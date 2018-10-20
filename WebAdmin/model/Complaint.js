// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var complaintSchema = new Schema({
    userEmail : {
        type: String,
        required: true
    },
    fileId : {
        type: String,
        required: true
    },
    description:{
      type: String,
        required: true
    },
    is_delete:{
        type: Boolean,
        required: true,
        default: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

// the schema is useless so far
// we need to create a model using it
var Complaint = mongoose.model('Complaint', complaintSchema);

// make this available to our users in our Node applications
module.exports = Complaint;