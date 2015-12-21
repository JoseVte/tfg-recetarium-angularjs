'use strict';

var recetarium = angular.module('recetariumApp', [
    'environment',
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ngSanitize',
    'ngAnimate',
    'ui.router',
    'Animations',
    'NotificationProviders',
    'HomeController',
    'AuthServices',
    'AuthController',
    'RecipeServices',
    'RecipeFilters',
    'RecipeController'
]);

// Routes
recetarium.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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

    // Middleware
    $httpProvider.interceptors.push(function ($q, $location) {
        return {
            response: function (response) {
                return response;
            },
            responseError: function (response) {
                if (response.status === 401) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        }
    })
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
        }

        switch ($location.path()) {
            case '/login':
            case '/register':
                $rootScope.tabColor = '#00BFA5';
                $rootScope.headerTheme = 'header-theme-auth';
                $rootScope.bodyTheme = 'body-theme-auth';
                break;
            default:
                $rootScope.tabColor = '#DD2C00';
                $rootScope.headerTheme ='header-theme-default';
                $rootScope.bodyTheme = 'body-theme-default';
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

String.prototype.splitRecipe = function() {
    return {
        ingredients: $($(this)[0]).html(),
        steps: $($(this)[1]).html()
    };
}
