var File = require('./../model/File.js');
var jsend = require('./../plugins/jsend.js');



// File list -- get
var fileList = function (req, res) {
    console.log('into file list')
    var query = {
        is_delete: false,
        is_status: true
    };
    File.find(query).exec(function (err, files) {
        if (err) throw err;
        if (req.body.userId && req.body.userId != '') {
            console.log(files);
            var userId = req.body.userId;
            var updFileList = [];    
            for(var i =0 ; i< files.length ; i++){
                var indexed = files[i].history.length - 1;
                console.log(userId);
                //console.log(files[i].history[indexed].assignedTo);
                //console.log(files[i].history[indexed])
                if(files[i].history[indexed].assignedTo == userId){
                    console.log('aaaaaaa');
                    updFileList.push(files[i]);
                }
            }
            console.log(updFileList);
            res.send(updFileList);
        } else {
            console.log('akskdnaskndkn')
            return res.send('error');    
        }

    });

};

var fileListAll = function(req,res){
    var query = {
        is_delete: false,
        is_status: true
    };
    File.find(query).exec(function (err, files) {
        if (err) throw err;
        
        res.send(jsend.success("success",files));

    });
}

// File Detail -- get for user side display this function i s send to pratham at user side
var fileDetailUser = function (req, res) {
    if (req.body.adhaar && req.body.adhaar != '') {
        var adhaar = req.body.adhaar
    } else {
        return res.send('please input fileId');
    }
// changed the logic enter addhar of user to get how many files are there of users
    File.find({
        adhaar: adhaar,
        is_status: true,
        is_delete: false
    }).exec(function (err, file) {
        if (err) throw err;
        return res.send(file);
    });
};
//qr scanner//detail  of one file
var fileDetailOfficer = function (req, res) {
    if (req.body.fileId && req.body.fileId!= '') {
        var fileId = req.body.fileId
        console.log(fileId)
    } else {
        return res.send('please input fileId');
    }
// changed the logic  enter file id to know its is assign to how many officers
    File.find({
         fileId: fileId,
        is_status: true,
        is_delete: false
    }).exec(function (err, file) {
        if (err) throw err;
        return res.send(file[0]);
    });
};

// Add File -- Post
var addFile = function (req, res) {
    if (req.body.creatorId && req.body.creatorId != '') {
        var creatorId = req.body.creatorId
    } else {
        return res.send('please input User Id');
    }

    if (req.body.filename && req.body.filename != '') {
        var filename = req.body.filename
    } else {
        return res.send('please input filename');
    }

    if (req.body.fileId && req.body.fileId != '') {
        var fileId = req.body.fileId
    } else {
        return res.send('please input fileId');
    }

     if (req.body.adhaar && req.body.adhaar != '') {
        var adhaar = req.body.adhaar
        console.log(adhaar);
    } else {
         return res.send('please input addhar');
    }
    
    if (req.body.description && req.body.description != '') {
        var description = req.body.description
    } else {
        var description = "";
    }

    if (req.body.history && req.body.history.length > 0) {
        var history = req.body.history;
    } else {
        var history = [];
    }

    var newFile = new File({
        "creatorId": creatorId,
        "filename": filename,
        "fileId": fileId,
        "description": description,
        "history": history,
            "adhaar":adhaar,
        "is_status": "true"
    });
    console.log(newFile)

    newFile.save(function (err, saveData) {
        if (err) throw err;

        return res.send(saveData);
        console.log(saveData)
    });

};

// Add history to file -- put
var updateFile = function (req, res) {
    console.log('jasjbdjdsabjdkbasjbfjbjdsafbjdsbjf')
    if (req.body.fileId && req.body.fileId != '') {
        var fileId = req.body.fileId
    } else {
        return res.send('please input fileId');
    }

    if (req.body.history && req.body.history) {
        var history = req.body.history;
    } else {
        return res.send('please history');
    }

    File.find({
        "fileId": fileId
    }).exec(function (err, fileData) {
        
        var updHistory = fileData[0].history    
        
        updHistory.push(history);
        File.update({
            "fileId": fileId
        }, {
            $set: {
                'history': updHistory
            }
        }, function (err, data) {
            if (err) throw err;
            
            res.send(jsend.success("success",data));
            
        });

    });



}

// Delete File --put
var deleteFile = function (req, res) {
    if (req.body._id && req.body._id != '') {
        var fileId = req.body._id;
    } else {
        return res.send('please enter File id')
    }

    
    File.update({
        _id: fileId
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
var fileCount = function (req, res) {
    File.count({}, function (err, count) {
        if (err) throw err;
        res.send(count.toString());
    });
}

// File Status -- put
var fileStatus = function (req, res) {
    if (req.body._id && req.body._id != '') {
        var fileId = req.body._id;
    } else {
        return res.send('please enter file id')
    }

    File.update({
        _id: fileId
    }, {
        $set: {
            is_status: false
        }
    }, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
}



module.exports = {
    "fileList": fileList, 
    "fileListAll":fileListAll,
    "fileDetailUser": fileDetailUser,
    "fileDetailOfficer": fileDetailOfficer,
    "addFile": addFile,
    "updateFile": updateFile,
    "deleteFile": deleteFile,
    "fileCount": fileCount,
    "fileStatus": fileStatus
}
