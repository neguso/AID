angular.module('app.controllers', ['app.services'])

	.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $ionicLoading, $ionicHistory, login) {

		$scope.user = login.info;
		$scope.onlogin = doLogin;
		$scope.onlogout = doLogout;


		function doLogin()
		{
			login.show(function() { // close
					login.hide();
				},
				function() { // login
					$ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
					login.call()
						.then(function(result) {
							$ionicLoading.hide();

							if(result.info === null)
							{
								login.message('Invalid credentials');
							}
							else
							{
								login.hide();

								$scope.$broadcast('$login.in');
							}
						})
						.catch(function(error) {
							$ionicLoading.hide();

							login.message('Check your connection and try again.\n' + JSON.stringify(error));
						});
				});
		}

		function doLogout()
		{
			login.out();

			$ionicHistory.clearHistory();
			$ionicHistory.nextViewOptions({ disableBack: true });
			if($ionicHistory.currentStateName() === 'app.employees')
				$rootScope.$broadcast('$login.out');
			else
				$state.go('app.employees');
		}


		$scope.$on('$login.request', function() {
			doLogin();
		});
	})

	.controller('StartCtrl', function($scope, $ionicHistory, $state, $timeout) {

			$scope.model = {
				state: null, // loading, error

				loading: {
					message: 'loading...'
				},
				error: {
					message: 'Check your connection and try again.',
					retry: error_retry
				}
			};


			function load()
			{
				$scope.model.state = 'loading';
				$timeout(function() {

					if(Math.random() > 0.5)
					{
						$scope.model.state = 'error';
					}
					else
					{
						// login with saved token
						//$scope.user.token = 'xxx';
						//$scope.user.firstName = 'Ovidiu';
						//$scope.user.lastName = 'Negus';
						//$scope.user.email = 'ovidiu.negus@accesa.eu';

						$ionicHistory.nextViewOptions({ disableBack: true });
						$state.go('app.employees');
					}

				}, 1000);
			}

			function error_retry()
			{
				load();
			}


			$scope.$on('$ionicView.enter', function() {
				load();
			});
	})

	.controller('EmployeesCtrl', function($scope, $ionicLoading, login, employees) {

		$scope.model = {
			state: null,	// unauthorized, loading, error, ready

			unauthorized: {
				message: 'Authentication required, please login.',
				login: unauthorized_login
			},

			loading: {
				message: 'loading...'
			},

			error: {
				message: 'Check your connection and try again.',
				retry: error_retry
			},

			ready: {
				employees: []
			}

		};


		function unauthorized_login()
		{
			$scope.$emit('$login.request');
		}

		function load()
		{
			$scope.model.state = 'loading';
			employees.get()
				.then(function(result) {
					$scope.model.state = 'ready';
					$scope.model.ready.employees = result;
				})
				.catch(function(error) {
					$scope.model.state = 'error';
				});
		}

		function error_retry()
		{
			load();
		}


		$scope.$on('$ionicView.enter', function() {
			if(login.info.token === null)
			{
				$scope.model.state = 'unauthorized';
			}
			else
			{
				if($scope.model.state === 'loading' || $scope.model.state === 'ready') {
					// do nothing
				}
				else {
					load();
				}
			}
		});

		$scope.$on('$login.in', function() {
			load();
		});

		$scope.$on('$login.out', function() {
			$scope.model.state = 'unauthorized';
		});
	})

	.controller('EmployeeCtrl', function($scope, $stateParams, employees) {

			$scope.model = {
				state: null,	// loading, error, ready

				loading: {
					message: 'loading...'
				},

				error: {
					message: 'Check your connection and try again.',
					retry: error_retry
				},

				ready: {
					employee: null
				}
			};

		function load()
		{
			$scope.model.state = 'loading';
			employees.load($stateParams.id)
				.then(function(result) {
					$scope.model.state = 'ready';
					$scope.model.ready.employee = result;
				})
				.catch(function(error) {
					$scope.model.state = 'error';
				});
		}

		function error_retry()
		{
			load();
		}

		$scope.$on('$ionicView.enter', function() {
			load();
		});

	})

	.controller('OfficesCtrl', function($scope) {

		$scope.model = {
			state: null,	// loading, error, ready

			loading: {
				message: 'loading...'
			},

			error: {
				message: 'Check your connection and try again.',
				retry: error_retry
			},

			ready: {

			}


		};


		function load()
		{

		}

		function error_retry()
		{

		}


		$scope.$on('$ionicView.enter', function() {

		});

	});
