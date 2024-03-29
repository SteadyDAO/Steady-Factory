// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AlchemistForged extends ethereum.Event {
  get params(): AlchemistForged__Params {
    return new AlchemistForged__Params(this);
  }
}

export class AlchemistForged__Params {
  _event: AlchemistForged;

  constructor(event: AlchemistForged) {
    this._event = event;
  }

  get alchemist(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get priceOracle(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get fees(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get steadyImplForChyme(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class Chymed extends ethereum.Event {
  get params(): Chymed__Params {
    return new Chymed__Params(this);
  }
}

export class Chymed__Params {
  _event: Chymed;

  constructor(event: Chymed) {
    this._event = event;
  }

  get chyme(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fees(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get approvalStatus(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get symbol(): string {
    return this._event.parameters[3].value.toString();
  }
}

export class Initialized extends ethereum.Event {
  get params(): Initialized__Params {
    return new Initialized__Params(this);
  }
}

export class Initialized__Params {
  _event: Initialized;

  constructor(event: Initialized) {
    this._event = event;
  }

  get version(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class AlchemistAcademy__chymeListResult {
  value0: i32;
  value1: i32;
  value2: i32;
  value3: Address;
  value4: Address;
  value5: string;
  value6: BigInt;
  value7: Address;

  constructor(
    value0: i32,
    value1: i32,
    value2: i32,
    value3: Address,
    value4: Address,
    value5: string,
    value6: BigInt,
    value7: Address
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
    this.value7 = value7;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set(
      "value0",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value0))
    );
    map.set(
      "value1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value1))
    );
    map.set(
      "value2",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value2))
    );
    map.set("value3", ethereum.Value.fromAddress(this.value3));
    map.set("value4", ethereum.Value.fromAddress(this.value4));
    map.set("value5", ethereum.Value.fromString(this.value5));
    map.set("value6", ethereum.Value.fromUnsignedBigInt(this.value6));
    map.set("value7", ethereum.Value.fromAddress(this.value7));
    return map;
  }
}

export class AlchemistAcademy__getChymeInfoResult {
  value0: Address;
  value1: i32;
  value2: i32;
  value3: BigInt;
  value4: string;
  value5: Address;
  value6: Address;

  constructor(
    value0: Address,
    value1: i32,
    value2: i32,
    value3: BigInt,
    value4: string,
    value5: Address,
    value6: Address
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set(
      "value1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value1))
    );
    map.set(
      "value2",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value2))
    );
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromString(this.value4));
    map.set("value5", ethereum.Value.fromAddress(this.value5));
    map.set("value6", ethereum.Value.fromAddress(this.value6));
    return map;
  }
}

export class AlchemistAcademy__setChymeInfoInput_iChymeStruct extends ethereum.Tuple {
  get decimals(): i32 {
    return this[0].toI32();
  }

  get fees(): i32 {
    return this[1].toI32();
  }

  get DAOApproved(): i32 {
    return this[2].toI32();
  }

  get oracleAddress(): Address {
    return this[3].toAddress();
  }

  get steadyImplForChyme(): Address {
    return this[4].toAddress();
  }

  get symbol(): string {
    return this[5].toString();
  }

  get timeToMaturity(): BigInt {
    return this[6].toBigInt();
  }

  get steadyDAOReward(): Address {
    return this[7].toAddress();
  }
}

export class AlchemistAcademy extends ethereum.SmartContract {
  static bind(address: Address): AlchemistAcademy {
    return new AlchemistAcademy("AlchemistAcademy", address);
  }

  DAOAddress(): Address {
    let result = super.call("DAOAddress", "DAOAddress():(address)", []);

    return result[0].toAddress();
  }

  try_DAOAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall("DAOAddress", "DAOAddress():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  MINTER_ROLE(): Bytes {
    let result = super.call("MINTER_ROLE", "MINTER_ROLE():(bytes32)", []);

    return result[0].toBytes();
  }

  try_MINTER_ROLE(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("MINTER_ROLE", "MINTER_ROLE():(bytes32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  alchemistImpl(): Address {
    let result = super.call("alchemistImpl", "alchemistImpl():(address)", []);

    return result[0].toAddress();
  }

  try_alchemistImpl(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "alchemistImpl",
      "alchemistImpl():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  chymeList(param0: Address): AlchemistAcademy__chymeListResult {
    let result = super.call(
      "chymeList",
      "chymeList(address):(uint8,uint8,uint8,address,address,string,uint256,address)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new AlchemistAcademy__chymeListResult(
      result[0].toI32(),
      result[1].toI32(),
      result[2].toI32(),
      result[3].toAddress(),
      result[4].toAddress(),
      result[5].toString(),
      result[6].toBigInt(),
      result[7].toAddress()
    );
  }

  try_chymeList(
    param0: Address
  ): ethereum.CallResult<AlchemistAcademy__chymeListResult> {
    let result = super.tryCall(
      "chymeList",
      "chymeList(address):(uint8,uint8,uint8,address,address,string,uint256,address)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new AlchemistAcademy__chymeListResult(
        value[0].toI32(),
        value[1].toI32(),
        value[2].toI32(),
        value[3].toAddress(),
        value[4].toAddress(),
        value[5].toString(),
        value[6].toBigInt(),
        value[7].toAddress()
      )
    );
  }

  getChymeInfo(_chyme: Address): AlchemistAcademy__getChymeInfoResult {
    let result = super.call(
      "getChymeInfo",
      "getChymeInfo(address):(address,uint8,uint8,uint256,string,address,address)",
      [ethereum.Value.fromAddress(_chyme)]
    );

    return new AlchemistAcademy__getChymeInfoResult(
      result[0].toAddress(),
      result[1].toI32(),
      result[2].toI32(),
      result[3].toBigInt(),
      result[4].toString(),
      result[5].toAddress(),
      result[6].toAddress()
    );
  }

  try_getChymeInfo(
    _chyme: Address
  ): ethereum.CallResult<AlchemistAcademy__getChymeInfoResult> {
    let result = super.tryCall(
      "getChymeInfo",
      "getChymeInfo(address):(address,uint8,uint8,uint256,string,address,address)",
      [ethereum.Value.fromAddress(_chyme)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new AlchemistAcademy__getChymeInfoResult(
        value[0].toAddress(),
        value[1].toI32(),
        value[2].toI32(),
        value[3].toBigInt(),
        value[4].toString(),
        value[5].toAddress(),
        value[6].toAddress()
      )
    );
  }

  priceFromOracle(_priceOracle: Address): BigInt {
    let result = super.call(
      "priceFromOracle",
      "priceFromOracle(address):(int256)",
      [ethereum.Value.fromAddress(_priceOracle)]
    );

    return result[0].toBigInt();
  }

  try_priceFromOracle(_priceOracle: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "priceFromOracle",
      "priceFromOracle(address):(int256)",
      [ethereum.Value.fromAddress(_priceOracle)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  setChymeInfo(
    _chyme: Address,
    _iChyme: AlchemistAcademy__setChymeInfoInput_iChymeStruct
  ): boolean {
    let result = super.call(
      "setChymeInfo",
      "setChymeInfo(address,(uint8,uint8,uint8,address,address,string,uint256,address)):(bool)",
      [ethereum.Value.fromAddress(_chyme), ethereum.Value.fromTuple(_iChyme)]
    );

    return result[0].toBoolean();
  }

  try_setChymeInfo(
    _chyme: Address,
    _iChyme: AlchemistAcademy__setChymeInfoInput_iChymeStruct
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "setChymeInfo",
      "setChymeInfo(address,(uint8,uint8,uint8,address,address,string,uint256,address)):(bool)",
      [ethereum.Value.fromAddress(_chyme), ethereum.Value.fromTuple(_iChyme)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  steadyImpl(): Address {
    let result = super.call("steadyImpl", "steadyImpl():(address)", []);

    return result[0].toAddress();
  }

  try_steadyImpl(): ethereum.CallResult<Address> {
    let result = super.tryCall("steadyImpl", "steadyImpl():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  treasury(): Address {
    let result = super.call("treasury", "treasury():(address)", []);

    return result[0].toAddress();
  }

  try_treasury(): ethereum.CallResult<Address> {
    let result = super.tryCall("treasury", "treasury():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class CreateNewChymeCall extends ethereum.Call {
  get inputs(): CreateNewChymeCall__Inputs {
    return new CreateNewChymeCall__Inputs(this);
  }

  get outputs(): CreateNewChymeCall__Outputs {
    return new CreateNewChymeCall__Outputs(this);
  }
}

export class CreateNewChymeCall__Inputs {
  _call: CreateNewChymeCall;

  constructor(call: CreateNewChymeCall) {
    this._call = call;
  }

  get _iChyme(): CreateNewChymeCall_iChymeStruct {
    return changetype<CreateNewChymeCall_iChymeStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }

  get _chyme(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class CreateNewChymeCall__Outputs {
  _call: CreateNewChymeCall;

  constructor(call: CreateNewChymeCall) {
    this._call = call;
  }
}

export class CreateNewChymeCall_iChymeStruct extends ethereum.Tuple {
  get decimals(): i32 {
    return this[0].toI32();
  }

  get fees(): i32 {
    return this[1].toI32();
  }

  get DAOApproved(): i32 {
    return this[2].toI32();
  }

  get oracleAddress(): Address {
    return this[3].toAddress();
  }

  get steadyImplForChyme(): Address {
    return this[4].toAddress();
  }

  get symbol(): string {
    return this[5].toString();
  }

  get timeToMaturity(): BigInt {
    return this[6].toBigInt();
  }

  get steadyDAOReward(): Address {
    return this[7].toAddress();
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _steadyImpl(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _treasury(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _alchemistImpl(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _DAOAddress(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class SetChymeInfoCall extends ethereum.Call {
  get inputs(): SetChymeInfoCall__Inputs {
    return new SetChymeInfoCall__Inputs(this);
  }

  get outputs(): SetChymeInfoCall__Outputs {
    return new SetChymeInfoCall__Outputs(this);
  }
}

export class SetChymeInfoCall__Inputs {
  _call: SetChymeInfoCall;

  constructor(call: SetChymeInfoCall) {
    this._call = call;
  }

  get _chyme(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _iChyme(): SetChymeInfoCall_iChymeStruct {
    return changetype<SetChymeInfoCall_iChymeStruct>(
      this._call.inputValues[1].value.toTuple()
    );
  }
}

export class SetChymeInfoCall__Outputs {
  _call: SetChymeInfoCall;

  constructor(call: SetChymeInfoCall) {
    this._call = call;
  }

  get success(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class SetChymeInfoCall_iChymeStruct extends ethereum.Tuple {
  get decimals(): i32 {
    return this[0].toI32();
  }

  get fees(): i32 {
    return this[1].toI32();
  }

  get DAOApproved(): i32 {
    return this[2].toI32();
  }

  get oracleAddress(): Address {
    return this[3].toAddress();
  }

  get steadyImplForChyme(): Address {
    return this[4].toAddress();
  }

  get symbol(): string {
    return this[5].toString();
  }

  get timeToMaturity(): BigInt {
    return this[6].toBigInt();
  }

  get steadyDAOReward(): Address {
    return this[7].toAddress();
  }
}
