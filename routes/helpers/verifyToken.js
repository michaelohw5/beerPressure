//require dependencies
require("dotenv").config();
var jwt = require("jsonwebtoken");
var models = require("../../models");
//
function verifyToken(req, res, next) {
  //get cookie with useerId
  var user = req.cookies.user;
  //get cookie with user token
  var token = req.cookies.token;
  //check if token exists
  if (!token) {
    //send message stating no toke received
    return res.status(403).send({ auth: false, message: "No token provided." });
  }
  //find user from id stored in the cookie
  models.User.findOne({
    where: {
      id: user
    }
  })
    .then(function(resp) {
      var user = resp.dataValues;
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
          return res.status(500).send({
            auth: false,
            message: "Failed to authenticate token."
          });
        }
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
      });
    })
    .catch(function(err) {
      // log any errors to the console
      console.log(err);
    });
}

module.exports = verifyToken;
