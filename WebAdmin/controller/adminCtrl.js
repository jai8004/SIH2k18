var Admin = require('./../model/Admin.js');
var randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
var Passwords = require('machinepack-passwords');
var jwtoken = require('./../plugins/jwToken.js');
var jsend = require('./../plugins/jsend.js');
var logger = require('./../plugins/logger/logger.js')

// Display list of all -- get
var list = function (req, res) {
    if (typeof (req.body.isAdmin) === Boolean) {
        var isAdmin = req.body.isAdmin
    } else {
        var isAdmin = false
    }

    var query = {
        is_delete: false,
        is_status: true,
        is_admin: isAdmin
    };
    Admin.find(query).exec(function (err, staffs) {
        if (err) {
            logger.error(err);
            return res.send(jsend.failure("Internal Server Error"));
        }

        return res.send(jsend.success("Success", staffs));
    });
};

// Display detail -- get
var detail = function (req, res) {
    if (req.body.staffId && req.body.staffId != '') {
        var staffId = req.body.staffId
    } else {
        return res.send(jsend.notFound("please input staffId"));
    }

    Admin.find({
        _id: staffId,
        is_status: true,
        is_delete: false
    }).exec(function (err, staff) {
        if (err) {
            logger.error(err);
            return res.send(jsend.failure("Internal Server Error"));
        }

        return res.send(jsend.success("Admin Detail", staff[0])); // array removal not removing
    });
};



// Add -- Post
var addAdmin = function (req, res) {

    if (req.body.email && req.body.email != '') {
        var email = req.body.email
    } else {
        return res.send(jsend.notFound("Email not found"));
    }

    if (req.body.dept_id && req.body.dept_id != '') {
        var dept_id = req.body.dept_id
    } else {
        return res.send(jsend.notFound("Department Id not found"));
    }

    if (req.body.dept_loc && req.body.dept_loc != '') {
        var dept_loc = req.body.dept_loc
    } else {
        return res.send(jsend.notFound("Department Location not found"));
    }

    if (req.body.dept_name && req.body.dept_name != '') {
        var dept_name = req.body.dept_name
    } else {
        return res.send(jsend.notFound("Department Name not found"));
    }

    if (req.body.adhaar && req.body.adhaar != '') {
        var adhaar = req.body.adhaar;
    } else {
        return res.send(jsend.notFound("Adhaar not found"));
    }

    if (req.body.password && req.body.password != '') {
        // have to update here i.e encrypt password before saving
        var password = req.body.password
    } else {
        return res.send(jsend.notFound("Password not found"));
    }

    if (req.body.is_admin && req.body.is_admin != '') {
        var is_admin = req.body.is_admin
    }

    var name = '';

    if (req.body.name && req.body.name != '') {
        var name = req.body.name
    }

    Passwords.encryptPassword({
        password: password,
    }).exec({
        // An unexpected error occurred.
        error: function (err) {
            logger.error(err);
            res.send(jsend.failure("Internal Server Error"))
            // send appropiate response
            // add it also into logger
        },
        // OK.
        success: function (encryptedPassword) {
            var newAdmin = new Admin({
                "name": name,
                "email": email,
                "adhaarNo": adhaar,
                "password": encryptedPassword,
                "dept_id": dept_id,
                "dept_loc": dept_loc,
                "dept_name": dept_name,
                "is_admin": is_admin
            });

            newAdmin.save(function (err, data) {
                if (err) {
                    logger.error(err);
                    res.send(jsend.failure("Internal Server Error"))
                }


                res.send(jsend.success("successfully added", data));
            });
        }
    });
};

// login  --put
var login = function (req, res) {
    if (req.body.email && req.body.email != '') {
        var email = req.body.email

        console.log(email);
    } else {
        return res.send('please input email');
    }
    if (req.body.password && req.body.password != '') {
        var password = req.body.password
        console.log(password)
    } else {
        return res.send('please input password');
    }

    Admin.find({
        'email': email,

        'is_status': true,
        'is_delete': false
    }).exec(function (err, data) {
        if (err) {
            return res.send('No admin found with ' + email);
        }
        console.log(data)

        Passwords.checkPassword({
            passwordAttempt: password,
            encryptedPassword: data[0].password,
        }).exec({
            // An unexpected error occurred.
            error: function (err) {
                logger.error(err);
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

                Admin.update({
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
    });
}

var forget_password = function (req, res) {
    if (req.body.email && req.body.email != '') {
        var email = req.body.email
        console.log(email);
    } else {
        return res.send('please input email');
    }

    Admin.find({
        'email': email
    }).exec(function (err, data) {

        if (err) {
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
        
        
        Admin.update({
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
        
        
        
        
        
    })
}

// update  -- put
var updateAdmin = function (req, res) {
    if (req.body._id && req.body._id != '') {
        var staffId = req.body._id;
    } else {
        return res.send('please enter staff id')
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

    Admin.update({
        _id: staffId
    }, {
        $set: query
    }, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
}

// delete  --put
var deleteOfficer = function (req, res) {
    if (req.body._id && req.body._id != '') {
        var staffId = req.body._id;
    } else {
        return res.send('please enter staff id')
    }

    Admin.update({
        _id: staffId
    }, {
        $set: {
            is_delete: true
        }
    }, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
}

// count in database -- get
var count = function (req, res) {
    Admin.count({}, function (err, count) {
        if (err) throw err;
        res.send(count.toString());
    });
}

// block  --put
var block = function (req, res) {
    if (req.body._id && req.body._id != '') {
        var staffId = req.body._id;
    } else {
        return res.send('please enter staff id')
    }

    Admin.update({
        _id: staffId
    }, {
        $set: {
            is_status: false
        }
    }, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
}

var upgradeToAdmin = function (req, res) {
    if (req.body._id && req.body._id != '') {
        var staffId = req.body._id;
    } else {
        return res.send('please enter staff id')
    }

    Admin.update({
        _id: staffId
    }, {
        $set: {
            is_admin: true
        }
    }, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
}

module.exports = {
    "adminList": list,
    "adminDetail": detail,
    "addAdmin": addAdmin,
    "login": login,
    "forgetPassword": forget_password,
    "updateAdmin": updateAdmin,
    "deleteOfficer": deleteOfficer,
    "adminCount": count,
    "blockOfficer": block,
    "upgrade": upgradeToAdmin
}
