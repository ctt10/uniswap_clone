import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import fs from "fs";

const projectKey = "AbKkaIMQesworvOYTLVvtZa8fbeBa3Gu";
const privateKey = fs.readFileSync(".secret").toString();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{
      version: "0.7.6",
      settings: {
        evmVersion: "istanbul",
        optimizer:{
          enabled: true,
          runs: 1000,
        }
      },
    }],
  },
  networks: {
    hardhat: {
      forking:{
        url:`https://eth-goerli.g.alchemy.com/v2/${projectKey}`,
        // accounts:[],
      },
      // gas: 2100000, 
      // gasPrice: 8000000000
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${projectKey}`,
      accounts: [privateKey],
      gas: 2100000,
      gasPrice: 8000000000
    }
  },
};

export default config;
