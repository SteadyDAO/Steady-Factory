/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  AlchemistAcademy,
  AlchemistAcademyInterface,
} from "../AlchemistAcademy";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "alchemist",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "priceOracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "forgePrice",
        type: "int256",
      },
    ],
    name: "AlchemistForged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "chyme",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fees",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "approvalStatus",
        type: "uint256",
      },
    ],
    name: "Chymed",
    type: "event",
  },
  {
    inputs: [],
    name: "DAOAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_chyme",
        type: "address",
      },
    ],
    name: "alchemist",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "alchemistCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "alchemistImpl",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "chymeList",
    outputs: [
      {
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "ratioOfSteady",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "fees",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "DAOApproved",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "oracleAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "infoUri",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeToMaturity",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_ratioOfSteady",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_fees",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_approvalStatus",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_chyme",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oracleAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_timeToMaturity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_rewardAmount",
        type: "uint256",
      },
    ],
    name: "createNewChyme",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "elixirImpl",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_chyme",
        type: "address",
      },
    ],
    name: "getChymeInfo",
    outputs: [
      {
        internalType: "address",
        name: "oracleAddress",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "fees",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "ratio",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "timeToMaturity",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_steadyImpl",
        type: "address",
      },
      {
        internalType: "address",
        name: "_elixirImpl",
        type: "address",
      },
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
      {
        internalType: "address",
        name: "_alchemistImpl",
        type: "address",
      },
      {
        internalType: "address",
        name: "_DAOAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_steadyDAOReward",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_priceOracle",
        type: "address",
      },
    ],
    name: "priceFromOracle",
    outputs: [
      {
        internalType: "int256",
        name: "price",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_steadyDAOReward",
        type: "address",
      },
    ],
    name: "setDAORewardContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "steadyDAOReward",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "steadyDAOToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "steadyImpl",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611e63806100206000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c8063cc2a9a5b11610097578063e2effcb811610066578063e2effcb8146102be578063ece07489146102da578063eea080c4146102f8578063f7e1b04d1461031457610100565b8063cc2a9a5b14610236578063d392eab114610252578063d539139314610270578063df0d927b1461028e57610100565b806361d027b3116100d357806361d027b3146101a857806364b6a148146101c657806380f1ea8a146101e4578063826d88731461020257610100565b80631eb4a6df146101055780634297711c1461012357806348aad3ed146101415780634b5fc8db14610178575b600080fd5b61010d610332565b60405161011a91906114eb565b60405180910390f35b61012b610358565b60405161013891906114eb565b60405180910390f35b61015b60048036038101906101569190611537565b61037e565b60405161016f989796959493929190611632565b60405180910390f35b610192600480360381019061018d9190611537565b6104a2565b60405161019f91906116d0565b60405180910390f35b6101b061060f565b6040516101bd91906114eb565b60405180910390f35b6101ce610635565b6040516101db91906114eb565b60405180910390f35b6101ec61065b565b6040516101f991906114eb565b60405180910390f35b61021c60048036038101906102179190611537565b610681565b60405161022d9594939291906116eb565b60405180910390f35b610250600480360381019061024b919061173e565b610832565b005b61025a610aa2565b60405161026791906114eb565b60405180910390f35b610278610ac8565b60405161028591906117e4565b60405180910390f35b6102a860048036038101906102a39190611537565b610aec565b6040516102b591906114eb565b60405180910390f35b6102d860048036038101906102d39190611537565b611008565b005b6102e2611054565b6040516102ef91906114eb565b60405180910390f35b610312600480360381019061030d9190611857565b61107a565b005b61031c611276565b604051610329919061190d565b60405180910390f35b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016020528060005260406000206000915090508060000160009054906101000a900460ff16908060000160019054906101000a900460ff16908060000160029054906101000a900460ff16908060000160039054906101000a900460ff16908060000160049054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600101805461041390611957565b80601f016020809104026020016040519081016040528092919081815260200182805461043f90611957565b801561048c5780601f106104615761010080835404028352916020019161048c565b820191906000526020600020905b81548152906001019060200180831161046f57829003601f168201915b5050505050908060020154908060030154905088565b6000806040516024016040516020818303038152906040527f50d25bcd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050905060008373ffffffffffffffffffffffffffffffffffffffff168260405161055191906119d0565b600060405180830381855afa9150503d806000811461058c576040519150601f19603f3d011682016040523d82523d6000602084013e610591565b606091505b50915050808060200190518101906105a99190611a13565b9250600183121580156105c957506c0c9f2c9cd04674edea400000008313155b610608576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105ff90611a8c565b60405180910390fd5b5050919050565b600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000806000600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160049054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160029054906101000a900460ff16600160008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160019054906101000a900460ff16600160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff16600160008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301549450945094509450945091939590929450565b600060019054906101000a900460ff1661085a5760008054906101000a900460ff1615610863565b61086261127c565b5b6108a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161089990611b1e565b60405180910390fd5b60008060019054906101000a900460ff1615905080156108f2576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b86600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555085600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508015610a995760008060016101000a81548160ff0219169083151502179055505b50505050505050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b600080600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020604051806101000160405290816000820160009054906101000a900460ff1660ff1660ff1681526020016000820160019054906101000a900460ff1660ff1660ff1681526020016000820160029054906101000a900460ff1660ff1660ff1681526020016000820160039054906101000a900460ff1660ff1660ff1681526020016000820160049054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600182018054610c1490611957565b80601f0160208091040260200160405190810160405280929190818152602001828054610c4090611957565b8015610c8d5780601f10610c6257610100808354040283529160200191610c8d565b820191906000526020600020905b815481529060010190602001808311610c7057829003601f168201915b505050505081526020016002820154815260200160038201548152505090506001816060015160ff1614610cf6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ced90611b8a565b60405180910390fd5b6000610d0582608001516104a2565b90506000610d34600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661128d565b90508073ffffffffffffffffffffffffffffffffffffffff16636dca3b0286600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168760096000815480929190610dd090611bd9565b91905055600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518863ffffffff1660e01b8152600401610e199796959493929190611c22565b600060405180830381600087803b158015610e3357600080fd5b505af1158015610e47573d6000803e3d6000fd5b50505050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632f2ff15d7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6836040518363ffffffff1660e01b8152600401610ec8929190611c91565b600060405180830381600087803b158015610ee257600080fd5b505af1158015610ef6573d6000803e3d6000fd5b50505050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632f2ff15d7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6836040518363ffffffff1660e01b8152600401610f77929190611c91565b600060405180830381600087803b158015610f9157600080fd5b505af1158015610fa5573d6000803e3d6000fd5b505050508073ffffffffffffffffffffffffffffffffffffffff167fd0fb6102a0316c24e4252cd5ed240ec097cefcb21ec410606801fba4f31105de846080015184604051610ff5929190611cba565b60405180910390a2809350505050919050565b611010611362565b80600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b611082611362565b60006040518061010001604052808a60ff1681526020018960ff1681526020018860ff1681526020018760ff1681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200160405180602001604052806000815250815260200183815260200184815250905080600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548160ff021916908360ff16021790555060208201518160000160016101000a81548160ff021916908360ff16021790555060408201518160000160026101000a81548160ff021916908360ff16021790555060608201518160000160036101000a81548160ff021916908360ff16021790555060808201518160000160046101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060a0820151816001019080519060200190611218929190611407565b5060c0820151816002015560e082015181600301559050507fbb8f7ee72caa397a1e6abc1aa3e9ffb7a33033034fc803ca129e47d147a8da8985888860405161126393929190611d1e565b60405180910390a1505050505050505050565b60095481565b6000611287306113f4565b15905090565b60006040517f3d602d80600a3d3981f3363d3d373d3d3d363d7300000000000000000000000081528260601b60148201527f5af43d82803e903d91602b57fd5bf3000000000000000000000000000000000060288201526037816000f0915050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561135d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161135490611da1565b60405180910390fd5b919050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146113f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113e990611e0d565b60405180910390fd5b565b600080823b905060008111915050919050565b82805461141390611957565b90600052602060002090601f016020900481019282611435576000855561147c565b82601f1061144e57805160ff191683800117855561147c565b8280016001018555821561147c579182015b8281111561147b578251825591602001919060010190611460565b5b509050611489919061148d565b5090565b5b808211156114a657600081600090555060010161148e565b5090565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006114d5826114aa565b9050919050565b6114e5816114ca565b82525050565b600060208201905061150060008301846114dc565b92915050565b600080fd5b611514816114ca565b811461151f57600080fd5b50565b6000813590506115318161150b565b92915050565b60006020828403121561154d5761154c611506565b5b600061155b84828501611522565b91505092915050565b600060ff82169050919050565b61157a81611564565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156115ba57808201518184015260208101905061159f565b838111156115c9576000848401525b50505050565b6000601f19601f8301169050919050565b60006115eb82611580565b6115f5818561158b565b935061160581856020860161159c565b61160e816115cf565b840191505092915050565b6000819050919050565b61162c81611619565b82525050565b600061010082019050611648600083018b611571565b611655602083018a611571565b6116626040830189611571565b61166f6060830188611571565b61167c60808301876114dc565b81810360a083015261168e81866115e0565b905061169d60c0830185611623565b6116aa60e0830184611623565b9998505050505050505050565b6000819050919050565b6116ca816116b7565b82525050565b60006020820190506116e560008301846116c1565b92915050565b600060a08201905061170060008301886114dc565b61170d6020830187611571565b61171a6040830186611571565b6117276060830185611571565b6117346080830184611623565b9695505050505050565b60008060008060008060c0878903121561175b5761175a611506565b5b600061176989828a01611522565b965050602061177a89828a01611522565b955050604061178b89828a01611522565b945050606061179c89828a01611522565b93505060806117ad89828a01611522565b92505060a06117be89828a01611522565b9150509295509295509295565b6000819050919050565b6117de816117cb565b82525050565b60006020820190506117f960008301846117d5565b92915050565b61180881611564565b811461181357600080fd5b50565b600081359050611825816117ff565b92915050565b61183481611619565b811461183f57600080fd5b50565b6000813590506118518161182b565b92915050565b600080600080600080600080610100898b03121561187857611877611506565b5b60006118868b828c01611816565b98505060206118978b828c01611816565b97505060406118a88b828c01611816565b96505060606118b98b828c01611816565b95505060806118ca8b828c01611522565b94505060a06118db8b828c01611522565b93505060c06118ec8b828c01611842565b92505060e06118fd8b828c01611842565b9150509295985092959890939650565b60006020820190506119226000830184611623565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061196f57607f821691505b6020821081141561198357611982611928565b5b50919050565b600081519050919050565b600081905092915050565b60006119aa82611989565b6119b48185611994565b93506119c481856020860161159c565b80840191505092915050565b60006119dc828461199f565b915081905092915050565b6119f0816116b7565b81146119fb57600080fd5b50565b600081519050611a0d816119e7565b92915050565b600060208284031215611a2957611a28611506565b5b6000611a37848285016119fe565b91505092915050565b7f4f7261636c65207072696365206973206f7574206f662072616e676500000000600082015250565b6000611a76601c8361158b565b9150611a8182611a40565b602082019050919050565b60006020820190508181036000830152611aa581611a69565b9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000611b08602e8361158b565b9150611b1382611aac565b604082019050919050565b60006020820190508181036000830152611b3781611afb565b9050919050565b7f5965204368796d6520697320496d707572652100000000000000000000000000600082015250565b6000611b7460138361158b565b9150611b7f82611b3e565b602082019050919050565b60006020820190508181036000830152611ba381611b67565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611be482611619565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611c1757611c16611baa565b5b600182019050919050565b600060e082019050611c37600083018a6114dc565b611c4460208301896114dc565b611c5160408301886114dc565b611c5e60608301876114dc565b611c6b6080830186611623565b611c7860a0830185611623565b611c8560c08301846114dc565b98975050505050505050565b6000604082019050611ca660008301856117d5565b611cb360208301846114dc565b9392505050565b6000604082019050611ccf60008301856114dc565b611cdc60208301846116c1565b9392505050565b6000819050919050565b6000611d08611d03611cfe84611564565b611ce3565b611619565b9050919050565b611d1881611ced565b82525050565b6000606082019050611d3360008301866114dc565b611d406020830185611d0f565b611d4d6040830184611d0f565b949350505050565b7f455243313136373a20637265617465206661696c656400000000000000000000600082015250565b6000611d8b60168361158b565b9150611d9682611d55565b602082019050919050565b60006020820190508181036000830152611dba81611d7e565b9050919050565b7f526571756972657320476f7665726e616e636521000000000000000000000000600082015250565b6000611df760148361158b565b9150611e0282611dc1565b602082019050919050565b60006020820190508181036000830152611e2681611dea565b905091905056fea2646970667358221220c2cf8b6f369c1880cb44ce46129dfe88d525df8960df8b9be43a7b6a4da1a8b664736f6c634300080b0033";

export class AlchemistAcademy__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<AlchemistAcademy> {
    return super.deploy(overrides || {}) as Promise<AlchemistAcademy>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): AlchemistAcademy {
    return super.attach(address) as AlchemistAcademy;
  }
  connect(signer: Signer): AlchemistAcademy__factory {
    return super.connect(signer) as AlchemistAcademy__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AlchemistAcademyInterface {
    return new utils.Interface(_abi) as AlchemistAcademyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AlchemistAcademy {
    return new Contract(address, _abi, signerOrProvider) as AlchemistAcademy;
  }
}
