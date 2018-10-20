var User = require('./../model/User.js');
var Admin = require('./../model/Admin.js');
var randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
var Passwords = require('machinepack-passwords');
var jwtoken = require('./../plugins/jwToken.js');
var transporter = require('./../plugins/email.js');
var jsend = require('./../plugins/jsend.js');

// Display list of all users -- get
var user_list = function (req, res) {
    var query = {
        is_delete: false,
        is_status: true
    };
    User.find(query).exec(function (err, users) {
        if (err) throw err;
        return res.send(users);
    });

};

// Display detail page for a specific User -- get
var user_detail = function (req, res) {
    if (req.body.userId && req.body.userId != '') {
        var userId = req.body.userId
    } else {
        return res.send('please input userID');
    }

    User.find({
        _id: userId,
        is_status: true,
        is_delete: false
    }).exec(function (err, user) {
        if (err) throw err;
        return res.send(user);
    });

};

// register User in Database -- Post
var register_user = function (req, res) {
    if (req.body.email && req.body.email != '') {
        var email = req.body.email
    } else {
        return res.send('please input email');
    }

    if (req.body.adhaar && req.body.adhaar != '') {
        var adhaar = req.body.adhaar
    } else {
        return res.send('please input adhaar no');
    }

    if (req.body.password && req.body.password != '') {
        // have to update here i.e encrypt password before saving
        var password = req.body.password
    } else {
        return res.send('please input password');
    }

    var name = '';

    if (req.body.name && req.body.name != '') {
        var name = req.body.name
    }

    var updateCode = randomToken(6);
    console.log('djasbjdbsajbdjsbajdbasjbdjbasjbd')

    User.find({
        'email': email,
        'adhaar_no': adhaar
    }).exec(function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
            res.send(jsend.failure("user already exists with email " + email))
        } else {
            Passwords.encryptPassword({
                password: password,
            }).exec({
                // An unexpected error occurred.
                error: function (err) {
                    // send appropiate response
                    // add it also into logger
                },
                // OK.
                success: function (encryptedPassword) {
                    var newUser = new User({
                        "name": name,
                        "email": email,
                        "adhaar_no": adhaar,
                        "password": encryptedPassword,
                        "updateCode": updateCode,
                        "is_status": false
                    });

                    newUser.save(function (err, data) {
                        if (err) throw err;
                        console.log(data)

                        const mailOptions = {
                            from: 'filestatus@gmail.com', // sender address
                            to: data.email, // list of receivers
                            subject: 'Confirmation Code', // Subject line
                            html: '<p>Your Confirmation Code is ' + data.updateCode + '</p>' // plain text body
                        };

                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.log(err)
                            } else {
                                res.send(data);
                            }
                        });
                    });
                }
            });
        }

    });




};

// login user --put
var login_user = function (req, res) {
    if (req.body.email && req.body.email != '') {
        var email = req.body.email
        console.log(email)
    } else {
        return res.send('please input email');
    }
    if (req.body.password && req.body.password != '') {
        var password = req.body.password
        console.log(password)
    } else {
        return res.send('please input password');
    }

    User.find({
        'email': email,
        'is_status': true,
        'is_delete': false
    }).exec(function (err, data) {
        if (err) {
            return res.send('No user found with ' + email);
        }
        console.log(data)

        if (data.length > 0) {
            Passwords.checkPassword({
                passwordAttempt: password,
                encryptedPassword: data[0].password,
            }).exec({
                // An unexpected error occurred.
                error: function (err) {
                    console.log(err)
                    // set appropiate response 
                    // add into log
                },
                // Password attempt does not match already-encrypted version
                incorrect: function () {
                    return res.send('Incorrect password');
                },
                // OK.
                success: function () {
                    var token = jwtoken.generateToken(req);

                    User.update({
                        '_id': data[0]._id
                    }, {
                        $set: {
                            'token': token

                        }
                    }, function (err) {
                        if (err) {
                            // send a response
                        }

                        return res.send(data[0]);
                        console.log(data)
                    });
                }
            });
        } else {
            return res.send('No user found with ' + email);
        }


    });
}

