const express = require('express');
const { createAdmin, createWebmaster, 
    loginAdmin, changePwdAdmin, fetchAdmins,
approveAdmin, denyAdmin, deleteAdmin, editAdmin } = require('../controllers/adminControllers');
const router = express.Router();

router.get('/alladmins', fetchAdmins)

router.post('/createadmin', createAdmin)
router.post('/createwebmaster', createWebmaster)
router.post('/login', loginAdmin)
router.put('/approve/:id', approveAdmin)
router.put('/deny/:id', denyAdmin)
router.put('/changePwdAdmin', changePwdAdmin)
router.put('/editAdmin', editAdmin)
router.delete('/delete/:id', deleteAdmin)

module.exports = router;