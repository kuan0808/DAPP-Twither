const util = require("../utils/create_json");
const hre = require("hardhat");
const fs = require("fs");
const contracts = require("../contracts.json");

async function main() {
  const UserStorage = await hre.ethers.getContractFactory("UserStorage");
  const userStorage = await UserStorage.deploy();

  const TweetStorage = await hre.ethers.getContractFactory("TweetStorage");
  const tweetStorage = await TweetStorage.deploy();

  const CommentStorage = await hre.ethers.getContractFactory("CommentStorage");
  const commentStorage = await CommentStorage.deploy();

  await util.contractJsonMaker({
    UserStorage: { address: userStorage.address },
    TweetStorage: { address: tweetStorage.address },
    CommentStorage: { address: commentStorage.address },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
