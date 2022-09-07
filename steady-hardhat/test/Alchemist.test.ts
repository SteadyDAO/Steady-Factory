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
  SimpleToken} from '../typechain';
import * as hre from "hardhat";
let mrAlchemist:Alchemist;
let mySteady:Steady;
let alchemistAcademy: AlchemistAcademy;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;
let alchemistImpl: Alchemist;
let chyme:SimpleToken;
let steadyDAOReward: SteadyDAOReward;

const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const chymeAddress = '0xa77451Ce512c970173fD3Faff316F6EDED1867f6';
const oracleAddress = '0x81570059A0cb83888f1459Ec66Aad1Ac16730243';
const oracleAddressWith18DecimalPlaces = "0x0855428B493637726090003eD12Dd224715CA217";
const chymeImpersonate = "0x244d07fe4dfa30b4ee376751fdc793ae844c5de6";


// Start test block
describe('Check the Alchemy', () => {
  let wallet: Wallet, Wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;

  // let dummyPriceOracleForTesting:DummyPriceOracleForTesting;
  let loadFixture: ReturnType<typeof createFixtureLoader>;

  const createFixtureLoader = waffle.createFixtureLoader;
  const advanceTimeAndBlock = async(_days:number) => {
    await network.provider.send("evm_increaseTime", [_days]);
    await network.provider.send("evm_mine");
   }

  before('create fixture loader', async () => {
    [wallet, DAOAddress, treasury] = await (ethers as any).getSigners()
    console.log(wallet.address)
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
    console.log("Elixir Impl address - ", elixirImpl.address)
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
    
    await alchemistAcademy.initialize(
      steadyImpl.address,
      treasury.address,
      alchemistImpl.address,
      DAOAddress.address
    );

  })

  describe('Ideal alchemy cases for Alchemist with 8 decimal places', () => {
    before('create Alchemist loader 8 decimal places', async () => 
    {
      const Alchemist = await ethers.getContractFactory("Alchemist");
      const SteadyFactory = await ethers.getContractFactory("Steady");
      
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
        
      
      elixirImpl.setAcademy(alchemistAcademy.address);

     
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interfaceAlch = new ethers.utils.Interface(["event AlchemistForged(address indexed alchemist,address priceOracle,uint8 fees,address steadyImplForChyme)"]);
      const data = receipt.logs[receipt.logs.length-1].data;
      const topics = receipt.logs[receipt.logs.length-1].topics;

      const event = interfaceAlch.decodeEventLog("AlchemistForged(address indexed,address,uint8,address)", data, topics);
      const Chyme = await ethers.getContractFactory("SimpleToken");
      chyme = await Chyme.attach(chymeAddress) as SimpleToken;
      mrAlchemist = await Alchemist.attach(event.alchemist) as Alchemist;
      elixirImpl.grantRole(MINTER_ROLE, mrAlchemist.address); 
      
      mySteady = await SteadyFactory.attach(event.steadyImplForChyme) as Steady;
    })

    it('can split Chyme belonging to it', async () => {
      await chyme.connect(chymeHolder).transfer(wallet.address, ethers.utils.parseUnits("100", 8) )

      expect(await mrAlchemist.chyme()).to.equal(chymeAddress)
      let chymeAddressContract = await mrAlchemist.chyme();
      let balanceBefore = await chyme.balanceOf(wallet.address);
      let elixirTokenID = await elixirImpl.getCurrentTokenId();
      console.log("Elixir Impl token Id - ", elixirTokenID);


      await chyme.approve(mrAlchemist.address,ethers.utils.parseUnits("100", 8));

      let tx = await mrAlchemist.split(ethers.utils.parseUnits("100", 8), 0);

      let balanceAfter = await chyme.balanceOf(wallet.address);
      // let balanceChyme = await chyme.balanceOf(mrAlchemist.address);
      let balSteady = await mySteady.balanceOf(wallet.address);
      expect(balanceBefore.sub(balanceAfter)).to.equal(ethers.utils.parseUnits("100", 8));
      expect(balSteady).to.equal(BigNumber.from("136388000000000000000000"))
      let balElixir = await elixirImpl.balanceOf(wallet.address);
      expect(balElixir).to.gte(ethers.BigNumber.from("1"))

    });


    it('can merge Chyme belonging to it', async () => {
      let balanceBeforeMerge = await chyme.balanceOf(wallet.address);
      let balSteady = await steadyImpl.balanceOf(wallet.address);
      let balElixir = await elixirImpl.balanceOf(wallet.address);
      expect(balElixir).to.equal(ethers.BigNumber.from("1"));
      //time to merge the first elixir
      
      await mySteady.approve(mrAlchemist.address, ethers.utils.parseUnits("136388000000000000000000", 18));
      await elixirImpl.approve(mrAlchemist.address, 0);

      //find the steady Required 
      let steadyRequired = await elixirImpl.getSteadyRequired(0);
      expect(steadyRequired[0]).to.eq(ethers.BigNumber.from("136388000000000000000000"));
      await mrAlchemist.merge(0);
      // await chyme.transferFrom(mrAlchemist.address,wallet.address,ethers.utils.parseUnits("10", 8));
      let balanceAfterMerge = await chyme.balanceOf(wallet.address);
      expect(balanceAfterMerge.sub(balanceBeforeMerge)).to.gte(ethers.utils.parseUnits("10", 8));
      balSteady = await steadyImpl.balanceOf(wallet.address);
      expect(balSteady).to.equal(BigNumber.from("0"))
    });
  });
  /**
   * Tests with a larger decimal 
   */
  describe.skip('Ideal alchemy cases for Alchemist with 18 decimal places', () => {
    before('create Alchemist loader 18 decimal places', async () => 
    {
      const Alchemist = await ethers.getContractFactory("Alchemist");
      alchemistImpl = await Alchemist.deploy() as Alchemist;
      const SimpleToken = await ethers.getContractFactory("SimpleToken");
      chyme = await SimpleToken.deploy(18) as SimpleToken;
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
      await chyme.mint(chymeHolder.address,ethers.utils.parseEther("10000"));
 
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interfaceAlch = new ethers.utils.Interface(["event AlchemistForged(address indexed alchemist,address priceOracle,uint8 fees)"]);
      const data = receipt.logs[receipt.logs.length-1].data;
      const topics = receipt.logs[receipt.logs.length-1].topics;
      const event = interfaceAlch.decodeEventLog("AlchemistForged", data, topics);
      mrAlchemist = await Alchemist.attach(event.alchemist) as Alchemist;
    })

    it('can split 18 decimal chyme belonging to it', async () => {
      await chyme.connect(chymeHolder).transfer(wallet.address, ethers.utils.parseUnits("100", 18) )
      expect(await mrAlchemist.chyme()).to.equal(chyme.address)
      let chymeAddressContract = await mrAlchemist.chyme();
      let balanceBefore = await chyme.balanceOf(wallet.address);
      let balSteadyBefore = await steadyImpl.balanceOf(wallet.address);
      await chyme.approve(mrAlchemist.address,ethers.utils.parseUnits("100", 18));
      let tx = await mrAlchemist.split(ethers.utils.parseUnits("100", 18),0);
      let balanceAfter = await chyme.balanceOf(wallet.address);
      let balSteadyAfter = await steadyImpl.balanceOf(wallet.address);
      expect(parseFloat(ethers.utils.formatUnits(balSteadyAfter,18))).to.gte(parseFloat(ethers.utils.formatUnits( BigNumber.from("70000000000000000000000"),18)))
      expect(balanceBefore.sub(balanceAfter)).to.equal(ethers.utils.parseUnits("100", 18));
      let balElixir = await elixirImpl.balanceOf(wallet.address);
      expect(balElixir).to.gte(ethers.BigNumber.from("1"))
    });

    it('can merge 18 decimal chyme belonging to it', async () => {
      let balanceBeforeMerge = await chyme.balanceOf(wallet.address);
      console.log("balanceBefore Merge Chyme --",  balanceBeforeMerge);
      let balSteady = await steadyImpl.balanceOf(wallet.address);
      let balElixir = await elixirImpl.balanceOf(wallet.address);
      expect(balElixir).to.gte(ethers.BigNumber.from("1"));// 1 here because now we have burned the elixir from previous test
      //time to merge the first elixir
      //approve tokens
      
      await steadyImpl.approve(mrAlchemist.address, ethers.utils.parseUnits("76800000000000000000000", 18));
      await elixirImpl.approve(mrAlchemist.address, 1);
      //find the steady Required 
      let steadyRequired = await elixirImpl.getSteadyRequired(1);
      console.log("Steady Required == ", steadyRequired[0].toString())
      expect(steadyRequired[0]).to.eq(ethers.BigNumber.from("76800000000000000000000"));
      await mrAlchemist.merge(1);
      await chyme.transferFrom(mrAlchemist.address,wallet.address,ethers.utils.parseUnits("10", 18));
      let balanceAfterMerge = await chyme.balanceOf(wallet.address);
      console.log("balanceAfterMerge Of Chyme --",  balanceAfterMerge);
      expect(balanceAfterMerge.sub(balanceBeforeMerge)).to.equal(ethers.utils.parseUnits("10", 18));
    });
  });
})

