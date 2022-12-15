const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usermodel')
const Job = require('../models/jobmodel')
const Review = require('../models/reviewmodel')

// @route POST /api/jobs/:id
const createReview = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400)
        throw new Error('Please enter id for job')
    }

    if (!req.body.text) {
        res.status(400)
        throw new Error('Please enter some text for the review')
    }

    if (!req.body.rating) {
        res.status(400)
        throw new Error('Please enter a rating for the job')
    }

    if (!req.body.title) {
        res.status(400)
        throw new Error('Please enter a title for the job')
    }

    const user = await User.findById(req.user.id)
    const job = await Job.findById(req.params.id)

    if (!job) {
        res.status(400)
        throw new Error('Job not found')
    }

    if (job.status != "Complete")
    {
        res.status(400)
        throw new Error('Job is not complete yet')
    }

    reviewExists = await Review.find({job:req.params.id, reviewer:user.id})
    // console.log(reviewExists)
    if (reviewExists.length >= 1){
        {
            res.status(400)
            throw new Error('you have already made an review')
        }
    }
     

    if (user.contractor == false)
    {
        const review = await Review.create({
            job: job.id,
            reviewer: req.user.id,
            reviewee: job.acceptedby,
            text: req.body.text,
            rating: req.body.rating,
            title: req.body.title,
            username:req.user.first_name + " " + req.user.last_name
        })
        res.status(200).json(review)
    }

    if (user.contractor == true)
    {
        const review = await Review.create({
            job: job.id,
            reviewer: req.user.id,
            reviewee: job.user,
            text: req.body.text,
            rating: req.body.rating,
            title: req.body.title,
            username:req.user.first_name + " " + req.user.last_name

        })
        res.status(200).json(review)
    }
})

const getReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({reviewee: req.user.id}).sort({ createdAt: 'desc' }).exec()
    res.status(200).json(reviews)
})

const updateReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)
    const user = await User.findById(req.user.id)

    

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Check if logged in user matches the job user
    if (review.reviewer.toString() !== user.id) {
        res.status(401)
        throw new Error('You are not the creator of the review')
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedReview)
})

const deleteReview =  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)
    if (!review) {
        res.status(400)
        throw new Error('Job not found')
    }
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Check if logged in user matches the job user
    if (review.reviewer.toString() !== user.id) {
        res.status(401)
        throw new Error('User does not match review maker')
    }

    await review.remove()
    res.status(200).json({ id: req.params.id })
})

const getReviewsOther = asyncHandler(async (req, res) => {
    const reviews = await Review.find({reviewee: req.params.id}).sort({ createdAt: 'desc' }).exec()
    res.status(200).json({reviews})

})

const updatetemp = asyncHandler(async (req, res) => {
    Review.find({},(err,reviews) => {
        if(err){
            console.log("error")
        }
        reviews.map( async review =>{ 
            const user = await User.findById(review.reviewer).exec()
            if(user)
            {
                let updatedReview= await review.updateOne({$set: {username:(user.first_name + " " + user.last_name)}})
                if(updatedReview)
                console.log(updatedReview)
            }
        })
    })
})

module.exports = {
    createReview,
    getReviews,
    updateReview,
    deleteReview,
    getReviewsOther,
    updatetemp
}