// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "./interfaces/IERC20Burnable.sol";
import "./interfaces/IElixir.sol";
import "./ChymeVault.sol";

import "./interfaces/IChyme.sol";
import "./interfaces/IVault.sol";
import "./interfaces/IAcademy.sol";
import "./interfaces/ISteadyDAORewards.sol";

import "hardhat/console.sol";

/// @title Split and Merge Token Chyme
contract Alchemist is ReentrancyGuard, Initializable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using SafeERC20Upgradeable for IERC20Burnable;

    address public chyme;
    address public steadyDAOToken;
    address public academy;
    address public elixirImpl;
    address public treasury;
    address public steadyDAORewards;
    uint256 public alchemistId;
    address public chymeVaultImpl;
    enum Ratios {
        LOW,
        MEDIUM,
        HIGH
    } // RISK LOW = 75%, Medium = 50%, HIGH = 25%

    event Split(address indexed source, uint256 splitAmount, address chymeVaultDeployed, address chyme, uint256 tokenId);
    event Merge(address indexed source, uint256 mergedAmount, address chyme, uint256 tokenid);

    struct TokenInfo {
        uint256 balance;
        uint256 amount;
    }

    /***
     *@dev A alchemist is created per chyme, ratio. The strike price is calculated from the ratio of chyme and the forge price
     */
    function initialize(
        address _chyme,
        address _elixirImpl,
        address _treasury,
        uint256 _alchemistId,
        address _steadyDAORewards
    ) public initializer {
        __Alchemist_init(
            _chyme,
            _elixirImpl,
            _treasury,
            _alchemistId,
            _steadyDAORewards
        );
    }

    function __Alchemist_init(
        address _chyme,
        address _elixirImpl,
        address _treasury,
        uint256 _alchemistId,
        address _steadyDAORewards
    ) internal {
        chyme = _chyme;
        alchemistId = _alchemistId;
        academy = msg.sender;
        elixirImpl = _elixirImpl;
        treasury = _treasury;
        steadyDAORewards = _steadyDAORewards;
    }

    /// @notice This splits an amount of Chyme into two parts one is Steady tokens which takes the ratio of $ value
    /// @dev The rest is in Elixir NFT's which takes all the volatility of the commodity
    function split(uint256 amount, Ratios ratioOfSteady)
        external
        nonReentrant
        returns (bool)
    {
        IElixir elixir = IElixir(address(elixirImpl));
        (
            address oracleAddress,
            uint8 fees,
            uint8 decimals,
            uint256 durationForMaturity,
            ,
            address steadyImplForChyme
        ) = IAcademy(address(academy)).getChymeInfo(chyme);

        uint256 forgePrice = uint256(
            IAcademy(address(academy)).priceFromOracle(oracleAddress)
        );
        //two operands with decimals specified to token so ** 2 and 100 for ratioOfSteady to decimal conversion
        uint256 sChymeAmt = ((amount *
            (75 - (25 * uint8(ratioOfSteady))) *
            uint256(forgePrice)) / (100 * (10**decimals * 10**decimals))) * (10**18);
        //transfer the Chyme tokens to a new contract tied to this address and store this mapping in the elixir
        address chymeVaultDeployed = generateVault(elixir);
        //use a salt to create the new vault
        IERC20Upgradeable(address(chyme)).safeTransferFrom(
            msg.sender,
            chymeVaultDeployed,
            amount
        );

        ISteadyDAORewards(steadyDAORewards).performAction(
            ISteadyDAORewards.actionType.SPLIT,
            sChymeAmt,
            fees,
            chyme
        );

        IERC20Burnable(address(steadyImplForChyme)).mint(msg.sender, sChymeAmt);

        uint256 tokenId = mintElixir(elixir, amount, ratioOfSteady, forgePrice, durationForMaturity, chymeVaultDeployed);
        emit Split(msg.sender, amount,  chymeVaultDeployed, chyme, tokenId);
        return true;
    }

function generateVault(IElixir elixir) internal returns(address){
    return address(
            new ChymeVault{
                salt: keccak256(
                    abi.encode(msg.sender,  elixir.getCurrentTokenId() + 1)
                )
            }()
        );
}
function mintElixir(IElixir elixir,
 uint amount, Ratios ratioOfSteady, 
 uint256 forgePrice, 
 uint durationForMaturity, 
 address chymeVaultDeployed) internal returns (uint256 tokenId){
  tokenId = elixir.safeMint(
            msg.sender,
            chyme,
             (75 - (25 * uint8(ratioOfSteady))),//25,50,75
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

        IElixir elixir = IElixir(address(elixirImpl));
        address chymeBeneficiary = elixir.ownerOf(tokenId);
        (, uint256 fees, , , ,address steadyImplForChyme) = IAcademy(address(academy)).getChymeInfo(
            chyme
        );
        (_steady.amount, ratioOfSteady, timeToMaturity, chymeVaultDeployed) = elixir.getSteadyRequired(tokenId);
        console.log("Going to query balance - %s for %s ", chymeVaultDeployed, msg.sender);
        _steady.balance = IERC20Burnable(address(steadyImplForChyme)).balanceOf(msg.sender);

        require(_steady.amount <= _steady.balance, "Need more Steady");
        //we take the balance left over in the vault to account for rebase tokens
        uint256 totalChymeInVaultToMerge = IVault(chymeVaultDeployed)
            .getBalance(chyme);
        address[] memory beneficiaries = new address[](2);
        uint[] memory beneficiaryAmounts = new uint[](2);
        beneficiaries[0] = chymeBeneficiary;
        beneficiaryAmounts[0] = totalChymeInVaultToMerge;
        if (timeToMaturity > block.timestamp) {
            require(chymeBeneficiary == msg.sender, "You need to be the creator!");
        } else {
            //the maturity time has expired anyone can now call to mature this chyme
            //transfer Chyme from this address to the chymeBeneficiary proportional to the value in elixir
            beneficiaryAmounts[0] =  (totalChymeInVaultToMerge *
                        (100 - (75 - (25 * ratioOfSteady)))) / 100;
            beneficiaries[1] = msg.sender;
            beneficiaryAmounts[1] =  (totalChymeInVaultToMerge * (75 - (25 * ratioOfSteady))) /
                        100;
        }
        //transfer Chyme from this address to the msg.sender proportional to the total value
        IVault(chymeVaultDeployed).mergeAndClose(
            IERC20(chyme),
            beneficiaries,
            beneficiaryAmounts
        );
        //Here fees are denoted to signify the value, in merge we will be rewarding the user with some small rewards
        ISteadyDAORewards(steadyDAORewards).performAction(
            ISteadyDAORewards.actionType.MERGE,
            _steady.amount,
            fees,
            chyme
        );
        IERC20Burnable(address(steadyImplForChyme)).burnFrom(msg.sender, _steady.amount);
        elixir.burn(tokenId);
        emit Merge(msg.sender, chymeAmountToMerge, chyme, ratioOfSteady);
        return true;
    }

    function getChyme() public view returns (address) {
        return chyme;
    }
}
