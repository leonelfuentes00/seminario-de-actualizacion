class ApplicationModel {
	constructor() {
		this.authData = new Map();
		this.maxLoginFailedAttempts = 3;

		let userData = [
			{ password: 
                '987654', 
                failedLoginCounter: 0, 
                isLocked: false, 
                role: 'admin' 
            },
			{ password: '987654', 
                failedLoginCounter: 0, 
                isLocked: false, 
                role: 'client' 
            }
		];

		this.authData.set('scorpion', userData[0]);
		this.authData.set('subZero', userData[1]);

		this.userPermissions = {
			admin: { 
                canView: true, 
                canAdd: true, 
                canEdit: true, 
                canDelete: true, 
                canBuy: true 
            },
			client: { 
                canView: true, 
                canAdd: false, 
                canEdit: false, 
                canDelete: false, 
                canBuy: true 
            },
			seller: { 
                canView: true, 
                canAdd: false, 
                canEdit: true, 
                canDelete: false, 
                canBuy: true 
            },
			worker: { 
                canView: true, 
                canAdd: true, 
                canEdit: true, 
                canDelete: false, 
                canBuy: false }
		};

		this.articulos = [
			{ 
                id: 1, 
                nombre: "Lavandina x 1L", 
                precio: 875.25, 
                stock: 3000 
            },
			{ 
                id: 4, 
                nombre: "Detergente x 500mL", 
                precio: 1102.45, 
                stock: 2010 },
			{ 
                id: 22, 
                nombre: "Jabón en polvo x 250g", 
                precio: 650.22, 
                stock: 407 }
		];

		this.loadUsers();
		return true;
	}

    isValidUserGetData(username) {
		return this.authData.get(username);
	}

	authenticateUser(username, password) {
		let api_return = { 
            status: false, 
            result: null, 
            role: null 
        };

		if ( (username != undefined && username != null && username != '') && (password != undefined && password != null && password != '') )
        {
            let userdata = this.isValidUserGetData(username); 
			if (userdata && userdata.isLocked === false) {
				if (userdata.password === password) {
					api_return.status = true;
					api_return.role = userdata.role;
					api_return.result = 'USER_AUTHENTICATED';
				} else {
					userdata.failedLoginCounter++;
					api_return.result = 'USER_PASSWORD_FAILED';

					if (userdata.failedLoginCounter === this.maxLoginFailedAttempts) {
						userdata.isLocked = true;
						api_return.result = 'BLOCKED_USER';
					}
					this.saveUsers(); 
				}
			} else if (userdata?.isLocked) {
				api_return.result = 'BLOCKED_USER';
			}
		}

		return api_return;
	}

    isValidPassword(password) {
        const lengthValid = password.length >= 8 && password.length <= 16;
        const hasUppercase = /[A-Z]/.test(password);
        const specialMatches = password.match(/[-_}{/!@#$%^&*]/g);
        const specialCount = specialMatches ? specialMatches.length : 0;
        
        return lengthValid && hasUppercase && specialCount >= 2;
    }

	createUser(username, password, role) {
		if (this.authData.has(username)) return false;
		this.authData.set(username, {
			password,
			failedLoginCounter: 0,
			isLocked: false,
			role
		});
		this.saveUsers();
		return true;
	}


	loadUsers() {
		const savedUsers = localStorage.getItem('authData');
		if (savedUsers) {
			const parsed = JSON.parse(savedUsers);
			for (let [user, data] of Object.entries(parsed)) {
				this.authData.set(user, data);
			}
		}
	}

	saveUsers() {
		const obj = Object.fromEntries(this.authData);
		localStorage.setItem('authData', JSON.stringify(obj));
	}

	hasPermission(role, action) {
		return this.userPermissions[role] && this.userPermissions[role][action];
	}

	getArticulos() {
		return this.articulos;
	}

	addArticulo(nombre, precio, stock) {
		this.articulos.push({
			id: this.articulos.length + 1,
			nombre,
			precio,
			stock
		});
	}

	editArticulo(id, nuevoNombre, nuevoPrecio, nuevoStock) {
		let articulo = this.articulos.find(a => a.id === id);
		if (!articulo) return false;
		articulo.nombre = nuevoNombre;
		articulo.precio = nuevoPrecio;
		articulo.stock = nuevoStock;
		return true;
	}

	deleteArticulo(id) {
		const index = this.articulos.findIndex(a => a.id === id);
		if (index === -1) return false;
		this.articulos.splice(index, 1);
		return true;
	}

	buyArticulo(id, cantidad) {
		let articulo = this.articulos.find(a => a.id === id);
		if (!articulo || articulo.stock < cantidad) return false;
		articulo.stock -= cantidad;
		return true;
	}
}
export { ApplicationModel };
