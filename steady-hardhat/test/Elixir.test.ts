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

let elixir: Elixir;
// Tests are based on Block: 13670552
const chymeAddress = '0xC6d54D2f624bc83815b49d9c2203b1330B841cA0';
// const chymeNotApprovedAddress = '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF';
const oracleAddress = '0x9dd18534b8f456557d11B9DDB14dA89b2e52e308';// we use SAND token but we use Gold oracle
const chymeImpersonate = "0x3BD6ccC927a19A3532613647e4E71a25B65655f7";
const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";
const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;

// Start test block
describe('Elixir NFT works as expected', async () => {
  let wallet: Wallet, wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;
    // let scgt:Steady;
    // let unsteady:Unsteady;
    let dummyPriceOracleForTesting:DummyPriceOracleForTesting;
    let loadFixture: ReturnType<typeof createFixtureLoader>;

    const createFixtureLoader = waffle.createFixtureLoader;
    before('create fixture loader', async () => {
        [wallet, DAOAddress, wallet2, treasury] = await (ethers as any).getSigners()

        console.log("Wallet addresses - %s, %s, \n Chyme Address: %s", wallet.address, wallet2.address);
        await hre.network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [chymeImpersonate],
        });
        await network.provider.send("hardhat_setBalance", [
            chymeImpersonate,
            "0xA688906BD8B00000",
        ]);
    
        chymeHolder = await (ethers as any).getSigner(chymeImpersonate);
        const TreasureChest = await ethers.getContractFactory("Treasure");
        const treasureChest = await TreasureChest.deploy();
        const SteadyDaoToken = await ethers.getContractFactory("SteadyDaoToken");
        sdt = await SteadyDaoToken.deploy(ufoTokenAddr) as SteadyDaoToken;
    
        const Steady = await ethers.getContractFactory("Steady");
        steadyImpl = await Steady.deploy() as Steady;
    
        const factoryProxy = await ethers.getContractFactory("Elixir");
        elixirImpl = await factoryProxy.deploy("NFT","Elixir", treasureChest.address) as Elixir;
    
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
          8,
          75,
          100,
          1,
          chymeAddress,           
          dummyPriceOracleForTesting.address,
          157680000,
          10
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
        elixirImpl.setAcademy(alchemistAcademy.address);
        
        // let chymeAddressContract = await mrAlchemist.getChyme();
        loadFixture = createFixtureLoader([wallet, DAOAddress, treasury])
        //create an alchemist and create  a forge price
        
    })

    it('can fetch a token URI string', async () => {
        let forgePrice =  await mrAlchemist.forgePrice();
        console.log("forge Price --- ", forgePrice);

        await elixirImpl.safeMint(
          wallet2.address,
          chymeAddress,
          forgePrice,
          100,
          1775925203);

        const tokenURI = await elixirImpl.tokenURI(0);
        console.log("generateBase64Image  - ",tokenURI);       
    });
});
