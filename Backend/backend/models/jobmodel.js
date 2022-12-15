const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    title: {
        type:String,
        required: [true, 'Please add a title value'] 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    username:{
        type:String,
    },
    acceptedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:[]
    },
    text: {
        type:String,
        required: [true, 'Please add a text value'] 
    },
    price: {
        type:Number,
        required: [true, 'Please add a price value'] 
    },
    tags: {
        type: [String]
    },
    status:{
        type:String,
        required:true,
    },

    location:{
        type: [Number],
    },
    address:{
        type: String,
    },
    completed_user:{
        type:Boolean
    },
    completed_contractor:{
        type:Boolean
    },
    images:{
        type:[String]
    }
    


},
{
    timestamps: true
})

module.exports = mongoose.model('Job',jobSchema)