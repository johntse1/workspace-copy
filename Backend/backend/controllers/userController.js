const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usermodel')
const { ImgurClient } = require('imgur');
const fs = require('fs');
const path = require('path');

// @desc register user
// @route POST /api/user/register
// @access public
const registerUser = asyncHandler(async (req,res) => {
    const {first_name,last_name, email, password,birthday,description,skills,rating,contractor,location} = req.body


    
    if(!first_name || !email || !password || !last_name){
        if(req.file)
        fs.unlinkSync(path.join(__dirname,'..','..','images',req.file.filename))
        
        res.status(401)
        throw new Error('Please enter all fields')
    }

    // check if user exists
    const userExists = await User.findOne({email})
    if (userExists) {
        if(req.file)
        fs.unlinkSync(path.join(__dirname,'..','..','images',req.file.filename))
        
        res.status(400)
        throw new Error('User already exists')
    }

    // hash password 
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    let imgurUrl = ""
    if(req.file)
    {
        const CLIENT_ID = "ec5fa7976333d6b"
        const client = new ImgurClient({ clientId: CLIENT_ID });

        const response = await client.upload({
            image: fs.createReadStream(path.join(__dirname,'..','..','images',req.file.filename)),
            type: 'stream',
        });
        console.log(response)
        if(response.success == true)
        {
            console.log("ran1")
            fs.unlinkSync(path.join(__dirname,'..','..','images',req.file.filename))
            imgurUrl = response.data.link
            console.log(imgurUrl)
        }
        else {
            console.log("ran2")
                console.log(error)
                fs.unlinkSync(path.join(__dirname,'..','..','images',req.file.filename))
                imgurUrl = ""
        }
    }
    let skills_temp = req.body.skills
    if(req.body.skills)
    {
        skills_temp = skills_temp.split(",")
    }

    console.log(skills_temp)

    //create user 
    const user = await User.create({
        first_name,
        last_name, 
        email,
        password: hashedPassword,
        birthday,
        description,
        skills:skills_temp,
        rating,
        contractor,
        image:imgurUrl
    })

    if (user){
        res.status(201).json({
            _id: user.id,
            first_name: user.first_name,
            last_name:user.last_name,
            email:user.email,
            token: generateToken(user._id),
            birthday:user.birthday,
            description:user.description,
            skills:user.skills,
            rating:user.rating,
            contractor: user.contractor,
            location: user.location,
            image : user.image
        })
    } else {
        res.status(400)
        throw new Error ('Invalid user data')
    }

})

// @desc authenticate a user
// @route POST /api/user/login
// @access public
const loginUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body

    // check if email exists in db
    const user = await User.findOne({email})

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email:user.email,
            token: generateToken(user._id),
            contractor:user.contractor,
            image:user.image,
            location:user.location,
            skills:user.skills
        })
    } else {
        res.status(400)
        throw new Error ('Invalid login')
    }
})

// @desc get user data
// @route GET /api/user/me
// @access private
const getMe = asyncHandler(async(req,res) => {
    const {_id, first_name,last_name, email,birthday,description,skills,rating,contractor,location,image,password} = await User.findById(req.user.id)
    res.status(200).json({
        id: _id,
        first_name,
        last_name, 
        email,
        birthday,
        description,
        skills,
        rating,
        contractor,
        location,
        image,
        password
    })
})

// @desc get user data from other people
// @route GET /api/user/id
// @access private
const getUser = asyncHandler(async(req,res) => {
    const {_id, first_name,last_name, email,birthday,description,skills,rating,contractor,location,image} = await User.findById(req.params.id)
    res.status(200).json({
        id: _id,
        first_name,
        last_name, 
        email,
        birthday,
        description,
        skills,
        rating,
        contractor,
        location,
        image
    })
})

const getUserTag = asyncHandler(async(req,res) => {
    const filter = { skills: { $in: req.user.skills }, contractor:true}
    const users = await User.find(filter).select('_id first_name last_name description skills contractor image')  

    res.status(200).json(users)
})

const testImage = asyncHandler(async(req,res) => {
    if(req.file)
    {
        const CLIENT_ID = "ec5fa7976333d6b"
        const file = req.file
        const client = new ImgurClient({ clientId: CLIENT_ID });
    
        // const response = await client.upload({
        //     image: fs.createReadStream(`./images/${file.filename}`),
        //     type: 'stream',
        // })
        await client.upload({
            image: fs.createReadStream(`./images/${file.filename}`),
            type: 'stream',
        }).then(function(response){
            // console.log(response)
            fs.unlinkSync(`./images/${file.filename}`)
            res.status(200).json(response.data.link)
        }).catch(function(error){
            // console.log(error)
            fs.unlinkSync(`./images/${file.filename}`)
            res.status(400)
            throw new Error ('Imgur API failed')
        })
    }

    else {
        res.status(400)
        throw new Error("shit bnroke")
    }
})

const getallUsers = asyncHandler(async(req,res) => {
    filter ={}
    const users = await User.find(filter).select('-password')  
    res.status(200).json(users)

})

const updatePass = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if(!req.body.password)
    {
        res.status(400)
        throw new Error('Please enter a password')
    }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        
        console.log(hashedPassword)
        if(hashedPassword)
        {
            await user.updateOne({password:hashedPassword})
            res.status(200).json(user)
        }


})



//generate token for jwt
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '60d',
    })
}
module.exports = {
    registerUser,
    loginUser,
    getMe,
    getUser,
    getUserTag,
    getallUsers,
    updatePass
    
}