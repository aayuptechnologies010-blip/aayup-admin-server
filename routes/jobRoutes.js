const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { sendJobApplicationEmail } = require('../controllers/jobController');

router.post('/send-job-application-email', upload.single('resume'), sendJobApplicationEmail);

module.exports = router;
