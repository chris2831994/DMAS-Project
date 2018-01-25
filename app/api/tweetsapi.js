'use strict';

const Tweet = require('../models/tweet');
const User = require('../models/user');
const Boom = require('boom');

exports.find = {
    auth: false,
    handler: function(request, reply){
        Tweet.find({}).populate('author').then(tweets => {
            if(tweets != null){
                reply(tweets);
            } else {
                reply([]);
            }          
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}

exports.findOne = {
    auth: false,
    handler: function(request, reply){
        Tweet.findOne({ _id: request.params.id }).populate('author').then(tweet => {
            if(tweet != null){
                reply(tweet);
            } else {
                reply(Boom.notFound('id not found'));
            }
        }).catch(err => {
            reply(Boom.notFound('id not found'));
        });
    }
}

exports.findTweetsOfUser = {
    auth: false,
    handler: function(request, reply){
        User.find({ _id: request.params.userId }).then(user => {
            Tweet.find({author: user}).sort({date: 'desc'}).populate('author').then(tweets => {
                reply(tweets);
            });
        }).catch(err => {
            reply(Boom.notFound('id not found'));
        });
    }
}

exports.create = {
    auth: false,
    handler: function(request, reply){
        let userData = request.payload.user;
        let tweetData = request.payload.tweet;
        User.findOne({_id: userData._id}).then(user => {
            const tweet = new Tweet(tweetData);
            tweet.author = user;
            let date = new Date();
            tweet.date = date;
            tweet.formattedDate = date.toString();
            tweet.postedImage = "";
            return tweet.save();      
        }).then(newTweet => {
            reply(newTweet);
        }).catch(err => {
            reply(Boom.badImplementation('user not found'));
        });
    }
}

exports.deleteOne = {
    auth: false,
    handler: function(request, reply){
        Tweet.remove({_id: request.params.id}).then(deleted => {
            reply(deleted);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}

exports.deleteAll = {
    auth: false,
    handler: function(request, reply){
        Tweet.remove({}).then(deleted => {
            reply(deleted);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}