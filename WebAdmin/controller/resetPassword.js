var adminMdl = require('./../model/Admin.js');
var userMdl = require('./../model/User.js');
var Passwords = require('machinepack-passwords');
var transporter = require('./../plugins/email.js');

var renderUser = function (req, res) {
    console.log('into reset')
    if (req.params.code && req.params.code != '') {
        var code = req.params.code;
    } else {
        res.render('message', {
            message: "please input code",
            title: "Invalid Code"
        });
    }
    console.log('code',code)

    userMdl.find({
        'updateCode': code
    }).exec(function (err, data) {
        if (err) {
            res.render('message', {
                message: "internal server error",
                title: "Server Error"
            });
        }

        if (data.length > 0) {
            res.render('change-password', {
                code: code,
                id: data[0]._id
            });
        } else {
            res.render('message', {
                message: "Invalid Token",
                title: "UnAuthorized Request"
            });
        }

    });
}

var changeUser = function (req, res) {
    if (req.body.id && req.body.id != '') {
        var id = req.body.id
    } else {
        res.render('message', {
            message: "Invalid Token",
            title: "UnAuthorized Request"
        });
    }

    if (req.body.code && req.body.code != '') {
        var code = req.body.code
    } else {
        res.render('message', {
            message: "Invalid Token",
            title: "UnAuthorized Request"
        });
    }

    if (req.body.password && req.body.password != '') {
        var password = req.body.password
    } else {
        res.render('message', {
            message: "please input password",
            title: "Password Missing"
        });
    }

    userMdl.find({
        'updateCode': code,
        '_id': id
    }).exec(function (err, data) {
        if (err) {
            res.render('message', {
                message: "internal server error",
                title: "Server Error"
            });
        }

        if (data.length > 0) {
            Passwords.encryptPassword({
                password: password,
            }).exec({
                // An unexpected error occurred.
                error: function (err) {
                    // send appropiate response
                    // add it also into logger
                    res.render('message', {
                        message: "internal server error",
                        title: "Server Error"
                    });
                },
                // OK.
                success: function (encryptedPassword) {
                    userMdl.update({
                        '_id': data[0]._id
                    }, {
                        $set: {
                            'password': encryptedPassword,
                            'updateCode': ''
                        }
                    }, function (err) {
                        if (err) {
                            res.render('message', {
                                message: "internal server error",
                                title: "Server Error"
                            });
                        }

                        // add mail code here the 
                        const mailOptions = {
                            from: 'fileStatus@gmail.com', // sender address
                            to: data[0].email, // list of receivers
                            subject: 'Password Change Confirmation', // Subject line
                            html: '<p>Your Password for ' + data[0].email + ' changed successfully.</p>' // plain text body
                        };

                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.log(err)
                            }

                            res.render('message', {
                                message: "Password updated sucessfully",
                                title: "Success"
                            });
                        });

                    });
                }
            });
        }

    });
}

var renderAdmin = function (req, res) {
    if (req.params.code && req.params.code != '') {
        var code = req.params.code;
    } else {
        res.render('message', {
            message: "please input code"
        });
    }

    adminMdl.find({
        'updateCode': code
    }).exec(function (err, data) {
        if (err) {
            res.render('message', {
                message: "internal server error"
            });
        }

        if (data.length > 0) {
            res.render('change-password', {
                code: code,
                id: data[0]._id
            });
        } else {
            res.render('message', {
                message: "Invalid Token"
            });
        }

    });
}

var changeAdmin = function (req, res) {
    if (req.body.id && req.body.id != '') {
        var id = req.body.id
    } else {
        res.render('message', {
            message: "Invalid Token",
            title: "UnAuthorized Request"
        });
    }

    if (req.body.code && req.body.code != '') {
        var code = req.body.code
    } else {
        res.render('message', {
            message: "Invalid Token",
            title: "UnAuthorized Request"
        });
    }

    if (req.body.password && req.body.password != '') {
        var password = req.body.password
    } else {
        res.render('message', {
            message: "please input password",
            title: "Password Missing"
        });
    }

    adminMdl.find({
        'updateCode': code,
        '_id': id
    }).exec(function (err, data) {
        if (err) {
            res.render('message', {
                message: "internal server error",
                title: "Server Error"
            });
        }

        if (data.length > 0) {
            Passwords.encryptPassword({
                password: password,
            }).exec({
                // An unexpected error occurred.
                error: function (err) {
                    // send appropiate response
                    // add it also into logger
                    res.render('message', {
                        message: "internal server error",
                        title: "Server Error"
                    });
                },
                // OK.
                success: function (encryptedPassword) {
                    adminMdl.update({
                        '_id': data[0]._id
                    }, {
                        $set: {
                            'password': encryptedPassword,
                            'updateCode': ''
                        }
                    }, function (err) {
                        if (err) {
                            res.render('message', {
                                message: "internal server error",
                                title: "Server Error"
                            });
                        }

                        // add mail code here the 
                        const mailOptions = {
                            from: 'fileStatus@gmail.com', // sender address
                            to: data[0].email, // list of receivers
                            subject: 'Password Change Confirmation', // Subject line
                            html: '<p>Your Password for ' + data[0].email + ' changed successfully.</p>' // plain text body
                        };

                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.log(err)
                            }

                            res.render('message', {
                                message: "Password updated sucessfully",
                                title: "Success"
                            });
                        });

                    });
                }
            });
        }

    });
}

module.exports = {
    'renderUser': renderUser,
    'changeUser': changeUser,
    'renderAdmin': renderAdmin,
    'changeAdmin': changeAdmin,
}
