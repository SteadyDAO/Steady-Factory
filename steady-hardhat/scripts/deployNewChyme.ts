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
  GoldToken,
  Steady,
  Elixir } from '../typechain';

let wallet: Wallet, wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;
let alchemistAcademy: AlchemistAcademy;

let cgt: GoldToken;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;
let alchemistImpl: Alchemist;
let steadyDAOReward: SteadyDAOReward;

const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;

async function main() {
  [wallet, wallet2, Wallet3, treasury, DAOAddress] = await (ethers as any).getSigners()
  console.log("addresses ",wallet2.address,DAOAddress.address)


  const GoldToken = await ethers.getContractFactory("GoldToken");
  cgt = await GoldToken.connect(wallet2).deploy(8) as GoldToken;
  await cgt.deployed();
  const AlchemistAcademyFactory = await ethers.getContractFactory("AlchemistAcademy");
  alchemistAcademy = await AlchemistAcademyFactory.attach("0xDCAfb3962c0031B3295490A10D36Aad4D64Da65f") as AlchemistAcademy;
  console.log("AlchemistAcademyFactory deployed to:", alchemistAcademy.address);


      const newChyme =  await alchemistAcademy.connect(DAOAddress).createNewChyme( 
        { 
          "decimals":8,
          "fees":0,
          "DAOApproved":1,
          "oracleAddress":"0x062e4C197Cb2b6a772E27F9321e005A729888D17",
          "steadyImplForChyme":cgt.address,
          "symbol":"PGT",
          "timeToMaturity":94608000,
          "steadyDAOReward":"0x587E78b513b1f1192B726e02b53eF93BC9a9e1de"}, cgt.address
          );
    console.log("createNewChyme done");



  await newChyme.wait();
  console.log("Academy deployed to:", alchemistAcademy.address);
  console.log("Now verifying...\n",
  cgt.address,"cgt Address\n",
  
  DAOAddress.address,"DAOAddress Address\n",);


  await verify(cgt.address, 8);
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
  await verify("0x2B242F7718272D5852F2C0bb9dE9322350dec720");
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

  function saveFrontendFiles(contract: Contract, contractName: string) {
    console.log('Adding to frontend',contractName)
    fs.appendFileSync(
      `${config.paths.artifacts}/contracts/contractAddress.ts`,
      `export const ${contractName} = '${contract.address}'\n`
    );
  }
