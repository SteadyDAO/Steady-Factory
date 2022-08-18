import {ByteArray , Bytes,BigInt, ethereum, Address, store } from "@graphprotocol/graph-ts"

import {
  AlchemistAcademy,
  AlchemistForged,
  Chymed,
} from "../generated/AlchemistAcademy/AlchemistAcademy"
import { Split,Merge } from "../generated/templates/AlchemistInstance/Alchemist"
import { Alchemist, Chyme, Elixir, Transaction} from "../generated/schema"
import { AlchemistInstance } from "../generated/templates"
enum Status{
  Split,
  Merged
}

export function handleAlchemistForged(event: AlchemistForged): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = Alchemist.load(event.params.alchemist.toHexString())
  let id = event.transaction.hash.toHexString()
  let transaction = Transaction.load(id)
  
  let tx:ethereum.Transaction = event.transaction

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new Alchemist(event.params.alchemist.toHexString())
  }
  //start indexing the child factory contract
  AlchemistInstance.create(event.params.alchemist)
  if(!transaction) {
   transaction = new Transaction(id)
  }
  let chymeEntity = Chyme.load(transaction.chyme);
  if(!chymeEntity){
    chymeEntity = new Chyme(transaction.chyme)
  }

  // Increment the counter
  entity.count = BigInt.fromI32(1).plus(entity.count)
  entity.chyme = transaction.chyme
  entity.alchemist = event.params.alchemist
  chymeEntity.alchemist = event.params.alchemist.toHexString()
  let contract = AlchemistAcademy.bind(event.address)
  let chymeInfo = contract.getChymeInfo(Address.fromString(transaction.chyme))
  let priceOracleBefore =  chymeInfo.toMap().get("value0");
  let priceOracle = Address.fromString("0x0000000000000000000000000000000000000000")
  if(priceOracleBefore){
    priceOracle = priceOracleBefore.toAddress()
  }
  chymeEntity.steadyToken = event.params.steadyImplForChyme
  
  chymeEntity.priceOracle = priceOracle
  entity.save()
  chymeEntity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DAOAddress(...)
  // - contract.MINTER_ROLE(...)
  // - contract.alchemist(...)
  // - contract.alchemistCounter(...)
  // - contract.alchemistImpl(...)
  // - contract.chymeList(...)
  // - contract.elixirImpl(...)
  // - contract.getChymeInfo(...)
  // - contract.priceFromOracle(...)
  // - contract.steadyDAOReward(...)
  // - contract.steadyDAOToken(...)
  // - contract.steadyImpl(...)
  // - contract.treasury(...)
}

export function handleChymed(event: Chymed): void {
  let chymeEntity = Chyme.load(event.params.chyme.toHexString());
  if(!chymeEntity){
    chymeEntity = new Chyme(event.params.chyme.toHexString())

  }
  let id = event.transaction.hash.toHexString()
  let transaction = new Transaction(id)

  transaction.chyme = event.params.chyme.toHexString()
  // chymeEntity.priceOracle = event.params.
//   //store the transaction that created this chyme and use it to link it to the alchemist later
  
  transaction.save();
  chymeEntity.symbol = event.params.symbol
  chymeEntity.save();
}

export function handleSplit(event: Split): void {
  let elixirEntity = Elixir.load(event.params.tokenId.toHexString())
  if(!elixirEntity){
    elixirEntity = new Elixir(event.params.tokenId.toHexString())
  }
  elixirEntity.chyme = event.params.chyme.toHexString()
  elixirEntity.status = "Split"

  elixirEntity.save()
}

export function handleMerge(event: Merge): void {
  let elixirEntity = Elixir.load(event.params.tokenid.toHexString())
  if(!elixirEntity){
    elixirEntity = new Elixir(event.params.tokenid.toHexString())
  }
  elixirEntity.status = "Merged"
  elixirEntity.save()
}
// export function handleChymeCreated(call: CreateNewChymeCall): void {
//   let id = call.transaction.hash.toHexString()
//   let transaction = new Transaction(id)

//   let chymeEntity = Chyme.load(call.inputs._chyme.toHexString())
//   if (!chymeEntity) {
//     chymeEntity = new Chyme(call.inputs._chyme.toHexString())
//   }
//   transaction.chyme = call.inputs._chyme.toHexString()
//   chymeEntity.priceOracle = call.inputs._oracleAddress
//   //store the transaction that created this chyme and use it to link it to the alchemist later
  
//   chymeEntity.save();
//   transaction.save();
// }