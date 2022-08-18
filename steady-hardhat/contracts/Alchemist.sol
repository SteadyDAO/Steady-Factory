// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IERC20Burnable.sol";
import "./interfaces/IElixir.sol";
import "./ChymeVault.sol";

import "./interfaces/IVault.sol";
import "./interfaces/IAcademy.sol";
import "./interfaces/ISteadyDAORewards.sol";

/// @title Split and Merge Token Chyme
contract Alchemist is ReentrancyGuard, Initializable {
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Burnable;

    // Risk ratios that define the proportion of asset splits LOW = 75%, Medium = 50%, HIGH = 25%
    enum Ratios {
        LOW,
        MEDIUM,
        HIGH
    }
    struct TokenInfo {
        uint256 balance;
        uint256 amount;
    }

    address public constant elixirImpl = 0x70b0FbacB4a6b1C0bf09cddef4cE2B908f87DF18;
    IElixir elixir;
    address public academy;
    address public chyme;

    event Split(
        address indexed source,
        uint256 splitAmount,
        address chymeVaultDeployed,
        address chyme,
        uint256 tokenId
    );
    event Merge(
        address indexed source,
        uint256 mergedAmount,
        address chyme,
        uint256 tokenid
    );

    /***
     * @dev An alchemist is created per chyme, ratio.
     * @dev The strike price is calculated from the ratio of chyme and the forge price
     */
    function initialize(address _chyme) public initializer {
        chyme = _chyme;
        academy = msg.sender;
        elixir = IElixir(address(elixirImpl));
    }

    /// @notice This splits an amount of Chyme into two parts one is Steady tokens which takes the ratio of $ value
    /// @dev The rest is in Elixir NFT's which takes all the volatility of the commodity
    function split(uint256 amount, Ratios ratioOfSteady)
        external
        nonReentrant
        returns (bool)
    {
        (
            address oracleAddress,
            uint8 fees,
            uint8 decimals,
            uint256 durationForMaturity,
            ,
            address steadyImplForChyme,
            address steadyDAOReward
        ) = IAcademy(address(academy)).getChymeInfo(chyme);

        uint256 forgePrice = uint256(
            IAcademy(address(academy)).priceFromOracle(oracleAddress)
        );
        //two operands with decimals specified to token so ** 2 and 100 for ratioOfSteady to decimal conversion
        uint256 sChymeAmt = ((amount *
            (75 - (25 * uint8(ratioOfSteady))) *
            uint256(forgePrice)) / (100 * (10**decimals * 10**decimals))) *
            (10**18);
        //transfer the Chyme tokens to a new contract tied to this address and store this mapping in the elixir
        address chymeVaultDeployed = generateVault();
        //use a salt to create the new vault
        IERC20(address(chyme)).safeTransferFrom(
            msg.sender,
            chymeVaultDeployed,
            amount
        );

        ISteadyDAORewards(steadyDAOReward).performAction(
            ISteadyDAORewards.actionType.SPLIT,
            sChymeAmt,
            fees,
            chyme
        );

        IERC20Burnable(address(steadyImplForChyme)).mint(msg.sender, sChymeAmt);

        uint256 tokenId = mintElixir(
            amount,
            ratioOfSteady,
            forgePrice,
            durationForMaturity,
            chymeVaultDeployed
        );
        emit Split(msg.sender, amount, chymeVaultDeployed, chyme, tokenId);
        return true;
    }

    function generateVault() internal returns (address) {
        return
            address(
                new ChymeVault{
                    salt: keccak256(
                        abi.encode(msg.sender, elixir.getCurrentTokenId() + 1)
                    )
                }()
            );
    }

    function mintElixir(
        uint256 amount,
        Ratios ratioOfSteady,
        uint256 forgePrice,
        uint256 durationForMaturity,
        address chymeVaultDeployed
    ) internal returns (uint256 tokenId) {
        tokenId = elixir.safeMint(
            msg.sender,
            chyme,
            (75 - (25 * uint8(ratioOfSteady))), //25,50,75
            forgePrice,
            amount,
            block.timestamp + durationForMaturity,
            chymeVaultDeployed
        );
        return tokenId;
    }

    /// @notice This closes a given Elixir NFT
    function merge(uint256 tokenId) external nonReentrant returns (bool) {
        TokenInfo memory _steady;
        uint256 chymeAmountToMerge;
        uint256 timeToMaturity;
        uint256 ratioOfSteady;
        address chymeVaultDeployed;

        address chymeBeneficiary = elixir.ownerOf(tokenId);
        (, uint256 fees, , , , address steadyImplForChyme, address steadyDAOReward) = IAcademy(
            address(academy)
        ).getChymeInfo(chyme);
        (
            _steady.amount,
            ratioOfSteady,
            timeToMaturity,
            chymeVaultDeployed
        ) = elixir.getSteadyRequired(tokenId);
        _steady.balance = IERC20Burnable(address(steadyImplForChyme)).balanceOf(
            msg.sender
        );

        require(_steady.amount <= _steady.balance, "Need more Steady");
        //we take the balance left over in the vault to account for rebase tokens
        uint256 totalChymeInVaultToMerge = IVault(chymeVaultDeployed)
            .getBalance(chyme);
        address[] memory beneficiaries = new address[](2);
        uint256[] memory beneficiaryAmounts = new uint256[](2);
        beneficiaries[0] = chymeBeneficiary;
        beneficiaryAmounts[0] = totalChymeInVaultToMerge;
        if (timeToMaturity > block.timestamp) {
            require(
                chymeBeneficiary == msg.sender,
                "You need to be the creator!"
            );
        } else {
            //the maturity time has expired anyone can now call to mature this chyme
            //transfer Chyme from this address to the chymeBeneficiary proportional to the value in elixir
            beneficiaryAmounts[0] =
                (totalChymeInVaultToMerge *
                    (100 - (75 - (25 * ratioOfSteady)))) /
                100;
            beneficiaries[1] = msg.sender;
            beneficiaryAmounts[1] =
                (totalChymeInVaultToMerge * (75 - (25 * ratioOfSteady))) /
                100;
        }
        //transfer Chyme from this address to the msg.sender proportional to the total value
        IVault(chymeVaultDeployed).mergeAndClose(
            IERC20(chyme),
            beneficiaries,
            beneficiaryAmounts
        );
        //Here fees are denoted to signify the value, in merge we will be rewarding the user with some small rewards
        ISteadyDAORewards(steadyDAOReward).performAction(
            ISteadyDAORewards.actionType.MERGE,
            _steady.amount,
            fees,
            chyme
        );
        IERC20Burnable(address(steadyImplForChyme)).burnFrom(
            msg.sender,
            _steady.amount
        );
        elixir.burn(tokenId);
        emit Merge(msg.sender, chymeAmountToMerge, chyme, ratioOfSteady);
        return true;
    }

    function getChyme() public view returns (address) {
        return chyme;
    }
}
