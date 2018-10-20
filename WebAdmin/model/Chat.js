// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var officerSchema = new Schema({
    officerId:{
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    reply:{
        type: String,
        required: false
    }
});

// create a schema
var chatSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        required: true
    },
    fileId : {
        type: Schema.Types.ObjectId,
        required: true
    },
    officers: {
        type: [officerSchema],
        required: false
    },
    is_status:{
        type: Boolean,
        required: true,
        default: false
    },
    is_delete:{
        type: Boolean,
        required: true,
        default: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// the schema is useless so far
// we need to create a model using it
var Chat = mongoose.model('Chat', chatSchema);

// make this available to our users in our Node applications
module.exports = Chat;