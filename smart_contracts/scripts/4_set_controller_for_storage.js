const hre = require("hardhat");
const contracts = require("../contracts.json");

async function main() {
  const UserStorage = await hre.ethers.getContractFactory("UserStorage");
  const TweetStorage = await hre.ethers.getContractFactory("TweetStorage");
  const CommentStorage = await hre.ethers.getContractFactory("CommentStorage");

  const userStorageAddr = contracts.UserStorage.address;
  const tweetStorageAddr = contracts.TweetStorage.address;
  const commentStorageAddr = contracts.CommentStorage.address;
  const controllerAddr = contracts.Controller.address;

  const userStorage = UserStorage.attach(userStorageAddr);
  const tweetStorage = TweetStorage.attach(tweetStorageAddr);
  const commentStorage = CommentStorage.attach(commentStorageAddr);

  await userStorage.setControllerAddr(controllerAddr);
  await tweetStorage.setControllerAddr(controllerAddr);
  await commentStorage.setControllerAddr(controllerAddr);
  Promise.all([
    userStorage.controllerAddr(),
    tweetStorage.controllerAddr(),
    commentStorage.controllerAddr(),
  ]).then((addrs) => {
    console.log("Controller of UserStorage:", addrs[0]);
    console.log("Controller of TweetStorage:", addrs[1]);
    console.log("Controller of CommentStorage:", addrs[2]);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
