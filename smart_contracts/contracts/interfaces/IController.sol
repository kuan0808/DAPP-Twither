//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IController {
    function userStorageAddr() external returns (address);

    function tweetStorageAddr() external returns (address);

    function commentStorageAddr() external returns (address);

    function setStorageAddrs() external;

    function createUser(bytes32 _username, string memory _image_uri)
        external
        returns (uint256);

    function deleteMyProfileAndAll() external;

    function createTweet(string memory _text, string memory _photoUri)
        external
        returns (uint256);

    function deleteTweet(uint256 _tweetId) external;

    function createComment(
        uint256 _tweetId,
        string memory _text,
        string memory _photoUri
    ) external returns (uint256);

    function deleteComment(uint256 _commentId) external;
}
