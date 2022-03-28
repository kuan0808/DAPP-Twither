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
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    ropsten: {
      url: process.env.ALCHEMY_ROPSTEN_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    harmony: {
      url: `https://api.s0.b.hmny.io`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
