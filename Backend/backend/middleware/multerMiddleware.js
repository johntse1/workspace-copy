const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router()
const { ImgurClient } = require('imgur');
const fs = require('fs');
const { model } = require('mongoose');
// Image Upload
const imageStorage = multer.diskStorage({
    destination: 'images', // Destination to store image 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
        // file.fieldname is name of the field (image), path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000   // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {     // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})

// For Single image upload
router.post('/uploadImage', imageUpload.single('image'), async (req, res) => {
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

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// For Multiple image uplaod
router.post('/uploadBulkImage', imageUpload.array('images', 4), (req, res) => {
    res.send(req.files)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// ---------------------------------------------------------------------------- //

const upload = multer({storage:imageStorage})
module.exports = {upload:upload}

// module.exports = router