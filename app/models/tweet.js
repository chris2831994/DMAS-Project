'use strict';

const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: String,
    formattedDate: String,
    date: Date,
    postedImage: String
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;