const express = require('express');
const { addFooter, getFooter, updateFooter } = require('../controllers/footerController');
const router = express.Router();

router.get('/getfooter', getFooter)
router.post('/addfooter', addFooter)
router.put('/updatefooter/:id', updateFooter)

module.exports = router;