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
  Steady,
  SteadyDAOReward,
  Elixir } from '../src/types/index';
import * as hre from "hardhat";

// let mrAlchemist:Alchemist;
let alchemistAcademy: AlchemistAcademy;
let steadyImpl: Contract;
let elixirImpl: Contract;
let steadyDAOReward: Contract;
let alchemistImpl: Alchemist;

const testAddresses = ['0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B', '0xE61A17362BEcE0764C641cd449B4c56150c99c80'];
const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';

// SAND token
// Tests are based on Block: 13670552
const chymeAddress = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';
const oracleAddress = '0x0C466540B2ee1a31b441671eac0ca886e051E410';// we use SAND token but we use Gold oracle

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
        console.log("Wallet addresses - %s, %s", wallet.address, Wallet2.address);

        const Steady = await ethers.getContractFactory("Steady");
        steadyImpl = await Steady.deploy() as Steady;
        
        const TreasureChest = await ethers.getContractFactory("Treasure");
        const treasureChest = await TreasureChest.deploy();

        const ElixirFactory = await ethers.getContractFactory("Elixir");
        elixirImpl = await ElixirFactory.deploy("NFT","Elixir", treasureChest.address) as Elixir;

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

        const SteadyDAOReward = await ethers.getContractFactory("SteadyDAOReward");
        steadyDAOReward = await SteadyDAOReward.connect(Wallet2).deploy() as SteadyDAOReward;
        await steadyDAOReward.deployed();

    })
    
    describe('Set up an Alchemist', async () => {
        it('initialize factory', async () => {
            await alchemistAcademy.initialize(
                steadyImpl.address, 
                elixirImpl.address,
                alchemistImpl.address,
                treasury.address,
                DAOAddress.address,
                steadyDAOReward.address
              );
            expect(await alchemistAcademy.elixirImpl()).equals(elixirImpl.address);
            expect(await alchemistAcademy.steadyImpl()).equals(steadyImpl.address);
        });
        it('DAO can create new chyme', async () => {
            await alchemistAcademy.connect(DAOAddress).createNewChyme(
                18,
                75,
                0,
                1,
                chymeAddress,           
                oracleAddress,
                157680000,
                0
                );
            expect((await alchemistAcademy.chymeList(chymeAddress)).fees).equal(0);
        });

        it('Non DAO cannot create a new chyme', async () => {
            await expect( alchemistAcademy.createNewChyme(
                18,
                75,
                0,
                1,
                chymeAddress,           
                oracleAddress,
                157680000,
                0
                ))
            .to.be.revertedWith("Requires Governance!");
        });
    });

});