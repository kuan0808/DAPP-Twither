const hre = require("hardhat");
const ethers = require("ethers");
const contracts = require("../contracts.json");

async function main() {
  const ContractManager = await hre.ethers.getContractFactory(
    "ContractManager"
  );
  const contractManager = ContractManager.attach(
    contracts.ContractManager.address
  );

  const keys = [
    ethers.utils.formatBytes32String("UserStorage"),
    ethers.utils.formatBytes32String("TweetStorage"),
    ethers.utils.formatBytes32String("CommentStorage"),
  ];

  await contractManager.setAddress(keys[0], contracts.UserStorage.address);
  await contractManager.setAddress(keys[1], contracts.TweetStorage.address);
  await contractManager.setAddress(keys[2], contracts.CommentStorage.address);

  Promise.all([
    contractManager.storageAddrs(keys[0]),
    contractManager.storageAddrs(keys[1]),
    contractManager.storageAddrs(keys[2]),
  ]).then((addrs) => {
    console.log("UserStorageAddress set to:", addrs[0]);
    console.log("TweetStorageAddress set to:", addrs[1]);
    console.log("CommentStorageAddress set to:", addrs[2]);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
