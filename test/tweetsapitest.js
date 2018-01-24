'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

suite('User API tests', function(){
    test('get tweets', function(){
        
        const url = "http://localhost:4001/api/tweets";
        var res = request('GET', url);
        console.log(JSON.parse(res.getBody('utf8')));

    });
    /*
    test('get tweet', function(){
        
        const url = "http://localhost:4001/api/tweets";
        var res = request('GET', url);
        console.log(JSON.parse(res.getBody('utf8')));

    });
    */
});