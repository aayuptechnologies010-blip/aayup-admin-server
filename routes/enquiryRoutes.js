const express = require('express');
const router = express.Router();
const { sendEnquiryEmail } = require('../controllers/enquiryController');

router.post('/send-enquiry-email', sendEnquiryEmail);

module.exports = router;
