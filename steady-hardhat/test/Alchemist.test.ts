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
  SteadyDaoToken,
  Steady,
  Elixir, 
  ERC20} from '../src/types/index';
import * as hre from "hardhat";
let mrAlchemist:Alchemist;
let alchemistAcademy: AlchemistAcademy;
let sdt: SteadyDaoToken;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;
let alchemistImpl: Alchemist;
let chyme:ERC20;

const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
// SAND token
// Tests are based on Block: 13670552
const chymeAddress = '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683';
// const chymeNotApprovedAddress = '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF';
const oracleAddress = '0x0C466540B2ee1a31b441671eac0ca886e051E410';// we use SAND token but we use Gold oracle
const chymeImpersonate = "0x545967B6Ef1efe2B57AaA6353F0593f215fA66b8";

// Start test block
describe('Check the Alchemy', () => {
  let wallet: Wallet, Wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;

  let dummyPriceOracleForTesting:DummyPriceOracleForTesting;
  let loadFixture: ReturnType<typeof createFixtureLoader>;
  const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";

  const createFixtureLoader = waffle.createFixtureLoader;
  const advanceTimeAndBlock = async(_days:number) => {
    await network.provider.send("evm_increaseTime", [_days]);
    await network.provider.send("evm_mine");
   }

  before('create fixture loader', async () => {
    [wallet, DAOAddress, treasury] = await (ethers as any).getSigners()
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [chymeImpersonate],
    });
    await network.provider.send("hardhat_setBalance", [
        chymeImpersonate,
        "0xA688906BD8B00000",
    ]);

    chymeHolder = await (ethers as any).getSigner(chymeImpersonate);

    const SteadyDaoToken = await ethers.getContractFactory("SteadyDaoToken");
    sdt = await SteadyDaoToken.deploy(ufoTokenAddr) as SteadyDaoToken;

    const Steady = await ethers.getContractFactory("Steady");
    steadyImpl = await Steady.deploy() as Steady;

    const ElixirFactory = await ethers.getContractFactory("Elixir");
    elixirImpl = await ElixirFactory.deploy("NFT","Elixir") as Elixir;

    const AlchemistAcademy = await ethers.getContractFactory("AlchemistAcademy");
    alchemistAcademy = await AlchemistAcademy.deploy() as AlchemistAcademy;

    elixirImpl.grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
    steadyImpl.grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);

    const Alchemist = await ethers.getContractFactory("Alchemist");
    alchemistImpl = await Alchemist.deploy() as Alchemist;

    const _dummyPriceOracleForTesting = await ethers.getContractFactory("DummyPriceOracleForTesting");
    dummyPriceOracleForTesting = await _dummyPriceOracleForTesting.deploy() as DummyPriceOracleForTesting;

    await dummyPriceOracleForTesting.setLatestAnswer(5778003570);
    console.log("starting Academy Creation");
    await alchemistAcademy.initialize(
      sdt.address,
      steadyImpl.address, 
      elixirImpl.address,
      treasury.address,
      alchemistImpl.address,
      DAOAddress.address
    );

    await alchemistAcademy.connect(DAOAddress).createNewChyme( 
      chymeAddress,           
      dummyPriceOracleForTesting.address,
      100,
      0,
      3600000,
      1,
      75
      );

    let tx = await alchemistAcademy.alchemist(chymeAddress,
      {value: ethers.utils.parseEther("0.0001")});   
    const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
    const interfaceAlch = new ethers.utils.Interface(["event AlchemistForged(address indexed alchemist, address priceOracle, int256 forgePrice)"]);
    const data = receipt.logs[2].data;
    const topics = receipt.logs[2].topics;
    const event = interfaceAlch.decodeEventLog("AlchemistForged", data, topics);
      
    console.log(event, event.alchemist);
    const Chyme = await ethers.getContractFactory("ERC20");
    chyme = await Chyme.attach(chymeAddress) as ERC20;

    mrAlchemist = await Alchemist.attach(event.alchemist) as Alchemist;
    
    // let chymeAddressContract = await mrAlchemist.getChyme();
    loadFixture = createFixtureLoader([wallet, DAOAddress, treasury])
  })

  describe('Ideal alchemy cases for Alchemist', () => {
  
    it('can split Chyme belonging to it', async () => {
      await chyme.connect(chymeHolder).transfer(wallet.address, ethers.utils.parseEther("100") )
      let balanceBefore = await chyme.balanceOf(wallet.address);
      console.log("Balance Of Chyme Held --",  balanceBefore);
      expect(await mrAlchemist.chyme()).to.equal(chymeAddress)
      // let chymeAddressContract = await mrAlchemist.getChyme();
      // console.log("chyme Of chymeAddressContract --",  chymeAddressContract);
    
      //split the token
    await chyme.approve(mrAlchemist.address,ethers.utils.parseEther("10"));
   
    let tx = await mrAlchemist.split(ethers.utils.parseEther("10"));

    let balanceAfter = await chyme.balanceOf(wallet.address);
    console.log("Balance Of Chyme After --",  balanceAfter);
     let balSteady = await steadyImpl.balanceOf(wallet.address);
    console.log("Balance Of balSteady --",  balSteady);

    let balElixir = await elixirImpl.balanceOf(wallet.address);
    console.log("Balance Of balElixir --",  balElixir);
      expect(balElixir).to.equal(ethers.BigNumber.from("1"))

    });


    it('can split and merge Chyme belonging to it', async () => {

      await chyme.connect(chymeHolder).transfer(wallet.address, ethers.utils.parseEther("100") )
      let balanceBefore = await chyme.balanceOf(wallet.address);

      expect(await mrAlchemist.chyme()).to.equal(chymeAddress)

      await chyme.approve(mrAlchemist.address,ethers.utils.parseEther("10"));     
      let tx = await mrAlchemist.split(ethers.utils.parseEther("10"));

      let balanceAfter = await chyme.balanceOf(wallet.address);
      console.log("balanceAfter Split Chyme --",  balanceAfter);

      expect(balanceBefore.sub(balanceAfter)).to.equal(ethers.utils.parseEther("10"));
      let balSteady = await steadyImpl.balanceOf(wallet.address);
      let balElixir = await elixirImpl.balanceOf(wallet.address);
      expect(balElixir).to.equal(ethers.BigNumber.from("2"));
      //time to merge the first elixir
      //approve tokens
      await sdt.mint(wallet.address, ethers.utils.parseEther("10000"));
      await sdt.approve(mrAlchemist.address, ethers.utils.parseEther("10000"));
      await steadyImpl.approve(mrAlchemist.address, ethers.utils.parseEther("10000"));
      await elixirImpl.approve(mrAlchemist.address, 0);
      await mrAlchemist.merge(0);
      
      await chyme.transferFrom(mrAlchemist.address,wallet.address,ethers.utils.parseEther("10"));

      let balanceAfterMerge = await chyme.balanceOf(wallet.address);
      console.log("balanceAfterMerge Of Chyme --",  balanceAfterMerge);
  
    });

  });

  describe.skip('Time based alchemy cases for Alchemist with constant price', () => {
  
   it('can split CGT belonging to it that accrues storage fees for a year', async () => {

    });

    it('cannot split CGT belonging to it that accrues too much storage fees for a year', async () => {
    });


    it('can split CGT belonging to it that accrues storage fees for ten years', async () => {
    });

    it('cannot split CGT belonging to it that accrues too much storage fees for ten years', async () => {
    });


    it('can split and merge CGT belonging to it that accrues storage fees for a year', async () => {
    });

    xit('can split and merge CGT belonging to it that accrues storage fees for a year and then kept in unsteady for a year', async () => {
    });
  });

  describe.skip('Alchemy cases for Alchemist with fluctuating price', () => {
  
    it('should not be able to split at a lower price and merge CGT belonging to it at a higher price', async () => {
    });

    it('can split at a higher price and merge CGT belonging to it at a lower price', async () => {
    });
  });

})

