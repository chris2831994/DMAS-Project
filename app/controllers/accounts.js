'use strict';

const User = require('../models/user');
const BaseJoi = require('joi');
const ImageExtension = require('joi-image-extension');
const Joi = BaseJoi.extend(ImageExtension);


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
        loggedInUser.follows = loggedInUser.follows.concat([followUserId]);
        return loggedInUser.save();
      }).catch();  
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
      userName: Joi.string().required()
    },

    failAction: function (request, reply, source, error) {
      reply.view('main', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },
  handler: function (request, reply) {
    const user = new User(request.payload);
    user.description = "This is a profile description";
    user.profileImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAyCAIAAAClJN76AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QwTETULvpeljgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAANJSURBVFjD7ZffShtBFMZnZnfdmARNoDQQ+yc10VqwjVChhWqU+ARC9LYXfahCX0Bv1CuxRFFBLVWSgjUaDQ01MVHBGOIqm83OzkwvpKHGZKPJbhXac7ews7/5vjl75hz48dMpuLtA4E6Db2CNJFFCQCqt2Wzo+Ji43VwuR10PkcfDm4jPZMnhIYlE1Nwpubhg11/wPOX7+1vcbu5RB2ckPn1AYjH1+xYuFCilNV/bT2npA83hQK9eCr29LU8ec83ii0X2I6ktLyuHR4SQ+hulFOTzdGW1lExqw8MWn5dvbYUNpl6xyCJRdWpaPsjciF0OQsBBhkxNy5GoWiyyRtQXi2x1rbS0XNI01lhWyzKb+6woCht4J9byoKb69Q11cUlpmH0ZmsYWl5T1DfV25kejanheuZXhOgcRnleiUfWmeEmi4YVmdVd4EF5QJIneCD87pxQK1NjqVijQ2TmlPj6TJYkEZsxYOmAMJBI4kyV18PE4lmWj4b9/hHgc18HHto2XXjYgtq2LlySaz1NgWuTztCIBr+LPGcbMPDzGTDpneuqpieIBpUBPvSF1pm4V0sEz8/HsHjVbV/D6d7MhUYG4gnc4TDejAnHlwelAFtFEAywidOrgBQE20K3ePDweXhBqmw8h6PMLyJwTQAj0+QUIdWu+z8e7XJwZeJeL8/n4OleO3Y5GghbDDUAIjAQtdjuqg0cIdHfxXq/BGeD18t1d/HVVVWSKIhwPWQ38BSwiHA9ZxWofrIKHELS1oWDQAo3YAIQgGLS0taGqX0O11gwFRG+nAUfg7eSHAmItJUhn12Mhq83WlAM2GxwLWXVc1EtxpxMFBsVm8IFB0elEjc94qVRTLUAqRfRnvJr4dFqbmpb3ErgZ/F4CT03L6bR2ixGTEPBzX5uZkXOntMmulxCwFcNHR2R01PrMw3NcPfWEgJ04npiUT3LUkI6bMXCSoxOT8k4cX2/m+D/7wLMzurJa+rquGjjgXcb5OZ2YlN++aRkcENvbUbn88Zcb3N3Dm5s4vosVhZk0ZmgaW/tSin5TX/QIfr/Q81yAEMD3Hw4jUZzNan+hzS0Hx4GODr7/tQDbHyRN7e31r0F0V+zLbLtPjfZ//H/8P4P/BaUljmJ8GjTRAAAAAElFTkSuQmCC";
    user.follows = [];
    user.save().then(newUser => {
      reply.view('signupSuccess', {
        title: 'Sign up successful!'
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.viewSettings = {
  handler: function (request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser }).then(foundUser => {
      reply.view('accountSettings', { title: 'Edit Account Settings', user: foundUser });
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
      userName: Joi.string().required(),
      description: Joi.string().max(140).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      currentImage: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('accountSettings', {
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
      user.userName = editedUser.userName;
      user.description = editedUser.description;
      user.email = editedUser.email;
      user.password = editedUser.password;
      user.profileImage = editedUser.currentImage;        
      return user.save();
    }).then(user => {
      reply.view('accountSettings', { title: 'Edit Account Settings', user: user });
    });
  }
}

exports.updateImage = {
  validate: {   
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      userName: Joi.string().required(),
      description: Joi.string().max(140).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      profileImage: Joi.image().allowTypes('jpg'),
      currentImage: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('accountSettings', {
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
      user.userName = editedUser.userName;
      user.email = editedUser.email;
      user.description = editedUser.description;
      user.password = editedUser.password;
      if(editedUser.profileImage == null){
        user.profileImage = editedUser.currentImage;
      } else {
        user.profileImage = "data:image/jpg;base64," + editedUser.profileImage.toString('base64');
      }         
      return user.save();
    }).then(user => {
      reply.view('accountSettings', { title: 'Edit Account Settings', user: user });
    });
  }
}