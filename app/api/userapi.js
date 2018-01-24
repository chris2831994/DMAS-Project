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
            reply(user);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    }
}