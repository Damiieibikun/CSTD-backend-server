const mongoose = require('mongoose');
const { Schema } = mongoose;
const publicationSchema = new Schema({

    title:{
        type:String,
        required:true       
    },
     summary:{
        type:String,
        required:true       
    },
     authors:{
        type:[String],
        required: true            
    },
     link:{
        type:String,
        required:true       
    },
     date:{
        type:String,
        required:true       
    },

}, {timestamps: true})

const publicationModel = mongoose.model('publication', publicationSchema)
module.exports = publicationModel