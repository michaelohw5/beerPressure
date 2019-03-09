//import dependecies
require("dotenv").config();
var db = require("../models");
var express = require("express");
var router = express.Router();
var request = require("request");
var axios = require("axios");
var verifyToken = require("./helpers/verifyToken");
//logout route
router.post("/logout", function(req, res) {
  res.clearCookie("token");
});
//profile route
router.get("/profile", verifyToken, function (req, res) {
  function party(party){
    if(party === "D"){
      return "democrat"
    } else if(party === "R"){
      return "republican"
    } else if(party === "I") {
      return "info"
    } 
  }
  //get use
  db.User.findOne({
    where: {
      id: req.userId
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
      "zip",
      "senator1",
      "senator2",
      "usRepresentative",
      "congressionalDistrict"
    ]
  })
  .then(function (resp) {
    //parse response
    var data = resp.dataValues;
    console.log(data.state);
    //get contact forms
    var houseurl = `https://api.propublica.org/congress/v1/members/house/${data.state}/${data.congressionalDistrict}/current.json`;
    var senateurl = `https://api.propublica.org/congress/v1/members/senate/${data.state}/current.json`;
    var config = {headers : {
      "X-API-Key": publicaAPI,
    }
  }
  axios.get(senateurl, config)
  .then(function(resp){
    //console.log(resp.data);
    var senators = resp.data.results;
    var senator1 = {
      id: senators[0].id,
      name: senators[0].name,
      lastName: senators[0].last_name,
      party: senators[0].party,
      api_uri: senators[0].api_uri,
      url: senators[0].url,
      contact_form: senators[0].contact_form,
      icon: party(senators[0].party)
    };
    var senator2 = {
      id: senators[1].id,
      name: senators[1].name,
      lastName: senators[1].last_name,
      party: senators[1].party,
      api_uri: senators[1].api_uri,
      url: senators[1].url,
      contact_form: senators[1].contact_form,
      icon: party(senators[1].party)
    };
    
    data.senator1 = senator1;
    data.senator2 = senator2;
    axios.get(houseurl, config)
    .then(function(resp){
      //console.log(resp.data);
      var rep = resp.data.results;
      //console.log(rep);
      var houseRep = {
        id: rep[0].id,
        name: rep[0].name,
        lastName: rep[0].last_name,
        party: rep[0].party,
        api_uri: rep[0].api_uri,
        url: rep[0].url,
        contact_form: rep[0].contact_form,
        icon: party(rep[0].party)
      }; 
    data.houseRep = houseRep;
    console.log(data);
    var senator1url= data.senator2.api_uri;
    var senator1url= data.senator2.api_uri;
    var houseRepurl= data.houseRep.api_uri;

      axios(senator1url, config)
      .then(function(resp){
        //console.log(resp.data.url);
      }).catch(function(err){
        if(err) throw err;
      });

    res.render("profile", data);
    }).catch(function(err){
      if(err) throw err;
    });
    
  }).catch(function(err){
    if(err) throw err;
  });
          
  })
  .catch(function (err) {
    //log error to console
    console.log(err);
  });
    // .then(function (resp) {
    //   //parse response
    //   var data = resp.dataValues;
    //   //render profile template
    //   //res.render("profile", data);
    // })
    // .catch(function (err) {
    //   //log error to console
    //   console.log(err);
    // });
});
//getting the API from google civic
// GOOGLE CIVIC API
var civicAPI = process.env.civicInfoAPIKey;
var civicQuery = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicAPI}&address=`
var address = "1263%20Pacific%20Ave.%20Kansas%20City%20KS";
var civicQueryURL = civicQuery + address;

router.get("/users", function (req, res) {
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
}); // works like a charm

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
      var parseBody = JSON.parse(body);
      var bills = parseBody.results[0].bills;
      if (bills === undefined) {
        console.log("house: no bills");
        return res.json({
          "bills": "No Upcoming Bills",
        })
      }
      else {
        // for (var i = 0; i < bills.length; i++) {
        //   // console.log(`Chamber of Bill #${i + 1} ${bills[i].description}`);
        // }
        return res.json(parseBody.results[0].bills);
      }
    }
  })
})
// Senate Bills
router.get("/api/senate", function (req, res) {
  request(senateOptions, function (err, result, body) {
    if (!err && result.statusCode == 200) {
      // console.log(body);
      var parsed = JSON.parse(body);
      var bills = parsed.results[0].bills;
      if (bills === undefined) {
        console.log("senate: no bills");
        return res.json({
          "bills": "No Upcoming Bills",
        })
      }
      else {
        // for (var i = 0; i < bills.length; i++) {
        //   console.log(`Chamber of Bill #${i + 1} ${bills[i].description}`);
        // }
        return res.json(parsed.results[0].bills);
      }
    }
  });
});

// =====================================================================
// GET REPRESENTATIVES
var baseURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicAPI}`;
var formattedAddress = `&address=1263%20Pacific%20Ave.%20Kansas%20City%20KS`//`&address=${userInstance.address1}%20${userInstance.city}%20${userInstance.state}%20${userInstance.zip}`;
var roles = `&roles=legislatorUpperBody&roles=legislatorLowerBody`
var repUrl = baseURL + formattedAddress + roles;
router.get("/api/reps", function (req, res) {
  request(repUrl, function (err, result, body) {
    if (!err && result.statusCode == 200) {
      var parsebody = JSON.parse(body);
      var reps = parsebody.officials
      var repsArray = [];
      for (var i = 0; i < reps.length; i++) {
        repsArray.push(reps[i]);
      }
      console.log(repsArray);
      return res.json(repsArray);
    }
  })
});
// =====================================================================
//export protected routes
module.exports = router;
