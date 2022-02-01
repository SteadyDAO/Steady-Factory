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
  Elixir } from '../src/types/index';
import * as hre from "hardhat";
// let mrAlchemist:Alchemist;
let alchemistAcademy: AlchemistAcademy;
let sdt: SteadyDaoToken;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;
let alchemistImpl: Alchemist;

const testAddresses = ['0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B', '0xE61A17362BEcE0764C641cd449B4c56150c99c80'];
const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';

// SAND token
// Tests are based on Block: 13670552
const chymeAddress = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';
// const chymeNotApprovedAddress = '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF';
const oracleAddress = '0x0C466540B2ee1a31b441671eac0ca886e051E410';// we use SAND token but we use Gold oracle


const chymeImpersonate = "0x59cE29e760F79cd83395fB3d017190Bd727542f7";
const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";
const DAY = 86400;
const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
let wallet: Wallet, Wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;

// Start test block
describe('Alchemists Ideal cases', async () => {

    let dummyPriceOracleForTesting: DummyPriceOracleForTesting;
    let loadFixture: ReturnType<typeof createFixtureLoader>;

    const createFixtureLoader = waffle.createFixtureLoader;

    before('create fixture loader', async () => {
        [wallet, Wallet2, Wallet3, treasury, DAOAddress] = await (ethers as any).getSigners()
        console.log("Wallet addresses - %s, %s, \n Chyme Address: %s", wallet.address, Wallet2.address, chymeHolder.address);

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

        loadFixture = createFixtureLoader([wallet, Wallet2]);
        const _dummyPriceOracleForTesting = await ethers.getContractFactory("DummyPriceOracleForTesting");
        dummyPriceOracleForTesting = await _dummyPriceOracleForTesting.deploy() as DummyPriceOracleForTesting;

        await dummyPriceOracleForTesting.setLatestAnswer(5778003570);

    })
    
    describe('Set up an Alchemist', async () => {
        it('initialize factory', async () => {
            await alchemistAcademy.initialize(
                sdt.address,
                steadyImpl.address, 
                elixirImpl.address,
                alchemistImpl.address,
                treasury.address,
                DAOAddress.address
              );
            expect(await alchemistAcademy.elixirImpl()).equals(elixirImpl.address);
            expect(await alchemistAcademy.steadyImpl()).equals(steadyImpl.address);
        });

        it('DAO can create new chyme', async () => {
            await alchemistAcademy.connect(DAOAddress).createNewChyme( 
                chymeAddress,           
                oracleAddress,
                100,
                0,
                3600000,
                1,
                75
                );
            expect((await alchemistAcademy.chymeList(chymeAddress)).fees).equal(100);
        });

        it('Non DAO cannot create a new chyme', async () => {
            await expect( alchemistAcademy.createNewChyme(
                chymeAddress,           
                oracleAddress,
                100,
                0,
                3600000,
                1,
                75
                ))
            .to.be.revertedWith("Requires Governance!");
        });

        it('Any user can create a new alchemist that is approved', async () => {
           let alchemist = await alchemistAcademy.alchemist(chymeAddress,{value: ethers.utils.parseEther("100")});   
        //    console.log("alchemist --- ", alchemist);
           const Alchemist = await ethers.getContractFactory("Alchemist");

        //    let alchemistInstance = await Alchemist.attach(alchemist) as Alchemist;
        });
    });

});