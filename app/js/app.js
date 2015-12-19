'use strict';

var recetarium = angular.module('recetariumApp', [
    'environment',
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ngSanitize',
    'ui.router',
    'HomeController',
    'AuthServices',
    'AuthController',
    'RecipeServices',
    'RecipeController'
]);

// Routes
recetarium.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //$locationProvider.hashPrefix(); // Removes index.html in URL
    $routeProvider
        .when('/', { templateUrl: 'views/home.html', controller: ''})
        .when('/login', { templateUrl: 'views/auth/login.html', controller: 'Login' })
        .when('/logout', { template: '', controller: 'Logout' })
        .when('/register', { templateUrl: 'views/auth/register.html', controller: 'Register' })
        .when('/recipes', { templateUrl: 'views/recipe/index.html', controller: 'RecipeAll' })
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

// Environment configuration
recetarium.config(['envServiceProvider', function (envServiceProvider) {
    envServiceProvider.config({
        domains: {
            development: ['localhost', '127.0.0.1'],
            production: ['recetarium-angular.herokuapp.com']
        },
        vars: {
            development: {
                apiUrl: 'http://localhost:9000'
            },
            production: {
                apiUrl: 'https://recetarium.herokuapp.com'
            }
        }
    });
    envServiceProvider.check();
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
        } else if (($location.path() !== '/login' && $location.path() !== '/register' && $location.path() !== '/' && $location.path() !== '/recipes') && !token) {
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

// Function extras
String.prototype.trunc = function( n, useWordBoundary ){
    var isTooLong = this.length > n,
    s_ = isTooLong ? this.substr(0,n-1) : this;
    s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  isTooLong ? s_ + '&hellip;' : s_;
};
