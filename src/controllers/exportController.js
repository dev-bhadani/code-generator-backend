const fs = require('fs');
const path = require('path');

const exportComponent = (req, res) => {
    const { name, fields } = req.body;
    if (!name || !Array.isArray(fields)) {
        return res.status(400).json({ success: false, message: 'Invalid data received' });
    }

    const componentName = name.replace(/\s+/g, '');
    const fieldComponents = fields.map((field) => {
        return `<label>${field.label}<input type="${field.type}" name="${field.label.toLowerCase()}" /></label>`;
    }).join('\n');

    const componentCode = `import React from 'react';

const ${componentName} = () => {
    return (
        <form>
            ${fieldComponents}
        </form>
    );
};

export default ${componentName};
`;

    const exportDir = path.join(__dirname, '..', 'exports');
    const fileName = `${componentName}.js`;
    const filePath = path.join(exportDir, fileName);

    if (!fs.existsSync(exportDir)) {
        console.log('Creating exports directory...');
        fs.mkdirSync(exportDir);
    }

    fs.writeFile(filePath, componentCode, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ success: false, message: 'Failed to generate the component file' });
        }

        console.log('File successfully written to:', filePath);
        res.status(200).json({ success: true, message: 'Component file generated successfully', filePath });
    });
};

module.exports = { exportComponent };
