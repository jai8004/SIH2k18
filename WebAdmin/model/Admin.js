// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var adminSchema = new Schema({
    adhaarNo: {
        type: String,
        required: true,
        unique: true
    },
    dept_id: {
        type: String,
        required: true
    },
    dept_loc: {
        type: String,
        required: true
    },
    dept_name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true,
        enum: ['head', 'clerk'],
        default: 'clerk'
    },
    token:{
        type: String,
     required: false
    },
    updateCode:{
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    is_status: {
        type: Boolean,
        required: true,
        default: true
    },
    is_delete: {
        type: Boolean,
        default: false,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false,
        required: true
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
var Admin = mongoose.model('Admin', adminSchema);

// make this available to our users in our Node applications
module.exports = Admin;
