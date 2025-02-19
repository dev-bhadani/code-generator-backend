const express = require('express');
const { exportProject} = require('../controllers/exportController');

const router = express.Router();

router.post('/', exportProject);

module.exports = router;
