const hre = require("hardhat");
const contracts = require("../contracts.json");
const util = require("../utils/create_json");

async function main() {
  const Controller = await hre.ethers.getContractFactory("Controller");
  const _controller = await Controller.deploy();
  await _controller.deployed();

  await util.contractJsonMaker({
    Controller: { address: _controller.address },
  });

  console.log("Controller deployed to:", _controller.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
