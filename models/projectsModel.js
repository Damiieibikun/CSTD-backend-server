const mongoose = require('mongoose');
const { Schema } = mongoose;
const projectsSchema = new Schema({

     title:{
        type:String,
        required:true       
    },
     objective:{
        type:String,
        required:true       
    },
     output:{
        type:String,            
    },
     partners:{
        type:String,            
    },
     technology:{
        type:String,            
    },
     importance:{
        type:String,            
    },
     category:{
        type:String,
        required: true,
        enum: ['upcoming', 'past']            
    },
    

}, {timestamps: true})

const projectsModel = mongoose.model('project', projectsSchema)
module.exports = projectsModel