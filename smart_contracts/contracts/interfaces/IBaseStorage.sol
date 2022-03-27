//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IBaseStorage {
    function controllerAddr() external view returns (address);

    function setControllerAddr(address _controllerAddr) external;
}
