import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import '@typechain/hardhat';
import { config } from 'dotenv'; config();

const accounts = process.env.SK! ? [process.env.SK!] : [];

export default {
  solidity: "0.8.11",
  networks: {
    bsc: {
      url: "https://data-seed-prebsc-1-s2.binance.org:8545",
      accounts,
    },
    vechain: {
        url: "https://testing-bridge.xp.network/vechain/",
        accounts
    },
  },
  etherscan: {
    apiKey: "VNMTR116VFPFEGHXK9BWR8NIMSM61J65CK"
  }
};
