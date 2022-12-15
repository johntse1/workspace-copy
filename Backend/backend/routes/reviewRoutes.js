const express = require('express')
const router = express.Router()
const {createReview,getReviews,updateReview,deleteReview,getReviewsOther,updatetemp} = require('../controllers/reviewController')

const {protect} = require ('../middleware/authMiddleware')

router.route('/create/:id').post(protect,createReview)
router.route('/get').get(protect,getReviews)
router.route('/update/:id').put(protect,updateReview)
router.route('/delete/:id').put(protect,deleteReview)
router.route('/get/:id').get(getReviewsOther)

router.route('/temp').get(updatetemp)


module.exports = router 
