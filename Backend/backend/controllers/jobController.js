const axios = require('axios');
const asyncHandler = require('express-async-handler')
const { globalAgent } = require('http')
const { model } = require('mongoose')
const Job = require('../models/jobmodel')
const User = require('../models/usermodel')
const fs = require('fs');
const path = require('path');
const { ImgurClient } = require('imgur');
const { ObjectId } = require('mongodb');

// @desc get jobs
// @route GET /api/jobs
// @access Private
const getJobs = asyncHandler(async (req, res) => {

    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: 'desc' }).exec()
    res.status(200).json(jobs)
})

// @desc set jobs
// @route POST /api/jobs
// @access Private
const setJobs = asyncHandler(async (req, res) => {
    console.log(req.body)
    if (!req.body.text) {
        req.files.forEach(image => {
            try{
                fs.unlinkSync(path.join(__dirname,'..','..','images',image.filename))
            } catch(err){
                console.log(err)
                res.status(401)
                throw new Error ("Failed to upload images")
            }
        })

        res.status(402)
        throw new Error('Please add a text fields')
    }

    if (!req.body.tags) {
        req.files.forEach(image => {
            try{
                fs.unlinkSync(path.join(__dirname,'..','..','images',image.filename))
            } catch(err){
                console.log(err)
                res.status(401)
                throw new Error ("Failed to upload images")
            }
        })

        res.status(403)
        throw new Error('Please enter tag(s)')
    }

    if (!req.body.title) {
        req.files.forEach(image => {
            try{
                fs.unlinkSync(path.join(__dirname,'..','..','images',image.filename))
            } catch(err){
                console.log(err)
                res.status(401)
                throw new Error ("Failed to upload images")
            }
        })
        res.status(404)
        throw new Error('Please add a title field')
    }

    if (!req.body.price) {
        req.files.forEach(image => {
            try{
                fs.unlinkSync(path.join(__dirname,'..','..','images',image.filename))
            } catch(err){
                console.log(err)
                res.status(403)
                throw new Error ("Failed to upload images")
            }
        })
        res.status(405)
        throw new Error('Please add a price field')
    }
    console.log(req.files)
    let coord = []
    if (req.body.address) {
        let base_url = "https://maps.googleapis.com/maps/api/geocode/json?"
        let params = {
            'key': process.env.GOOGLE_API_KEY,
            'address': req.body.address
        }
        var options = {
            'method': 'GET',
            'url': base_url,
            'params': params
        }
        await axios(options).then(function (response) {
            if (response.data.results[0].geometry.location.lat) {
                let lat = response.data.results[0].geometry.location.lat
                let lon = response.data.results[0].geometry.location.lng
                coord = [lat, lon]
            }
        }).catch(function (error) {
            console.log(error)
            res.status(400)
            throw new Error('Please enter another address')
        })
    }

    let urls = []
    if (req.files) {
        const CLIENT_ID = "ec5fa7976333d6b"
        const client = new ImgurClient({ clientId: CLIENT_ID });
        for (let i in req.files ) { 
            const response = await client.upload({
                image: fs.createReadStream(path.join(__dirname, '..', '..', 'images', req.files[i].filename)),
                type: 'stream',
            });
            console.log(response)
            if (response.success == true) {
                urls.push(response.data.link)
            }
            else {
                console.log(response)
                console.log("ran")
                // temp
                req.files.forEach(image => {
                    try{
                        fs.unlinkSync(path.join(__dirname,'..','..','images',image.filename))
                    } catch(err){
                        console.log(err)
                        // res.status(403)
                        // throw new Error ("Failed to upload images")
                    }
                })
                //temp
                res.status(406)
                throw new Error ("Failed to upload images to imgur")
            }
        }

        req.files.forEach(image => {
            try{
                fs.unlinkSync(path.join(__dirname,'..','..','images',image.filename))
            } catch(err){
                console.log(err)
                res.status(401)
                throw new Error ("Failed to upload images")
            }
        })
    }




    let tags = req.body.tags
    if(req.body.tags)
    {
        tags = tags.split(",")        
    }

    console.log(tags)

    const job = await Job.create({
        title: req.body.title,
        user: req.user.id,
        text: req.body.text,
        price: req.body.price,
        tags: tags,
        status: "Incomplete",
        acceptedby: null,
        location: coord,
        address: req.body.address,
        completed_user: false,
        completed_contractor: false,
        images:urls,
        username:req.user.first_name + " " + req.user.last_name
    })

    const user = await User.findById(req.user.id)
    if (user.contractor == false) {
        if (req.body.tags) {
            console.log("bruh moment")
            let temp = user.skills
            console.log(tags)
            if (tags.length === 1) {
                if (temp.includes(req.body.tags) == false) {
                    temp.push(tags[0])
                }
            }

            else if (tags.length >1 ) {
                for (const x of tags) {
                    if (temp.includes(x) == false) {
                        temp.push(x)
                    }
                }
            }
            await user.updateOne({ skills: temp })

        }
    }

    res.status(200).json(job)
})

