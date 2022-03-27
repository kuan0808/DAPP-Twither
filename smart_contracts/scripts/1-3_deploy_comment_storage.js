const util = require("../utils/create_json");
const hre = require("hardhat");

async function main() {
  const CommentStorage = await hre.ethers.getContractFactory("CommentStorage");
  const commentStorage = await CommentStorage.deploy();
  await commentStorage.deployed();

  await util.contractJsonMaker({
    CommentStorage: { address: commentStorage.address },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
