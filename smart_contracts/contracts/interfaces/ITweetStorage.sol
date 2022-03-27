//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ITweetStorage {
    function tweets(uint256 _tweetId)
        external
        view
        returns (
            address authorAddr,
            uint256 tweetId,
            string memory text,
            uint256 timestamp,
            string memory photo_uri,
            bool deleted
        );

    function _exists(uint256 _tweetId) external view returns (bool);

    function authorOf(uint256 _tweetId) external view returns (address);

    function tweetCountOf(address _authorAddr) external view returns (uint256);

    function tweetsOf(address _author) external view returns (uint256[] memory);

    function createTweet(
        address _userAddr,
        string memory _text,
        string memory _photoUri
    ) external returns (uint256);

    function deleteTweet(address _from, uint256 _tweetId) external;

    function deleteAllTweetsOfUser(address _userAddr) external;
}
