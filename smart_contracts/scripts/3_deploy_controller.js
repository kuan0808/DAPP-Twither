const hre = require("hardhat");
const contracts = require("../contracts.json");
const util = require("../utils/create_json");

async function main() {
  const Controller = await hre.ethers.getContractFactory("Controller");

  const controller = await Controller.deploy();

  console.log(await controller.owner());

  await controller.setManagerAddr(contracts.ContractManager.address);
  await controller.initialize();

  await util.contractJsonMaker({
    Controller: { address: controller.address },
  });

  console.log("Controller deployed to:", controller.address);
  console.log("ManagerAddress set to:", await controller.getManagerAddr());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
