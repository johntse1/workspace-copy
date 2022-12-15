const express = require('express')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const axios = require('axios').default;
const imgur = require('imgur')
const multer = require('multer');
const path = require('path')
// const fileUpload = require('express-fileupload')

const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require ('./config/db')
const port = process.env.PORT || 3000


connectDB()
const app = express()
app.use(cors())
app.use(cors({origin: '*'}))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:false,limit:'50mb'}))

app.use('/api/jobs',require('./routes/jobRoutes'),cors())
app.use('/api/users',require('./routes/userRoutes'),cors())
app.use('/api/reviews',require('./routes/reviewRoutes'),cors())
    // app.use('/api/upload',require('./routes/uploadRoutes'),cors())

app.use(errorHandler)


app.listen(port, () => console.log(`Server started on port ${port}`))

    