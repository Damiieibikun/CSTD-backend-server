const express = require('express');
const { addFooter, getFooter, updateFooter } = require('../controllers/footerController');
const router = express.Router();
const upload = require('../middlewares/multer');

router.get('/getfooter', getFooter)
router.post('/addfooter', upload.single('logo'), addFooter)
router.put('/updatefooter/:id', upload.single('logo'), updateFooter)

module.exports = router;