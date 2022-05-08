# Manual Testing - Create a new Alchemist and Split tokens
For all addresses if in case of doubt check deploys.md for contract addresses

## 1. Get some chyme tokens (the token that you want to split)
https://rinkeby.etherscan.io/address/0xd7659f8168b9144ede632ebc08e282247902844e#writeContract
where 0xd7659f8168b9144ede632ebc08e282247902844e is a simple test token

Connect your wallet address to etherscan.
Goto, function mint -  key in your address and an amount of tokens you want plus 8 decimals (example 100 tokens = 10000000000)

## 2. Create new alchemist (this will take the current oracle price of the token) / Alternatively use the existing pool skip to step 3

1. Goto Alchemist academy and connect any wallet
eg. https://rinkeby.etherscan.io/address/0x61c01b6c92528300d00cbc35dfbe4ab893702b28
1. call alchemist function call (0xd7659f8168b9144ede632ebc08e282247902844e) for creating a new alchemist alchemy
  0xd7659f8168b9144ede632ebc08e282247902844e is the address of the chyme address 
3. Check logs for "AlchemistForged" to find the address of newly deployed alchemist eg. 
4. https://rinkeby.etherscan.io/address/0x61c01b6c92528300d00cbc35dfbe4ab893702b28#events

Alchemist  - 0x3c516282045f3e7b3a65b75412240fed76cb03ee

## 3. Approve transfer of chyme tokens to the alchemist 
Goto - https://rinkeby.etherscan.io/address/0xd7659f8168b9144ede632ebc08e282247902844e#writeContract
Approve - (100 = 10000000000) stt tokens 0xd7659f8168b9144ede632ebc08e282247902844e to alchemist 0x3c516282045f3e7b3a65b75412240fed76cb03ee

## 4. Split some chyme stt tokens 
1. goto alchemist contract 
2. https://rinkeby.etherscan.io/address/0x3c516282045f3e7b3a65b75412240fed76cb03ee#writeContract
3. Splittokens (100 = 10000000000)  -> https://rinkeby.etherscan.io/tx/0x6c4bc406134cdbeb0d1de2b92e0dd0e1138651568b690cc93d605d01638c82ad
4. Verify the transaction information (note that you may need to increase the default gas price to get a quick confirmation). Take note of the number of steady tokens you receive and the Elixer token ID.
5. Verify that the Elixir information is correct https://rinkeby.etherscan.io/address/0xba159d729fc61d6a965b7c40fc121df08d9f8b7b#writeContract

## 5. Merge the token back
1. give approval for your Elixir NFT back - Elixer NFT tokenId from step 4, spender 0x3c516282045f3e7b3a65b75412240fed76cb03ee
  https://rinkeby.etherscan.io/address/0xba159d729fc61d6a965b7c40fc121df08d9f8b7b#writeContract 
2. give approval for Steady Tokens back - use the amount of Steady (STY) tokens received in step 4 (example 100 = 100000000000000000000), spender 0x3c516282045f3e7b3a65b75412240fed76cb03ee - https://rinkeby.etherscan.io/address/0x71a37310a97f7ddac78c531b99d806dd23e1c695
3. Call the Merge  https://rinkeby.etherscan.io/address/0x3c516282045f3e7b3a65b75412240fed76cb03ee#writeContract
  with the NFT token id from step 4.
4. Now you should have the right to pull your original chyme, you can do this by going to https://rinkeby.etherscan.io/address/0xd7659f8168b9144ede632ebc08e282247902844e and calling transferFrom - recepient is your address, sender is 0x3c516282045f3e7b3a65b75412240fed76cb03ee and amount is the amount you original split (100 = 10000000000).
  eg. https://rinkeby.etherscan.io/tx/0xde749766a4575b35357433dd5e5814658d7fd3264c0a9c63fc506329be4dccc8
