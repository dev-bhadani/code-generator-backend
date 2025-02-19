const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');

const exportProject = (req, res) => {
    const {name, fields} = req.body;

    if (!name || !Array.isArray(fields)) {
        return res.status(400).json({success: false, message: 'Invalid data received'});
    }

    const componentName = name.replace(/\s+/g, '');

    const fieldComponents = fields.map((field) => {
        switch (field.type) {
            case 'text':
                return `<TextField label="${field.label}" variant="outlined" fullWidth margin="normal" />`;

            case 'email':
                return `<TextField label="${field.label}" type="email" variant="outlined" fullWidth margin="normal" />`;

            case 'password':
                return `<TextField label="${field.label}" type="password" variant="outlined" fullWidth margin="normal" />`;

            case 'button':
                return `<Button variant="contained" color="primary">${field.label}</Button>`;

            case 'checkbox':
                return `<FormControl component="fieldset">
                            <FormLabel component="legend">${field.label}</FormLabel>
                            ${field.options.map(option => `<FormControlLabel control={<Checkbox />} label="${option}" />`).join('\n')}
                        </FormControl>`;

            case 'radio':
                return `<FormControl component="fieldset">
                            <FormLabel component="legend">${field.label}</FormLabel>
                            <RadioGroup name="${field.label.toLowerCase()}">
                                ${field.options.map(option => `<FormControlLabel value="${option}" control={<Radio />} label="${option}" />`).join('\n')}
                            </RadioGroup>
                        </FormControl>`;

            case 'select':
                return `<FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel>${field.label}</InputLabel>
                            <Select label="${field.label}">
                                ${field.options.map(option => `<MenuItem value="${option}">${option}</MenuItem>`).join('\n')}
                            </Select>
                        </FormControl>`;

            default:
                return `<div>Unknown field type: ${field.type}</div>`;
        }
    }).join('\n');

    const formCode = `import React from 'react';
    import { TextField, Button, Checkbox, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio, Select, MenuItem, InputLabel } from '@mui/material';
    import './App.css';
    
    const ${componentName} = () => {
        return (
            <form>
                ${fieldComponents}
            </form>
        );
    };
    
    export default ${componentName};
    `;

    const projectDir = path.join(__dirname, '..', 'exports', componentName);
    const srcDir = path.join(projectDir, 'src');
    const publicDir = path.join(projectDir, 'public');

    if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, {recursive: true});
    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, {recursive: true});
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, {recursive: true});

    fs.writeFileSync(path.join(srcDir, 'App.js'), formCode);

    const packageJson = {
        name: componentName.toLowerCase(), version: "1.0.0", private: true, dependencies: {
            "@mui/material": "^5.0.0",
            "@emotion/react": "^11.0.0",
            "@emotion/styled": "^11.0.0",
            "react": "^18.0.0",
            "react-dom": "^18.0.0",
            "react-scripts": "5.0.0"
        }, scripts: {
            start: "set PORT=3999 && react-scripts start",
            build: "react-scripts build",
            test: "react-scripts test",
            eject: "react-scripts eject"
        }
    };

    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    const indexJs = `import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import App from './App';
    
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
    `;
    fs.writeFileSync(path.join(srcDir, 'index.js'), indexJs);

    const indexCss = `body {
        font-family: 'Roboto', sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 70vh;
    }`;
    fs.writeFileSync(path.join(srcDir, 'index.css'), indexCss);

    const appCss = `form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        height: auto;
        width: 500px;
    }
    
    label {
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
    }
    `;
    fs.writeFileSync(path.join(srcDir, 'App.css'), appCss);

    const indexHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${componentName}</title>
    </head>
    <body>
        <div id="root"></div>
    </body>
    </html>
    `;
    fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);

    exec(`cd ${projectDir} && npm install && npm start`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running the project:', error.message);
            return res.status(500).json({
                success: false, message: 'Failed to run the project', error: error.message,
            });
        }

        console.log('Project running successfully:', stdout);
        res.status(200).json({
            success: true, message: 'Project generated and running successfully', projectPath: projectDir,
        });
    });
};

module.exports = {exportProject};
