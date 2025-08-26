const express = require('express');
const { addUpcomingProject, addPastProject, getProjects, editProject, deleteProject} = require('../controllers/projectsController');
const router = express.Router();
const upload = require('../middlewares/multer');

router.post('/addupcomingproject', upload.single('image'), addUpcomingProject )
router.post('/addpastproject', upload.single('image'), addPastProject )
router.get('/getprojects', getProjects )
router.delete('/deleteproject/:id', deleteProject )
router.put('/editproject/:id', upload.single('image'), editProject )

module.exports = router;