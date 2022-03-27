//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ICommentStorage {
    function comments(uint256 _commentId)
        external
        view
        returns (
            address authorAddr,
            uint256 tweetId,
            uint256 commentId,
            string memory text,
            uint256 timestamp,
            string memory photoUri
        );

    function _exists(uint256 _commentId) external view returns (bool);

    function authorOf(uint256 _commentId) external view returns (address);

    function commentsOfTweet(uint256 _tweetId)
        external
        view
        returns (uint256[] memory);

    function commentsOfAuthor(address _authorAddr)
        external
        view
        returns (uint256[] memory);

    function commentCountOfAuthor(address _authorAddr)
        external
        view
        returns (uint256);

    function createComment(
        address _authorAddr,
        uint256 _tweetId,
        string memory _text,
        string memory _photoUri
    ) external returns (uint256);

    function deleteComment(address _from, uint256 _commentId)
        external
        returns (bool);

    function deleteAllCommentsOfTweet(address _from, uint256 _tweetId)
        external
        returns (bool);
}
