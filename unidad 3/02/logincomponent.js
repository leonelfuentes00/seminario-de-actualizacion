export class LoginComponent extends HTMLElement {
	constructor() {
		super();
		this.container = document.createElement('div');
	}

	connectedCallback() {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://www.w3schools.com/w3css/5/w3.css';

		document.head.appendChild(link);

		this.container.classList.add('w3-container', 'w3-half', 'w3-margin-top');
		const form = document.createElement('form');
		form.classList.add('w3-container', 'w3-card-4');
		form.appendChild(this.createInput('Name', 'text'));
		form.appendChild(this.createInput('Password', 'password'));

		form.appendChild(this.createRadio('gender', 'male', 'Male', true));
		form.appendChild(this.createRadio('gender', 'female', 'Female', false));
		form.appendChild(this.createRadio('gender', '', "Don't know (Disabled)", false, true));

		const stayLogged = document.createElement('p');
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = true;
		checkbox.id = 'stayLogged';
		checkbox.classList.add('w3-check');

		const labelCheck = document.createElement('label');
		labelCheck.textContent = 'Stay logged in';

		stayLogged.appendChild(checkbox);
		stayLogged.appendChild(labelCheck);
		form.appendChild(stayLogged);

		const pBtn = document.createElement('p');
		const btn = document.createElement('button');
		btn.textContent = 'Log in';
		btn.classList.add('w3-button', 'w3-section', 'w3-teal', 'w3-ripple');
		pBtn.appendChild(btn);
		form.appendChild(pBtn);

		this.container.appendChild(form);
		this.appendChild(this.container);
	}

	createInput(labelText, type) {
		const p = document.createElement('p');
		const input = document.createElement('input');
		input.classList.add('w3-input');
		input.type = type;
		input.style.width = '90%';
		input.required = true;

		const label = document.createElement('label');
		label.textContent = labelText;

		p.appendChild(input);
		p.appendChild(label);
		return p;
	}

	createRadio(name, value, labelText, checked = false, disabled = false) {
		const p = document.createElement('p');
		const input = document.createElement('input');
		input.classList.add('w3-radio');
		input.type = 'radio';
		input.name = name;
		input.value = value;
		input.checked = checked;
		input.disabled = disabled;

		const label = document.createElement('label');
		label.textContent = labelText;

		p.appendChild(input);
		p.appendChild(label);
		return p;
	}
}

customElements.define('login-component', LoginComponent);
