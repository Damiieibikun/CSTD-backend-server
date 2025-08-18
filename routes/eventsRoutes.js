const express = require('express');
const { postEvent, getEvents, deleteEvent, editEvent } = require('../controllers/eventsController');
const router = express.Router();

router.post('/createevent', postEvent)
router.get('/fetchevents', getEvents)
router.delete('/delete/:id', deleteEvent)
router.put('/edit/:id', editEvent)

module.exports = router;