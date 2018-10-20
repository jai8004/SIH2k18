var Chat = require('./../model/Chat.js');

// File list -- get
var chatList = function (req, res) {
    // list of files
    // fileId
    if (req.body.userId && req.body.userId != '') {
        var userId = req.body.userId;
    } else {
        res.send('please input userid');
    }

    Chat.find({
        "userId": userId
    },{
        '_id':0,
        'officers':0
    }).exec(function (err, chats) {
        if (err) throw err;
        res.send(chats);
    })

};

// File Detail -- get
var chatDetail = function (req, res) {
    // list of officer 
    // officerId 
    if (req.body.fileId && req.body.fileId != '') {
        var fileId = req.body.fileId;
    } else {
        res.send('please input fileid');
    }
    
    if (req.body.staffId && req.body.staffId != '') {
        var staffId = req.body.staffId;
    } else {
        res.send('please input staffid');
    }
    
    Chat.find({
        "fileId": fileId,
        "officers.officerId": staffId
    }).exec(function (err, chats) {
        if (err) throw err;
        res.send(chats);
    })
};

// Add File -- Post
var commentChat = function (req, res) {
    // this will be for user
    if (req.body.userId && req.body.userId != '') {
        var userId = req.body.userId;
    } else {
        res.send('please input userid');
    }

    if (req.body.fileId && req.body.fileId != '') {
        var fileId = req.body.fileId;
    } else {
        res.send('please input fileid');
    }

    if (req.body.staffId && req.body.staffId != '') {
        var staffId = req.body.staffId;
    } else {
        res.send('please input staffid');
    }

    Chat.find({
        "fileId": fileId,
        "userId": userId
    }).exec(function (err,data) {
        if (err) throw err;
        
        console.log(data);
        
        var newChat = Chat({
            
        })
        
    })

};

var replyChat = function (req, res) {
    // this will be for admin
}


module.exports = {
    "chatList": chatList,
    "chatDetail": chatDetail,
    "commentChat": commentChat,
    "replyChat": replyChat
}