var forget_password = function (req, res) {
    if (req.body.email && req.body.email != '') {
        var email = req.body.email
    } else {
        return res.send('please input email');
    }

    User.find({
        'email': email
    }).exec(function (err, data) {

        if (err) {
            logger.error(err);
            res.send(jsend.failure("System Internal Error"));
        }

        var updateCode = randomToken(8);
        console.log(data)
        
        Passwords.encryptPassword({
                password: updateCode,
            }).exec({
                // An unexpected error occurred.
                error: function (err) {
                    // send appropiate response
                    // add it also into logger
                },
                // OK.
                success: function (encryptedPassword) {
                    password = encryptedPassword;
                }
        });
        
        
        User.update({
            'email':email
        },{
            $set : {
                'password':password
            }
        },function(err){
            if(err){
                console.log(err);
            }
            
            const mailOptions = {
                from: 'filestatus@gmail.com', // sender address
                to: data[0].email, // list of receivers
                subject: 'Confirmation Code', // Subject line
                html: '<p>Your New password is <b>' + updateCode + ' </b> </p>' // plain text body
            };

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    res.send(data);
                }
            });
            
        })
    });
}

///////////////////////////////////////////////////////////////code not working ///////////////////////////////////////////////////////////////////////////

// update user in database -- put
var update_user = function (req, res) {

    if (req.body._id && req.body._id != '') {
        var userId = req.body._id;
    } else {
        return res.send('please enter user id')
    }

    var query = {};
    if (req.body.name && req.body.name != '') {
        query["name"] = req.body.name
    }

    if (req.body.phone && req.body.phone != '') {
        query["phone"] = req.body.phone
    }

    if (req.body.password && req.body.password != '') {
        
        
        Passwords.encryptPassword({
                password: req.body.password,
            }).exec({
                // An unexpected error occurred.
                error: function (err) {
                    // send appropiate response
                    // add it also into logger
                },
                // OK.
                success: function (encryptedPassword) {
                    query["password"] = encryptedPassword;
                }
        });
                    
    }

    User.update({
        _id: userId
    }, {
        $set: query
    }, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
}

// delete user in database --put
var delete_user = function (req, res) {
    if (req.body._id && req.body._id != '') {
        var userId = req.body._id;
    } else {
        return res.send('please enter user id')
    }

    User.update({
        _id: userId
    }, {
        $set: {
            is_delete: true
        }
    }, function (err, data) {
        if (err) throw err;
        res.send(data);

    });
}

// user count in database -- get
var user_count = function (req, res) {
    User.count({}, function (err, count) {
        if (err) throw err;
        res.send(count.toString());
    });
}

// status user in database --put
var statusUser = function (req, res) {
    if (req.body.code && req.body.code != '') {
        var code = req.body.code;
        console.log(code)
    } else {

        return res.send('please enter user code')
    }

    User.find({
        "updateCode": code
    }).exec(function (err, data) {
        if (err) {
            throw err;
            console.log(err);
            console.log(data + "data");

        }


        if (data.length > 0) {
            User.update({
                "_id": data[0]._id
            }, {
                $set: {
                    is_status: true
                }
            }, function (err) {
                if (err) throw err;
                console.log(err)

                const mailOptions = {
                    from: 'filestatus@gmail.com', // sender address
                    to: data[0].email, // list of receivers
                    subject: 'Welcome', // Subject line
                    html: '<p>Welcome To File Status <br> Email: ' + data[0].email + ' <br> Name: ' + data[0].name + ' <br><br> Regards <br> Admin</p>' // plain text body
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.send(jsend.success("user status confirm successfully"));
                    }
                });
            });
        }
    });


}

module.exports = {
    "userList": user_list,
    "userDetail": user_detail,
    "register": register_user,
    "login": login_user,
    "forgetPassword": forget_password,
    "updateUser": update_user,
    "deleteUser": delete_user,
    "userCount": user_count,
    "statusUser": statusUser
}
