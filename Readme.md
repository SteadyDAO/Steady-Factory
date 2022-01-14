# Steady DAO - Chainlink Hackathon 2021
![Steady](https://media.giphy.com/media/fyLKPt5fFoChh6u4uw/giphy.gif)


# Basics

<p align="center">
  <img src="steadyDAO.png"/>
</p>


At the base a contract that splits a token based on the latest chainlink price into 2 preset erc20 tokens.

The original alloy token - Chyme - The DAO has to approve and add a fee basis for different tokens.
Steady - A stable token that is common to the entire system and represents $1 at the time of split.
Elixir - This is an NFT token that represents all the original properties of the token as attributes. 

A minimum of $10000 is required to create a new chyme split.

The equation that we use is 
if K denotes the original token amount, 
let X denote the Steady token,
Y the Unsteady token and if the ratio of M:N = 1:2 then
Z denote the price at contract creation time = max(1, priceFromOracle());

As a user for this pool - Token X Price - (Z)       
 X = K * .75 * uint(Z) Fungible ERC20
 Y = K * 1 NFT

## Tokenomics

1. Money Out - reward is the amount of Steady DAO tokens that are given out upon creation of a new pool
1. All these gauges related to STEADY DAO token rewards can be modified by the DAO
1. Money In - We charge 40 basis points or 0.4% on merge in the underlying
1. BuyBack - 50% of the fees from the underlying across all projects will be used to buyback Steady DAO tokens every X blocks

Inital Minting - 
Yield Farms - 
Total Supply - 


## IMPORTANT SAFETY NOTICE 
Tokens in each pool can only be split for a period of three months. After a period of three weeks from the launch of the pool. No more tokens can be SPLIT at that price.

Elixir tokens that have not been merged for more than 3 years are liable to be blocked from transfer. The transfer lock does not prevent the user from merging.
This incentivices Elixir token holders to not HODL for more than 3 years and improves liquidity.

## How we used moralis

We integrate moralis into gamemaker studio 2 which we think is a huge boon to the indie dev community. We use moralis to create a database for contract events and to trigger in game actions based on this.

## How we used Steady DAO Dynasty tokens
Our two way token linked with Steady DAO Dynasty - 
Everytime someone splits a CHYME, a small amount of Steady DAO Dynasty is given to the splitter.

## How we used chainlink keepers

We utilized chainlink keepers to do a prize distribution across pools, or across DAO's. The keepers in every epoch calls our Merkle Distributor contract
and stores the merkle hash for that epoch.

### Deployed Addresses
#### Keeper
https://keepers.chain.link/mumbai/144 

#### Upkeep contract
This runs every epoch and calls the api contract(Right now we used a dummy api contract)
Using Dummy API - 
https://mumbai.polygonscan.com/address/0x0680a4A953952329A5241c284146DDD9d5adBD6E#readContract


## How we used chainlink api oracle
We used chainlink oracle to get the latest merkle hash that must be pushed into the Merkle Distributor contract.
https://mumbai.polygonscan.com/address/0xA7f820c64184142ea73cbf02cd1412e2B4cdA446#code

# Setting up
1. Run yarn at the top level
2. For the contracts ``` cd steady-hardhat ```  
3. yarn add ts-node 
4. npx hardhat compile
5. update .env.example -> .env
# Deploying 
This alchemist requires the address of the base token and the chainlink oracle for deployment. This is a factory contract, use npx hardhat run scripts/deploy.ts followed by custom.ts

# Testing 
```
npx hardhat test
```

## Coverage
We had added coverage, but during the hackathon this is broken.

```
npx hardhat coverage
```
