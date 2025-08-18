const express = require('express');
const { postNews, getNews, deleteNews, editNews } = require('../controllers/newsController');
const router = express.Router();

router.post('/createnews', postNews)
router.get('/fetchnews', getNews)
router.delete('/delete/:id', deleteNews)
router.put('/edit/:id', editNews)

module.exports = router;