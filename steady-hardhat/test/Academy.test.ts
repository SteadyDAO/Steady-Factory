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
  Elixir } from '../typechain';
import * as hre from "hardhat";

// let mrAlchemist:Alchemist;
let alchemistAcademy: AlchemistAcademy;
let steadyImpl: Contract;
let elixirImpl: Contract;
let steadyDAOReward: Contract;
let alchemistImpl: Alchemist;

const testAddresses = ['0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B', '0xE61A17362BEcE0764C641cd449B4c56150c99c80'];
const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';

const chymeAddress = '0xa77451Ce512c970173fD3Faff316F6EDED1867f6';
const oracleAddress = '0x81570059A0cb83888f1459Ec66Aad1Ac16730243';

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
        console.log("Wallet addresses - %s, %s", wallet.address, Wallet2.address, Wallet3.address,treasury.address);

        const Steady = await ethers.getContractFactory("Steady");
        steadyImpl = await Steady.connect(DAOAddress).deploy() as Steady;
        await steadyImpl.deployed();
        
        const TreasureChest = await ethers.getContractFactory("Treasure");
        const treasureChest = await TreasureChest.deploy();

        const ElixirFactory = await ethers.getContractFactory("Elixir");
        elixirImpl = await ElixirFactory.deploy("NFT","Elixir", treasureChest.address) as Elixir;
      
        const Alchemist = await ethers.getContractFactory("Alchemist");
        alchemistImpl = await Alchemist.deploy() as Alchemist;
        await alchemistImpl.deployed();
        console.log("Alchemist Impl deployed")

        const SteadyDAOReward = await ethers.getContractFactory("SteadyDAOReward");
        steadyDAOReward = await SteadyDAOReward.deploy() as SteadyDAOReward;
        await steadyDAOReward.deployed();
        console.log("steadyDAOReward  deployed")

    })
    
    describe('Set up an Alchemist', async () => {
        it('can deploy factory', async () => {
            const AlchemistAcademy = await ethers.getContractFactory("AlchemistAcademy");
            alchemistAcademy = await AlchemistAcademy.deploy() as AlchemistAcademy;
            await alchemistAcademy.deployed();
            
            elixirImpl.grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address); 
        }).timeout(100000);

        it('initialize factory', async () => {
           
            await alchemistAcademy.initialize(
                elixirImpl.address,
                steadyImpl.address,
                treasury.address,
                alchemistImpl.address,
                DAOAddress.address,
                steadyDAOReward.address
              );


        expect(await alchemistAcademy.elixirImpl()).equals(elixirImpl.address);
        }).timeout(100000);
        
        it('DAO can create new chyme', async () => {
            // await steadyImpl.grantRole(DEFAULT_ADMIN_ROLE, alchemistAcademy.address);
            
            console.log("DAOAddress.address --- ",DAOAddress.address)
            await alchemistAcademy.connect(DAOAddress).createNewChyme(
                18,
                0,
                1,
                chymeAddress,           
                oracleAddress,
                157680000
                );
            expect((await alchemistAcademy.chymeList(chymeAddress)).fees).equal(0);
        }).timeout(100000);

        it('Non DAO cannot create a new chyme', async () => {
            await expect( alchemistAcademy.createNewChyme(
                18,
                0,
                1,
                chymeAddress,           
                oracleAddress,
                157680000
                ))
            .to.be.revertedWith("Requires Governance!");
        });
    });

})