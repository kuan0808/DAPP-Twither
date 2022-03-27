//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IBaseController {
    function managerAddr() external view returns (address);

    function setManagerAddr(address _managerAddr) external;
}
