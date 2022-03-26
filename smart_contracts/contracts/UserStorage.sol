//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./utils/BaseStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserStorage is BaseStorage {
    event UserCreated(
        address indexed _userAddr,
        uint256 _userId,
        uint256 _timestamp
    );
    event UserDeleted(
        address indexed _userAddr,
        uint256 _userId,
        uint256 _timestamp
    );

    // Use for assigning unique ids to users
    using Counters for Counters.Counter;
    Counters.Counter private _userCount;

    // Map of user address to user profile
    mapping(address => Profile) public profiles;

    // Map of user's id to the the index of the user in the array of users
    mapping(uint256 => uint256) private _userIndex;

    // Store all user's id for easy enumeration
    uint256[] private _allUserIds;

    struct Profile {
        uint256 userId;
        address userAddr;
        bytes32 username;
        string image_uri;
        bool exists;
    }

    function _exists(address _userAddr)
        public
        view
        onlyController
        returns (bool)
    {
        return profiles[_userAddr].exists;
    }

    function createUser(
        address _userAddr,
        bytes32 _username,
        string memory _image_uri
    ) public onlyController returns (uint256) {
        require(!_exists(_userAddr), "User already exists");
        _userCount.increment();
        uint256 newUserId = _userCount.current();
        profiles[_userAddr] = Profile(
            newUserId,
            _userAddr,
            _username,
            _image_uri,
            true
        );
        _allUserIds.push(newUserId);
        _userIndex[newUserId] = _allUserIds.length - 1;
        emit UserCreated(_userAddr, newUserId, block.timestamp);
        return newUserId;
    }

    function deleteUser(address _from) public onlyController {
        require(_exists(_from), "User does not exist");
        uint256 userId = profiles[_from].userId;
        uint256 lastIndex = _allUserIds.length - 1;
        uint256 userIndex = _userIndex[userId];
        _allUserIds[userIndex] = _allUserIds[lastIndex];
        _userIndex[_allUserIds[lastIndex]] = userIndex;
        _allUserIds.pop();
        profiles[_from].exists = false;

        emit UserDeleted(_from, userId, block.timestamp);
    }
}
