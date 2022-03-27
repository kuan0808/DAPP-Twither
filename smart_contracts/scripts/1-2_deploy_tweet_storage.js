const util = require("../utils/create_json");
const hre = require("hardhat");

async function main() {
  const TweetStorage = await hre.ethers.getContractFactory("TweetStorage");
  const tweetStorage = await TweetStorage.deploy();
  await tweetStorage.deployed();

  await util.contractJsonMaker({
    TweetStorage: { address: tweetStorage.address },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
