'use strict';

const _ = require('lodash');
const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');

suite('User API tests', function(){
    
    let users = fixtures.users;
    let newUser = fixtures.newUser;

    const tweetService = new TweetService('http://localhost:4001');

    beforeEach(function(){
        tweetService.deleteAllUsers();
    });

    afterEach(function(){
        tweetService.deleteAllUsers();
    });

    test('create a user', function(){
        const returnedUser = tweetService.createUser(newUser);
        assert(_.some([returnedUser], newUser), 'returned User must be a superset of newUser');
        assert.isDefined(returnedUser._id);
    });

    test('get a user', function(){
        const u1 = tweetService.createUser(newUser);
        const u2 = tweetService.getUser(u1._id);
        assert.deepEqual(u1, u2);
    });

    test('get invalid user', function(){
        const u1 = tweetService.getUser('1234');
        assert.isNull(u1);
        const u2 = tweetService.getUser('13413412351235612612345123512352351235123');
        assert.isNull(u2);
    });

    test('delete a user', function(){
        const u = tweetService.createUser(newUser);
        assert(tweetService.getTweet(u._id) != null);
        tweetService.deleteUser(u._id);
        assert(tweetService.getUser(u._id) == null);
    });

    test('get all users', function(){
        for(let u of users){
            tweetService.createUser(u);
        }

        const allUsers = tweetService.getUsers();
        assert.equal(allUsers.length, users.length);
    });

    test('get users detail', function(){
        for(let u of users){
            tweetService.createUser(u);
        }

        const allUsers = tweetService.getUsers();
        for(var i = 0; i < users.length; i++){
            assert(_.some([allUsers[i]], users[i]), 'returnedUsers must be a superset of newUser');
        }
    });

    test('get all users empty', function(){
        const allUsers = tweetService.getUsers();
        assert.equal(allUsers.length, 0);
    });


});