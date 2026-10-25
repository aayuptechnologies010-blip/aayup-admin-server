const express = require('express');
const router = express.Router();
const { createSuperAdmin, saveDynamicData, getDynamicData } = require('../controllers/adminController');

router.post('/create-superadmin', createSuperAdmin);
router.post('/dynamic-data', saveDynamicData);
router.get('/dynamic-data/:key', getDynamicData);

module.exports = router;
