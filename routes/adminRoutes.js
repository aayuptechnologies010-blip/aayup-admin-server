const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { createSuperAdmin, saveDynamicData, getDynamicData, uploadMedia } = require('../controllers/adminController');

router.post('/create-superadmin', createSuperAdmin);
router.post('/dynamic-data', saveDynamicData);
router.get('/dynamic-data/:key', getDynamicData);
router.post('/upload-media', upload.single('file'), uploadMedia);

module.exports = router;
