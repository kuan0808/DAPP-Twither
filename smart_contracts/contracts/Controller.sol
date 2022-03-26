//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./utils/BaseController.sol";
import "./ContractManager.sol";
import "./TweetStorage.sol";
import "./UserStorage.sol";
import "./CommentStorage.sol";

contract Controller is BaseController {
    TweetStorage _tweetStorage;
    UserStorage _userStorage;
    CommentStorage _commentStorage;

    function initialize(address _managerAddr) public onlyOwner {
        ContractManager _manager = ContractManager(_managerAddr);
        address _userStorageAddr = _manager.getAddress("UserStorage");
        address _tweetStorageAddr = _manager.getAddress("TweetStorage");
        address _commentStorageAddr = _manager.getAddress("CommentStorage");
        _tweetStorage = TweetStorage(_tweetStorageAddr);
        _userStorage = UserStorage(_userStorageAddr);
        _commentStorage = CommentStorage(_commentStorageAddr);
    }

    function createUser(bytes32 _username, string memory _image_uri)
        public
        returns (uint256)
    {
        return _userStorage.createUser(msg.sender, _username, _image_uri);
    }

    function deleteMyProfileAndAll() public {
        _userStorage.deleteUser(msg.sender);
        _tweetStorage.deleteAllTweetsOfUser(msg.sender);
    }

    function createTweet(string memory _text, string memory _photoUri)
        public
        returns (uint256)
    {
        require(_userStorage._exists(msg.sender), "User does not exist");
        return _tweetStorage.createTweet(msg.sender, _text, _photoUri);
    }

    function deleteTweet(uint256 _tweetId) public {
        _tweetStorage.deleteTweet(msg.sender, _tweetId);
        _commentStorage.deleteAllCommentsOfTweet(msg.sender, _tweetId);
    }

    function createComment(
        uint256 _tweetId,
        string memory _text,
        string memory _photoUri
    ) public returns (uint256) {
        require(_tweetStorage._exists(_tweetId), "Tweet does not exist");
        return
            _commentStorage.createComment(
                msg.sender,
                _tweetId,
                _text,
                _photoUri
            );
    }

    function deleteComment(uint256 _commentId) public {
        _commentStorage.deleteComment(msg.sender, _commentId);
    }
}
