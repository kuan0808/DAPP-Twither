const hre = require("hardhat");
const contracts = require("../contracts.json");

async function main() {
  const Controller = await hre.ethers.getContractFactory("Controller");
  const _controller = Controller.attach(contracts.Controller.address);
  await _controller.setStorageAddrs();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
