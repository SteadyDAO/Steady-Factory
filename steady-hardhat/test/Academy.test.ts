import { Wallet } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle, network } from "hardhat";
// import { Signer } from "ethers";
import { BigNumber } from '@ethersproject/bignumber';
import { expect } from "chai";
import { describe } from "mocha";
import {  
  AlchemistAcademy, 
  DummyPriceOracleForTesting, 
  SteadyDaoToken,
  ERC20,
  Elixir } from '../src/types/index';
import * as hre from "hardhat";
// let mrAlchemist:Alchemist;
let alchemistAcademy: AlchemistAcademy;
let sdt: SteadyDaoToken;
let steadyImpl: Contract;
let elixirImpl: Contract;
let alchI: Contract;

const testAddresses = ['0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B', '0xE61A17362BEcE0764C641cd449B4c56150c99c80'];
const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';

// SAND token and Oracle
// Tests are based on Block: 13670552
const chymeAddress = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';
const oracleAddress = '0xCF4Be57aA078Dc7568C631BE7A73adc1cdA992F8';
const chymeSymbol = "SAND";
const chymeImpersonate = "0x59cE29e760F79cd83395fB3d017190Bd727542f7";
const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";
const DAY = 86400;
let wallet: Wallet, Wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet, treasury: Wallet, DAOAddress:Wallet;

// const factoryAbi = [
//     "function alchemist(address _Chyme, address _priceOracle, string memory _symbol) external view returns (address)"
// ]

// const chymeAbi = [
//     "function balanceOf(address owner) public view returns (uint256)",
//     "function getSteady() public view returns (address)",
//     "function approve(address spender,uint256 addedValue) returns (bool)",
//     "function transferFrom(address from,address to,uint256 value) external returns (bool)"
// ]

// const alchAbi = [
//     "function getSteady() public view returns (address)",
//     "function getSdtAddr() public view returns(address)",
//     "function split(uint256 amount) external returns (bool)"
// ]

// Start test block
describe('Alchemists Ideal cases', async () => {

    let dummyPriceOracleForTesting: DummyPriceOracleForTesting;
    let loadFixture: ReturnType<typeof createFixtureLoader>;

    const createFixtureLoader = waffle.createFixtureLoader;

    before('create fixture loader', async () => {
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [chymeImpersonate],
        });
        await network.provider.send("hardhat_setBalance", [
            chymeImpersonate,
            "0xA688906BD8B00000",
        ]);
        [wallet, Wallet2, Wallet3, treasury, DAOAddress] = await (ethers as any).getSigners()
        chymeHolder = await (ethers as any).getSigner(chymeImpersonate);
        console.log("Wallet addresses - %s, %s, \n Chyme Address: %s", wallet.address, Wallet2.address, chymeHolder.address);

        loadFixture = createFixtureLoader([wallet, Wallet2]);

    })

    beforeEach('deploy factory and SteadyDaoToken', async () => {
        const SteadyDaoToken = await ethers.getContractFactory("SteadyDaoToken");
        sdt = await SteadyDaoToken.deploy(ufoTokenAddr) as SteadyDaoToken;

        const ERC20Factory = await ethers.getContractFactory("ERC20");
        steadyImpl = await ERC20Factory.deploy("STD","Steady Token") as ERC20;

        const ElixirFactory = await ethers.getContractFactory("Elixir");
        elixirImpl = await ElixirFactory.deploy("NFT","Elixir") as Elixir;

        const AlchemistAcademy = await ethers.getContractFactory("AlchemistAcademy");
        alchemistAcademy = await AlchemistAcademy.deploy() as AlchemistAcademy;

        // const chymeFactory = await ethers.getContractFactory("ICHYME");

        // factoryI = new ethers.Contract(factory.address, factoryAbi, wallet).connect(wallet);

        // chymeI = new ethers.Contract(chymeAddress, chymeAbi, chymeHolder).connect(chymeHolder);
        // chymeI = await ethers.getContractAt(chymeAbi, chymeAddress) as ICHYME;
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
                treasury.address,
                DAOAddress.address
              );
            expect(await alchemistAcademy.elixirImpl()).equals(elixirImpl.address);
            expect(await alchemistAcademy.steadyImpl()).equals(steadyImpl.address);
        });
        it('can create a new chyme', async () => {});
        it('can create a new alchemist', async () => {});
        it('can collect fees for new alchemist', async () => {});
        it('can give rewards for new alchemist creators', async () => {});
    });

});