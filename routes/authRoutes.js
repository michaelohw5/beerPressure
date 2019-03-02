var models = require("../models");
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var helpers = require("./helpers/auth.helpers");
var routeHelpers = require("./helpers/route.helper");


// Create a new example

router.post("/register", function(req, res) {
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
    password: req.body.password1
  };

  var salt = helpers.getSalt();
router.post("/register", function (req, res) {
    var user = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone: req.body.phone,
    }
    var salt = helpers.getSalt();

    var userInstance = {
        email: user.email,  
        firstName: user.firstName,
        lastName: user.lastName,
        salt: salt,
        hash: helpers.getHash(salt, user.password),
        street: user.street,
        city: user.city,
        state: user.state,
        zip: user.zip,
        phone: user.phone
    }
    console.log(userInstance.salt, userInstance.hash);

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

  console.log(userInstance.salt, userInstance.hash);

  models.User.create(userInstance)
    .then(function(resp) {
      res.json({ message: "Creation Sucess!", id: resp.id });
    })
    .catch(function(err) {
      routeHelpers.sendJsonError(res, err);
    });
});

module.exports = router;
