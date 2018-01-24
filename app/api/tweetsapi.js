'use strict';

const Tweet = require('../models/tweet');
const User = require('../models/user');
const Boom = require('boom');

exports.find = {
    auth: false,
    handler: function(request, reply){
        Tweet.find({}).exec().then(tweets => {
            reply(tweets);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}

exports.findOne = {
    auth: false,
    handler: function(request, reply){
        Tweet.find({_id:request.params.id}).then(tweet => {
            reply(user);
        }).catch(err => {
            reply(Boom.notFound('id not found'));
        });
    }
}

exports.findTweetsOfUser = {
    auth: false,
    handler: function(request, reply){
        User.findOne({ _id: request.params.userId }).then(user => {
            Tweet.find({author: user}).sort({date: 'desc'}).populate('author').then(tweets => {
                reply(tweets);
            });
        }).catch(err => {
            reply(Boom.notFound('id not found'));
        });
    }
}