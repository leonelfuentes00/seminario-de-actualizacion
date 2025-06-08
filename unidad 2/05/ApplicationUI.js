import { ApplicationModel } from './ApplicationModel';

class ApplicationUI {
	constructor(model) {
		this.model = model;
	}

	mainMenu() {
		let option;
		do {
			option = prompt("1. Iniciar sesión\n 2. Crear cuenta\n X. Salir");

			switch (option) {
                case '1':
                    this.GUI_login();
                    break;
                case '2':
                    this.createAccount();
                    break;
                case 'X':
                case 'x':
                    alert("Saliendo...");
                    break;
                default:
                    alert("Opción no válida");
                    break;
            } 
        } while (option !== 'X' && option !== 'x');
    }

    userMenu(username, role) {
		let option = '';
		alert(`¡Bienvenido/a ${username}!`);

		do {
			option = prompt("Seleccione una opción:\n1. Cambiar contraseña\n2. Ver artículos\n3. Agregar artículo\n4. Editar artículo\n5. Eliminar artículo\n6. Comprar artículos\nX. Salir");

			switch (option) {
				case '1':
					let currentPassword = prompt("Ingrese su contraseña actual:");
					let userData = this.model.isValidUserGetData(username);
					if (userData.password === currentPassword) {
						let newPassword = prompt("Ingrese la nueva contraseña:");
						if (this.model.isValidPassword(newPassword)) {
							userData.password = newPassword;
							this.model.saveUsers();
							alert("Contraseña actualizada exitosamente.");
						} else {
							alert("La contraseña no cumple con los requisitos:\n- 8 a 16 caracteres\n- Al menos 1 mayúscula\n- Al menos 2 símbolos especiales");
						}
					} else {
						alert("La contraseña actual no es correcta.");
					}
					break;
				case '2':
					if (this.model.hasPermission(role, 'canView')) {
						this.displayArticulos();
					} else {
						alert("No tiene permiso para ver los artículos.");
					}
					break;
				case '3':
					if (this.model.hasPermission(role, 'canAdd')) {
						this.addArticulo();
					} else {
						alert("No tiene permiso para agregar artículos.");
					}
					break;
				case '4':
					if (this.model.hasPermission(role, 'canEdit')) {
						this.editArticulo();
					} else {
						alert("No tiene permiso para editar artículos.");
					}
					break;
				case '5':
					if (this.model.hasPermission(role, 'canDelete')) {
						this.deleteArticulo();
					} else {
						alert("No tiene permiso para eliminar artículos.");
					}
					break;
				case '6':
					if (this.model.hasPermission(role, 'canBuy')) {
						this.buyArticulo();
					} else {
						alert("No tiene permiso para comprar artículos.");
					}
					break;
				case 'X':
				case 'x':
					alert("Sesión finalizada.");
					break;
				default:
					alert("Opción invalida. Intente nuevamente.");
			}
		} while (option !== 'X' && option !== 'x');
	}
    
	GUI_login() {
		const username = prompt("Usuario:");
		const password = prompt("Contraseña:");
		const res = this.model.authenticateUser(username, password);

		this.model.saveUsers();

		if (res.status) {
			document.cookie = `currentUser=${username}; path=/`;
			document.cookie = `currentRole=${res.role}; path=/`;
			alert(`Autenticado como ${res.role}`);
			this.userMenu(username, res.role);
		} else {
			alert(res.result === 'BLOCKED_USER' ? 'Bloqueado' : 'Error de autenticación');
		}
	}


	createAccount() {
        let newUsername = prompt("Ingrese un nuevo nombre de usuario:");
        if (!newUsername || newUsername.trim() === '') {
            alert("El nombre de usuario no puede estar vacío.");
            return;
        }

		if (this.model.isValidUserGetData(newUsername)) {
			alert("Ese nombre de usuario ya existe.");
			return;
		}

		let newPassword = prompt("Ingrese una nueva contraseña:");
		if (!this.model.isValidPassword(newPassword)) {
			alert("La contraseña no cumple con los requisitos:\n- 8 a 16 caracteres\n- Al menos 1 mayúscula\n- Al menos 2 símbolos especiales");
			return;
		}

		const validRoles = ['admin', 'client', 'seller', 'worker'];
		let role = prompt("Ingrese el rol del nuevo usuario (admin, client, seller, worker):").toLowerCase();

		if (!validRoles.includes(role)) {
			alert("Rol inválido.");
			return;
		}

		this.model.createUser(newUsername, newPassword, role);
		alert(`Cuenta creada exitosamente con rol "${role}".`);
	}

	displayArticulos(username) {
		const articulos = this.model.getArticulos(username);
		let mensaje = "Listado de artículos:\n";
		articulos.forEach(a => {
			mensaje += `ID: ${a.id}, Nombre: ${a.nombre}, Precio: $${a.precio}, Stock: ${a.stock}\n`;
		});
		alert(mensaje);
	}

	addArticulo(username) {
		const nombre = prompt("Nombre del artículo:");
		const precio = parseFloat(prompt("Precio del artículo:"));
		const stock = parseInt(prompt("Stock inicial:"));
		this.model.addArticulo(nombre, precio, stock, username);
		alert("Artículo agregado.");
	}

	editArticulo(username) {
		const id = parseInt(prompt("ID del artículo a editar:"));
		const nombre = prompt("Nuevo nombre:");
		const precio = parseFloat(prompt("Nuevo precio:"));
		const stock = parseInt(prompt("Nuevo stock:"));
		if (this.model.editArticulo(id, nombre, precio, stock, username)) {
			alert("Artículo actualizado.");
		} else {
			alert("Artículo no encontrado.");
		}
	}

	deleteArticulo(username) {
		const id = parseInt(prompt("ID del artículo a eliminar:"));
		if (this.model.deleteArticulo(id, username)) {
			alert("Artículo eliminado.");
		} else {
			alert("Artículo no encontrado.");
		}
	}

	buyArticulo(username) {
		const id = parseInt(prompt("ID del artículo a comprar:"));
		const cantidad = parseInt(prompt("Cantidad a comprar:"));
		if (this.model.buyArticulo(id, cantidad, username)) {
			alert("Compra realizada.");
		} else {
			alert("No se pudo realizar la compra.");
		}
	}
}
export { ApplicationUI };
