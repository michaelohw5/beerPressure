//require dependencies
require("dotenv").config();
var models = require("../models");
var express = require("express");
var jwt = require('jsonwebtoken');
var router = express.Router();
var helpers = require("./helpers/auth.helpers");
var routeHelpers = require("./helpers/route.helper");
//login auth route
router.post("/login", function(req, res) {
  //parse response into user object
  var user = {
    email: req.body.email,
    password: req.body.password
  };
  //find user info based on provided email
  models.User.findOne({
    where: {
      email: user.email
    }
  })
    .then(function(resp) {
      //parse response
      var currentUser = resp.dataValues.id;
      //check if user password is valid
      if (helpers.checkIfValidPass(resp.dataValues, user.password)) {
        //set token expiration date
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        //create token
        var token = jwt.sign(
          {
            exp: parseInt(expiry.getTime() / 1000),
            userID: resp.dataValues.id,
            fisrtName: resp.dataValues.firstName,
            lastName: resp.dataValues.lastName,
            email: resp.dataValues.email,
            scaryStuff: "OOGA BOOOGA"
          },
          process.env.JWT_SECRET
        );
        //send authorization and user info cookies
        res
          .cookie("token", token)
          .cookie("user", currentUser)
          .status(200)
          .send("cookie set");
      } else {
        //send error message of incorrect password
        routeHelpers.sendJsonError(res, new Error("WRONG PASSWORD"), 401);
      }
    })
    .catch(function(err) {
      //send any error messages to the client
      routeHelpers.sendJsonError(res, err);
    });
});

// register a new user
router.post("/register", function(req, res) {
  //parse request
  var user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    email: req.body.email,
    password: req.body.password1
  };
  //get salt
  var salt = helpers.getSalt();
  //generate user instance
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
    zip: user.zip
  };

  function createUser(userInstance){
    //create user in database
    models.User.create(userInstance)
      .then(function(resp) {
        //send success message
        res.json({ message: "Creation Sucess!", id: resp.id })
      })
      .catch(function(err) {
        //send error message
        routeHelpers.sendJsonError(res, err);
      });
  }

  createUser(userInstance);
});

module.exports = router;
