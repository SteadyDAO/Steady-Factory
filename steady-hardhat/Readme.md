# Manual Testing - Create a new Alchemist and Split tokens
For all addresses if in case of doubt check deploys.md for contract addresses

## 1. Get some chyme tokens (the token that you want to split)
https://mumbai.polygonscan.com/address/0x51F6a023D48ceb22F30E71f87AF695ba0a4D95df#writeContract
where 0x51F6a023D48ceb22F30E71f87AF695ba0a4D95df is a simple test token

Connect your wallet address to etherscan.
Goto, function mint -  key in your address and an amount of tokens you want plus 8 decimals (example 100 tokens = 10000000000)

## 2. Create new alchemist (this will take the current oracle price of the token) / Alternatively use the existing pool skip to step 3

1. Goto Alchemist academy and connect any wallet
eg. https://mumbai.polygonscan.com/address/0x2955591086bB33eeA5E0c803C8C8bF3D3ba9Ec70#writeContract
2. call alchemist function call (0.00001, 0x51F6a023D48ceb22F30E71f87AF695ba0a4D95df) 0.00001 is a small fee for creating a new alchemist alchemy
  0x51F6a023D48ceb22F30E71f87AF695ba0a4D95df is the address of the chyme address 
3. Check logs for "AlchemistForged" to find the address of newly deployed alchemist eg. 
4. https://mumbai.polygonscan.com/tx/0x656d73de25047067d87476b3a6c595f96af4902375a7b938460311e43a2b7e35#eventlog

Alchemist  - 0x7cD7b74dDDf9E77eC567895b8Ce1191DB9bfAAe1

## 3. Approve transfer of chyme tokens to the alchemist 
Goto - https://mumbai.polygonscan.com/address/0x51F6a023D48ceb22F30E71f87AF695ba0a4D95df#writeContract
Approve - (100 = 10000000000) stt tokens 0x51F6a023D48ceb22F30E71f87AF695ba0a4D95df to alchemist 0x7cD7b74dDDf9E77eC567895b8Ce1191DB9bfAAe1

## 4. Split some chyme stt tokens 
1. goto alchemist contract 
2. https://mumbai.polygonscan.com/address/0x7cD7b74dDDf9E77eC567895b8Ce1191DB9bfAAe1#writeContract
3. Splittokens (100 = 10000000000)  -> https://mumbai.polygonscan.com/tx/0xc6e4872174be863d29497d46a9aadff01eba52723a9b11e888cbe1d694eea30f
4. Verify the transaction information (note that you may need to increase the default gas price to get a quick confirmation). Take note of the number of steady tokens you receive.
5. Verify that the Elixir information is correct https://mumbai.polygonscan.com/address/0xb5498259b96a2659fc73d9257c762a829e9bbe2e#readContract

## 5. Merge the token back
1. give approval for your Elixir NFT back - tokenId 1, spender 0x7cD7b74dDDf9E77eC567895b8Ce1191DB9bfAAe1
  https://mumbai.polygonscan.com/address/0xb5498259b96a2659fc73d9257c762a829e9bbe2e#writeContract 
2. give approval for Steady Tokens back - use the amount of Steady (STY) tokens received in step 4 (example 100 = 10000000000), spender 0x7cD7b74dDDf9E77eC567895b8Ce1191DB9bfAAe1 - https://mumbai.polygonscan.com/address/0x2B242F7718272D5852F2C0bb9dE9322350dec720#writeContract
3. Call the Merge  https://mumbai.polygonscan.com/address/0x7cD7b74dDDf9E77eC567895b8Ce1191DB9bfAAe1#writeContract
  with the NFT token id
4. Now you should have the right to pull your original chyme, you can do this by going to https://mumbai.polygonscan.com/address/0x51F6a023D48ceb22F30E71f87AF695ba0a4D95df#writeContract and calling transferFrom
  eg. https://mumbai.polygonscan.com/tx/0x4a4c01c5a111fadc4442ef418aaaccc0869efad99ec2a69c328df42c4e562114
