const hre = require("hardhat");
const contracts = require("../contracts.json");
const util = require("../utils/create_json");

async function main() {
  const ContractManager = await hre.ethers.getContractFactory(
    "ContractManager"
  );

  const contractManager = await ContractManager.deploy();

  await Promise.all([
    contractManager.setAddress("UserStorage", contracts.UserStorage.address),
    contractManager.setAddress("TweetStorage", contracts.TweetStorage.address),
    contractManager.setAddress(
      "CommentStorage",
      contracts.CommentStorage.address
    ),
  ]);

  await util.contractJsonMaker({
    ContractManager: { address: contractManager.address },
  });

  console.log("ContractManager deployed to:", contractManager.address);
  console.log(
    "UserStorageAddress set to:",
    await contractManager.getAddress("UserStorage")
  );
  console.log(
    "TweetStorageAddress set to:",
    await contractManager.getAddress("TweetStorage")
  );
  console.log(
    "CommentStorageAddress set to:",
    await contractManager.getAddress("CommentStorage")
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
