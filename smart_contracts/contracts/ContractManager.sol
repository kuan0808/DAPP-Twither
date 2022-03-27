//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IContractManager.sol";

contract ContractManager is Ownable, IContractManager {
    mapping(bytes32 => address) public storageAddrs;

    function setAddress(bytes32 _name, address _address) external onlyOwner {
        storageAddrs[_name] = _address;
    }

    function deleteAddress(bytes32 _name) external onlyOwner {
        storageAddrs[_name] = address(0);
    }
}
