import { Wallet } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle, network } from "hardhat";
// import { Signer } from "ethers";
import { BigNumber } from '@ethersproject/bignumber';
import { expect } from "chai";
import { describe } from "mocha";
import {  
  AlchemistAcademy,
  Alchemist,
  DummyPriceOracleForTesting, 
  SteadyDAOReward,
  Steady,
  Elixir, 
  ERC20} from '../typechain';
import * as hre from "hardhat";
let mrAlchemist:Alchemist;
let alchemistAcademy: AlchemistAcademy;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;
let alchemistImpl: Alchemist;
let chyme:ERC20;
let steadyDAOReward: SteadyDAOReward;

let elixir: Elixir;
// Tests are based on Block: 13670552
const chymeAddress = '0xa77451Ce512c970173fD3Faff316F6EDED1867f6';
// const chymeNotApprovedAddress = '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF';
const oracleAddress = '0x81570059A0cb83888f1459Ec66Aad1Ac16730243';
const chymeImpersonate = "0x244d07fe4dfa30b4ee376751fdc793ae844c5de6";
const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";
const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;

// Start test block
describe('Elixir NFT works as expected', async () => {
  let wallet: Wallet, wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet, chymeVaultExample:Wallet;
    // let scgt:Steady;
    // let unsteady:Unsteady;
    // let dummyPriceOracleForTesting:DummyPriceOracleForTesting;
    let loadFixture: ReturnType<typeof createFixtureLoader>;

    const createFixtureLoader = waffle.createFixtureLoader;
    before('create fixture loader', async () => {
        [wallet, DAOAddress, wallet2, treasury,chymeVaultExample] = await (ethers as any).getSigners()

        console.log("Wallet addresses - %s, %s", wallet.address, DAOAddress.address);
        await hre.network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [chymeImpersonate],
        });
        await network.provider.send("hardhat_setBalance", [
            chymeImpersonate,
            "0xA688906BD8B00000",
        ]);
    
        chymeHolder = await (ethers as any).getSigner(chymeImpersonate);
        const SteadyFactory = await ethers.getContractFactory("Steady");
        steadyImpl = await SteadyFactory.connect(DAOAddress).deploy() as Steady;
        await steadyImpl.deployed();
        
        const TreasureChest = await ethers.getContractFactory("Treasure");
        const treasureChest = await TreasureChest.deploy();
    
        const ElixirFactory = await ethers.getContractFactory("Elixir");
        elixirImpl = await ElixirFactory.deploy("NFT","Elixir", treasureChest.address) as Elixir;
        console.log("elixirImpl.address -- ",elixirImpl.address)
        const Alchemist = await ethers.getContractFactory("Alchemist");
        alchemistImpl = await Alchemist.deploy() as Alchemist;
        await alchemistImpl.deployed();
        console.log("Alchemist Impl deployed")
    
        const SteadyDAOReward = await ethers.getContractFactory("SteadyDAOReward");
        steadyDAOReward = await SteadyDAOReward.deploy() as SteadyDAOReward;
        await steadyDAOReward.deployed();
        console.log("steadyDAOReward  deployed")
        loadFixture = createFixtureLoader([wallet, DAOAddress, treasury])
    
        const AlchemistAcademy = await ethers.getContractFactory("AlchemistAcademy");
        alchemistAcademy = await AlchemistAcademy.deploy() as AlchemistAcademy;
        await alchemistAcademy.deployed();
        
        elixirImpl.grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address); 
        elixirImpl.grantRole(DEFAULT_ADMIN_ROLE, wallet.address); 
    
        await alchemistAcademy.initialize(
          steadyImpl.address,
          treasury.address,
          alchemistImpl.address,
          DAOAddress.address
        );
        console.log("initialized")
     
        let tx = await alchemistAcademy.connect(DAOAddress).createNewChyme( 
          { 
          "decimals":8,
          "fees":0,
          "DAOApproved":1,
          "oracleAddress":oracleAddress,
          "steadyImplForChyme":oracleAddress,
          "symbol":"PGT",
          "timeToMaturity":157680000,
          "steadyDAOReward":steadyDAOReward.address}, chymeAddress
          );
      console.log("createNewChyme.address -- ",chymeAddress)

      elixirImpl.setAcademy(alchemistAcademy.address);
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interfaceAlch = new ethers.utils.Interface(["event AlchemistForged(address indexed alchemist,address priceOracle,uint8 fees,address steadyImplForChyme)"]);
      const data = receipt.logs[receipt.logs.length-1].data;
      const topics = receipt.logs[receipt.logs.length-1].topics;
       const event = interfaceAlch.decodeEventLog("AlchemistForged(address indexed,address,uint8,address)", data, topics);
          
        console.log(event, event.alchemist);
        const Chyme = await ethers.getContractFactory("ERC20");
        chyme = await Chyme.attach(chymeAddress) as ERC20;
    
        mrAlchemist = await Alchemist.attach(event.alchemist) as Alchemist;
        // let chymeAddressContract = await mrAlchemist.getChyme();
        loadFixture = createFixtureLoader([wallet, DAOAddress, treasury])
        //create an alchemist and create  a forge price
        
    })

  it('can fetch a token URI string', async () => {
    let forgePrice =  5778003570;
    await elixirImpl.safeMint(
      wallet2.address,
      chymeAddress,
      (75 - (25 * (0))),//25,50,75
      forgePrice,
      100,
      1775925203,
      chymeVaultExample.address
    );
      
    const tokenURI = await elixirImpl.tokenURI(0);
    // console.log("generateBase64Image  - ",tokenURI);
    expect(tokenURI.toString()).to.not.equal("");     
  });

  it('can fetch the params', async () => {        
    const params = await elixirImpl.calculateParams(0);
    expect(params).to.be.an('array').that.has.length(4);  
  });

  it('can check the number of days left to maturity', async () => {      
    const params = await elixirImpl.calculateParams(0);
    expect(params.timeLeft.toString()).to.equal("1423");
  });
});