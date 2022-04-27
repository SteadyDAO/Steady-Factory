import "dotenv/config";

import '@typechain/hardhat';
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter"
import { HardhatUserConfig, task } from "hardhat/config";
import { removeConsoleLog } from "hardhat-preprocessor";
import "solidity-coverage";
import "hardhat-watcher";

const accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test test",
};



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, { ethers }) => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 const config: HardhatUserConfig =  {
  defaultNetwork: "hardhat",
  solidity: {compilers: [
    // {
    //   version: "0.5.16",
    // },
    {
      version: "0.8.11",
      settings: {},
    },
  ]},
  paths: {
    artifacts: '../frontend/artifacts',
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      // accounts,
      blockGasLimit: 30000000
    },
    hardhat: {
      forking: {
        enabled: true,
        url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 24786530
      },
      blockGasLimit : 5470440
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_RINKEBY_API_KEY}`, 
      accounts,
    },
    kovan: {
      url: "https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}", 
      accounts,
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}", 
      accounts,
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}", 
      accounts,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}", 
      accounts,
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts,
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 30000000000,
      accounts,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      gasPrice: 31000000000,
      accounts,
      blockGasLimit : 10470440
    },
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) =>
        bre.network.name !== "hardhat" && bre.network.name !== "localhost"
    ),
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_KEY
  },
  // contractSizer: {
  //   alphaSort: true,
  //   disambiguatePaths: false,
  //   runOnCompile: true,
  //   strict: true,
  // },
  // gasReporter: {
  //   showMethodSig: false,
  //   enabled: (process.env.REPORT_GAS) ? true : false
  // },
  // typechain: {
  //   outDir: 'src/types',
  //   target: 'ethers-v5',
  //   alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
  //   externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  // },
  // abiExporter: {
  //   path: './data/abi',
  //   clear: false,
  //   flat: true,
  //   spacing: 2
  // },
  mocha: {
    timeout: 40000
  },
  watcher: {
    compilation: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
    ci: {
      tasks: ["clean", { command: "compile", params: { quiet: true } }, { command: "test", params: { noCompile: true, testFiles: ["test/Academy.test.ts","test/Alchemist.test.ts"] } } ],
      files: ["./contracts", "./test"],
    }
  }
};

export default config;
