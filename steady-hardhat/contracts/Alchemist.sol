// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./interfaces/IERC20Burnable.sol";
import "./interfaces/IElixir.sol";

import "./interfaces/IChyme.sol";
import "./interfaces/IAcademy.sol";
import "hardhat/console.sol";

/// @title Split and Merge Token Chyme
/// TODO: Add reentrancy guard
contract Alchemist is ReentrancyGuard, Initializable {

    address public chyme;
    address public steadyDAOToken;
    address public academy;
    address public steadyImpl;
    address public elixirImpl;
    address public treasury;
    uint256 forgePrice;
    uint256 alchemistId;

    event Split(address indexed source, uint256 splitAmount, uint256 poolId);
    event Merge(address indexed source, uint256 mergedAmount, uint256 price);

    struct TokenInfo {
        uint256 balance;
        uint256 amount;
    }

    function initialize
    (
        address _chyme,
        address _steadyDAOToken,
        address _steadyImpl,
        address _elixirImpl,
        address _treasury,
        uint256 _forgePrice,
        uint256 _alchemistId
    ) 
        public 
        initializer 
    {
        __Alchemist_init
            (
                _chyme, 
                _steadyDAOToken, 
                _steadyImpl, 
                _elixirImpl, 
                _treasury, 
                _forgePrice, 
                _alchemistId
            );
    }

    function __Alchemist_init(
        address _chyme,
        address _steadyDAOToken,
        address _steadyImpl,
        address _elixirImpl,
        address _treasury,
        uint256 _forgePrice,
        uint256 _alchemistId
    )  internal initializer {
        chyme = _chyme;
        steadyDAOToken = _steadyDAOToken;
        forgePrice = _forgePrice;
        alchemistId = _alchemistId;
        academy = msg.sender;
        steadyImpl = _steadyImpl;
        elixirImpl = _elixirImpl;
        treasury = _treasury;
    }

    /// @dev This splits an amount of Chyme into two parts one is Steady tokens which takes the ratio of $ value
    /// @dev The rest is in Elixir NFT's which takes all the volatility of the commodity
    function split(uint256 amount) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        require(amount >= 10); //minimum amount that can be split is 10 units or 0.0000001 Grams
        uint256 balanceOfSender = IERC20Burnable(chyme).balanceOf(msg.sender);
        require(amount <= balanceOfSender, "Ye do not have enough Chyme!");

        IERC20Burnable steady = IERC20Burnable(address(steadyImpl));
        IElixir elixir = IElixir(address(elixirImpl));
        IChyme.Chyme memory myChyme = IAcademy(address(academy)).chymeList(chyme);

        uint256 sChymeAmt = (amount * myChyme.ratioOfSteady * uint256(forgePrice)) / 10000000000;
        //transfer the Chyme tokens to the splitter contract
        IERC20Burnable(chyme).transferFrom(msg.sender, address(this), amount);
        steady.mint(msg.sender, sChymeAmt);
        elixir.safeMint(msg.sender, forgePrice, myChyme.ratioOfSteady, myChyme.oracleAddress, myChyme.fees, amount);

        emit Split(msg.sender, amount, alchemistId);
        return true;
    }

    /// @notice This merges an amount of Chyme from an Elixir NFT
    function merge(uint256 tokenId) 
        external 
        nonReentrant() 
        returns (bool) 
    {

        TokenInfo memory __elixir;
        TokenInfo memory __steady;
        
        IERC20Burnable steady = IERC20Burnable(address(steadyImpl));
        IElixir elixir = IElixir(address(elixirImpl));
        IChyme.Chyme memory myChyme = IAcademy(address(academy)).chymeList(chyme);
        
        require(elixir.ownerOf(tokenId) == msg.sender, "Ye do not have elixir!");
        uint chymeAmountToMerge;
        (__steady.amount, chymeAmountToMerge) = elixir.getSteadyRequired(tokenId);
        __steady.balance = steady.balanceOf(msg.sender);

        require(__steady.amount <= __steady.balance, "Need more Steady");
        //approve Chyme from this address to the msg.sender
        IERC20Burnable(chyme).approve(msg.sender, chymeAmountToMerge);
        IERC20Burnable(steadyDAOToken).transferFrom(msg.sender, address(treasury), chymeAmountToMerge * myChyme.fees);
        
        elixir.burnFrom(msg.sender, __elixir.amount);
        steady.burnFrom(msg.sender, __steady.amount);

        emit Merge(msg.sender, chymeAmountToMerge, forgePrice);
        return true;
    }
}
