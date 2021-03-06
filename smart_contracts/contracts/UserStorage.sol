//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./utils/BaseStorage.sol";
import "./interfaces/IUserStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserStorage is BaseStorage, IUserStorage {
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
    event UserUpdated(
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
        bool deleted;
    }

    function _exists(address _userAddr)
        public
        view
        onlyController
        returns (bool)
    {
        return profiles[_userAddr].userId > 0;
    }

    function createUser(
        address _userAddr,
        bytes32 _username,
        string memory _image_uri
    ) external onlyController returns (uint256) {
        _userCount.increment();
        uint256 newUserId = _userCount.current();
        profiles[_userAddr] = Profile(
            newUserId,
            _userAddr,
            _username,
            _image_uri,
            false
        );
        _allUserIds.push(newUserId);
        _userIndex[newUserId] = _allUserIds.length - 1;
        emit UserCreated(_userAddr, newUserId, block.timestamp);
        return newUserId;
    }

    function updateUserProfile(
        address _userAddr,
        bytes32 _username,
        string memory _image_uri
    ) external onlyController returns (uint256) {
        Profile memory profile = profiles[_userAddr];
        profile.username = _username;
        profile.image_uri = _image_uri;
        profiles[_userAddr] = profile;
        emit UserUpdated(
            _userAddr,
            profiles[_userAddr].userId,
            block.timestamp
        );
        return profiles[_userAddr].userId;
    }

    function deleteUser(address _from) external onlyController {
        uint256 userId = profiles[_from].userId;
        uint256 lastIndex = _allUserIds.length - 1;
        uint256 userIndex = _userIndex[userId];
        _allUserIds[userIndex] = _allUserIds[lastIndex];
        _userIndex[_allUserIds[lastIndex]] = userIndex;
        _allUserIds.pop();
        delete profiles[_from];
        profiles[_from].deleted = true;

        emit UserDeleted(_from, userId, block.timestamp);
    }
}
