/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IAcademy, IAcademyInterface } from "../IAcademy";

const _abi = [
  {
    inputs: [],
    name: "DAOAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "alchemistImpl",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "chymeList",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "decimals",
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
            internalType: "address",
            name: "steadyImplForChyme",
            type: "address",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timeToMaturity",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "steadyDAOReward",
            type: "address",
          },
        ],
        internalType: "struct IChyme.Chyme",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "elixirImpl",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "decimals",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "timeToMaturity",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "address",
        name: "steadyImplForChyme",
        type: "address",
      },
      {
        internalType: "address",
        name: "steadyDAOReward",
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
    inputs: [],
    name: "steadyDAOToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "steadyImpl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IAcademy__factory {
  static readonly abi = _abi;
  static createInterface(): IAcademyInterface {
    return new utils.Interface(_abi) as IAcademyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAcademy {
    return new Contract(address, _abi, signerOrProvider) as IAcademy;
  }
}
