import { Wallet } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle, network } from "hardhat";
// import { Signer } from "ethers";
import { BigNumber } from '@ethersproject/bignumber';
import { expect } from "chai";
import { describe } from "mocha";
import { Elixir } from '../src/types/index';
import * as hre from "hardhat";

let elixir: Elixir;

const testAddresses = ['0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B', '0xE61A17362BEcE0764C641cd449B4c56150c99c80'];
const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';

// Start test block
describe('Elixir NFT works as expected', async () => {
    let wallet: Wallet, Wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet;
    // let scgt:Steady;
    // let unsteady:Unsteady;
    let loadFixture: ReturnType<typeof createFixtureLoader>;

    const createFixtureLoader = waffle.createFixtureLoader;

    before('create fixture loader', async () => {
        [wallet, Wallet2, Wallet3] = await (ethers as any).getSigners()
        console.log("Wallet addresses - %s, %s, \n Chyme Address: %s", wallet.address, Wallet2.address);
        loadFixture = createFixtureLoader([wallet, Wallet2])
        const factoryProxy = await ethers.getContractFactory("Elixir");
        elixir = await factoryProxy.deploy("PLES","PLE") as Elixir; 
    })

    it('can fetch a token URI string', async () => {
        await elixir.safeMint(Wallet2.address,50,75, "0x0C466540B2ee1a31b441671eac0ca886e051E410", 1,100);
        
        const tokenURI = await elixir.tokenURI(0);
        console.log("generateBase64Image  - ",tokenURI);       
    });
});