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
  SimpleToken} from '../src/types/index';
import * as hre from "hardhat";
let mrAlchemist:Alchemist;
let alchemistAcademy: AlchemistAcademy;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;
let alchemistImpl: Alchemist;
let chyme:SimpleToken;
let steadyDAOReward: SteadyDAOReward;

const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
const chymeAddress = "0xC79bE05675830c8C56A228B914C1a094296c37E4";
const oracleAddress = "0x9dd18534b8f456557d11B9DDB14dA89b2e52e308";// we use SAND token but we use Gold oracle
const oracleAddressWith18DecimalPlaces = "0x0855428B493637726090003eD12Dd224715CA217";
const chymeImpersonate = "0xCd746dbAec699A3E0B42e411909e67Ad8BbCC315";
const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";


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
    
    const SteadyDAOReward = await ethers.getContractFactory("SteadyDAOReward");
    steadyDAOReward = await SteadyDAOReward.deploy() as SteadyDAOReward;
    await steadyDAOReward.deployed();
    const Steady = await ethers.getContractFactory("Steady");
    steadyImpl = await Steady.deploy() as Steady;
    await steadyImpl.deployed();
    const TreasureChest = await ethers.getContractFactory("Treasure");
    const treasureChest = await TreasureChest.deploy();
    await treasureChest.deployed();
    const factoryProxy = await ethers.getContractFactory("Elixir");
    elixirImpl = await factoryProxy.deploy("NFT","Elixir", treasureChest.address) as Elixir;
    await elixirImpl.deployed();
    const AlchemistAcademy = await ethers.getContractFactory("AlchemistAcademy");
    alchemistAcademy = await AlchemistAcademy.deploy() as AlchemistAcademy;
    elixirImpl.grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
    steadyImpl.grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
    loadFixture = createFixtureLoader([wallet, DAOAddress, treasury])
  })

  describe('Ideal alchemy cases for Alchemist with 8 decimal places', () => {
    before('create Alchemist loader 8 decimal places', async () => 
    {
      const Alchemist = await ethers.getContractFactory("Alchemist");
      alchemistImpl = await Alchemist.deploy() as Alchemist;
      await alchemistAcademy.initialize(
        steadyImpl.address, 
        elixirImpl.address,
        treasury.address,
        alchemistImpl.address,
        DAOAddress.address,
        steadyDAOReward.address
      );

      await alchemistAcademy.connect(DAOAddress).createNewChyme( 
        8,
        75,
        0,
        1,
        chymeAddress,           
        oracleAddress,
        157680000,
        10
        );
      
      elixirImpl.setAcademy(alchemistAcademy.address);

      let tx = await alchemistAcademy.alchemist(chymeAddress);   
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interfaceAlch = new ethers.utils.Interface(["event AlchemistForged(address indexed alchemist, address priceOracle, int256 forgePrice)"]);
      const data = receipt.logs[2].data;
      const topics = receipt.logs[2].topics;
      const event = interfaceAlch.decodeEventLog("AlchemistForged", data, topics);
      const Chyme = await ethers.getContractFactory("SimpleToken");
      chyme = await Chyme.attach(chymeAddress) as SimpleToken;
      mrAlchemist = await Alchemist.attach(event.alchemist) as Alchemist;
    })

    it('can split Chyme belonging to it', async () => {
      await chyme.connect(chymeHolder).transfer(wallet.address, ethers.utils.parseUnits("100", 8) )

      expect(await mrAlchemist.chyme()).to.equal(chymeAddress)
      let chymeAddressContract = await mrAlchemist.chyme();
      let balanceBefore = await chyme.balanceOf(wallet.address);

      await chyme.approve(mrAlchemist.address,ethers.utils.parseUnits("100", 8));

      let tx = await mrAlchemist.split(ethers.utils.parseUnits("100", 8));

      let balanceAfter = await chyme.balanceOf(wallet.address);
      let balSteady = await steadyImpl.balanceOf(wallet.address);
      expect(balanceBefore.sub(balanceAfter)).to.equal(ethers.utils.parseUnits("100", 8));
      expect(balSteady).to.equal(BigNumber.from("350000000000000000000"))

      let balElixir = await elixirImpl.balanceOf(wallet.address);
      expect(balElixir).to.gte(ethers.BigNumber.from("1"))

    });


    it('can merge Chyme belonging to it', async () => {
      let balanceBeforeMerge = await chyme.balanceOf(wallet.address);
      let balSteady = await steadyImpl.balanceOf(wallet.address);
      let balElixir = await elixirImpl.balanceOf(wallet.address);
      expect(balElixir).to.equal(ethers.BigNumber.from("1"));
      //time to merge the first elixir
      
      await steadyImpl.approve(mrAlchemist.address, ethers.utils.parseUnits("350000000000000000000", 18));
      await elixirImpl.approve(mrAlchemist.address, 0);

      //find the steady Required 
      let steadyRequired = await elixirImpl.getSteadyRequired(0);
      expect(steadyRequired[0]).to.eq(ethers.BigNumber.from("350000000000000000000"));
      await mrAlchemist.merge(0);
      await chyme.transferFrom(mrAlchemist.address,wallet.address,ethers.utils.parseUnits("10", 8));
      let balanceAfterMerge = await chyme.balanceOf(wallet.address);
      expect(balanceAfterMerge.sub(balanceBeforeMerge)).to.equal(ethers.utils.parseUnits("10", 8));
      balSteady = await steadyImpl.balanceOf(wallet.address);
      expect(balSteady).to.equal(BigNumber.from("0"))
    });
  });
  /**
   * Tests with a larger decimal 
   */
  describe('Ideal alchemy cases for Alchemist with 18 decimal places', () => {
    before('create Alchemist loader 18 decimal places', async () => 
    {
      const Alchemist = await ethers.getContractFactory("Alchemist");
      alchemistImpl = await Alchemist.deploy() as Alchemist;
      const SimpleToken = await ethers.getContractFactory("SimpleToken");
      chyme = await SimpleToken.deploy(18) as SimpleToken;
      await alchemistAcademy.connect(DAOAddress).createNewChyme( 
        18,
        75,
        0,
        1,
        chyme.address,           
        oracleAddressWith18DecimalPlaces,
        157680000,
        10
        );
      await chyme.mint(chymeHolder.address,ethers.utils.parseEther("10000"));

      let tx = await alchemistAcademy.alchemist(chyme.address);   
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const interfaceAlch = new ethers.utils.Interface(["event AlchemistForged(address indexed alchemist, address priceOracle, int256 forgePrice)"]);
      const data = receipt.logs[2].data;
      const topics = receipt.logs[2].topics;
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
      let tx = await mrAlchemist.split(ethers.utils.parseUnits("100", 18));
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

