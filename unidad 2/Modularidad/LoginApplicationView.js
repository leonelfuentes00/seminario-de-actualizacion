class LoginApplicationView
{
	constructor(apiInstanceObject)
	{
		this._api = apiInstanceObject;
	}

	show()
	{
		let username = window.prompt("Ingrese su nombre de usuario:");
		let password = window.prompt("Ingrese contraseña:");

		let api_return = this._api.authenticateUser( username, password );
		
		if ( api_return.status )
		{
			alert('Usuario autenticado exitosamente');
		}
		else if ( api_return.status == false )
		{
			switch ( api_return.result ) 
			{
				case 'BLOCKED_USER':
					alert('Usuario bloqueado. Contacte al administrador');
				break;

				case 'USER_PASSWORD_FAILED':
					alert('Usuario y/o contraseña incorrecta');
				break;

				default:
					alert('Error desconocido');
				break;
			}
		}

		return api_return;	
	}
}

export { LoginApplicationView };