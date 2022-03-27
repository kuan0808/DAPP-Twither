require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");

dotenv.config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      privateKey:
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    },
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_RPC_URL,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
    ropsten: {
      url: process.env.ALCHEMY_ROPSTEN_RPC_URL,
      accounts: [process.env.ROPSTEN_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
