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
        external
        returns (uint256)
    {
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        require(
            !_userStorage._exists(msg.sender),
            "Controller: User already exists"
        );
        return _userStorage.createUser(msg.sender, _username, _image_uri);
    }

    function updateUserProfile(bytes32 _username, string memory _image_uri)
        external
        returns (uint256)
    {
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        require(
            _userStorage._exists(msg.sender),
            "Controller: User does not exist"
        );
        return
            _userStorage.updateUserProfile(msg.sender, _username, _image_uri);
    }

    function deleteUser() external {
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        require(
            _userStorage._exists(msg.sender),
            "Controller: User does not exist"
        );
        _userStorage.deleteUser(msg.sender);
    }

    function deleteAllTweetsOfUser(address _userAddr) external {
        require(
            _userAddr != address(0),
            "Controller: User address cannot be zero"
        );
        ITweetStorage _tweetStorage = ITweetStorage(tweetStorageAddr);
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        require(
            _userStorage._exists(msg.sender),
            "Controller: User does not exist"
        );
        _tweetStorage.deleteAllTweetsOfUser(_userAddr);
    }

    function deleteAllCommentsOfUser(address _userAddr) external {
        require(
            _userAddr != address(0),
            "Controller: User address cannot be zero"
        );
        ICommentStorage _commentStorage = ICommentStorage(commentStorageAddr);
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        require(
            _userStorage._exists(msg.sender),
            "Controller: User does not exist"
        );
        _commentStorage.deleteAllCommentsOfUser(_userAddr);
    }

    function createTweet(string memory _text, string memory _photoUri)
        external
        returns (uint256)
    {
        ITweetStorage _tweetStorage = ITweetStorage(tweetStorageAddr);
        IUserStorage _userStorage = IUserStorage(userStorageAddr);
        require(
            _userStorage._exists(msg.sender),
            "Controller: User does not exist"
        );
        return _tweetStorage.createTweet(msg.sender, _text, _photoUri);
    }

    function deleteTweet(uint256 _tweetId) external {
        ITweetStorage _tweetStorage = ITweetStorage(tweetStorageAddr);
        require(
            _tweetStorage._exists(_tweetId),
            "Controller: Tweet does not exist"
        );
        require(
            _tweetStorage.authorOf(_tweetId) == msg.sender,
            "Controller: Tweet does not belong to user"
        );
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
        require(
            _commentStorage._exists(_commentId),
            "Controller: Comment does not exist"
        );
        require(
            _commentStorage.authorOf(_commentId) == msg.sender,
            "Controller: Comment does not belong to user"
        );

        _commentStorage.deleteComment(msg.sender, _commentId);
    }
}
