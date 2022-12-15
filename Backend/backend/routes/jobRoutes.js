const express = require('express')
const router = express.Router()
const {getJobs,setJobs,updateJobs,deleteJobs,getallJobs,filterJobs,acceptJob,getallJobsFiltered,getJobsWithin,getJobsWithTagDistance,completeJob,denyJob,getCurrentJobs,getPastJobs,getIncompleteJobs,updatetemp} = require('../controllers/jobController')
const {upload} = require('../middleware/multerMiddleware')
const {protect} = require ('../middleware/authMiddleware')

router.route('/get').get(protect,getJobs)
router.route('/set').post(protect,upload.array("images"),setJobs)
router.route('/update/:id').put(protect,updateJobs)
router.route('/delete/:id').delete(protect,deleteJobs)
router.route('/getall').get(getallJobs)
router.route('/tags').get(filterJobs)
router.route('/accept/:id').post(protect,acceptJob)
router.route('/mytags').get(protect,getallJobsFiltered)
router.route('/getwithin').get(getJobsWithin)
router.route('/getwithintag').post(protect,getJobsWithTagDistance)
router.route('/complete/:id').post(protect,completeJob)
router.route('/deny/:id').post(protect,denyJob)
router.route('/getcurrent').get(protect,getCurrentJobs)
router.route('/getpast').get(protect,getPastJobs)
router.route('/getincomplete').get(protect,getIncompleteJobs)

router.route('/temp').get(updatetemp)

// router.route('/setTEMP').post(upload.array("images"), setJobsTEMP)

module.exports = router 
