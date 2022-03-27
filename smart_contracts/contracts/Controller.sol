//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./utils/BaseController.sol";
import "./interfaces/IContractManager.sol";
import "./interfaces/IController.sol";
import "./interfaces/ITweetStorage.sol";
import "./interfaces/IUserStorage.sol";
import "./interfaces/ICommentStorage.sol";

contract Controller is BaseController, IController {
    address public tweetStorageAddr;
    address public userStorageAddr;
    address public commentStorageAddr;

    function setStorageAddrs() external onlyOwner {
        IContractManager _contractManager = IContractManager(managerAddr);
        userStorageAddr = _contractManager.storageAddrs(
            bytes32(bytes("UserStorage"))
        );
        tweetStorageAddr = _contractManager.storageAddrs(
            bytes32(bytes("TweetStorage"))
        );
        commentStorageAddr = _contractManager.storageAddrs(
            bytes32(bytes("CommentStorage"))
        );
    }

    function createUser(bytes32 _username, string memory _image_uri)
        public
        returns (uint256)
    {
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        return _userStorage.createUser(msg.sender, _username, _image_uri);
    }

    function deleteMyProfileAndAll() external {
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        ITweetStorage _tweetStorage = ITweetStorage(tweetStorageAddr);
        _userStorage = IUserStorage(userStorageAddr);
        _userStorage.deleteUser(msg.sender);
        _tweetStorage.deleteAllTweetsOfUser(msg.sender);
    }

    function createTweet(string memory _text, string memory _photoUri)
        external
        returns (uint256)
    {
        ITweetStorage _tweetStorage = ITweetStorage(tweetStorageAddr);
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        require(
            _userStorage._exists(msg.sender),
            "UserStorage: User does not exist"
        );
        return _tweetStorage.createTweet(msg.sender, _text, _photoUri);
    }

    function deleteTweet(uint256 _tweetId) external {
        ITweetStorage _tweetStorage = ITweetStorage(tweetStorageAddr);
        _tweetStorage.deleteTweet(msg.sender, _tweetId);
    }

    function createComment(
        uint256 _tweetId,
        string memory _text,
        string memory _photoUri
    ) external returns (uint256) {
        ICommentStorage _commentStorage = ICommentStorage(commentStorageAddr);
        ITweetStorage _tweetStorage = ITweetStorage(tweetStorageAddr);
        require(
            _tweetStorage._exists(_tweetId),
            "TweetStorage: Tweet does not exist"
        );
        return
            _commentStorage.createComment(
                msg.sender,
                _tweetId,
                _text,
                _photoUri
            );
    }

    function deleteComment(uint256 _commentId) external {
        ICommentStorage _commentStorage = ICommentStorage(commentStorageAddr);
        _commentStorage.deleteComment(msg.sender, _commentId);
    }
}
