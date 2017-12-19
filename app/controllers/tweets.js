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
    User.findOne({email: request.auth.credentials.loggedInUser}).populate('follows').then(user => {
      Tweet.find({ author: user }).sort({date: 'desc'}).populate('author').then(tweets => {
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

exports.showGlobalTimeline = {
  handler: function (request, reply){
    let userId = request.auth.credentials.loggedInUserId;
    User.findOne({_id: userId}).then(user => {
      Tweet.find({}).sort({date: 'desc'}).populate('author').then(tweets => {
        reply.view('globalTimeline', {
          title: "Showing all tweets",
          loggedInUser: user,
          user: user,
          tweets: tweets,
          delete: false,
          auth: true
        });
      }).catch(err => {
        redirect('/home');
      });
    });
  }
};

exports.showTimeline = {
  handler: function (request, reply){
    let userId = request.params.userId;
    let loggedInUserId = request.auth.credentials.loggedInUserId;
    User.findOne({_id: loggedInUserId}).populate('follows').then(loggedInUser => {
      User.findOne({ _id: userId }).then(user => {
        var following = loggedInUser.follows.find(function(current){
          return current._id + "" === user._id + "";
        });
        Tweet.find({author: user}).sort({date: 'desc'}).populate('author').then(tweets => {
          reply.view('timeline', {
            title: "Timeline of " + user.firstName + " " + user.lastName,
            loggedInUser: user,
            user: user,
            tweets: tweets,
            following: following,
            delete: false,
            auth: true,
          });
        }).catch(err => {
          reply.redirect('/');
        });
      });
    });
  },
};

exports.create = {
  validate:{
    payload:{
      text: Joi.string().alphanum().min(1).max(140).required(),
    },
    options:{
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      let text = request.payload.text;
      User.findOne({email: request.auth.credentials.loggedInUser}).populate('follows').then(user => {
        Tweet.find({ author: user }).sort({date: 'desc'}).populate('author').then(tweets => {
          reply.view('home', {
            title: "Home",
            user: user,
            tweets: tweets,
            delete: true,
            auth: true,
            text: text,
            errors: error.data.details,
          });
        }).catch(err => {
          reply.redirect('/');
        });
      });
    },
  },
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
