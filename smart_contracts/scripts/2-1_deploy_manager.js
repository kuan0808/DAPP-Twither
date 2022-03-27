const hre = require("hardhat");
const ethers = require("ethers");
const contracts = require("../contracts.json");
const util = require("../utils/create_json");

async function main() {
  const ContractManager = await hre.ethers.getContractFactory(
    "ContractManager"
  );
  const contractManager = await ContractManager.deploy();
  await contractManager.deployed();

  await util.contractJsonMaker({
    ContractManager: { address: contractManager.address },
  });
  console.log("ContractManager deployed to:", contractManager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
