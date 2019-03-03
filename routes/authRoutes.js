require("dotenv").config();
var models = require("../models");
var express = require("express");
var jwt = require('jsonwebtoken');
var router = express.Router();
var helpers = require("./helpers/auth.helpers");
var routeHelpers = require("./helpers/route.helper");
var request = require("request");


router.post("/login", function (req, res) {
    var user = {
        email: req.body.email,
        password: req.body.password
    }
    console.log(user);
    models.User.findOne({
        where: {
            email: user.email
        }
    })
        .then(function (resp) {
            var currentUser = resp.dataValues.id;
            console.log(resp.dataValues);
            console.log(user.password);
            if (helpers.checkIfValidPass(resp.dataValues, user.password)) {
                var expiry = new Date();
                expiry.setDate(expiry.getDate() + 7);
                var token = jwt.sign({
                    exp: parseInt(expiry.getTime() / 1000),
                    userID: resp.dataValues.id,
                    fisrtName: resp.dataValues.firstName,
                    lastName: resp.dataValues.lastName,
                    email: resp.dataValues.email,
                    scaryStuff: "OOGA BOOOGA"
                }, process.env.JWT_SECRET);

                console.log(token);
                // res.json({
                //     token: jwt.sign({
                //         exp: parseInt(expiry.getTime() / 1000),
                //         userID: resp.id,
                //         name: resp.name,
                //         email: resp.email,
                //         scaryStuff: "OOGA BOOOGA"
                //     }, process.env.JWT_SECRET)
                // });
                
                res.cookie('token', token).cookie('user', currentUser).status(200).send('cookie set');
                
            }
            else {
                routeHelpers.sendJsonError(res, new Error("WRONG PASSWORD"), 401);
            }
        })
        .catch(function (err) {
            routeHelpers.sendJsonError(res, err);
        })
});

// Create a new example
router.post("/register", function (req, res) {
    console.log(req.body);
    var user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        email: req.body.email,
        password: req.body.password1,
        
    }
    
    var salt = helpers.getSalt();

    var userInstance = {
        salt: salt,
        email: user.email,
        hash: helpers.getHash(salt, user.password),
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        address1: user.address1,
        address2: user.address2,
        city: user.city,
        state: user.state,
        zip: user.zip,

    }
    function getpoliticians(userInstance, next) {
        var baseURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${process.env.civicInfoAPIKey}`;
        var formattedAddress = `&address=${userInstance.address1} ${userInstance.address2} ${userInstance.city} ${userInstance.state} ${userInstance.zip}`;
        var roles = `&roles=legislatorUpperBody&roles=legislatorLowerBody`
        var url = baseURL + formattedAddress + roles;
        console.log(url);
        console.log(formattedAddress);
        request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            // userInstance.senator1 = body.officials[0].name;
            // userInstance.senator2 = body.officials[1].name;
            // userInstance.ushouseRep = body.officials[2].name;
            
            var data = Object.keys(body);
            console.log(body);

            next(userInstance);
        });
    }
    function createUser(userInstance){
        console.log(userInstance.salt, userInstance.hash);

        models.User.create(userInstance)
            .then(function (resp) {
                res.json({ message: "Creation Sucess!", id: resp.id })
            })
            .catch(function (err) {
                routeHelpers.sendJsonError(res, err);
            })
    }
createUser(userInstance);
    //getpoliticians(userInstance, createUser);
    
});

module.exports = router;
