const express = require('express');
const { postNews, getNews, deleteNews, editNews } = require('../controllers/newsController');
const upload = require('../middlewares/multer');
const router = express.Router();

router.post('/createnews', upload.fields([
    { name: 'media', maxCount: 10 }  
]), postNews)
router.get('/fetchnews', getNews)
router.delete('/delete/:id', deleteNews)
router.put('/edit/:id', upload.fields([
    { name: 'media', maxCount: 10 }  
]), editNews)

module.exports = router;