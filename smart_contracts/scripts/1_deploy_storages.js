const hre = require("hardhat");

async function main() {
  const UserStorage = await hre.ethers.getContractFactory("UserStorage");
  const userStorage = await UserStorage.deploy("Hello, Hardhat!");

  await userStorage.deployed();

  console.log("UserStorage deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
