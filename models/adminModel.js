const mongoose = require('mongoose');
const { Schema } = mongoose;
const adminSchema = new Schema({
    firstname:{
        type:String,
        required:true       
    },
    lastname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique: true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,        
        enum:['media', 'webmaster', 'admin'],
        default: 'admin'
    },
    approved:{
        type: Boolean,
        default: false
    },
    status:{
        type:String,
        enum:['approved', 'denied', 'pending'],
        default: 'pending'
    },

}, {timestamps:true})

const adminModel = mongoose.model('admin', adminSchema)
module.exports = adminModel