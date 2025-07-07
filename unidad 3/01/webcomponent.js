export class CalculatorComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.result = '';
        this.justEvaluated = false;
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    disconnectedCallback() {}

    render() {
        const style = document.createElement('style');
        style.textContent = `
            .container {
                display: grid;
                grid-template-columns: repeat(4, 60px);
                grid-gap: 5px;
                width: 260px;
            }
            button {
                font-size: 20px;
                padding: 10px;
            }
            #display {
                grid-column: span 4;
                height: 40px;
                font-size: 20px;
                text-align: right;
                padding: 5px;
                border: 1px solid black;
                background: white;
            }
        `;

        const container = document.createElement('div');
        container.classList.add('container');

        const display = document.createElement('div');
        display.id = 'display';
        display.innerText = '0';

        const buttons = [
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '0', '.', '=', '+'
        ];

        container.appendChild(display);

        buttons.forEach(label => {
            const btn = document.createElement('button');
            btn.innerText = label;
            btn.dataset.value = label;
            container.appendChild(btn);
        });

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
    }

    attachEvents() {
        const buttons = this.shadowRoot.querySelectorAll('button');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;

                if (value === '=') {
                    try {
                        this.result = eval(this.result).toString();
                        display.innerText = this.result;
                        this.justEvaluated = true;
                    } catch (e) {
                        display.innerText = 'Error';
                        this.result = '';
                        this.justEvaluated = false;
                    }
                } else {
                    if (this.justEvaluated && /[0-9.]/.test(value)) {
                        this.result = value;
                    } else if (this.justEvaluated && /[+\-*/]/.test(value)) {
                        this.result += value;
                    } else {
                        this.result += value;
                    }
                    display.innerText = this.result;
                    this.justEvaluated = false;
                }
            });
        });
    }
}

customElements.define('calculator-component', CalculatorComponent);