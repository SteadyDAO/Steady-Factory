// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from 'ethers';
import  { config, ethers } from "hardhat";
import { Wallet } from 'ethers';
import fs from 'fs';
import * as hre from "hardhat";
import {  
  AlchemistAcademy,
  Alchemist, 
  SteadyDAOReward,
  SimpleToken,
  Steady,
  Elixir } from '../typechain';

let wallet: Wallet, wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;
let alchemistAcademy: AlchemistAcademy;

let stt: SimpleToken;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;
let alchemistImpl: Alchemist;
let steadyDAOReward: SteadyDAOReward;

const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

async function main() {
  [wallet, wallet2, Wallet3, treasury, DAOAddress] = await (ethers as any).getSigners()
  console.log("addresses ",wallet2.address,DAOAddress.address)

  const Alchemist = await ethers.getContractFactory("Alchemist");
  alchemistImpl = await Alchemist.connect(wallet2).deploy() as Alchemist;
  // alchemistImpl = await Alchemist.connect(wallet2).attach("0xb57107d4465f66011f1adb854213a70bcebd2e24") as Alchemist;
  await alchemistImpl.deployed();

  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  stt = await SimpleToken.connect(wallet2).deploy(8) as SimpleToken;
  // stt = await SimpleToken.connect(wallet2).attach("0xd7659f8168b9144ede632ebc08e282247902844e") as SimpleToken;
  await stt.deployed();

  const Steady = await ethers.getContractFactory("Steady");
  steadyImpl = await Steady.connect(wallet2).deploy() as Steady;
  // steadyImpl = await Steady.connect(wallet2).attach("0x71a37310a97f7ddac78c531b99d806dd23e1c695") as Steady;
  console.log("steadyImpl steadyImpl" , steadyImpl.address);
  await steadyImpl.deployed();

  const TreasureChest = await ethers.getContractFactory("Treasure");
  // const treasureChest = await TreasureChest.connect(wallet2).deploy();
  const treasureChest = await TreasureChest.attach("0xF60CF01855dDE0C6b69a7Ec6Ca3B1F55cE22BE02");
  // await treasureChest.deployed();

  const ElixirFactory = await ethers.getContractFactory("Elixir");
  // elixirImpl = await ElixirFactory.connect(wallet2).deploy("NFT","Elixir", treasureChest.address) as Elixir;
  elixirImpl = await ElixirFactory.connect(wallet2).attach("0x403aD48F8c8507dD193fbe4453EF2A410EB402cD") as Elixir;
  // await elixirImpl.deployed();


  const AlchemistAcademyFactory = await ethers.getContractFactory("AlchemistAcademy");
  alchemistAcademy = await AlchemistAcademyFactory.connect(wallet2).deploy() as AlchemistAcademy;
  console.log("AlchemistAcademyFactory deployed to:", alchemistAcademy.address);
  await alchemistAcademy.deployed();
  const SteadyDAOReward = await ethers.getContractFactory("SteadyDAOReward");
  steadyDAOReward = await SteadyDAOReward.connect(wallet2).deploy() as SteadyDAOReward;
  await steadyDAOReward.deployed();
  const init = await alchemistAcademy.connect(wallet2).initialize(
      steadyImpl.address,
      treasury.address,
      alchemistImpl.address,
      DAOAddress.address
    );
  await init.wait();
  // const grantA = await elixirImpl.connect(wallet2).grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
  // await grantA.wait();
  // const grantB = await steadyImpl.connect(wallet2).grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
  // await grantB.wait();

  console.log("DEFAULT_ADMIN_ROLE granted to the implementation");

  console.log("alchemistAcademy initialized");
  const newChyme =  await alchemistAcademy.connect(DAOAddress).createNewChyme( 
    { 
      "decimals":8,
      "fees":0,
      "DAOApproved":1,
      "oracleAddress":"0x7A65Cf6C2ACE993f09231EC1Ea7363fb29C13f2F",
      "steadyImplForChyme":stt.address,
      "symbol":"PGT",
      "timeToMaturity":94608000,
      "steadyDAOReward":steadyDAOReward.address}, stt.address
      );
     
    console.log("createNewChyme done");



  await newChyme.wait();
  await elixirImpl.connect(wallet2).setAcademy(alchemistAcademy.address);

  
  const receipt = await ethers.provider.getTransactionReceipt(newChyme.hash);
  const interfaceAlch = new ethers.utils.Interface(["event AlchemistForged(address indexed alchemist,address priceOracle,uint8 fees,address steadyImplForChyme)"]);
  const data = receipt.logs[receipt.logs.length-1].data;
  const topics = receipt.logs[receipt.logs.length-1].topics;

  const event = interfaceAlch.decodeEventLog("AlchemistForged(address indexed,address,uint8,address)", data, topics);
  console.log("CHyme Alchemist deployed to:", event.alchemist);

  await elixirImpl.connect(wallet2).grantRole(MINTER_ROLE, event.alchemist); 

  console.log("Academy deployed to:", alchemistAcademy.address);
  console.log("Now verifying...\n",
  steadyImpl.address,"steadyImpl Address\n",
  stt.address,"stt Address\n",
  elixirImpl.address,"elixirImpl Address\n",
  treasury.address,"treasury Address\n",
  treasureChest.address,"treasureChest Address\n",
  alchemistImpl.address,"alchemistImpl Address\n",
  DAOAddress.address,"DAOAddress Address\n",);


  await verify(stt.address, 8);
  // await verify(elixirImpl.address,"NFT","Elixir", treasureChest.address );
  await verify(alchemistAcademy.address);
  await verify(alchemistImpl.address);
  await verify(steadyImpl.address);
  console.log("Verified!");
  return alchemistAcademy.address;
}

async function verify(contractAddress:string, ...args:Array<any>) {
  console.log("verifying", contractAddress, ...args);
  try{
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [
        ...args
      ],
    });
  }
  catch(err){
    console.log(err)
  }

}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function singleFn() {
  await verify("0xd7ee3B42896F95D768936D5059246541Ba37Af8C", 8);
  await verify("0x994D1d27875E918cAB33A2CFBeE96935848714Da");
  await verify("0xeCb4C9Cc67F744FB38CD6BeABBd9d5e8F7341396");
  await verify("0xdd21aaf299EEEEA82b5E0004b208EDB8d7cC56D3");
  // await verify("0x1bEdD6e959bE719D46612ad90F387d1f0dDACBdF","NFT","Elixir", "0x583D1fDfD9189EE4a2b971afEe10AcF53d6fCECd" );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// singleFn()
main()
  .then( async (deployedData) => {
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
