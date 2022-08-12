/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface AlchemistInterface extends ethers.utils.Interface {
  functions: {
    "academy()": FunctionFragment;
    "alchemistId()": FunctionFragment;
    "chyme()": FunctionFragment;
    "chymeVaultImpl()": FunctionFragment;
    "elixirImpl()": FunctionFragment;
    "getChyme()": FunctionFragment;
    "initialize(address,address,address,uint256,address)": FunctionFragment;
    "merge(uint256)": FunctionFragment;
    "split(uint256,uint8)": FunctionFragment;
    "steadyDAORewards()": FunctionFragment;
    "steadyDAOToken()": FunctionFragment;
    "treasury()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "academy", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "alchemistId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "chyme", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "chymeVaultImpl",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "elixirImpl",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getChyme", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "merge", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "split",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "steadyDAORewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "steadyDAOToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "treasury", values?: undefined): string;

  decodeFunctionResult(functionFragment: "academy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "alchemistId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "chyme", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "chymeVaultImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "elixirImpl", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getChyme", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "merge", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "split", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "steadyDAORewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "steadyDAOToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "treasury", data: BytesLike): Result;

  events: {
    "Initialized(uint8)": EventFragment;
    "Merge(address,uint256,address,uint256)": EventFragment;
    "Split(address,uint256,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Merge"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Split"): EventFragment;
}

export type InitializedEvent = TypedEvent<[number] & { version: number }>;

export type MergeEvent = TypedEvent<
  [string, BigNumber, string, BigNumber] & {
    source: string;
    mergedAmount: BigNumber;
    chyme: string;
    tokenid: BigNumber;
  }
>;

export type SplitEvent = TypedEvent<
  [string, BigNumber, string, string, BigNumber] & {
    source: string;
    splitAmount: BigNumber;
    chymeVaultDeployed: string;
    chyme: string;
    tokenId: BigNumber;
  }
>;

export class Alchemist extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: AlchemistInterface;

  functions: {
    academy(overrides?: CallOverrides): Promise<[string]>;

    alchemistId(overrides?: CallOverrides): Promise<[BigNumber]>;

    chyme(overrides?: CallOverrides): Promise<[string]>;

    chymeVaultImpl(overrides?: CallOverrides): Promise<[string]>;

    elixirImpl(overrides?: CallOverrides): Promise<[string]>;

    getChyme(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _chyme: string,
      _elixirImpl: string,
      _treasury: string,
      _alchemistId: BigNumberish,
      _steadyDAORewards: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    merge(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    split(
      amount: BigNumberish,
      ratioOfSteady: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    steadyDAORewards(overrides?: CallOverrides): Promise<[string]>;

    steadyDAOToken(overrides?: CallOverrides): Promise<[string]>;

    treasury(overrides?: CallOverrides): Promise<[string]>;
  };

  academy(overrides?: CallOverrides): Promise<string>;

  alchemistId(overrides?: CallOverrides): Promise<BigNumber>;

  chyme(overrides?: CallOverrides): Promise<string>;

  chymeVaultImpl(overrides?: CallOverrides): Promise<string>;

  elixirImpl(overrides?: CallOverrides): Promise<string>;

  getChyme(overrides?: CallOverrides): Promise<string>;

  initialize(
    _chyme: string,
    _elixirImpl: string,
    _treasury: string,
    _alchemistId: BigNumberish,
    _steadyDAORewards: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  merge(
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  split(
    amount: BigNumberish,
    ratioOfSteady: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  steadyDAORewards(overrides?: CallOverrides): Promise<string>;

  steadyDAOToken(overrides?: CallOverrides): Promise<string>;

  treasury(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    academy(overrides?: CallOverrides): Promise<string>;

    alchemistId(overrides?: CallOverrides): Promise<BigNumber>;

    chyme(overrides?: CallOverrides): Promise<string>;

    chymeVaultImpl(overrides?: CallOverrides): Promise<string>;

    elixirImpl(overrides?: CallOverrides): Promise<string>;

    getChyme(overrides?: CallOverrides): Promise<string>;

    initialize(
      _chyme: string,
      _elixirImpl: string,
      _treasury: string,
      _alchemistId: BigNumberish,
      _steadyDAORewards: string,
      overrides?: CallOverrides
    ): Promise<void>;

    merge(tokenId: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    split(
      amount: BigNumberish,
      ratioOfSteady: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    steadyDAORewards(overrides?: CallOverrides): Promise<string>;

    steadyDAOToken(overrides?: CallOverrides): Promise<string>;

    treasury(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Initialized(uint8)"(
      version?: null
    ): TypedEventFilter<[number], { version: number }>;

    Initialized(
      version?: null
    ): TypedEventFilter<[number], { version: number }>;

    "Merge(address,uint256,address,uint256)"(
      source?: string | null,
      mergedAmount?: null,
      chyme?: null,
      tokenid?: null
    ): TypedEventFilter<
      [string, BigNumber, string, BigNumber],
      {
        source: string;
        mergedAmount: BigNumber;
        chyme: string;
        tokenid: BigNumber;
      }
    >;

    Merge(
      source?: string | null,
      mergedAmount?: null,
      chyme?: null,
      tokenid?: null
    ): TypedEventFilter<
      [string, BigNumber, string, BigNumber],
      {
        source: string;
        mergedAmount: BigNumber;
        chyme: string;
        tokenid: BigNumber;
      }
    >;

    "Split(address,uint256,address,address,uint256)"(
      source?: string | null,
      splitAmount?: null,
      chymeVaultDeployed?: null,
      chyme?: null,
      tokenId?: null
    ): TypedEventFilter<
      [string, BigNumber, string, string, BigNumber],
      {
        source: string;
        splitAmount: BigNumber;
        chymeVaultDeployed: string;
        chyme: string;
        tokenId: BigNumber;
      }
    >;

    Split(
      source?: string | null,
      splitAmount?: null,
      chymeVaultDeployed?: null,
      chyme?: null,
      tokenId?: null
    ): TypedEventFilter<
      [string, BigNumber, string, string, BigNumber],
      {
        source: string;
        splitAmount: BigNumber;
        chymeVaultDeployed: string;
        chyme: string;
        tokenId: BigNumber;
      }
    >;
  };

  estimateGas: {
    academy(overrides?: CallOverrides): Promise<BigNumber>;

    alchemistId(overrides?: CallOverrides): Promise<BigNumber>;

    chyme(overrides?: CallOverrides): Promise<BigNumber>;

    chymeVaultImpl(overrides?: CallOverrides): Promise<BigNumber>;

    elixirImpl(overrides?: CallOverrides): Promise<BigNumber>;

    getChyme(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _chyme: string,
      _elixirImpl: string,
      _treasury: string,
      _alchemistId: BigNumberish,
      _steadyDAORewards: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    merge(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    split(
      amount: BigNumberish,
      ratioOfSteady: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    steadyDAORewards(overrides?: CallOverrides): Promise<BigNumber>;

    steadyDAOToken(overrides?: CallOverrides): Promise<BigNumber>;

    treasury(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    academy(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    alchemistId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    chyme(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    chymeVaultImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    elixirImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getChyme(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _chyme: string,
      _elixirImpl: string,
      _treasury: string,
      _alchemistId: BigNumberish,
      _steadyDAORewards: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    merge(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    split(
      amount: BigNumberish,
      ratioOfSteady: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    steadyDAORewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    steadyDAOToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    treasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
