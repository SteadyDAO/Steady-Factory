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

let  wallet: Wallet, testAddress : Wallet;

async function main() {
  let [wallet, wallet2] = await ethers.getSigners();
  console.log(wallet2.address);
  const Elixir = await ethers.getContractFactory("Elixir");

  const TreasureChest = await ethers.getContractFactory("Treasure");
  const treasureChest = await TreasureChest.connect(wallet2).deploy();
  // const treasureChest = await TreasureChest.attach("0xc590379d60dd7f9bb346ed8d12101cdf75cd4caf");
  await treasureChest.deployed();

  const ElixirFactory = await ethers.getContractFactory("Elixir");
  const elixir = await ElixirFactory.connect(wallet2).deploy("NFT","Elixir", treasureChest.address);
  await elixir.deployed();

  
  // await elixir.connect(wallet2).safeMint(wallet2.address,50,75, "0x9dd18534b8f456557d11B9DDB14dA89b2e52e308", 1,100);
  // console.log("Elixir deployed to:", elixir.address);
  console.log("Now verifying...");
  return {"elixir":elixir.address,"treasure": treasureChest.address};
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
    await verify(deployedData.elixir,"NFT","Elixir",deployedData.treasure)

    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

