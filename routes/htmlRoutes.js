var db = require("../models");
var express = require("express");
var request = require("request");
var router = express.Router();
var axios = require("axios");

// Load index page
// Load index page
router.get("/", function (req, res) {
  var houseurl = "https://api.propublica.org/congress/v1/bills/upcoming/house.json";
  var senateurl = "https://api.propublica.org/congress/v1/bills/upcoming/senate.json";

  var config = {
    headers: {
      "X-API-Key": process.env.publicaAPI,
    }
  };

  var bills = {
    house: [],
    senate: []
  }

  axios.get(houseurl, config)
    .then(function (resp) {

      //console.log(resp.data.results[0].bills);
      var billsArr = resp.data.results[0].bills;
      billsArr.forEach(bill => {
        var houseBills = {
          billId: bill.bill_id,
          billNum: bill.bill_number,
          description: bill.description,
          bill_url: bill.bill_url
        };
        bills.house.push(houseBills);
      });


      axios.get(senateurl, config)
        .then(function (resp) {

          //console.log(resp.data);
          var billsArr = resp.data.results[0].bills;
          if(billsArr === undefined){
            //bills.house.push({descrition: "No Bills currently up for vote"});
          
          } else {
            billsArr.forEach(bill => {
              var senateBills = {
                billId: bill.bill_id,
                billNum: bill.bill_number,
                description: bill.description,
                bill_url: bill.bill_url
              };
              bills.house.push(senateBills);
            });
          }
          
          console.log(bills);
          res.render("index", bills);
        })
        .catch(function (err) {
          if (err) throw err;
        });

    })
    .catch(function (err) {
      if (err) throw err;
    });

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
router.get("/example", function (req, res) {
  res.render("example");
});

module.exports = router;
