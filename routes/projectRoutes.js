const express = require('express');
const { addUpcomingProject, addPastProject, getProjects, editProject, deleteProject} = require('../controllers/projectsController');
const router = express.Router();

router.post('/addupcomingproject', addUpcomingProject )
router.post('/addpastproject', addPastProject )
router.get('/getprojects', getProjects )
router.delete('/deleteproject/:id', deleteProject )
router.put('/editproject/:id', editProject )

module.exports = router;