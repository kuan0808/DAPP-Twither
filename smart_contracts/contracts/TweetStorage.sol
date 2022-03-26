//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./utils/BaseStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TweetStorage is BaseStorage {
    event TweetCreated(
        address indexed _author,
        uint256 _tweetId,
        uint256 _timestamp
    );
    event TweetDeleted(
        address indexed _author,
        uint256 _tweetId,
        uint256 _timestamp
    );

    using Counters for Counters.Counter;
    Counters.Counter private _tweetCount;
    // Mapping from author to list of owned tweetIds
    mapping(address => uint256[]) public _ownedTweets;

    // Mapping from tweetId to index of the author's tweets list
    mapping(uint256 => uint256) private _ownedTweetsIndex;

    // Array with all tweetIds
    uint256[] private _allTweets;

    //Mapping of tweetId to position in the allTweets array
    mapping(uint256 => uint256) private _allTweetsIndex;

    // Mapping of tweetId to tweet
    mapping(uint256 => Tweet) public tweets;

    struct Tweet {
        address authorAddr;
        uint256 tweetId;
        string text;
        uint256 timestamp;
        string photoUri;
    }

    function _exists(uint256 _tweetId)
        public
        view
        onlyController
        returns (bool)
    {
        // All kwys in solidity mapping exists, so we need to check the zero index
        uint256 tweetIndex = _allTweetsIndex[_tweetId];
        return tweetIndex != 0 || _allTweets[tweetIndex] == _tweetId;
    }

    function _addTweetToAuthor(address _to, uint256 _tweetId) private {
        _ownedTweets[_to].push(_tweetId);
        _ownedTweetsIndex[_tweetId] = tweetCountOf(_to) - 1;
    }

    function _addTweetToAllTweets(uint256 _tweetId) private {
        _allTweets.push(_tweetId);
        _allTweetsIndex[_tweetId] = _allTweets.length - 1;
    }

    function _removeTweetFromAuthor(address _from, uint256 _tweetId) private {
        require(
            authorOf(_tweetId) == _from,
            "UserStorage: user does not own this tweet"
        );
        require(
            _ownedTweets[_from].length > 0,
            "UserStorage: user has no tweets"
        );
        uint256 lastIndex = _ownedTweets[_from].length - 1;
        uint256 tweetIndex = _ownedTweetsIndex[_tweetId];

        uint256 lastTweetId = _ownedTweets[_from][lastIndex];
        _ownedTweets[_from][tweetIndex] = lastTweetId;
        _ownedTweetsIndex[lastTweetId] = tweetIndex;

        delete _ownedTweetsIndex[_tweetId];
        _ownedTweets[_from].pop();
    }

    function _removeTweetFromAllTweets(uint256 _tweetId) private {
        uint256 lastIndex = _allTweets.length - 1;
        uint256 tweetIndex = _allTweetsIndex[_tweetId];

        uint256 lastTweetId = _allTweets[lastIndex];
        _allTweets[tweetIndex] = lastTweetId;
        _allTweetsIndex[lastTweetId] = tweetIndex;

        delete _allTweetsIndex[_tweetId];
        _allTweets.pop();
    }

    function authorOf(uint256 _tweetId) public view returns (address) {
        return tweets[_tweetId].authorAddr;
    }

    function tweetsOf(address _author) public view returns (uint256[] memory) {
        return _ownedTweets[_author];
    }

    function tweetCountOf(address _authorAddr) public view returns (uint256) {
        require(_authorAddr != address(0), "User address cannot be zero");
        return _ownedTweets[_authorAddr].length;
    }

    function createTweet(
        address _userAddr,
        string memory _text,
        string memory _photoUri
    ) public onlyController returns (uint256) {
        _tweetCount.increment();
        uint256 newTweetId = _tweetCount.current();
        _addTweetToAuthor(_userAddr, newTweetId);
        _addTweetToAllTweets(newTweetId);
        tweets[newTweetId] = Tweet(
            _userAddr,
            newTweetId,
            _text,
            block.timestamp,
            _photoUri
        );
        emit TweetCreated(_userAddr, newTweetId, block.timestamp);
        return newTweetId;
    }

    function deleteTweet(address _from, uint256 _tweetId)
        public
        onlyController
    {
        require(_exists(_tweetId), "Tweet does not exist");
        require(
            authorOf(_tweetId) == _from || _from == owner(),
            "TweetStorage: User does not own this tweet"
        );
        _removeTweetFromAuthor(_from, _tweetId);
        _removeTweetFromAllTweets(_tweetId);
        delete tweets[_tweetId];
        emit TweetDeleted(_from, _tweetId, block.timestamp);
    }

    function deleteAllTweetsOfUser(address _deletedUserAddr)
        public
        onlyController
    {
        uint256[] memory tweetIds = _ownedTweets[_deletedUserAddr];
        uint256 count = tweetIds.length;
        for (uint256 i = 0; i < count; i++) {
            deleteTweet(_deletedUserAddr, tweetIds[i]);
        }
    }
}
