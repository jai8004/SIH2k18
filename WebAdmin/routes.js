const routes = require('express').Router();

// importing of controllers to access function here

var resetpasswords = require('./controller/resetPassword.js')
var userController = require('./controller/userCtrl.js')
var adminController = require('./controller/adminCtrl.js')
var fileController = require('./controller/fileCtrl.js')
var chatController = require('./controller/chatCtrl.js')
var complaintController = require('./controller/complaintCtrl.js')
var jwtoken = require('./plugins/jwToken.js')
var jsend = require('./plugins/jsend.js')

// middleware for token check
routes.use(function(req, res, next) {
    console.log(req.path)
    
  if (req.path == '/api/user/login' || req.path == '/api/user/register' ||req.path == '/api/user/status' || req.path == '/api/admin/add' || req.path == '/api/admin/login' || req.path == '/api/user/forget-password' || req.path == '/api/admin/forget-password') {
    next();
  } else {
    if (req.body.token && req.body.token != "") {
      var token = req.body.token;
      if (jwtoken.validateToken(req, res).length > 1) {
        next();
      } else {
        return res.send(jsend.failure("Token expired"))
      }
    } else {
      return res.send(jsend.failure("No token Found"));
    }
  }
});


//routes.get('/reset/admin/:code',resetpasswords.renderAdmin);
//routes.get('/reset/user/:code',resetpasswords.renderUser);
//routes.post('/reset/admin/update',resetpasswords.changeAdmin);
//routes.post('/reset/user/update',resetpasswords.changeUser);

///////////////// user routes ///////////////////////
    routes.put('/api/user/statuschange',userController.statusUser);

/* Register User */
routes.post('/api/user/register',userController.register);

/* Login User */
routes.put('/api/user/login',userController.login);

/* Forget Password */
routes.put('/api/user/forget-password',userController.forgetPassword);

/* update user */
routes.put('/api/user/update',userController.updateUser);

/* delete User */
routes.put('/api/user/delete',userController.deleteUser);

/* Get Users list */
routes.put('/api/user/list',userController.userList);

/* Get User detail */
routes.put('/api/user/detail',userController.userDetail);

/* Get user count  */
routes.put('/api/user/count',userController.userCount);

/* Block User */
routes.put('/api/user/status',userController.statusUser);


//////////////// admin routes ////////////////////

/* Register Admin */
routes.post('/api/admin/add',adminController.addAdmin);

/* Login Admin */
routes.put('/api/admin/login',adminController.login);

/* Forget Password */
routes.put('/api/admin/forget-password',adminController.forgetPassword);

/* update admin */
routes.put('/api/admin/update',adminController.updateAdmin);

/* delete admin */
routes.put('/api/admin/delete',adminController.deleteOfficer);

/* Get admins list */
routes.put('/api/admin/list',adminController.adminList);

/* Get admin detail */
routes.put('/api/admin/detail',adminController.adminDetail);

/* upgrade officer to admin */
routes.put('/api/admin/upgrade',adminController.upgrade);

/* admin count */
routes.put('/api/admin/count',adminController.adminCount);

/* block office */
routes.put('/api/admin/block',adminController.blockOfficer);



////////////////////////// file routes ///////////////////////////

/* add file */
routes.post('/api/file/add',fileController.addFile);

/* update file */
routes.put('/api/file/update',fileController.updateFile);

/* read files with filtering options*/
routes.put('/api/file/list',fileController.fileList);

routes.put('/api/file/list/all',fileController.fileListAll)

/* read file detail user */
routes.put('/api/file/detailuser',fileController.fileDetailUser);

/* read file detail officer */
routes.put('/api/file/detailofficer',fileController.fileDetailOfficer);
/* delete file */
routes.put('/api/file/delete',fileController.deleteFile);

/* change status*/
routes.put('/api/file/status',fileController.fileStatus);

/* file count */
routes.put('/api/file/count',fileController.fileCount);

////////////////////////// chat routes ///////////////////////////

routes.put('/api/chat/list', chatController.chatList);

routes.put('/api/chat/detail', chatController.chatDetail);

routes.post('/api/chat/add', chatController.commentChat);

routes.put('/api/chat/reply', chatController.replyChat);



////////////////////////// complaint routes ///////////////////////////

routes.put('/api/complaint/list', complaintController.complaintList);

routes.put('/api/complaint/detail', complaintController.complaintDetail);

routes.post('/api/complaint/add', complaintController.addComplaint);

routes.put('/api/complaint/delete', complaintController.deleteComplaint);

routes.put('/api/complaint/count', complaintController.complaintCount);

// department routes

// location routes



module.exports = routes;
