const TweetsApi = require('./app/api/tweetsapi');
const UserApi = require('./app/api/userapi');

module.exports = [
    {method: 'GET', path: '/api/users', config: UserApi.find },
    {method: 'GET', path: '/api/users/{id}', config: UserApi.findOne},
    {method: 'GET', path: '/api/tweets', config: TweetsApi.find },
    {method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne},
    {method: 'GET', path: '/api/tweetsUser/{userId}', config: TweetsApi.findTweetsOfUser}
];