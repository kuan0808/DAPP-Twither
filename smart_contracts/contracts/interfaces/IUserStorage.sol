//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IUserStorage {
    function profiles(address _userAddr)
        external
        view
        returns (
            uint256 userId,
            address userAddr,
            bytes32 username,
            string memory image_uri,
            bool deleted
        );

    function _exists(address) external view returns (bool);

    function createUser(
        address _userAddr,
        bytes32 _username,
        string memory _image_uri
    ) external returns (uint256);

    function updateUserProfile(
        address _userAddr,
        bytes32 _username,
        string memory _image_uri
    ) external returns (uint256);

    function deleteUser(address) external;
}
