const generateReactComponent = (componentName, elements) => {
    const generateElementCode = (element) => {
        switch (element.type) {
            case 'text':
                return `<input type="text" placeholder="${element.name}" />`;
            case 'button':
                return `<button>${element.label || 'Submit'}</button>`;
            case 'checkbox':
                return `
          ${element.checkboxOptions
                    .map(
                        (option) =>
                            `<label><input type="checkbox" /> ${option.label}</label>`
                    )
                    .join('\n')}
        `;
            case 'radio':
                return `
          ${element.options
                    .map(
                        (option) =>
                            `<label><input type="radio" name="radio-group" value="${option}" /> ${option}</label>`
                    )
                    .join('\n')}
        `;
            case 'select':
                return `
          <select>
            ${element.options
                    .map((option) => `<option value="${option}">${option}</option>`)
                    .join('\n')}
          </select>
        `;
            default:
                return `<!-- Unknown element type: ${element.type} -->`;
        }
    };

    const elementsCode = elements.map((el) => generateElementCode(el)).join('\n');

    return `
import React from 'react';

const ${componentName} = () => {
  return (
    <form>
      ${elementsCode}
    </form>
  );
};

export default ${componentName};
  `;
};

module.exports = generateReactComponent;
