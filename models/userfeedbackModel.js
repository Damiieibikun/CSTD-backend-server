const mongoose = require('mongoose');
const { Schema } = mongoose;
const feedbackSchema = new Schema({

     name:{
        type:String,
        required:true       
    },
     email:{
        type:String,
        required:true       
    },
     phone:{
        type:String,            
    },
     message:{
        type:String,
        required:true       
    },

}, {timestamps: true})

const feedbackModel = mongoose.model('feedback', feedbackSchema)
module.exports = feedbackModel