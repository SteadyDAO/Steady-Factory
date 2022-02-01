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
  DummyPriceOracleForTesting, 
  SteadyDaoToken,
  SimpleToken,
  Steady,
  Elixir } from '../src/types/index';

const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';
let wallet: Wallet, Wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;
let alchemistAcademy: AlchemistAcademy;
let sdt: SteadyDaoToken;
let stt: SimpleToken;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;
let alchemistImpl: Alchemist;
const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";
const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;

async function main() {
  [wallet, Wallet2, Wallet3, treasury, DAOAddress] = await (ethers as any).getSigners()
//   console.log("DAOAddress addresses ",DAOAddress.address)

//   const Alchemist = await ethers.getContractFactory("Alchemist");
//   alchemistImpl = await Alchemist.connect(Wallet2).deploy() as Alchemist;
//   await alchemistImpl.deployed();

//   const SteadyDaoToken = await ethers.getContractFactory("SteadyDaoToken");
//   sdt = await SteadyDaoToken.connect(Wallet2).deploy(ufoTokenAddr) as SteadyDaoToken;
//   await sdt.deployed();

//   const SimpleToken = await ethers.getContractFactory("SimpleToken");
//   stt = await SimpleToken.connect(Wallet2).deploy() as SimpleToken;
//   await stt.deployed();

//   const Steady = await ethers.getContractFactory("Steady");
//   steadyImpl = await Steady.connect(Wallet2).deploy() as Steady;
//   console.log("steadyImpl steadyImpl" , steadyImpl.address);
//   await steadyImpl.deployed();
//   const ElixirFactory = await ethers.getContractFactory("Elixir");
//   elixirImpl = await ElixirFactory.connect(Wallet2).deploy("NFT","Elixir") as Elixir;
//   await elixirImpl.deployed();

//   const AlchemistAcademyFactory = await ethers.getContractFactory("AlchemistAcademy");
//   alchemistAcademy = await AlchemistAcademyFactory.connect(Wallet2).deploy() as AlchemistAcademy;
//   console.log("AlchemistAcademyFactory deployed to:", alchemistAcademy.address);
//   await alchemistAcademy.deployed();
  
//   await alchemistAcademy.connect(Wallet2).initialize(
//     sdt.address,
//     steadyImpl.address, 
//     elixirImpl.address,
//     treasury.address,
//     alchemistImpl.address,
//     DAOAddress.address
//   );
//   await delay(20000);

//   elixirImpl.connect(Wallet2).grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
//   await delay(20000);

//   steadyImpl.connect(Wallet2).grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
//   await delay(20000);

//   console.log("DEFAULT_ADMIN_ROLE granted");



//   console.log("alchemistAcademy initialized");
//   await alchemistAcademy.connect(DAOAddress).createNewChyme( 
//     stt.address,           
//     "0x9dd18534b8f456557d11B9DDB14dA89b2e52e308",
//     100,
//     0,
//     3600000,
//     1,
//     75
//     );

//     console.log("createNewChyme done");



// await delay(20000);
//   console.log("Academy deployed to:", alchemistAcademy.address);
//   console.log("Now verifying...",sdt.address,
//   steadyImpl.address, 
//   elixirImpl.address,
//   treasury.address,
//   alchemistImpl.address,
//   DAOAddress.address);


  // await verify(sdt.address, ufoTokenAddr);
  // await verify(stt.address);
  // await verify(elixirImpl.address);
  // await verify(alchemistAcademy.address);

  // await verify("0xF295f6DD9D0E11C5A974972f3266a0934Ded8201", "0xF295f6DD9D0E11C5A974972f3266a0934Ded8201");
  // await verify("0x97abbcaf6c598256d53a271755ffb16013b30dfa");
  await verify("0x851872cE18789a62c5986A4BdE43996ED181CDea");
  // await verify("0xfe8b129AA60C6CD9c7A1904f6716Fe5d3A8A8944", "NFT","Elixir");

  console.log("Verified!");
  return alchemistAcademy.address;
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
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

  function saveFrontendFiles(contract: Contract, contractName: string) {
    console.log('Adding to frontend',contractName)
    fs.appendFileSync(
      `${config.paths.artifacts}/contracts/contractAddress.ts`,
      `export const ${contractName} = '${contract.address}'\n`
    );
  }
