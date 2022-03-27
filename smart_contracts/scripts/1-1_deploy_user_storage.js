const util = require("../utils/create_json");
const hre = require("hardhat");

async function main() {
  const UserStorage = await hre.ethers.getContractFactory("UserStorage");
  const userStorage = await UserStorage.deploy();
  await userStorage.deployed();

  await util.contractJsonMaker({
    UserStorage: { address: userStorage.address },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
