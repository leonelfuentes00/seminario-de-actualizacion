export class PricingComponent extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.plans = [
			{ name: "Basico", price: "$10", features: ["1 usuario", "5 GB almacenamiento", "Soporte básico"] },
			{ name: "Estandar", price: "$25", features: ["5 usuarios", "50 GB almacenamiento", "Soporte estandar"] },
			{ name: "Premium", price: "$50", features: ["Usuarios ilimitados", "1 TB almacenamiento", "Soporte premium"] }
		];
	}

	connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	set data(newPlans) {
		this.plans = newPlans;
		this.render();
	}

	render() {
		this.shadow.innerHTML = '';

		const container = document.createElement('div');
		container.classList.add('w3-container', 'w3-row-padding');

		this.plans.forEach(plan => {
			const card = document.createElement('div');
			card.classList.add('w3-third');

			const cardInner = document.createElement('div');
			cardInner.classList.add('w3-card', 'w3-margin', 'w3-padding');

			const title = document.createElement('h3');
			title.textContent = plan.name;

			const price = document.createElement('h4');
			price.textContent = plan.price;

			const ul = document.createElement('ul');
			plan.features.forEach(feature => {
				const li = document.createElement('li');
				li.textContent = feature;
				ul.appendChild(li);
			});

			const btn = document.createElement('button');
			btn.textContent = 'Seleccionar';
			btn.classList.add('w3-button', 'w3-teal', 'w3-margin-top');

			cardInner.appendChild(title);
			cardInner.appendChild(price);
			cardInner.appendChild(ul);
			cardInner.appendChild(btn);
			card.appendChild(cardInner);
			container.appendChild(card);
		});

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://www.w3schools.com/w3css/5/w3.css';

		this.shadow.appendChild(link);
		this.shadow.appendChild(container);
	}
}

customElements.define('plan-list', PricingComponent);
