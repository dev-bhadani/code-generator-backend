const express = require('express');
const {
    createForm, getForms, getFormById, updateForm, deleteForm
} = require('../controllers/formController');

const router = express.Router();

router.route('/')
    .get(getForms)
    .post(createForm);

router.route('/:id')
    .get(getFormById)
    .put(updateForm)
    .delete(deleteForm);

module.exports = router;
