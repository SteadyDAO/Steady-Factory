// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from 'ethers';
import  { config, ethers } from "hardhat";
import { Wallet } from 'ethers';
import fs from 'fs';
import { Alchemist, AlchemistAcademy } from '../src/types/index';
import * as hre from "hardhat";

let  wallet: Wallet, testAddress : Wallet;

async function main() {
  let [wallet, testAddress] = await ethers.getSigners();
  console.log(wallet.address);
  const Elixir = await ethers.getContractFactory("Elixir");
  const elixir = await Elixir.deploy("Ples","PLE");
  await elixir.deployed();

  
  await elixir.safeMint("0xc1c5da1673935527d4EFE1714Ef8dcbee12a9380",50, "0x81570059A0cb83888f1459Ec66Aad1Ac16730243", 1,100);
  console.log("Elixir deployed to:", elixir.address);
  console.log("Now verifying...");
  return elixir.address;
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
    await delay(80000);
    // await verify(deployedData.rootCGTConvertor,
    //   deployedData.cgt, deployedData.scgt,
    //   deployedData.lcgt, deployedData._oracleAddress); //Verify the master contract
    await verify(deployedData,"Ples","PLE")

    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

