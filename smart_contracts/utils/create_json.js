let fs = require("fs"),
  hre = require("hardhat"),
  path = require("path"),
  filePath = path.join(__dirname, "../contracts.json");

exports.contractJsonMaker = async function create_json(contractInfo) {
  let contracts = {};
  if (!fs.readFileSync(filePath) === "{}") {
    contracts = JSON.parse(fs.readFileSync(filePath));
  } else {
    const [
      userStorageArtifact,
      tweetStorageArtifact,
      commentStorageArtifact,
      controllerArtifact,
      contractManagerArtifact,
    ] = await Promise.all([
      hre.artifacts.readArtifact("UserStorage"),
      hre.artifacts.readArtifact("TweetStorage"),
      hre.artifacts.readArtifact("CommentStorage"),
      hre.artifacts.readArtifactSync("Controller"),
      hre.artifacts.readArtifactSync("ContractManager"),
    ]);
    contracts = {
      UserStorage: {
        address: "",
        abi: userStorageArtifact.abi,
      },
      TweetStorage: {
        address: "",
        abi: tweetStorageArtifact.abi,
      },
      CommentStorage: {
        address: "",
        abi: commentStorageArtifact.abi,
      },
      Controller: {
        address: "",
        abi: controllerArtifact.abi,
      },
      ContractManager: {
        address: "",
        abi: contractManagerArtifact.abi,
      },
    };
    fs.writeFileSync(filePath, JSON.stringify(contracts, null, 2));
  }
  Object.keys(contractInfo).forEach((key) => {
    contracts[key].address = contractInfo[key].address;
  });
  fs.writeFileSync(filePath, JSON.stringify(contracts, null, 2));
};

exports.resetJson = function () {
  fs.writeFileSync(filePath, "{}");
};
