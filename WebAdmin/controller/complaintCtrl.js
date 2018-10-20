var Complaint = require('./../model/Complaint.js');

// File list -- get
var complaintList = function(req, res) {
     var query = {

    };
    Complaint.find(query).exec(function (err, complains) {
        if (err) throw err;
        return res.send(complains);
    });

};

// File Detail -- get
var complaintDetail = function(req, res) {
    if (req.body.fileId && req.body.fileId != '') {
        var fileId = req.body.fileId
    } else {
        return res.send('please input complainId');
    }

    Complaint.find({
        fielId: fileId,
    
        is_delete: false
    }).exec(function (err, complain) {
        if (err) throw err;
        return res.send(complain);
    });
};

// Add File -- Post
var addComplaint = function(req,res) {
    console.log('work')
    if(req.body.fileId && req.body.fileId != ''){
        var fileId = req.body.fileId
    }else{
        return res.send('please input fileId')
    }
    
    if(req.body.email && req.body.email != ''){
        var email = req.body.email
    }else{
        return res.send('please input userId')
    }
    
    if(req.body.description && req.body.description != ''){
        var description = req.body.description
    }else{
        return res.send('please input description')
    }
    
    var newComplain = new Complaint({
       "fileId" : fileId,
        "userEmail": email,
        "description": description
    });
    
    newComplain.save(function(err,data){
       if(err) throw err;
        
        res.send(data);
    });
    
};


// Delete File --put
var deleteComplaint = function(req,res){
    if (req.body._id && req.body._id != '') {
        var _id = req.body._id;
    } else {
        return res.send('please enter complain id')
    }

    Complaint.update({
        fileId:fileId
    }, {
        $set: {
            is_delete: true
        }
    }, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
}

// File count -- get
var complaintCount = function(req,res){
    Complaint.count({}, function (err, count) {
        if (err) throw err;
        res.send(count.toString());
    });
}


module.exports = {
    "complaintList" : complaintList,
    "complaintDetail": complaintDetail,
    "addComplaint": addComplaint,
    "deleteComplaint": deleteComplaint,
    "complaintCount": complaintCount
}