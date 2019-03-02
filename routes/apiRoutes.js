var db = require("../models");
var express = require("express");
var router = express.Router();
var request = require("request");

var civicAPI = process.env.civicAPI;
var civicQuery = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicAPI}`
var address = `&address=1263%20Pacific%20Ave.%20Kansas%20City%20KS`
var civicQueryURL = civicQuery + address;
var user = require("../models/user.model.js");
router.get("/api/users", function(req, res) {
  user.findOne({ where: })
  .then(function(result){
    console.log(result)
  })
  .catch(function(err) {
    if (err) throw err;
  })
})
router.get("/civic", function (req, res) {
  request(civicQueryURL, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      return JSON.parse(body);
    }
  });
});

router.get("/protect", function (req, res) {
  console.log("HELLO");
  res.json({
    message: "PROTECTED"
  });
});

router.get("/profile", function (req, res) {
  res.render("profile");
});

module.exports = router;
