/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { SimpleToken, SimpleTokenInterface } from "../SimpleToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimal",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
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
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526008600560146101000a81548160ff021916908360ff1602179055503480156200002d57600080fd5b5060405162001daf38038062001daf8339818101604052810190620000539190620002f6565b6040518060400160405280600b81526020017f53696d706c65546f6b656e0000000000000000000000000000000000000000008152506040518060400160405280600381526020017f53545400000000000000000000000000000000000000000000000000000000008152508160039080519060200190620000d792919062000203565b508060049080519060200190620000f092919062000203565b50505062000113620001076200013560201b60201c565b6200013d60201b60201c565b80600560146101000a81548160ff021916908360ff160217905550506200038d565b600033905090565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b828054620002119062000357565b90600052602060002090601f01602090048101928262000235576000855562000281565b82601f106200025057805160ff191683800117855562000281565b8280016001018555821562000281579182015b828111156200028057825182559160200191906001019062000263565b5b50905062000290919062000294565b5090565b5b80821115620002af57600081600090555060010162000295565b5090565b600080fd5b600060ff82169050919050565b620002d081620002b8565b8114620002dc57600080fd5b50565b600081519050620002f081620002c5565b92915050565b6000602082840312156200030f576200030e620002b3565b5b60006200031f84828501620002df565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200037057607f821691505b6020821081141562000387576200038662000328565b5b50919050565b611a12806200039d6000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c8063715018a611610097578063a457c2d711610066578063a457c2d71461029f578063a9059cbb146102cf578063dd62ed3e146102ff578063f2fde38b1461032f57610100565b8063715018a61461023b57806376809ce3146102455780638da5cb5b1461026357806395d89b411461028157610100565b8063313ce567116100d3578063313ce567146101a157806339509351146101bf57806340c10f19146101ef57806370a082311461020b57610100565b806306fdde0314610105578063095ea7b31461012357806318160ddd1461015357806323b872dd14610171575b600080fd5b61010d61034b565b60405161011a9190611112565b60405180910390f35b61013d600480360381019061013891906111cd565b6103dd565b60405161014a9190611228565b60405180910390f35b61015b6103fb565b6040516101689190611252565b60405180910390f35b61018b6004803603810190610186919061126d565b610405565b6040516101989190611228565b60405180910390f35b6101a96104fd565b6040516101b691906112dc565b60405180910390f35b6101d960048036038101906101d491906111cd565b610514565b6040516101e69190611228565b60405180910390f35b610209600480360381019061020491906111cd565b6105c0565b005b610225600480360381019061022091906112f7565b6105ce565b6040516102329190611252565b60405180910390f35b610243610616565b005b61024d61069e565b60405161025a91906112dc565b60405180910390f35b61026b6106b1565b6040516102789190611333565b60405180910390f35b6102896106db565b6040516102969190611112565b60405180910390f35b6102b960048036038101906102b491906111cd565b61076d565b6040516102c69190611228565b60405180910390f35b6102e960048036038101906102e491906111cd565b610858565b6040516102f69190611228565b60405180910390f35b6103196004803603810190610314919061134e565b610876565b6040516103269190611252565b60405180910390f35b610349600480360381019061034491906112f7565b6108fd565b005b60606003805461035a906113bd565b80601f0160208091040260200160405190810160405280929190818152602001828054610386906113bd565b80156103d35780601f106103a8576101008083540402835291602001916103d3565b820191906000526020600020905b8154815290600101906020018083116103b657829003601f168201915b5050505050905090565b60006103f16103ea6109f5565b84846109fd565b6001905092915050565b6000600254905090565b6000610412848484610bc8565b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600061045d6109f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050828110156104dd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d490611461565b60405180910390fd5b6104f1856104e96109f5565b8584036109fd565b60019150509392505050565b6000600560149054906101000a900460ff16905090565b60006105b66105216109f5565b84846001600061052f6109f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546105b191906114b0565b6109fd565b6001905092915050565b6105ca8282610e49565b5050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b61061e6109f5565b73ffffffffffffffffffffffffffffffffffffffff1661063c6106b1565b73ffffffffffffffffffffffffffffffffffffffff1614610692576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161068990611552565b60405180910390fd5b61069c6000610fa9565b565b600560149054906101000a900460ff1681565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546106ea906113bd565b80601f0160208091040260200160405190810160405280929190818152602001828054610716906113bd565b80156107635780601f1061073857610100808354040283529160200191610763565b820191906000526020600020905b81548152906001019060200180831161074657829003601f168201915b5050505050905090565b6000806001600061077c6109f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610839576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610830906115e4565b60405180910390fd5b61084d6108446109f5565b858584036109fd565b600191505092915050565b600061086c6108656109f5565b8484610bc8565b6001905092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6109056109f5565b73ffffffffffffffffffffffffffffffffffffffff166109236106b1565b73ffffffffffffffffffffffffffffffffffffffff1614610979576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161097090611552565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156109e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109e090611676565b60405180910390fd5b6109f281610fa9565b50565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610a6d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a6490611708565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610add576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ad49061179a565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610bbb9190611252565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610c38576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c2f9061182c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610ca8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c9f906118be565b60405180910390fd5b610cb383838361106f565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610d39576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d3090611950565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610dcc91906114b0565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610e309190611252565b60405180910390a3610e43848484611074565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610eb9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610eb0906119bc565b60405180910390fd5b610ec56000838361106f565b8060026000828254610ed791906114b0565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610f2c91906114b0565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610f919190611252565b60405180910390a3610fa560008383611074565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b838110156110b3578082015181840152602081019050611098565b838111156110c2576000848401525b50505050565b6000601f19601f8301169050919050565b60006110e482611079565b6110ee8185611084565b93506110fe818560208601611095565b611107816110c8565b840191505092915050565b6000602082019050818103600083015261112c81846110d9565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061116482611139565b9050919050565b61117481611159565b811461117f57600080fd5b50565b6000813590506111918161116b565b92915050565b6000819050919050565b6111aa81611197565b81146111b557600080fd5b50565b6000813590506111c7816111a1565b92915050565b600080604083850312156111e4576111e3611134565b5b60006111f285828601611182565b9250506020611203858286016111b8565b9150509250929050565b60008115159050919050565b6112228161120d565b82525050565b600060208201905061123d6000830184611219565b92915050565b61124c81611197565b82525050565b60006020820190506112676000830184611243565b92915050565b60008060006060848603121561128657611285611134565b5b600061129486828701611182565b93505060206112a586828701611182565b92505060406112b6868287016111b8565b9150509250925092565b600060ff82169050919050565b6112d6816112c0565b82525050565b60006020820190506112f160008301846112cd565b92915050565b60006020828403121561130d5761130c611134565b5b600061131b84828501611182565b91505092915050565b61132d81611159565b82525050565b60006020820190506113486000830184611324565b92915050565b6000806040838503121561136557611364611134565b5b600061137385828601611182565b925050602061138485828601611182565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806113d557607f821691505b602082108114156113e9576113e861138e565b5b50919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b600061144b602883611084565b9150611456826113ef565b604082019050919050565b6000602082019050818103600083015261147a8161143e565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006114bb82611197565b91506114c683611197565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156114fb576114fa611481565b5b828201905092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b600061153c602083611084565b915061154782611506565b602082019050919050565b6000602082019050818103600083015261156b8161152f565b9050919050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b60006115ce602583611084565b91506115d982611572565b604082019050919050565b600060208201905081810360008301526115fd816115c1565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611660602683611084565b915061166b82611604565b604082019050919050565b6000602082019050818103600083015261168f81611653565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b60006116f2602483611084565b91506116fd82611696565b604082019050919050565b60006020820190508181036000830152611721816116e5565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000611784602283611084565b915061178f82611728565b604082019050919050565b600060208201905081810360008301526117b381611777565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b6000611816602583611084565b9150611821826117ba565b604082019050919050565b6000602082019050818103600083015261184581611809565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b60006118a8602383611084565b91506118b38261184c565b604082019050919050565b600060208201905081810360008301526118d78161189b565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b600061193a602683611084565b9150611945826118de565b604082019050919050565b600060208201905081810360008301526119698161192d565b9050919050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b60006119a6601f83611084565b91506119b182611970565b602082019050919050565b600060208201905081810360008301526119d581611999565b905091905056fea26469706673582212209d38e4abe9617b854cbf2b51d9da01f42e6e67ebb0078c73666116f3eaa49cf464736f6c634300080b0033";

export class SimpleToken__factory extends ContractFactory {
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
    _decimals: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SimpleToken> {
    return super.deploy(_decimals, overrides || {}) as Promise<SimpleToken>;
  }
  getDeployTransaction(
    _decimals: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_decimals, overrides || {});
  }
  attach(address: string): SimpleToken {
    return super.attach(address) as SimpleToken;
  }
  connect(signer: Signer): SimpleToken__factory {
    return super.connect(signer) as SimpleToken__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SimpleTokenInterface {
    return new utils.Interface(_abi) as SimpleTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SimpleToken {
    return new Contract(address, _abi, signerOrProvider) as SimpleToken;
  }
}
