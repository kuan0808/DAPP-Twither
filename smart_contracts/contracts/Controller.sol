//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./utils/BaseController.sol";
import "./interfaces/IContractManager.sol";
import "./interfaces/IController.sol";
import "./interfaces/ITweetStorage.sol";
import "./interfaces/IUserStorage.sol";
import "./interfaces/ICommentStorage.sol";

contract Controller is BaseController, IController {
    ITweetStorage public _tweetStorage;
    IUserStorage public _userStorage;
    ICommentStorage public _commentStorage;

    function setStorageAddrs() external onlyOwner {
        IContractManager _contractManager = IContractManager(managerAddr);
        address _userStorageAddr = _contractManager.storageAddrs(
            bytes32(bytes("UserStorage"))
        );
        address _tweetStorageAddr = _contractManager.storageAddrs(
            bytes32(bytes("TweetStorage"))
        );
        address _commentStorageAddr = _contractManager.storageAddrs(
            bytes32(bytes("CommentStorage"))
        );
        _tweetStorage = ITweetStorage(_tweetStorageAddr);
        _userStorage = IUserStorage(_userStorageAddr);
        _commentStorage = ICommentStorage(_commentStorageAddr);
    }

    function createUser(bytes32 _username, string memory _image_uri)
        public
        returns (uint256)
    {
        return _userStorage.createUser(msg.sender, _username, _image_uri);
    }

    function deleteMyProfileAndAll() external {
        _userStorage.deleteUser(msg.sender);
        _tweetStorage.deleteAllTweetsOfUser(msg.sender);
    }

    function createTweet(string memory _text, string memory _photoUri)
        external
        returns (uint256)
    {
        require(_userStorage._exists(msg.sender), "User does not exist");
        return _tweetStorage.createTweet(msg.sender, _text, _photoUri);
    }

    function deleteTweet(uint256 _tweetId) external {
        _tweetStorage.deleteTweet(msg.sender, _tweetId);
        _commentStorage.deleteAllCommentsOfTweet(msg.sender, _tweetId);
    }

    function createComment(
        uint256 _tweetId,
        string memory _text,
        string memory _photoUri
    ) external returns (uint256) {
        require(_tweetStorage._exists(_tweetId), "Tweet does not exist");
        return
            _commentStorage.createComment(
                msg.sender,
                _tweetId,
                _text,
                _photoUri
            );
    }

    function deleteComment(uint256 _commentId) external {
        _commentStorage.deleteComment(msg.sender, _commentId);
    }
}
