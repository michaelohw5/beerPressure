var jwt = require("jsonwebtoken");
var models = require("../../models");
require("dotenv").config();

function verifyToken(req, res, next) {
    var user = req.cookies.user
    var token = req.cookies.token;
    console.log(token);
    console.log(user);

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    models.User.findOne(
        {
            where: {
                id: user
            }
            
        }
    ).then(function(resp){
        console.log(resp.dataValues);
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            // if everything good, save to request for use in other routes
            req.userId = decoded.id;
            next();
        });
    }).catch(function(err){
        console.log(err);
    })
    
}


module.exports = verifyToken;