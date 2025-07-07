import { LoginComponent } from './logincomponent.js';

window.onload = () => {
	const login = new LoginComponent();
	document.body.appendChild(login);
};