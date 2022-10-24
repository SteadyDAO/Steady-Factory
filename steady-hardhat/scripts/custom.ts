import { ethers } from "hardhat";
import * as hre from "hardhat";
import { Wallet } from 'ethers';
import {  
  AlchemistAcademy,
  Alchemist, 
  SteadyDAOReward,
  SimpleToken,
  Steady,
  Elixir } from '../typechain';
const tokenAddr = "0x4bae94FC93deE9712d94451FC434421F883a3300";
const chymeAddress = '0x326c977e6efc84e512bb9c30f76e30c160ed06fb';
const oracleAddress = '0x12162c3E810393dEC01362aBf156D7ecf6159528';
const chymeSymbol = "LINK";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const daiAbi = [
  // Some details about the token
  "function alchemist(address _Chyme, address _priceOracle, string memory _symbol) external returns (address)",
  "function getLatestAlchemist() external view returns (address)"
];

// The Contract object
let wallet: Wallet, wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;

async function main() {
  const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
  [wallet, wallet2, Wallet3, treasury, DAOAddress] = await (ethers as any).getSigners()
  const ElixirFactory = await ethers.getContractFactory("Elixir");
  // elixirImpl = await ElixirFactory.connect(wallet2).deploy("NFT","Elixir", treasureChest.address) as Elixir;
  const elixirImpl = await ElixirFactory.connect(wallet2).attach("0x403aD48F8c8507dD193fbe4453EF2A410EB402cD") as Elixir;
  // const accounts = await ethers.getSigners()
  // let tokenContract = new ethers.Contract(tokenAddr, daiAbi, accounts[0]).connect(accounts[0]);
  // let overrides = {
  //   value: ethers.utils.parseEther("0.1")
  // };

  // // let uri = await tokenContract.alchemist(chymeAddress, oracleAddress, chymeSymbol, { gasLimit: 11250000 });
  // let uri = await tokenContract.getLatestAlchemist();
  // console.log(uri);
  // // return tokenContract.address;

  await elixirImpl.connect(wallet2).grantRole(MINTER_ROLE, "0xa9e966aB5dAA049a0caB8075783b05716d35522a"); 


  return "";
}

async function verify(contractAddress:string, ...args:Array<any>) {
  console.log("verifying", contractAddress, ...args);
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [
      ...args
    ],
  });
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then( async (deployedData) => {
    const accounts = await ethers.getSigners()
    // await delay(50000);
    // await verify(deployedData);

    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });