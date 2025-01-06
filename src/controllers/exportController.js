const exportComponent = (req, res) => {
    const { name, fields } = req.body;

    if (!name || !fields || !Array.isArray(fields)) {
        return res.status(400).json({ message: "Invalid data received" });
    }

    const generateComponentCode = (name, fields) => {
        return `import React from 'react';

const ${name.replace(/\s+/g, '')} = () => {
    return (
        <form>
            ${fields
            .map((field) => {
                if (field.type === 'text') {
                    return `<label>${field.label}<input type="text" name="${field.label.toLowerCase()}" /></label>`;
                }
                if (field.type === 'email') {
                    return `<label>${field.label}<input type="email" name="${field.label.toLowerCase()}" /></label>`;
                }
                return '';
            })
            .join('\n')}
        </form>
    );
};

export default ${name.replace(/\s+/g, '')};
`;};

    const componentCode = generateComponentCode(name, fields);

    res.status(200).json({ success: true, componentCode });
};

module.exports = { exportComponent };
