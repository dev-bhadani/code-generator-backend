const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    elements: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
