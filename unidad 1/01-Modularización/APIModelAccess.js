class APIModelAccess
{
	constructor()
	{
		this._authData = new Map();
		this._maxLoginFailedAttempts = 3;
		
		let userData =
		[
			{
				password: '987654',
				failedLoginCounter: 0,
				isLocked: false
			},
			{
				password: '987654',
				failedLoginCounter: 0,
				isLocked: false
			}
		]

		this._authData.set('scorpion', userData[0] );
		this._authData.set('subZero', userData[1] );
	}

	isValidUserGetData( username )
	{
		return this._authData.get(username);
	}

	authenticateUser( username, password )
	{
		let api_return = 
		{
			status: false,
			result: null
		};


		if ( (username != undefined && username != null && username != '') && (password != undefined && password != null && password != '') )
		{
			let userdata = this.isValidUserGetData(username);

			if ( userdata.isLocked == false )
			{
				if( userdata.password === password )
				{
					api_return.status = true;
				}
				else
				{
					api_return.status = false;
					api_return.result = 'USER_PASSWORD_FAILED';

					userdata.failedLoginCounter++;
					
					if ( userdata.failedLoginCounter == this._maxLoginFailedAttempts )
					{
						userdata.isLocked = true;
						api_return.status = false;
						api_return.result = 'BLOCKED_USER';
					}
				}
			}
			else
			{
				api_return.status = false;
				api_return.result = 'BLOCKED_USER';
			}
			
		}
		
		return api_return;
	}

	getMaxLoginAttempts()
	{
		return this._maxLoginFailedAttempts;
	}

}


export { APIModelAccess };