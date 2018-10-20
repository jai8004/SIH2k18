//db_name = 'filetracker';
////provide a sensible default for local development
//mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
////take advantage of openshift env vars when available:
//if(process.env.OPENSHIFT_MONGODB_DB_URL){
//  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
//}
module.exports ={
    "url": 'mongodb://localhost/filetracker'
    //"url": mongodb_connection_string
}