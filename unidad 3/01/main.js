import './webcomponent.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const calc = document.createElement('calculator-component');
    app.appendChild(calc);
});
