const express = require('express');
const router = express.Router();
const { sendStudentApplicationEmail } = require('../controllers/studentController');

router.post('/send-student-application-email', sendStudentApplicationEmail);

module.exports = router;
