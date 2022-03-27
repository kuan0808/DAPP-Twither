//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IContractManager {
    function storageAddrs(bytes32 _name) external view returns (address);

    function setAddress(bytes32 _name, address _address) external;

    function deleteAddress(bytes32 _name) external;
}
