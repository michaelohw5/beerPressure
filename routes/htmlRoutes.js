var db = require("../models");
var express = require("express");
var router = express.Router();

//getting the API from google civic
var civicAPI = process.env.civicAPI;
var civicQuery = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicAPI}`
var address;
var civicQueryURL = civicQuery + address;

router.get("/api/users", function (req, res) {
  db.User.findOne({ where: { id: 1 } })
    .then(function (result) {
      var tempAddress = result.address1 + " " + result.city + " " + result.state;
      var tempString;
      console.log("old " + tempAddress)
      tempAddress = tempAddress.replace(/\s+/g, '%20').toLowerCase();
      console.log("new " + tempAddress);
      address = `&address=1263%20Pacific%20Ave.%20Kansas%20City%20KS`
    })
    .catch(function (err) {
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

// Load index page
router.get("/", function (req, res) {
  res.render("index");
});
router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/datapage", function (req, res) {
  res.render("datapage");
});
router.get("/login", function (req, res) {
  res.render("login");
});
router.get("/profile", function (req, res) {
  res.render("profile");
})
module.exports = router;