const updatetemp = asyncHandler(async (req, res) => {
    Job.find({},(err,jobs) => {
        if(err){
            console.log("error")
        }
        jobs.map( async job =>{ 
            // let id = ObjectId(job.user)
            const user = await User.findById(job.user).exec()
            if(user)
            {
                let updatedjob= await job.updateOne({$set: {username:(user.first_name + " " + user.last_name)}})
                if(updatedjob)
                console.log(updatedjob)
            }
        })
    })
})

// @desc update jobs
// @route GET /api/jobs/:id
// @access Private
const updateJobs = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
    if (!job) {
        res.status(400)
        throw new Error('Job not found')
    }

    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Check if logged in user matches the job user
    if (job.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User does not match job user')
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedJob)
})

// @desc delete jobs
// @route GET /api/jobs/:id
// @access Private
const deleteJobs = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
    if (!job) {
        res.status(400)
        throw new Error('Job not found')
    }
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Check if logged in user matches the job user
    if (job.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User does not match job user')
    }

    await job.remove()
    res.status(200).json({ id: req.params.id })
})

const getallJobs = asyncHandler(async (req, res) => {
    const filter = {}
    const jobs = await Job.find(filter).sort({ createdAt: 'desc' }).exec();
    res.status(200).json(jobs)
})

const filterJobs = asyncHandler(async (req, res) => {
    const filter = { tags: { $in: req.body.tags } }
    const jobs = await Job.find(filter)

    res.status(200).json(jobs)
})

const getallJobsFiltered = asyncHandler(async (req, res) => {
    // const jobs = await Job.find({user: req.user.id})
    const filter = { tags: { $in: req.user.skills }, status:"Incomplete" }
    const jobs = await Job.find(filter).sort({ createdAt: 'desc' }).exec()
    res.status(200).json(jobs)
})

const acceptJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
    if (!job) {
        res.status(400)
        throw new Error('Job not found')
    }
    const user = await User.findById(req.user.id)
    //Check if logged in user does not the job user
    if (job.user.toString() == user.id) {
        res.status(401)
        throw new Error('Cannot accept your own job')
    }
    console.log(job.acceptedby)
    if (job.acceptedby !== null) {
        res.status(401)
        console.log(job.acceptedby)
        throw new Error('Job is already accepted')

    }
    await job.updateOne({ acceptedby: req.user.id, status: "in progress" })
    res.status(200).json(job)
})

const completeJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)

    if (!job) {
        res.status(400)
        throw new Error('Job not found')
    }

    if (job.acceptedby == null) {
        res.status(400)
        throw new Error('Job must be accepted before completing')
    }

    const user = await User.findById(req.user.id)
    //If you are the owner of the job
    if (job.user.toString() == user.id) {
        if (job.completed_user == true) {
            res.status(400)
            throw new Error('Owner of job has already completed it')
        }
        else {
            if (job.completed_contractor == true) {
                const updatedJob = await Job.findByIdAndUpdate(req.params.id, { completed_user: true, status: "Complete" }, { new: true })
                res.status(200).json(updatedJob)
            }
            else {
                const updatedJob = await Job.findByIdAndUpdate(req.params.id, { completed_user: true }, { new: true })
                res.status(200).json(updatedJob)
            }
        }
    }

    //if you are the contractor of the job
    if (job.acceptedby.toString() == user.id) {
        if (job.completed_contractor == true) {
            res.status(400)
            throw new Error('Contractor of job has already completed it')
        }
        else {
            if (job.completed_user == true) {
                const updatedJob = await Job.findByIdAndUpdate(req.params.id, { completed_contractor: true, status: "Complete" }, { new: true })
                res.status(200).json(updatedJob)
            }
            else {
                const updatedJob = await Job.findByIdAndUpdate(req.params.id, { completed_contractor: true }, { new: true })
                res.status(200).json(updatedJob)
            }
        }
    }


    if (job.completed_user == true && job.completed_contractor == true) {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, { status: "Complete" }, { new: true })
        res.status(200).json(updatedJob)
    }
})

const denyJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)

    if (!job) {
        res.status(400)
        throw new Error('Job not found')
    }

    if (job.acceptedby == null) {
        res.status(400)
        throw new Error('Job must be accepted before denying')
    }

    const user = await User.findById(req.user.id)
    //If you are the owner of the job or contractor
    if (job.user.toString() == user.id || job.acceptedby.toString() == user.id) {
        if (job.status !== "Complete") {
            const updatedJob = await Job.findByIdAndUpdate(req.params.id, { status: "Incomplete", completed_user: false, completed_contractor: false, acceptedby: null }, { new: true })
            res.status(200).json(updatedJob)
        }
        else {
            res.status(200)
            throw new Error("Job is already completed")
        }
    }
    else {
        res.status(200)
        throw new Error("Not Authorized")
    }
})

const getJobsWithin = asyncHandler(async (req, res) => {
    if (!req.body.coord) {
        res.status(400)
        throw new Error('Enter a coordinate.')
    }

    if (!req.body.distance) {
        res.status(400)
        throw new Error('Enter a distance from coordinate.')
    }

    const lat = req.body.coord[0]
    const lng = req.body.coord[1]
    const radius = req.body.distance / 3963.2

    const result = await Job.find({
        location: { $geoWithin: { $centerSphere: [[lat, lng], radius] } },
    })
        .sort("-score");
    res.status(200).json(result)
})

const getJobsWithTagDistance = asyncHandler(async (req, res) => {
    if (!req.body.coord) {
        res.status(400)
        throw new Error('Enter a coordinate.')
    }
    if (!req.body.distance) {
        res.status(400)
        throw new Error('Enter a distance from coordinate.')
    }

    // const user = await User.findById(req.user.id)



    const lat = req.body.coord[0]
    const lng = req.body.coord[1]
    const radius = req.body.distance / 3963.2
    console.log(req.user.skills)
    const result = await Job.find({
        location: { $geoWithin: { $centerSphere: [[lat, lng], radius] } },
        tags: { $in: req.user.skills },
        status:"Incomplete"
    })
        .sort({ createdAt: 'desc' }).exec();
    res.status(200).json(result)
})

//used by the contractor to get their current jobs
const getCurrentJobs = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)
    //If you are an user 
    if (user.contractor == false) {
        const jobs = await Job.find({ user: req.user.id, status: "in progress" }).sort({ createdAt: 'desc' }).exec()
        res.status(200).json(jobs)
    }
    //if you are the contractor
    else if (user.contractor == true) {
        const jobs = await Job.find({ acceptedby: req.user.id, status: "in progress" }).sort({ createdAt: 'desc' }).exec()
        res.status(200).json(jobs)
    }

})

const getPastJobs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    //If you are an user 
    if (user.contractor == false) {
        const jobs = await Job.find({ user: req.user.id, status: "Complete" }).sort({ createdAt: 'desc' }).exec()
        res.status(200).json(jobs)
    }
    //if you are the contractor
    else if (user.contractor == true) {
        const jobs = await Job.find({ acceptedby: req.user.id, status: "Complete" }).sort({ createdAt: 'desc' }).exec()
        res.status(200).json(jobs)
    }

})

const getIncompleteJobs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    //If you are an user 
    if (user.contractor == false) {
        const jobs = await Job.find({ user: req.user.id, status: "Incomplete" }).sort({ createdAt: 'desc' }).exec()
        res.status(200).json(jobs)
    }
    //if you are the contractor
    else if (user.contractor == true) {
        const jobs = await Job.find({ acceptedby: req.user.id, status: "Incomplete" }).sort({ createdAt: 'desc' }).exec()
        res.status(200).json(jobs)
    }
})


module.exports = {
    getJobs,
    setJobs,
    updateJobs,
    deleteJobs,
    getallJobs,
    filterJobs,
    acceptJob,
    getallJobsFiltered,
    getJobsWithin,
    getJobsWithTagDistance,
    completeJob,
    denyJob,
    getCurrentJobs,
    getPastJobs,
    getIncompleteJobs,
    updatetemp,
}