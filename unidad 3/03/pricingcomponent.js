export class PricingComponent extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this._plans = [];
	}

	set data(value) {
		this._plans = value || [];
		this.render();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = '';

		const styleLink = document.createElement('link');
		styleLink.rel = 'stylesheet';
		styleLink.href = 'https://www.w3schools.com/w3css/5/w3.css';

		const fontLink = document.createElement('link');
		fontLink.rel = 'stylesheet';
		fontLink.href = 'https://fonts.googleapis.com/css?family=Verdana';
		this.shadowRoot.appendChild(fontLink);

		const style = document.createElement('style');
		style.textContent = `* { font-family: Verdana, sans-serif; }`;

		const container = document.createElement('div');
		container.className = 'w3-container';

		this._plans.forEach(plan => {
			const card = document.createElement('div');
			card.className = 'w3-third w3-margin-bottom';

			const ul = document.createElement('ul');
			ul.className = 'w3-ul w3-border w3-center w3-hover-shadow';

			const titleLi = document.createElement('li');
			titleLi.className = `${plan.color || 'w3-black'} w3-xlarge w3-padding-32`;
			titleLi.textContent = plan.name;
			ul.appendChild(titleLi);

			plan.features.forEach(f => {
				const li = document.createElement('li');
				li.className = 'w3-padding-16';
				if (f.bold && f.text) {
					li.innerHTML = `<b>${f.bold}</b> ${f.text}`;
				} else {
					li.textContent = f;
				}
				ul.appendChild(li);
			});

			const priceLi = document.createElement('li');
			priceLi.className = 'w3-padding-16';
			priceLi.innerHTML = `<h2 class="w3-wide">${plan.price}</h2><span class="w3-opacity">${plan.period}</span>`;
			ul.appendChild(priceLi);

			const btnLi = document.createElement('li');
			btnLi.className = 'w3-light-grey w3-padding-24';
			const button = document.createElement('button');
			button.className = 'w3-button w3-green w3-padding-large';
			button.textContent = plan.cta || 'Sign Up';
			btnLi.appendChild(button);
			ul.appendChild(btnLi);

			card.appendChild(ul);
			container.appendChild(card);
		});

		const wrapper = document.createElement('div');
		wrapper.className = 'w3-third w3-margin-bottom';
		const title = document.createElement('h2');
		title.textContent = 'Responsive Pricing Tables';
		wrapper.appendChild(title);

		this.shadowRoot.appendChild(styleLink);
		this.shadowRoot.appendChild(wrapper);
		this.shadowRoot.appendChild(container);
		this.shadowRoot.appendChild(style);
	}
}

customElements.define('plan-list', PricingComponent);
