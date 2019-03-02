var db = require("../models");
var express = require("express");
var router = express.Router();

router.get("/protect", function(req, res) {
  console.log("HELLO");
  res.json({
    message: "PROTECTED"
  });
});

router.get("/profile", function(req, res) {
  res.render("profile");
});

module.exports = router;
