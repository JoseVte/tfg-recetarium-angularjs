'use strict';

var recetarium = angular.module('recetariumApp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
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
        .when('/logout', { template: '', controller: 'Logout' })
        .when('/register', { templateUrl: 'views/auth/register.html', controller: 'Register' })
        .otherwise({ redirectTo: '/' });
}]);

// CORS configuration
recetarium.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

// Themes
recetarium.config(['$mdThemingProvider', function($mdThemingProvider) {
    //
}]);

//
recetarium.run(function ($rootScope, $location, $http, AuthService) {
    $rootScope.location = $location;

    if (localStorage.globals) {
        $rootScope.globals = JSON.parse(localStorage.globals);
    } else {
        $rootScope.globals = {};
    }

    $rootScope.$on('$locationChangeStart', function (ev, next, current) {
        $rootScope.IsAuthed = AuthService.IsAuthed();
        $rootScope.IsHome = ($location.path() == '/');

        var token = $rootScope.globals.token;

        if (token && $location.path() === '/login' && $location.path() === '/register') {
            //Redirect to home if logged in
            $location.path('/');
        } else if (($location.path() !== '/login' && $location.path() !== '/register' && $location.path() !== '/') && !token) {
            //Redirect if not logged in
            $location.path('/login');
        }

        switch ($location.path()) {
            case '/login':
            case '/register':
                $rootScope.headerTheme ='header-theme-auth';
                break;
            default:
                $rootScope.headerTheme ='default-theme-auth';
        }
    });
});
