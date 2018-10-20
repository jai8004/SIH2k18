var nodemailer = require('nodemailer');
var config = require('./../config/config.json')
var  transporter = nodemailer.createTransport(config.emailConfig);
module.exports = transporter
