const hre = require("hardhat");
const contracts = require("../contracts.json");

async function main() {
  const Controller = await hre.ethers.getContractFactory("Controller");
  const _controller = Controller.attach(contracts.Controller.address);

  await _controller.setManagerAddr(contracts.ContractManager.address);

  const _managerAddr = await _controller.managerAddr();
  console.log("ManagerAddress set to:", _managerAddr);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
