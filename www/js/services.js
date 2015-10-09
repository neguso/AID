angular.module('app.services', ['ionic'])
	.value('configuration', {
		apiKey: 'abcde',
		apiServer: 'http://localhost:3000'
		//apiServer: 'http://10.115.6.150:3000'
	})

	.factory('login', function($ionicModal, $rootScope, $q, $http, configuration) {

		$rootScope.login = {
			message: '',
			username: 'ovidiu.negus@accesa.eu',
			password: 'V@rzamulta05',
			onclose: function() { },
			onlogin: function() { }
		};

		var builder = $ionicModal.fromTemplateUrl('templates/login.html', { scope: $rootScope, focusFirstInput: true });

		var login = {

			check: function()
			{
				// check if a saved token exists
				// check if token is valid, if true set login info
			},

			show: function(onclose, onlogin)
			{
				$rootScope.login.onclose = onclose;
				$rootScope.login.onlogin = onlogin;
				builder.then(function(modal) { modal.show(); });
			},

			hide: function()
			{
				builder.then(function(modal) { modal.hide(); });
			},

			call: function()
			{
				var defer = $q.defer();

				// authenticate
				$http.get(configuration.apiServer + '/auth?key={key}&action=auth&user={user}&password={password}'.interpolate({ key: configuration.apiKey, user: $rootScope.login.username, password: $rootScope.login.password }))
					.success(function(auth, status) {

						if(status === 200)
						{
							if(auth.status === 'success')
							{
								// get identity information
								$http.get(configuration.apiServer + '/auth?key={key}&action=info&token={token}&identity={identity}&fields={fields}'.interpolate({ key: configuration.apiKey, token: auth.token, identity: auth.identity, fields: 'FirstName,LastName,Avatar,Birthday,Email,Skype,Phone,JobPosition,OfficeLocation' }))
									.success(function(info, status) {

										if(status === 200) {
											login.info.token = auth.token;
											login.info.identity = auth.identity;
											login.info.avatar = configuration.apiServer + '/auth?key={key}&action=resource&token={token}&identity={identity}&type=avatar'.interpolate({ key: configuration.apiKey, token: auth.token, identity: auth.identity });
											login.info.firstName = info.FirstName;
											login.info.lastName = info.LastName;
											login.info.email = info.Email;

											defer.resolve({ info: login.info });
										}
										else
										{
											defer.reject();
										}
									})
									.error(function(error, status) {
										defer.reject();
									});
							}
							else
							{
								defer.resolve({ info: null });
							}
						}
						else
						{
							defer.reject();
						}
					})
					.error(function(error, status) {
						defer.reject(error);
					});

				return defer.promise;
			},

			message: function(text)
			{
				$rootScope.login.message = text;
			},

			out: function()
			{
				login.info.token = null;
				login.info.identity = null;
				login.info.avatar = null;
				login.info.firstName = 'Unknown';
				login.info.lastName = '';
				login.info.email = '';
			},

			info: {
				token: null,
				identity: null,
				avatar: null,
				firstName: 'Unknown',
				lastName: '',
				email: ''
			}

		};
		return login;
	})

	.factory('employees', function($http, $q, configuration, login) {

		var employees = {

			get: function()
			{
				var defer = $q.defer();

				$http.get(configuration.apiServer + '/auth?key={key}&action=get&token={token}&fields={fields}&order={order}&skip=0&take=200'.interpolate({ key: configuration.apiKey, token: login.info.token, fields: 'Identity,FirstName,LastName,Email,Skype,Phone,JobPosition,OfficeLocation,Avatar', order: 'FirstName,LastName' }))
					.success(function(data, status) {

						defer.resolve(data.identities.map(function(item) {
							return {
								identity: item.Identity,
								firstName: item.FirstName,
								lastName: item.LastName,
								email: item.Email,
								skype: item.Skype,
								phone: item.Phone,
								jobPosition: item.JobPosition,
								officeLocation: item.OfficeLocation,
								avatar: configuration.apiServer + '/auth?key={key}&action=resource&token={token}&identity={identity}&type=avatar'.interpolate({ key: configuration.apiKey, token: login.info.token, identity: item.Identity })
							};
						}));

					})
					.error(function(data, status) {
						defer.reject();
					});

				return defer.promise;
			},

			load: function(identity)
			{
				var defer = $q.defer();

				// get identity information
				$http.get(configuration.apiServer + '/auth?key={key}&action=info&token={token}&identity={identity}&fields={fields}'.interpolate({ key: configuration.apiKey, token: login.info.token, identity: identity, fields: 'Identity,FirstName,LastName,Avatar,Birthday,Email,Skype,Phone,JobPosition,OfficeLocation' }))
					.success(function(info, status) {

						if(status === 200) {
							defer.resolve({
								identity: info.Identity,
								avatar: configuration.apiServer + '/auth?key={key}&action=resource&token={token}&identity={identity}&type=avatar'.interpolate({ key: configuration.apiKey, token: login.info.token, identity: info.Identity }),
								firstName: info.FirstName,
								lastName: info.LastName,
								email: info.Email,
								skype: info.Skype,
								phone: info.Phone,
								jobPosition: info.JobPosition,
								officeLocation: info.OfficeLocation
							});
						}
						else
						{
							defer.reject();
						}
					})
					.error(function(error, status) {
						defer.reject();
					});

				return defer.promise;
			}

		};
		return employees;
	});
