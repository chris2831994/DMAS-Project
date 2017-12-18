'use strict';
const Joi = require('joi');

const User = require('../models/user');
const Tweet = require('../models/tweet');

exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', {
        title: 'Welcome',
      }
    );
  },
};

exports.home = {
  handler: function (request, reply) {
    User.findOne({email: request.auth.credentials.loggedInUser}).then(user => {
      Tweet.find({ author: user }).populate('author').then(tweets => {
        reply.view('home', {
          title: "Home",
          user: user,
          tweets: tweets,
          delete: true,
          auth: true,
        });
      }).catch(err => {
        reply.redirect('/');
      });
    });
  },
};

exports.showTimeline = {
  handler: function (request, reply){
    let userId = request.params.userId;
    User.findOne({ _id: userId }).then(user => {
      Tweet.find({author: user}).populate('author').then(tweets => {
        reply.view('timeline', {
          title: "Timeline of " + user.firstName + " " + user.lastName,
          user: user,
          tweets: tweets,
          delete: false,
          auth: true,
        });
      }).catch(err => {
        reply.redirect('/');
      });
    });
  },
};

exports.create = {
  handler: function (request, reply){
    let tweet = null;
    User.findOne({email: request.auth.credentials.loggedInUser}).then(user => {
      let data = request.payload;
      tweet = new Tweet(data);
      let date = new Date();
      tweet.date = date;
      tweet.formattedDate = date.toDateString(); 
      tweet.author = user._id;
      return tweet.save();
    }).then(newTweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  }
};

exports.delete = {
  handler: function(request, reply) {
    let tweetId = request.payload.id;
    Tweet.findOneAndRemove({_id: tweetId}).then(removedTweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  }
};

exports.bulkDelete = {
  handler: function(request, reply) {
    var tweetIds = request.payload.ids;
    console.log(request.payload);
    if(tweetIds != null && Array.isArray(tweetIds)){
      tweetIds.forEach(id => {
        Tweet.findOneAndRemove({_id: id}).then(removedTweet => {
          return;
        }).catch(err => {
          reply.redirect('/home');
        });
      });   
    } else {
      Tweet.findOneAndRemove({_id: tweetIds}).then(removedTweet => {
        return;
      }).catch(err => {
        reply.redirect('/home');
      });
    }
    reply.redirect('/home');
  }
};
