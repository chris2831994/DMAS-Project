'use strict';

const User = require('../models/user');
const Joi = require('joi');

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Tweets' });
  },

};

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to Tweets' });
  },

};

exports.authenticate = {
  auth: false,
  validate: {   
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Login error',
        errors: error.data.details,
      }).code(400);
    },

  },
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: user.email,
          loggedInUserId: foundUser._id,
        });
        reply.redirect('/home');
      } else {
        reply.redirect('/signup');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.follow = {
  handler: function(request, reply){
    let loggedInUserId = request.auth.credentials.loggedInUserId;
    let followUserId = request.params.userId;
    if(loggedInUserId != followUserId){
      User.findOne({_id: loggedInUserId}).populate('follows').then(loggedInUser => {
        loggedInUser.follows.push(followUserId);
        return loggedInUser.save();
      });  
    }
    reply.redirect('/home');
  }
};

exports.unfollow = {
  handler: function(request, reply){
    let loggedInUserId = request.auth.credentials.loggedInUserId;
    let followUserId = request.params.userId;
    if(loggedInUserId != followUserId){
      User.findOne({_id: loggedInUserId}).populate('follows').then(loggedInUser => {
        let index = 0;
        loggedInUser.follows.forEach(user => {
          if(user._id == followUserId){
            loggedInUser.follows.splice(index, 1);
            return loggedInUser.save();
          }
          index++;
        });
      });  
    }
    reply.redirect('/home');
  }
};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },

};

exports.register = {
  auth: false,
  validate: {   
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },
  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.viewSettings = {
  handler: function (request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser }).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  }
};

exports.updateSettings = {
  validate: {   
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('settings', {
        title: 'Error changing settings',
        errors: error.data.details,
      }).code(400);
    },

  },
  handler: function (request, reply) {
    let editedUser = request.payload;
    User.findOne({ email: request.auth.credentials.loggedInUser }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.password = editedUser.password;
      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    });
  }
}