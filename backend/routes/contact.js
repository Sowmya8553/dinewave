const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', contactController.getMessages);
router.post('/', contactController.createMessage);

module.exports = router;
