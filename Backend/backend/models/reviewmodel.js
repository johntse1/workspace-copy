const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Job"
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reviewee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:[],
        required: true
    },
    text: {
        type:String,
        required: [true, 'Please add a text value'] 
    },
    rating: {
        type:Number,
        required: [true, 'Please add a rating value out of 1-5'] 
    },
    title:{
        type:String,
        required:[true, 'Please add a title']
    },
    username:{
        type:String
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Review',reviewSchema)