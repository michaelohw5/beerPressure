var db = require("../models");
require("dotenv").config();
var express = require("express");
var router = express.Router();
var verifyToken = require("./helpers/verifyToken");
var request = require("request");

router.get("/profile", verifyToken, function (req, res, next) {
    console.log("HELLO");
    db.User.findOne(
        {
            where: {
                id: req.cookies.user
            },
            attributes: ['id', 'firstName', 'lastName', 'email', 'address1', 'address2', 'city', 'state', 'zip'],
        }
    ).then(function (resp) {
        var data = resp.dataValues;

        console.log(data);
        res.render("profile", data);
    }).catch(function (err) {
        console.log(err);
    })

});





module.exports = router;
