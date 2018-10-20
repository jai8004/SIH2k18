var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.load();
var secret = process.env.JWT_SECRET;

var generateToken = function(req) {
  var token = jwt.sign({
    auth: 'magic',
    agent: req.headers['user-agent'],
    exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60 // Note: in seconds!
  }, secret); // secret is defined in the environment variable JWT_SECRET
  return token;
}

// validate the token supplied in request header
var validate = function(req, res) {
  var token = req.body.token;
  try {
    var decoded = jwt.verify(token, secret);
  } catch (e) {
    return [res];
  }
  if (!decoded || decoded.auth !== 'magic') {
    return [res];
  } else {
    return [res, token];
  }
}

module.exports = {
  'generateToken': generateToken,
  'validateToken': validate
}
