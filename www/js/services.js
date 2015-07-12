angular.module('app.services', ['ionic'])

	.factory('login', function($ionicModal, $rootScope, $q, $http) {

		$rootScope.login = {
			message: '',
			username: 'a',
			password: 'a',
			onclose: function() { },
			onlogin: function() { }
		};

		var builder = $ionicModal.fromTemplateUrl('templates/login.html', { scope: $rootScope });

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

				if($rootScope.login.username === 'a' && $rootScope.login.password === 'a')
				{
					$http.get('http://api.randomuser.me/')
						.success(function(data, status) {

							login.info.token = data.results[0].user.email;
							login.info.avatar = data.results[0].user.picture.thumbnail;
							login.info.firstName = data.results[0].user.name.first.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
							login.info.lastName = data.results[0].user.name.last.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
							login.info.email = data.results[0].user.email;

							defer.resolve({ info: login.info });
						})
						.error(function(data, status) {
							defer.reject();
						});
				}
				else
				{
					login.info.token = null;

					defer.resolve({ info: login.info });
				}

				return defer.promise;
			},

			message: function(text)
			{
				$rootScope.login.message = text;
			},

			out: function()
			{
				login.info.token = null;
				login.info.avatar = null;
				login.info.firstName = 'Unknown';
				login.info.lastName = '';
				login.info.email = '';
			},

			info: {
				token: null,
				avatar: null,
				firstName: 'Unknown',
				lastName: '',
				email: ''
			}

		};
		return login;
	})

	.factory('employees', function($http, $q) {

		var employees = {

			get: function()
			{
				var defer = $q.defer();

				if(Math.random() > 0.5)
				{
					defer.reject();
				}
				else
				{
					$http.get('http://api.randomuser.me/?results=200')
						.success(function(data, status) {
							try
							{
								defer.resolve(data.results.map(function(item) {
									return {
										identity: item.user.email,
										firstName: item.user.name.first.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();}),
										lastName: item.user.name.last.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();}),
										email: item.user.email,
										skype: item.user.username,
										phone: item.user.phone,
										jobPosition: 'job position',
										officeLocation: item.user.location.city.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();}),
										avatar: item.user.picture.thumbnail
									};
								}));
							}
							catch(error)
							{
								defer.reject();
							}
						})
						.error(function(data, status) {
							defer.reject();
						});
				}

				return defer.promise;
			},

			load: function(identity)
			{
				var defer = $q.defer();

				$http.get('http://api.randomuser.me/')
					.success(function(data, status) {
						try
						{
							defer.resolve({
								identity: data.results[0].user.email,
								avatar: data.results[0].user.picture.medium,
								firstName: data.results[0].user.name.first.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();}),
								lastName: data.results[0].user.name.last.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();}),
								email: data.results[0].user.email,
								skype: data.results[0].user.username,
								phone: data.results[0].user.phone,
								jobPosition: 'job position',
								officeLocation: data.results[0].user.location.city.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();})
							});
						}
						catch(error)
						{
							defer.reject();
						}
					})
					.error(function(data, status) {
						defer.reject();
					});

				return defer.promise;
			}

		};
		return employees;
	});
