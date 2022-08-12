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
  const treasureChest = await TreasureChest.connect(wallet2).deploy();
  // const treasureChest = await TreasureChest.attach("0xc590379d60dd7f9bb346ed8d12101cdf75cd4caf");
  await treasureChest.deployed();

  const ElixirFactory = await ethers.getContractFactory("Elixir");
  elixirImpl = await ElixirFactory.connect(wallet2).deploy("NFT","Elixir", treasureChest.address) as Elixir;
  // elixirImpl = await ElixirFactory.connect(wallet2).attach("0xba159d729fc61d6a965b7c40fc121df08d9f8b7b") as Elixir;
  await elixirImpl.deployed();


  const AlchemistAcademyFactory = await ethers.getContractFactory("AlchemistAcademy");
  alchemistAcademy = await AlchemistAcademyFactory.connect(wallet2).deploy() as AlchemistAcademy;
  console.log("AlchemistAcademyFactory deployed to:", alchemistAcademy.address);
  await alchemistAcademy.deployed();
  const SteadyDAOReward = await ethers.getContractFactory("SteadyDAOReward");
  steadyDAOReward = await SteadyDAOReward.connect(wallet2).deploy() as SteadyDAOReward;
  await steadyDAOReward.deployed();
  const init = await alchemistAcademy.connect(wallet2).initialize(
    elixirImpl.address,
    steadyImpl.address,
    treasury.address,
    alchemistImpl.address,
    DAOAddress.address,
    steadyDAOReward.address
  );
  await init.wait();
  const grantA = await elixirImpl.connect(wallet2).grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
  await grantA.wait();
  // const grantB = await steadyImpl.connect(wallet2).grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
  // await grantB.wait();

  console.log("DEFAULT_ADMIN_ROLE granted to the implementation");

  console.log("alchemistAcademy initialized");
  const newChyme =  await alchemistAcademy.connect(DAOAddress).createNewChyme( 
      8,
      0,
      1,
      stt.address,                
      "0x81570059A0cb83888f1459Ec66Aad1Ac16730243",
      157680000//5 years in seconds
      );
    console.log("createNewChyme done");



  await newChyme.wait();
  console.log("Academy deployed to:", alchemistAcademy.address);
  console.log("Now verifying...\n",
  steadyImpl.address,"steadyImpl Address\n",
  stt.address,"stt Address\n",
  elixirImpl.address,"elixirImpl Address\n",
  treasury.address,"treasury Address\n",
  treasureChest.address,"treasureChest Address\n",
  alchemistImpl.address,"alchemistImpl Address\n",
  DAOAddress.address,"DAOAddress Address\n",);
  elixirImpl.connect(wallet2).setAcademy(alchemistAcademy.address);


  await verify(stt.address, 8);
  await verify(elixirImpl.address,"NFT","Elixir", treasureChest.address );
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
