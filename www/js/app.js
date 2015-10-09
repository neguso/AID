angular.module('starter', ['ionic', 'app.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
		.state('app', { url: "/app", abstract: true, templateUrl: "templates/menu.html", controller: 'AppCtrl' })
		.state('app.start', { url: "/start", views: { 'menuContent': { templateUrl: "templates/start.html", controller: 'StartCtrl' } } })
		.state('app.employees', { url: "/employees", views: { 'menuContent': { templateUrl: "templates/employees.html", controller: 'EmployeesCtrl' } } })
		.state('app.employee', { url: "/employee/:id", views: { 'menuContent': { templateUrl: "templates/employee.html", controller: 'EmployeeCtrl' } } })
		.state('app.offices', { url: "/offices", views: { 'menuContent': { templateUrl: "templates/offices.html", controller: 'OfficesCtrl' } } })
		;

  $urlRouterProvider.otherwise('/app/start');
});

// globals

String.prototype.interpolate = function(props) {
	return this.replace(/\{(\w+)\}/g, function(match, expr) {
		return (props || window)[expr];
	});
};