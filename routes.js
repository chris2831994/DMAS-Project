const Tweets = require('./app/controllers/tweets');
const Accounts = require('./app/controllers/accounts');
const Assets = require('./app/controllers/assets');

module.exports = [
  
  //Accounts
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },
  //Tweets
  { method: 'GET', path: '/', config: Tweets.main },
  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/timeline/{userId}', config: Tweets.showTimeline },
  { method: 'GET', path: '/timeline', config: Tweets.showGlobalTimeline },
  { method: 'POST', path: '/tweet', config: Tweets.create },
  { method: 'POST', path: '/deleteTweet', config: Tweets.delete },
  { method: 'POST', path: '/bulkDelete', config: Tweets.bulkDelete },
  //Assets
  { method: 'GET', path: '/{param*}', config: { auth: false }, handler: Assets.servePublicDirectory, },
  /*
  { method: 'GET', path: '/report', config: Donations.report },
  { method: 'GET', path: '/{param*}', config: { auth: false }, handler: Assets.servePublicDirectory, },
  { method: 'POST', path: '/donate', config: Donations.donate },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },
  */
];