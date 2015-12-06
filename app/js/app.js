'use strict';

var recetarium = angular.module('recetariumApp', [
    'ngRoute',
    'ngMaterial',
    'ui.router',
    'HomeController',
    'AuthServices',
    'AuthController',
]);

// Routes
recetarium.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //$locationProvider.hashPrefix(); // Removes index.html in URL
    $routeProvider
        .when('/', { templateUrl: 'views/home.html', controller: ''})
        .when('/login', { templateUrl: 'views/auth/login.html', controller: 'Login' })
        .otherwise({ redirectTo: '/' });
}]);

recetarium.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
