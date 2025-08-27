const express = require('express');
const {createPageLinks, getPageLinks, updatePageLinks, deletePage, getPages, updatePage} = require('../controllers/pagesController');
const router = express.Router();
const upload = require('../middlewares/multer');

// links
router.post('/create', createPageLinks)
router.get('/links', getPageLinks)
router.put('/update/:id', updatePageLinks)
router.delete('/delete/:id', deletePage)
// created pages
router.get('/:pageId', getPages)
router.put('/updatepage/:pageId', upload.any(), updatePage)



module.exports = router;