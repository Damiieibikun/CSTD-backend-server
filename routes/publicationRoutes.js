const express = require('express');
const { addPublication, getPublications, editPublication, deletePublication} = require('../controllers/publicationController');
const router = express.Router();

router.post('/addpublication', addPublication )
router.put('/editpublication/:id', editPublication )
router.get('/getpublications', getPublications )
router.delete('/deletepublication/:id', deletePublication )

module.exports = router;