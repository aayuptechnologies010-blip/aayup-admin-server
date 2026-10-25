const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');

router.post('/send-contact-email', sendContactEmail);

module.exports = router;
