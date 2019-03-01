var db = require("../models");
var express = require("express")
var router = express.Router();
// Load index page
router.get("/", function (req, res) {
    res.render("index", {
  
  });
});
router.get("/register", function(req, res) {
  res.render("register")
})
router.get("/datapage", function(req, res) {
  res.render("datapage")
})
router.get("/login", function(req, res) {
  res.render("login")
})


module.exports = router;
