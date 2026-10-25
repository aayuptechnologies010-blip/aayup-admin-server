const express = require('express');
const router = express.Router();
const { createSuperAdmin } = require('../controllers/adminController');

router.post('/create-superadmin', createSuperAdmin);

module.exports = router;
