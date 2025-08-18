const express = require('express');
const { sendFeedBack, getFeedBack, deleteFeedBack, deleteMultipleFeedBack} = require('../controllers/userfeedbackController');
const router = express.Router();

router.post('/feedback', sendFeedBack )
router.get('/feedback', getFeedBack )
router.delete('/feedback/delete/:id', deleteFeedBack )
router.delete('/feedback/deletemany', deleteMultipleFeedBack )

module.exports = router;