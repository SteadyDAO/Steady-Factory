/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IAccessControlEnumerableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlEnumerableUpgradeable__factory>;
    getContractFactory(
      name: "IAccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlUpgradeable__factory>;
    getContractFactory(
      name: "IERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Upgradeable__factory>;
    getContractFactory(
      name: "IERC721Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Upgradeable__factory>;
    getContractFactory(
      name: "IERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165Upgradeable__factory>;
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Permit__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "ERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Burnable__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "ERC721Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721Burnable__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "Alchemist",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Alchemist__factory>;
    getContractFactory(
      name: "AlchemistAcademy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AlchemistAcademy__factory>;
    getContractFactory(
      name: "Elixir",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Elixir__factory>;
    getContractFactory(
      name: "IAcademy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAcademy__factory>;
    getContractFactory(
      name: "IElixir",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IElixir__factory>;
    getContractFactory(
      name: "IERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Burnable__factory>;
    getContractFactory(
      name: "IMerkleDistributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IMerkleDistributor__factory>;
    getContractFactory(
      name: "ISteadyDAORewards",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISteadyDAORewards__factory>;
    getContractFactory(
      name: "ITreasure",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ITreasure__factory>;
    getContractFactory(
      name: "SimpleToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpleToken__factory>;
    getContractFactory(
      name: "Steady",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Steady__factory>;
    getContractFactory(
      name: "SteadyDAOReward",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SteadyDAOReward__factory>;
    getContractFactory(
      name: "DummyPriceOracleForTesting",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyPriceOracleForTesting__factory>;
    getContractFactory(
      name: "Treasure",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Treasure__factory>;

    getContractAt(
      name: "IAccessControlEnumerableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlEnumerableUpgradeable>;
    getContractAt(
      name: "IAccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlUpgradeable>;
    getContractAt(
      name: "IERC20Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Upgradeable>;
    getContractAt(
      name: "IERC721Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Upgradeable>;
    getContractAt(
      name: "IERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165Upgradeable>;
    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Permit>;
    getContractAt(
      name: "IERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "ERC20Burnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Burnable>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "ERC721Burnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721Burnable>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "Alchemist",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Alchemist>;
    getContractAt(
      name: "AlchemistAcademy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AlchemistAcademy>;
    getContractAt(
      name: "Elixir",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Elixir>;
    getContractAt(
      name: "IAcademy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAcademy>;
    getContractAt(
      name: "IElixir",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IElixir>;
    getContractAt(
      name: "IERC20Burnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Burnable>;
    getContractAt(
      name: "IMerkleDistributor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IMerkleDistributor>;
    getContractAt(
      name: "ISteadyDAORewards",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISteadyDAORewards>;
    getContractAt(
      name: "ITreasure",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ITreasure>;
    getContractAt(
      name: "SimpleToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpleToken>;
    getContractAt(
      name: "Steady",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Steady>;
    getContractAt(
      name: "SteadyDAOReward",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SteadyDAOReward>;
    getContractAt(
      name: "DummyPriceOracleForTesting",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyPriceOracleForTesting>;
    getContractAt(
      name: "Treasure",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Treasure>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
