/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Alchemist, AlchemistInterface } from "../Alchemist";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "ratio",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "forgePrice",
        type: "uint256",
      },
    ],
    name: "ElixirCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "mergedAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "chyme",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenid",
        type: "uint256",
      },
    ],
    name: "Merge",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "source",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "splitAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "chymeVaultDeployed",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "chyme",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenid",
        type: "uint256",
      },
    ],
    name: "Split",
    type: "event",
  },
  {
    inputs: [],
    name: "academy",
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
    name: "chyme",
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
    inputs: [],
    name: "getChyme",
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
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "merge",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "enum Alchemist.Ratios",
        name: "ratioOfSteady",
        type: "uint8",
      },
    ],
    name: "split",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060016000556122d5806100256000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806364b6a1481161005b57806364b6a148146100e8578063a51d253314610103578063c4d66de814610114578063fb6e89621461012957600080fd5b806324a47aeb146100825780634cd6d7ab146100aa5780634f5fc3c1146100bd575b600080fd5b61009561009036600461145e565b61013c565b60405190151581526020015b60405180910390f35b6100956100b8366004611477565b610841565b6002546100d0906001600160a01b031681565b6040516001600160a01b0390911681526020016100a1565b6100d073403ad48f8c8507dd193fbe4453ef2a410eb402cd81565b6003546001600160a01b03166100d0565b6101276101223660046114c3565b610bf4565b005b6003546100d0906001600160a01b031681565b60006002600054036101955760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064015b60405180910390fd5b60026000819055506101ba604051806040016040528060008152602001600081525090565b6001546040517f6352211e00000000000000000000000000000000000000000000000000000000815260048101859052600091829182918291620100009091046001600160a01b031690636352211e90602401602060405180830381865afa15801561022a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061024e91906114eb565b60025460035460405163826d887360e01b81526001600160a01b03918216600482015292935060009283928392169063826d887390602401600060405180830381865afa1580156102a3573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102cb9190810190611553565b6001546040517f3c31457f00000000000000000000000000000000000000000000000000000000815260ff979097169a5091985096506001600160a01b0362010000909104169450633c31457f9361032f93508f9250600401905090815260200190565b608060405180830381865afa15801561034c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103709190611661565b60208c01939093526040517f70a082310000000000000000000000000000000000000000000000000000000081523360048201529099509097509095506001600160a01b038316906370a0823190602401602060405180830381865afa1580156103de573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061040291906116a2565b808952602089015111156104585760405162461bcd60e51b815260206004820152601060248201527f4e656564206d6f72652053746561647900000000000000000000000000000000604482015260640161018c565b6003546040517ff8b2cb4f0000000000000000000000000000000000000000000000000000000081526001600160a01b03918216600482015260009187169063f8b2cb4f90602401602060405180830381865afa1580156104bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104e191906116a2565b6040805160028082526060820183529293506000929091602083019080368337505060408051600280825260608201835293945060009390925090602083019080368337019050509050868260008151811061053f5761053f6116bb565b60200260200101906001600160a01b031690816001600160a01b0316815250508281600081518110610573576105736116bb565b602002602001018181525050428a11156105e4576001600160a01b03871633146105df5760405162461bcd60e51b815260206004820152601b60248201527f596f75206e65656420746f206265207468652063726561746f72210000000000604482015260640161018c565b6106b2565b60646105f18a60196116e7565b6105fc90604b611706565b610607906064611706565b61061190856116e7565b61061b919061171f565b8160008151811061062e5761062e6116bb565b602002602001018181525050338260018151811061064e5761064e6116bb565b6001600160a01b039092166020928302919091019091015260646106738a60196116e7565b61067e90604b611706565b61068890856116e7565b610692919061171f565b816001815181106106a5576106a56116bb565b6020026020010181815250505b6003546040517ff6a0b70a0000000000000000000000000000000000000000000000000000000081526001600160a01b038a81169263f6a0b70a92610701929091169086908690600401611741565b600060405180830381600087803b15801561071b57600080fd5b505af115801561072f573d6000803e3d6000fd5b5050505060208b015160035460405163a9d7fad560e01b81526001600160a01b038781169363a9d7fad59361076d936001938d92169060040161180c565b600060405180830381600087803b15801561078757600080fd5b505af115801561079b573d6000803e3d6000fd5b5050505060208b01516040517f79cc679000000000000000000000000000000000000000000000000000000000815233600482015260248101919091526001600160a01b038616906379cc679090604401600060405180830381600087803b15801561080657600080fd5b505af115801561081a573d6000803e3d6000fd5b50505050610828838e610ce4565b60019b5050505050505050505050506001600055919050565b60006002600054036108955760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161018c565b60026000818155905460035460405163826d887360e01b81526001600160a01b03918216600482015283928392839283928392169063826d887390602401600060405180830381865afa1580156108f0573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526109189190810190611553565b6002546040517f4b5fc8db0000000000000000000000000000000000000000000000000000000081526001600160a01b03808a166004830152989e50969c50949a50929850965090945060009390911691634b5fc8db9150602401602060405180830381865afa158015610990573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109b491906116a2565b905060006109c386600a611922565b6109ce87600a611922565b6109d891906116e7565b6109e39060646116e7565b828b60028111156109f6576109f66117d4565b610a01906019611931565b610a0c90604b611952565b610a199060ff168e6116e7565b610a2391906116e7565b610a2d919061171f565b610a3f90670de0b6b3a76400006116e7565b90506000610a4b610db0565b600354909150610a66906001600160a01b031633838f610e97565b60035460405163a9d7fad560e01b81526001600160a01b038681169263a9d7fad592610a9f9260009288928f929091169060040161196b565b600060405180830381600087803b158015610ab957600080fd5b505af1158015610acd573d6000803e3d6000fd5b50506040517f40c10f19000000000000000000000000000000000000000000000000000000008152336004820152602481018590526001600160a01b03881692506340c10f199150604401600060405180830381600087803b158015610b3257600080fd5b505af1158015610b46573d6000803e3d6000fd5b505050506000610b5d8d8d868a868d60ff16610f25565b9050336001600160a01b03167f430552a162a9271a67a2c68d352ebf78508c8778ecb58814fb47b2e2244108e58e84600360009054906101000a90046001600160a01b031685604051610bd394939291909384526001600160a01b03928316602085015291166040830152606082015260800190565b60405180910390a260019a5050505050505050505050600160005592915050565b6000610c006001611094565b90508015610c18576001805461ff0019166101001790555b600380546001600160a01b0384167fffffffffffffffffffffffff00000000000000000000000000000000000000009182161790915560028054909116331790556001805475403ad48f8c8507dd193fbe4453ef2a410eb402cd00007fffffffffffffffffffff0000000000000000000000000000000000000000ffff9091161790558015610ce0576001805461ff00191681556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050565b600354604080518481526001600160a01b03909216602083015281018290527f605166ae6aadc5b8b03d67e8f6d83467a99c03d72a932587f17dfed34a23586f9060600160405180910390a16001546040517f42966c6800000000000000000000000000000000000000000000000000000000815260048101839052620100009091046001600160a01b0316906342966c6890602401600060405180830381600087803b158015610d9457600080fd5b505af1158015610da8573d6000803e3d6000fd5b505050505050565b600033600160029054906101000a90046001600160a01b03166001600160a01b031663561892366040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e06573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e2a91906116a2565b610e359060016119a0565b604080516001600160a01b03909316602084015282015260600160405160208183030381529060405280519060200120604051610e7190611451565b8190604051809103906000f5905080158015610e91573d6000803e3d6000fd5b50905090565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd00000000000000000000000000000000000000000000000000000000179052610f1f9085906111cd565b50505050565b6001546003546000916001600160a01b036201000090910481169163aed0f69091339116896002811115610f5b57610f5b6117d4565b610f66906019611931565b610f7190604b611952565b898c610f7d8b426119a0565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e089901b1681526001600160a01b039687166004820152948616602486015260ff90931660448501526064840191909152608483015260a482015290861660c482015260e48101859052610104016020604051808303816000875af115801561100f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061103391906116a2565b90507fbc961357bfe7f42af42819bd1631b11c7e9b2917c4e65413020c65a987e4ab8481876002811115611069576110696117d4565b6040805192835260ff9091166020830152810187905260600160405180910390a19695505050505050565b600154600090610100900460ff1615611133578160ff1660011480156110b95750303b155b61112b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a6564000000000000000000000000000000000000606482015260840161018c565b506000919050565b60015460ff8084169116106111b05760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a6564000000000000000000000000000000000000606482015260840161018c565b506001805460ff191660ff9290921691909117815590565b919050565b6000611222826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166112b79092919063ffffffff16565b8051909150156112b2578080602001905181019061124091906119b3565b6112b25760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f74207375636365656400000000000000000000000000000000000000000000606482015260840161018c565b505050565b60606112c684846000856112d0565b90505b9392505050565b6060824710156113485760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c0000000000000000000000000000000000000000000000000000606482015260840161018c565b6001600160a01b0385163b61139f5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161018c565b600080866001600160a01b031685876040516113bb91906119d5565b60006040518083038185875af1925050503d80600081146113f8576040519150601f19603f3d011682016040523d82523d6000602084013e6113fd565b606091505b509150915061140d828286611418565b979650505050505050565b606083156114275750816112c9565b8251156114375782518084602001fd5b8160405162461bcd60e51b815260040161018c91906119f1565b61087b80611a2583390190565b60006020828403121561147057600080fd5b5035919050565b6000806040838503121561148a57600080fd5b823591506020830135600381106114a057600080fd5b809150509250929050565b6001600160a01b03811681146114c057600080fd5b50565b6000602082840312156114d557600080fd5b81356112c9816114ab565b80516111c8816114ab565b6000602082840312156114fd57600080fd5b81516112c9816114ab565b805160ff811681146111c857600080fd5b634e487b7160e01b600052604160045260246000fd5b60005b8381101561154a578181015183820152602001611532565b50506000910152565b600080600080600080600060e0888a03121561156e57600080fd5b8751611579816114ab565b965061158760208901611508565b955061159560408901611508565b945060608801519350608088015167ffffffffffffffff808211156115b957600080fd5b818a0191508a601f8301126115cd57600080fd5b8151818111156115df576115df611519565b604051601f8201601f19908116603f0116810190838211818310171561160757611607611519565b816040528281528d602084870101111561162057600080fd5b61163183602083016020880161152f565b809750505050505061164560a089016114e0565b915061165360c089016114e0565b905092959891949750929550565b6000806000806080858703121561167757600080fd5b8451935060208501519250604085015191506060850151611697816114ab565b939692955090935050565b6000602082840312156116b457600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615611701576117016116d1565b500290565b81810381811115611719576117196116d1565b92915050565b60008261173c57634e487b7160e01b600052601260045260246000fd5b500490565b6000606082016001600160a01b0380871684526020606081860152828751808552608087019150828901945060005b8181101561178e578551851683529483019491830191600101611770565b5050858103604087015286518082529082019350915080860160005b838110156117c6578151855293820193908201906001016117aa565b509298975050505050505050565b634e487b7160e01b600052602160045260246000fd5b6005811061180857634e487b7160e01b600052602160045260246000fd5b9052565b6080810161181a82876117ea565b8460208301528360408301526001600160a01b038316606083015295945050505050565b600181815b8085111561187957816000190482111561185f5761185f6116d1565b8085161561186c57918102915b93841c9390800290611843565b509250929050565b60008261189057506001611719565b8161189d57506000611719565b81600181146118b357600281146118bd576118d9565b6001915050611719565b60ff8411156118ce576118ce6116d1565b50506001821b611719565b5060208310610133831016604e8410600b84101617156118fc575081810a611719565b611906838361183e565b806000190482111561191a5761191a6116d1565b029392505050565b60006112c960ff841683611881565b600060ff821660ff84168160ff048111821515161561191a5761191a6116d1565b60ff8281168282160390811115611719576117196116d1565b6080810161197982876117ea565b84602083015260ff841660408301526001600160a01b038316606083015295945050505050565b80820180821115611719576117196116d1565b6000602082840312156119c557600080fd5b815180151581146112c957600080fd5b600082516119e781846020870161152f565b9190910192915050565b6020815260008251806020840152611a1081604085016020870161152f565b601f01601f1916919091016040019291505056fe608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6107fd8061007e6000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c8063f2fde38b11610050578063f2fde38b14610096578063f6a0b70a146100a9578063f8b2cb4f146100bc57600080fd5b8063715018a61461006c5780638da5cb5b14610076575b600080fd5b6100746100dd565b005b6000546040516001600160a01b0390911681526020015b60405180910390f35b6100746100a436600461057f565b610148565b6100746100b7366004610679565b61022a565b6100cf6100ca36600461057f565b610491565b60405190815260200161008d565b6000546001600160a01b0316331461013c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b6101466000610502565b565b6000546001600160a01b031633146101a25760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610133565b6001600160a01b03811661021e5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610133565b61022781610502565b50565b6000546001600160a01b031633146102845760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610133565b80518251146102d55760405162461bcd60e51b815260206004820152601660248201527f4d69736d6174636820696e20616c6c6f636174696f6e000000000000000000006044820152606401610133565b60005b825181101561048d5760006001600160a01b03168382815181106102fe576102fe61074f565b60200260200101516001600160a01b03161461047b57836001600160a01b031663a9059cbb8483815181106103355761033561074f565b60209081029190910101516040516370a0823160e01b81523060048201526001600160a01b038816906370a0823190602401602060405180830381865afa158015610384573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103a89190610765565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af115801561040b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061042f919061077e565b61047b5760405162461bcd60e51b815260206004820152600f60248201527f5472616e73666572206661696c656400000000000000000000000000000000006044820152606401610133565b80610485816107a0565b9150506102d8565b5033ff5b6040516370a0823160e01b81523060048201526000906001600160a01b038316906370a0823190602401602060405180830381865afa1580156104d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104fc9190610765565b92915050565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038116811461022757600080fd5b60006020828403121561059157600080fd5b813561059c8161056a565b9392505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156105e2576105e26105a3565b604052919050565b600067ffffffffffffffff821115610604576106046105a3565b5060051b60200190565b600082601f83011261061f57600080fd5b8135602061063461062f836105ea565b6105b9565b82815260059290921b8401810191818101908684111561065357600080fd5b8286015b8481101561066e5780358352918301918301610657565b509695505050505050565b60008060006060848603121561068e57600080fd5b83356106998161056a565b925060208481013567ffffffffffffffff808211156106b757600080fd5b818701915087601f8301126106cb57600080fd5b81356106d961062f826105ea565b81815260059190911b8301840190848101908a8311156106f857600080fd5b938501935b8285101561071f5784356107108161056a565b825293850193908501906106fd565b96505050604087013592508083111561073757600080fd5b50506107458682870161060e565b9150509250925092565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561077757600080fd5b5051919050565b60006020828403121561079057600080fd5b8151801515811461059c57600080fd5b6000600182016107c057634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220b2ebf3d5487d7f13a0afbbdc4c3588dec2f68f553d0c7afe99e5f751c755b98864736f6c63430008100033a264697066735822122025ad0f1d1039f398353380bc475d5499d15d00a161ea82c985094c587faffa3264736f6c63430008100033";

export class Alchemist__factory extends ContractFactory {
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
  ): Promise<Alchemist> {
    return super.deploy(overrides || {}) as Promise<Alchemist>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Alchemist {
    return super.attach(address) as Alchemist;
  }
  connect(signer: Signer): Alchemist__factory {
    return super.connect(signer) as Alchemist__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AlchemistInterface {
    return new utils.Interface(_abi) as AlchemistInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Alchemist {
    return new Contract(address, _abi, signerOrProvider) as Alchemist;
  }
}
