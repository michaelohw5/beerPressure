//import dependecies
require("dotenv").config();
var db = require("../models");
var express = require("express");
var router = express.Router();
var verifyToken = require("./helpers/verifyToken");
//profile route
router.get("/profile", verifyToken, function(req, res) {
  //get use
  db.User.findOne({
    where: {
      id: req.cookies.user
    }, //limit returned fields to omit salt and hash
    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "address1",
      "address2",
      "city",
      "state",
      "zip"
    ]
  })
    .then(function(resp) {
      //parse response
      var data = resp.dataValues;
      //render profile template
      res.render("profile", data);
    })
    .catch(function(err) {
      //log error to console
      console.log(err);
    });
});
//export protected routes
module.exports = router;
