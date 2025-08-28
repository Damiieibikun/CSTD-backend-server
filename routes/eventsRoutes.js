const express = require('express');
const { postEvent, getEvents, deleteEvent, editEvent } = require('../controllers/eventsController');
const router = express.Router();
const upload = require('../middlewares/multer');
router.post('/createevent', upload.single('flyer'), postEvent)
router.get('/fetchevents', getEvents)
router.delete('/delete/:id', deleteEvent)
router.put('/edit/:id', upload.single('flyer'), editEvent)

module.exports = router;