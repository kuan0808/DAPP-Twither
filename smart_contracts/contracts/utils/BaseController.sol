//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseController is Ownable {
    // The Contract Manager's address
    address managerAddr;

    function setManagerAddr(address _managerAddr) public onlyOwner {
        managerAddr = _managerAddr;
    }

    function getManagerAddr() public view onlyOwner returns (address) {
        return managerAddr;
    }
}
