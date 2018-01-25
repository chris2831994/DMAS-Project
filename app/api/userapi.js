'use strict';

const User = require('../models/user');
const Boom = require('boom');

exports.find = {
    auth: false,
    handler: function(request, reply){
        User.find({}).exec().then(users => {
            reply(users);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}

exports.findOne = {
    auth: false,
    handler: function(request, reply){
        User.findOne({ _id: request.params.id }).then(user => {
            if(user != null){
                reply(user);
            } else {
                reply(Boom.badImplementation('id not found'));
            }
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}

exports.create = {
    auth:false,
    handler: function(request, reply){
        const user = new User(request.payload);
        user.save().then(newUser => {
            reply(newUser);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}

exports.deleteOne = {
    auth: false,
    handler: function(request, reply){
        User.findOneAndRemove({_id: request.params.id}).then(deleted => {
            reply(deleted);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}

exports.deleteAll = {
    auth: false,
    handler: function(request, reply){
        User.remove({}).then(deleted => {
            reply(deleted);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}