let  email, password;

const assert = require('chai').assert;
const signInUser = require('../app');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('Testings login features using Mocha and Chai', function(){

    var tempUser = {// created mock data to test data in the database
        "firstName": "nicky",
        "lastName":"john",
        "email": "easydrop@test.com",
        "password": "easydroppass1",
        "username": "beky16", 
        "number": "7569890",
        "address": "cunupia",
        "town" :"Cunupia",
        "latitude" :"45.5",
        "longitude":"76.9"
    };


    it('Test 1: New user should be able to register successfully', function () {
        var signed =signInUser.signupUser(tempUser.username, tempUser.firstName, tempUser.lastName, tempUser.email, tempUser.password, tempUser.number, tempUser.address, tempUser.town, tempUser.latitude, tempUser.longitude, function (){
            if (signed) {
                assert.equal(tempUser, signed);
            }
        });
      });

    it('Test 2: There should not be duplicate emails', async ()=>{
        let result = signInUser.signInUser(tempUser.email, tempUser.password);
        assert.notEqual(tempUser.email,result);
    });
    it('Test 3: Users should not be able to register twice', function () {
        var signed =signInUser.signupUser(tempUser.username, tempUser.firstName, tempUser.lastName, tempUser.email, tempUser.password, tempUser.number, tempUser.address, tempUser.town, tempUser.latitude, tempUser.longitude, function (){
            assert.equal(false, signed);
        });
    });

    it('Test 4: When a user sign in sucessfullly, they are redirected to index.html',function(){ 
        const { window } = new JSDOM( `<!DOCTYPE html>
        <input id="email" type="text" value=`+tempUser.email+`><br/><br/>
        <input id="password" type="password" value=`+tempUser.password+`><br/><br/>
        `);
        const { document } = window.window;
        signInUser.runSignIn( function (){
            var loc =  window.location.href;
            assert.equal("index.html", loc)
        });

    })
        
});