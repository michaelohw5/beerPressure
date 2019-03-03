var db = require("../models");
var express = require("express");
var router = express.Router();
var verifyToken = require("./helpers/verifyToken");

router.get("/protect", verifyToken, function (req, res, next) {
  console.log("HELLO");
  console.log(req.body);
  res.json({
    message: "PROTECTED"
  });
});

router.get("/users/:id", verifyToken, function (req, res, next) {
  console.log("HELLO");
  console.log(req.params.id);

  db.User.findOne(
    {
      where: {
        id: req.params.id
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'address1', 'address2', 'city', 'state', 'zip'],
    }
  ).then(function (resp) {
    console.log(resp.dataValues);
    res.json(resp.dataValues);
  }).catch(function (err) {
    console.log(err);
  })

});

router.post("/users/:id", verifyToken, function (req, res, next) {
  console.log(req.body);

});




module.exports = router;
