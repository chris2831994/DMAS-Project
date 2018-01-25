const Tweets = require('./app/controllers/tweets');
const Accounts = require('./app/controllers/accounts');
const Assets = require('./app/controllers/assets');

module.exports = [
  
  //Accounts
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/follow/{userId}', config: Accounts.follow },
  { method: 'POST', path: '/unfollow/{userId}', config: Accounts.unfollow },
  { method: 'GET', path: '/accountSettings', config: Accounts.viewSettings },
  { method: 'POST', path: '/updateSettings', config: Accounts.updateSettings },
  { method: 'POST', path: '/updateImage', config: Accounts.updateImage },
  //Tweets
  { method: 'GET', path: '/', config: Tweets.main },
  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/timeline/{userId}', config: Tweets.showTimeline },
  { method: 'GET', path: '/timeline', config: Tweets.showGlobalTimeline },
  { method: 'GET', path: '/aggregateTimeline', config: Tweets.showAggregateTimeline },
  { method: 'POST', path: '/tweet', config: Tweets.create },
  { method: 'POST', path: '/tweetImage', config: Tweets.createImage },
  { method: 'POST', path: '/deleteTweet', config: Tweets.delete },
  { method: 'POST', path: '/bulkDelete', config: Tweets.bulkDelete },
  //Assets
  { method: 'GET', path: '/{param*}', config: { auth: false }, handler: Assets.servePublicDirectory, },
];