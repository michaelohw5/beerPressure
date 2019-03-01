var db = require("../models");
var express = require("express");
var router = express.Router();

router.get("/protect", function (req, res) {
    console.log("HELLO")
    res.json({
      message: "PROTECTED"
    });
});

module.exports = router;
