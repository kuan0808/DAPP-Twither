//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseStorage is Ownable {
    address public controllerAddr;

    modifier onlyController() {
        require(msg.sender == controllerAddr);
        _;
    }

    function setControllerAddr(address _controllerAddr) public onlyOwner {
        controllerAddr = _controllerAddr;
    }
}
