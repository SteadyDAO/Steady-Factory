// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./interfaces/IERC20Burnable.sol";
import "./interfaces/IERC721Burnable.sol";

import "./interfaces/IChyme.sol";
import "./interfaces/IAcademy.sol";
import "hardhat/console.sol";

/// @title Split and Merge Token Chyme
/// TODO: Add reentrancy guard
contract Alchemist is ReentrancyGuard, Initializable {

    address public chyme;
    address public academy;
    address public steadyImpl;
    address public elixirImpl;
    int256 forgePrice;
    uint256 alchemistId;

    event Split(address indexed source, uint256 splitAmount, uint256 poolId);
    event Merge(address indexed source, uint256 mergedAmount, int256 price);

    struct TokenInfo {
        uint256 balance;
        uint256 amount;
    }

    function initialize
    (
        address _chyme,
        address _steadyImpl,
        address _elixirImpl,
        int256 _forgePrice,
        uint256 _alchemistId
    ) 
        public 
        initializer 
    {
        __Alchemist_init(_chyme, _steadyImpl, _elixirImpl, _forgePrice, _alchemistId);
    }

    function __Alchemist_init(
        address _chyme,
        address _steadyImpl,
        address _elixirImpl,
        int256 _forgePrice,
        uint256 _alchemistId
    )  internal initializer {
        chyme = _chyme;
        forgePrice = _forgePrice;
        alchemistId = _alchemistId;
        academy = msg.sender;
        steadyImpl = _steadyImpl;
        elixirImpl = _elixirImpl;
    }

    /// @dev This splits an amount of Chyme into two parts one is Steady tokens which is the 3/4 the token in dollar value
    /// @dev The rest is in Elixir tokens which is 1/4th of the token in original form
    function split(uint256 amount) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        require(amount >= 10); //minimum amount that can be split is 10 units or 0.0000001 Grams
        uint256 balanceOfSender = IERC20Burnable(chyme).balanceOf(msg.sender);
        require(amount <= balanceOfSender, "You do not have enough Chyme");

        IERC20Burnable steady = IERC20Burnable(address(steadyImpl));
        IERC721Burnable elixir = IERC721Burnable(address(elixirImpl));
        IChyme.Chyme memory myChyme = IAcademy(address(academy)).chymeList(chyme);

        uint256 sChymeAmt = (amount * 75 * uint256(forgePrice)) / 10000000000; // should have twice the amount of Steady.
        //transfer the Chyme tokens to the splitter contract
        IERC20Burnable(chyme).transferFrom(msg.sender, address(this), amount);
        steady.mint(msg.sender, sChymeAmt);
        elixir.safeMint(msg.sender, 1);

        // reward splitter with SDT
        // IERC20Burnable(sdtAddress).approve(msg.sender, 10);

        emit Split(msg.sender, amount, alchemistId);
        return true;
    }

    /// @notice This merges an amount of Chyme from two parts one part Steady tokens and another Elixir tokens
    /// @dev Pass in the total amount of Chyme that you expect, it will increase the allowance accordingly
    function merge(uint256 ChymeAmountToMerge) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        require(ChymeAmountToMerge >= 10); //minimum amount that can be merged is 10 units or 0.0000001 Grams

        TokenInfo memory __elixir;
        TokenInfo memory __steady;
        
        IERC20Burnable steady = IERC20Burnable(address(steadyImpl));
        IERC721Burnable elixir = IERC721Burnable(address(elixirImpl));
        IChyme.Chyme memory myChyme = IAcademy(address(academy)).chymeList(chyme);


        __steady.amount = (ChymeAmountToMerge * 75 * uint256(forgePrice)) / 10000000000;
        __elixir.amount = (ChymeAmountToMerge * 25) / 100;
        __steady.balance = steady.balanceOf(msg.sender);
        __elixir.balance = elixir.balanceOf(msg.sender);

        require(__elixir.amount <= __elixir.balance, "Need more Elixir");
        require(__steady.amount <= __steady.balance, "Need more Steady");
        //approve Chyme from this address to the msg.sender
        IERC20Burnable(chyme).approve(msg.sender, ChymeAmountToMerge - myChyme.fees);
        // console.log("Burn Elixir: %s\nBurn Steady: %s", __elixir.amount, __steady.amount);
        console.log("alchI addr: %s", address(this));
        console.log("Tring to merge Steady: %s, ||  Elixir: %s", __steady.amount, __elixir.amount);
        elixir.burnFrom(msg.sender, __elixir.amount);
        steady.burnFrom(msg.sender, __steady.amount);

        emit Merge(msg.sender, ChymeAmountToMerge, forgePrice);
        return true;
    }
}
