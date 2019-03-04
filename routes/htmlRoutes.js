var db = require("../models");
var express = require("express");
var request = require("request");
var router = express.Router();

//getting the API from google civic
// GOOGLE CIVIC API
var civicAPI = process.env.civicAPI;
var civicQuery = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicAPI}&address=`
var address = "1263%20Pacific%20Ave.%20Kansas%20City%20KS";
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
router.get("/api/civic", function (req, res) {
  console.log("civic reached");
  request(civicQueryURL, function (err, result, body) {
    if (!err && result.statusCode === 200) {
      return JSON.parse(body);
    }
  });
}); // doesn't work yet

// ====================================================================
// PRO PUBLICA 
// Upcoming Bills
var publicaAPI = process.env.publicaAPI
var publicaQuery = `https://api.propublica.org/congress/v1/bills/upcoming/` //+ {chamber}.json
var houseOptions = {
  url: `https://api.propublica.org/congress/v1/bills/upcoming/house.json`,
  method: "GET",
  headers: {
    "X-API-Key": publicaAPI,
    "Content-type": "application/json",
    json: true
  }
}
var senateOptions = {
  url: publicaQuery + "senate.json",
  method: "GET",
  headers: {
    'X-API-Key': publicaAPI
  }
}
console.log(houseOptions);
console.log(senateOptions);
// House Bills
router.get("/api/house", function (req, res) {
  request(houseOptions, function (err, result, body) {
    if (!err && result.statusCode == 200) {
      // console.log(keys);
      // console.log(JSON.stringify(body));
      var parseBody = JSON.parse(body);
      var bills = parseBody.results[0].bills;
      for (var i =0; i<bills.length; i++) {
        console.log(`Chamber of Bill #${i+1} ${bills[i].description}`);
      }
      return res.json(parseBody.results[0].bills);
    }
  })
})
// Senate Bills
router.get("/api/senate", function (req, res) {
  request(senateOptions, function (err, result, body) {
    if (!err && result.statusCode == 200) {
      var parseBody = JSON.parse(body);
      var bills = parseBody.results[0].bills;
      for (var i =0; i<bills.length; i++) {
        console.log(`Chamber of Bill #${i+1} ${bills[i].description}`);
      }
      return res.json(parseBody.results[0].bills);
    }
  })
})

// =====================================================================
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

module.exports = router;
