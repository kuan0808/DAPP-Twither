//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./utils/BaseStorage.sol";
import "./interfaces/ICommentStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CommentStorage is BaseStorage, ICommentStorage {
    event CommentCreated(
        address indexed _author,
        uint256 indexed _tweetId,
        uint256 commentId,
        uint256 _timestamp
    );

    event CommentDeleted(
        address indexed _author,
        uint256 indexed _tweetId,
        uint256 commentId,
        uint256 _timestamp
    );
    using Counters for Counters.Counter;
    Counters.Counter private _commentCount;
    // Mapping from tweetId to list of owned CommentIds
    mapping(uint256 => uint256[]) private _commentsOfTweet;

    // Mapping from CommentId to index of the tweet's Comments list
    mapping(uint256 => uint256) private _commentsOfTweetIndex;

    // Mapping from address to list of owned CommentIds
    mapping(address => uint256[]) private _commentsOfAuthor;

    // Mapping from CommentId to index of the address's Comments list
    mapping(uint256 => uint256) private _commentsOfAuthorIndex;

    // Array with all Comments' ids
    uint256[] private _allComments;

    //Mapping of CommentId to position in the allComments array
    mapping(uint256 => uint256) private _allCommentsIndex;

    // Mapping of CommentId to Comment
    mapping(uint256 => Comment) public comments;

    struct Comment {
        address authorAddr;
        uint256 tweetId;
        uint256 commentId;
        string text;
        uint256 timestamp;
        string photoUri;
    }

    function _exists(uint256 _commentId)
        public
        view
        onlyController
        returns (bool)
    {
        // All kwys in solidity mapping exists, so we need to check the zero index
        uint256 commentIndex = _allCommentsIndex[_commentId];
        return commentIndex != 0 || _allComments[commentIndex] == _commentId;
    }

    function _addCommentToTweet(uint256 _tweetId, uint256 _commentId) private {
        _commentsOfTweet[_tweetId].push(_commentId);
        _commentsOfTweetIndex[_commentId] =
            _commentsOfTweet[_tweetId].length -
            1;
    }

    function _addCommentToAuthor(address _authorAddr, uint256 _commentId)
        private
    {
        _commentsOfAuthor[_authorAddr].push(_commentId);
        _commentsOfAuthorIndex[_commentId] =
            _commentsOfAuthor[_authorAddr].length -
            1;
    }

    function _addCommentToAllComments(uint256 _commentId) private {
        _allComments.push(_commentId);
        _allCommentsIndex[_commentId] = _allComments.length - 1;
    }

    function _removeCommentFromTweet(uint256 _tweetId, uint256 _commentId)
        private
    {
        require(
            commentTo(_commentId) == _tweetId,
            "CommentStorage: This Comment do not belong to this Tweet"
        );
        uint256 lastIndex = _commentsOfTweet[_tweetId].length - 1;
        uint256 commentIndex = _commentsOfTweetIndex[_commentId];

        uint256 lastCommentId = _commentsOfTweet[_tweetId][lastIndex];
        _commentsOfTweet[_tweetId][commentIndex] = lastCommentId;
        _commentsOfTweetIndex[lastCommentId] = commentIndex;

        delete _commentsOfTweetIndex[_commentId];
        _commentsOfTweet[_tweetId].pop();
    }

    function _removeCommentFromAuthor(address _authorAddr, uint256 _commentId)
        private
    {
        uint256 lastIndex = _commentsOfAuthor[_authorAddr].length - 1;
        uint256 commentIndex = _commentsOfAuthorIndex[_commentId];

        uint256 lastCommentId = _commentsOfAuthor[_authorAddr][lastIndex];
        _commentsOfAuthor[_authorAddr][commentIndex] = lastCommentId;
        _commentsOfAuthorIndex[lastCommentId] = commentIndex;

        delete _commentsOfAuthorIndex[_commentId];
        _commentsOfAuthor[_authorAddr].pop();
    }

    function _removeCommentFromAllComments(uint256 _CommentId) private {
        uint256 lastIndex = _allComments.length - 1;
        uint256 CommentIndex = _allCommentsIndex[_CommentId];

        uint256 lastCommentId = _allComments[lastIndex];
        _allComments[CommentIndex] = lastCommentId;
        _allCommentsIndex[lastCommentId] = CommentIndex;

        delete _allCommentsIndex[_CommentId];
        _allComments.pop();
    }

    function commentTo(uint256 _commentId) public view returns (uint256) {
        return comments[_commentId].tweetId;
    }

    function authorOf(uint256 _commentId) public view returns (address) {
        return comments[_commentId].authorAddr;
    }

    function commentsOfTweet(uint256 _tweetId)
        external
        view
        returns (uint256[] memory)
    {
        return _commentsOfTweet[_tweetId];
    }

    function commentsOfAuthor(address _authorAddr)
        external
        view
        returns (uint256[] memory)
    {
        require(
            _authorAddr != address(0),
            "CommentStorage: Author address cannot be the zero"
        );
        return _commentsOfAuthor[_authorAddr];
    }

    function commentCountOfAuthor(address _authorAddr)
        external
        view
        returns (uint256)
    {
        require(
            _authorAddr != address(0),
            "CommentStorage: Author address cannot be the zero"
        );
        return _commentsOfAuthor[_authorAddr].length;
    }

    function createComment(
        address _authorAddr,
        uint256 _tweetId,
        string memory _text,
        string memory _photoUri
    ) external onlyController returns (uint256) {
        _commentCount.increment();
        uint256 newCommentId = _commentCount.current();
        _addCommentToTweet(_tweetId, newCommentId);
        _addCommentToAuthor(_authorAddr, newCommentId);
        _addCommentToAllComments(newCommentId);
        comments[newCommentId] = Comment(
            _authorAddr,
            _tweetId,
            newCommentId,
            _text,
            block.timestamp,
            _photoUri
        );
        emit CommentCreated(
            _authorAddr,
            _tweetId,
            newCommentId,
            block.timestamp
        );
        return newCommentId;
    }

    function deleteComment(address _from, uint256 _commentId)
        public
        onlyController
    {
        require(_exists(_commentId), "Comment does not exist");
        require(
            authorOf(_commentId) == _from || _from == owner(),
            "CommentStorage: User does not own this comment"
        );

        _removeCommentFromAuthor(_from, _commentId);
        _removeCommentFromTweet(commentTo(_commentId), _commentId);
        _removeCommentFromAllComments(_commentId);
        delete comments[_commentId];
        emit CommentDeleted(
            _from,
            commentTo(_commentId),
            _commentId,
            block.timestamp
        );
    }

    function deleteAllCommentsOfUser(address _userAddr)
        external
        onlyController
    {
        uint256[] memory commentIds = _commentsOfAuthor[_userAddr];
        uint256 count = commentIds.length;
        for (uint256 i = 0; i < count; i++) {
            deleteComment(_userAddr, commentIds[i]);
        }
    }
}
