const Form = require('../models/formModel');

let forms = [];

const getForms = (req, res) => {
    res.status(200).json({success: true, data: forms});
};


const getFormById = (req, res) => {
    const {id} = req.params;
    const form = forms.find((f) => f.id === parseInt(id));

    if (!form) {
        return res.status(404).json({success: false, message: 'Form not found'});
    }

    res.status(200).json({success: true, data: form});
};


const createForm = (req, res) => {
    const newForm = req.body;

    if (!newForm.name || !Array.isArray(newForm.fields)) {
        return res.status(400).json({success: false, message: 'Invalid form data'});
    }

    newForm.id = forms.length + 1;
    forms.push(newForm);

    res.status(201).json({success: true, data: newForm});
};

const updateForm = (req, res) => {
    const {id} = req.params;
    const updatedData = req.body;

    const formIndex = forms.findIndex((f) => f.id === parseInt(id));
    if (formIndex === -1) {
        return res.status(404).json({success: false, message: 'Form not found'});
    }

    forms[formIndex] = {...forms[formIndex], ...updatedData};
    res.status(200).json({success: true, data: forms[formIndex]});
};


const deleteForm = (req, res) => {
    const {id} = req.params;
    const formIndex = forms.findIndex((f) => f.id === parseInt(id));

    if (formIndex === -1) {
        return res.status(404).json({success: false, message: 'Form not found'});
    }

    const deletedForm = forms.splice(formIndex, 1);
    res.status(200).json({success: true, data: deletedForm});
};

module.exports = {createForm, getForms, getFormById, updateForm, deleteForm};
