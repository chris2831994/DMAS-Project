'use strict';

const _ = require('lodash');
const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');

suite('User API tests', function(){
    
    let tweets = fixtures.tweets;
    let newTweet = fixtures.newTweet;
    let users = fixtures.users;
    let newUser = fixtures.newUser;

    const tweetService = new TweetService('http://localhost:4001');
    
    beforeEach(function(){
        tweetService.deleteAllTweets();
        tweetService.deleteAllUsers();
    });

    afterEach(function(){
        tweetService.deleteAllTweets();
        tweetService.deleteAllUsers();
    });
    
    test('create a tweet', function(){
        const returnedUser = tweetService.createUser(newUser);
        const returnedTweet = tweetService.createTweet(
            {tweet: newTweet, user: returnedUser});
        assert.equal(returnedTweet.author._id, returnedUser._id);
        assert.isDefined(returnedTweet._id);     
    });

    
    test('get a tweet', function(){
        const returnedUser = tweetService.createUser(newUser);
        const returnedTweet = tweetService.createTweet(
            {tweet: newTweet, user: returnedUser});
        const fetchedTweet = tweetService.getTweet(returnedTweet._id);
        assert.equal(returnedTweet.author._id, fetchedTweet.author._id);
        assert.equal(returnedTweet._id, fetchedTweet._id);    
    });

    
    test('get invalid tweet', function(){
        const t1 = tweetService.getTweet('1234');
        assert.isNull(t1);
        const t2 = tweetService.getTweet('13413412351235612612345123512352351235123');
        assert.isNull(t2);
    });

    
    test('delete a tweet', function(){
        const returnedUser = tweetService.createUser(newUser);
        const returnedTweet = tweetService.createTweet(
            {tweet: newTweet, user: returnedUser});
        tweetService.deleteTweet(returnedTweet._id);
        assert(tweetService.getTweet(returnedTweet._id) == null);    
    });

    test('delete all tweets', function(){
        const returnedUser = tweetService.createUser(newUser);
        for(let t of tweets){
            const returnedTweet = tweetService.createTweet(
                {tweet: t, user: returnedUser});
        }
        const allTweets = tweetService.getTweets();
        assert.equal(allTweets.length, 2);      
        tweetService.deleteAllTweets();
        const allTweetsEmpty = tweetService.getTweets();
        assert.equal(allTweetsEmpty.length, 0);
    });
    
    test('get all tweets of user', function(){
        const returnedUser1 = tweetService.createUser(newUser);
        for(let t of tweets){
            const returnedTweet = tweetService.createTweet(
                {tweet: t, user: returnedUser1});
        }
        const returnedUser2 = tweetService.createUser(newUser);
        tweetService.createTweet({tweet: newTweet, user: returnedUser2});
        const allTweets = tweetService.getTweets();
        assert.equal(allTweets.length, 3);
        const user1Tweets = tweetService.getTweetsOfUser(returnedUser1._id);
        assert.equal(user1Tweets.length, 2);
    });
    
});