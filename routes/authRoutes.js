var models = require("../models");
var express = require("express");
var jwt = require('jsonwebtoken');
var router = express.Router();
var helpers = require("./helpers/auth.helpers");
var routeHelpers = require("./helpers/route.helper");

router.post("/login", function (req, res) {
    var user = {
        email: req.body.email,
        password: req.body.password
    }
    models.User.findOne({
        where: {
            email: user.email
        }
    })
        .then(function (resp) {
            if (helpers.checkIfValidPass(resp, user.password)) {
                var expiry = new Date();
                expiry.setDate(expiry.getDate() + 7);

                res.json({
                    token: jwt.sign({
                        exp: parseInt(expiry.getTime() / 1000),
                        userID: resp.id,
                        name: resp.name,
                        email: resp.email,
                        scaryStuff: "OOGA BOOOGA"
                    }, process.env.JWT_SECRET)
                });
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
    var user = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    }
    var salt = helpers.getSalt();

    var userInstance = {
        salt: salt,
        email: user.email,
        hash: helpers.getHash(salt, user.password),
        name: user.name
    }
    console.log(userInstance.salt, userInstance.hash);

    models.User.create(userInstance)
        .then(function (resp) {
            res.json({ message: "Creation Sucess!", id: resp.id })
        })
        .catch(function (err) {
            routeHelpers.sendJsonError(res, err);
        })
});

module.exports = router;
