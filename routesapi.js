const TweetsApi = require('./app/api/tweetsapi');
const UserApi = require('./app/api/userapi');

module.exports = [
    {method: 'GET', path: '/api/users', config: UserApi.find },
    {method: 'GET', path: '/api/users/{id}', config: UserApi.findOne },
    {method: 'POST', path: '/api/users', config: UserApi.create },
    {method: 'DELETE', path: '/api/users', config: UserApi.deleteAll},
    {method: 'DELETE', path: '/api/users/{id}', config: UserApi.deleteOne},
    {method: 'GET', path: '/api/tweets', config: TweetsApi.find },
    {method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne},
    {method: 'GET', path: '/api/tweetsUser/{userId}', config: TweetsApi.findTweetsOfUser},
    {method: 'POST', path: '/api/tweets', config: TweetsApi.create},
    {method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
    {method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll }
];