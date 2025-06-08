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

	/* no se usa, pero lo dejo por si acaso
	estas funciones se usan si se quiere persistir los usuarios en cookies
	no se recomienda para producción por temas de seguridad

	loadUsers() {
		const cookie = document.cookie.split('; ').find(c => c.startsWith('authData='));
		if (!cookie) return;
		const json = decodeURIComponent(cookie.split('=')[1]);
		const parsed = JSON.parse(json);
		for (let [user, data] of Object.entries(parsed)) {
			this.authData.set(user, data);
		}
	}

	saveUsers() {
		const obj = Object.fromEntries(this.authData);
		document.cookie = `authData=${encodeURIComponent(JSON.stringify(obj))}; path=/; max-age=31536000`; // 1 año
	}
		*/

	openDB() {
		console.log("entramos en openDB");
			return new Promise((resolve, reject) => {
			const request = indexedDB.open('AppDB', 1);
			request.onupgradeneeded = event => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains('authData')) {
					db.createObjectStore('authData');
				}
				console.log("Base de datos creada o actualizada");
			};

			if (!db.objectStoreNames.contains('logs')) {
				db.createObjectStore('logs', { autoIncrement: true });
			}
			request.onsuccess = () => resolve(request.result);
			console.log("Base de datos abierta correctamente");
			request.onerror = () => reject(request.error);
			console.log("Error al abrir la base de datos");
		});
	}

	//creo funciones asíncronas para guardar y cargar los usuarios que usan IndexedDB para persistencia
	async saveUsers() {
		const db = await this.openDB();
		const tx = db.transaction('authData', 'readwrite');
		const store = tx.objectStore('authData');
		await store.put(Object.fromEntries(this.authData), 'users');
		
		return new Promise((resolve, reject) => {
			tx.oncomplete = () => {
				console.log("Usuarios guardados correctamente");
				resolve();
			};
			tx.onerror = () => {
				console.error("Error al guardar los usuarios");
				reject(tx.error);
			};
		});
	}

	async loadUsers() {
		const db = await this.openDB();
		const tx = db.transaction('authData', 'readonly');
		const store = tx.objectStore('authData');
		const data = await store.get('users');
		if (data) {
			for (let [user, val] of Object.entries(data)) {
				this.authData.set(user, val);
			}
		}
	}

	async logAction(userId, actionName, values) {
		const db = await this.openDB();
		const tx = db.transaction('logs', 'readwrite');
		const store = tx.objectStore('logs');

		const logEntry = {
			timestamp: new Date().toISOString(),
			userId,
			action: actionName,
			values
		};

		store.add(logEntry);
	}

	async getLogs() {
		const db = await this.openDB();
		const tx = db.transaction('logs', 'readonly');
		const store = tx.objectStore('logs');
		const logs = await store.getAll();

		return logs.map(log => ({
			timestamp: log.timestamp,
			userId: log.userId,
			action: log.action,
			values: log.values
		}));
	}

	async downloadLogs() {
		const logs = await this.model.getLogs();

		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();

		doc.setFontSize(12);
		doc.text("Registro de Operaciones", 10, 10);
		let y = 20;

		logs.forEach(log => {
			const line = `[${log.timestamp}] ${log.userId} - ${log.action} - ${JSON.stringify(log.values)}`;
			const lines = doc.splitTextToSize(line, 180);
			lines.forEach(l => {
				if (y > 280) { doc.addPage(); y = 10; }
				doc.text(l, 10, y);
				y += 7;
			});
		});

		doc.save('registro_operaciones.pdf');
	}

	hasPermission(role, action) {
		return this.userPermissions[role] && this.userPermissions[role][action];
	}

	getArticulos(userId) {
		this.logAction(userId, "GET_ARTICULOS", {});
		return this.articulos;
	}

	addArticulo(nombre, precio, stock, userId) {
		this.articulos.push({
			id: this.articulos.length + 1,
			nombre,
			precio,
			stock
		});
		this.logAction(userId, "ADD_ARTICULO", { nombre, precio, stock });
	}

	editArticulo(id, nuevoNombre, nuevoPrecio, nuevoStock, userId) {
		let articulo = this.articulos.find(a => a.id === id);
		if (!articulo) return false;
		articulo.nombre = nuevoNombre;
		articulo.precio = nuevoPrecio;
		articulo.stock = nuevoStock;
		this.logAction(userId, "EDIT_ARTICULO", { id, nuevoNombre, nuevoPrecio, nuevoStock});
		return true;
	}

	deleteArticulo(id, userId) {
		const index = this.articulos.findIndex(a => a.id === id);
		if (index === -1) return false;
		this.articulos.splice(index, 1);
		this.logAction(userId, "DELETE_ARTICULO", { id });
		return true;
	}

	buyArticulo(id, cantidad, userId) {
		let articulo = this.articulos.find(a => a.id === id);
		if (!articulo || articulo.stock < cantidad) return false;
		articulo.stock -= cantidad;
		this.logAction(userId, "BUY_ARTICULO", { id, cantidad });
		return true;
	}
}
export { ApplicationModel };