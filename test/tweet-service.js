'use strict';

const SyncHttpService = require('./sync-http-service');
const baseUrl = 'http://localhost:4001';

class TweetService {

    constructor(baseUrl){
        this.httpService = new SyncHttpService(baseUrl);
    }

    getUsers(){
        return this.httpService.get('/api/users');
    }

    getUser(id){
        return this.httpService.get('/api/users/' + id);
    }

    createUser(newUser){
        return this.httpService.post('/api/users', newUser);
    }

    deleteUser(id){
        return this.httpService.delete('/api/users/' + id);
    }

    deleteAllUsers(){
        return this.httpService.delete('/api/users');
    }

    getTweets(){
        return this.httpService.get('/api/tweets');
    }

    getTweetsOfUser(userId){
        return this.httpService.get('/api/tweetsUser/' + userId);
    }

    getTweet(id){
        return this.httpService.get('/api/tweets/' + id);
    }

    createTweet(newTweet){
        return this.httpService.post('/api/tweets', newTweet);
    }

    deleteTweet(id){
        return this.httpService.delete('/api/tweets/' + id);
    }

    deleteAllTweets(){
        return this.httpService.delete('/api/tweets');
    }

}

module.exports = TweetService;