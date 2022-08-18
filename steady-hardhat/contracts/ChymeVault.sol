// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//title - This contract is a chyme vault created by the user when a split position is created
contract ChymeVault is Ownable{
  // the alchemist is the one who can transfer here and also transfer out and destroy this contract
  function mergeAndClose(IERC20 token, address[] memory payTo,uint[] memory amounts) public onlyOwner{
    //the contract will be closed in full and all balances to be transferred out
    //make sure that msg.sender uses a delegate call
    require(payTo.length == amounts.length, "Mismatch in allocation");
    for(uint i = 0; i < payTo.length;) {
      if(payTo[i] != address(0)){
       require(token.transfer(payTo[i], token.balanceOf(address(this))), "Transfer failed");
      }
      i++;
    }
    //destruct the contract
    selfdestruct(payable(msg.sender));
  }
  
  function getBalance(address token) public view returns (uint balance){
    return IERC20(token).balanceOf(address(this));
  }
}
