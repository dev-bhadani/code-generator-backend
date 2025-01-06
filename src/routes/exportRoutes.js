const express = require('express');
const { exportComponent } = require('../controllers/exportController');

const router = express.Router();

router.post('/', exportComponent);

module.exports = router;
