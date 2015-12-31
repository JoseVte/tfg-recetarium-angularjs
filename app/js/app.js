moment.locale('es');

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
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', { templateUrl: 'views/home.html', controller: '' })
        .when('/login', { templateUrl: 'views/auth/login.html', controller: 'Login', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }],}})
        .when('/logout', { template: '', controller: 'Logout', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticathed(); }],}})
        .when('/register', { templateUrl: 'views/auth/register.html', controller: 'Register', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }],}})
        .when('/recipes', { templateUrl: 'views/recipe/index.html', controller: 'RecipeAll' })
        .when('/recipes/:slug', { templateUrl: 'views/recipe/show.html', controller: 'RecipeShow' })
        .when('/new-recipe', { templateUrl: 'views/recipe/create.html', controller: 'RecipeCreate', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticathed(); }],}})
        .when('/unauthorized', { templateUrl: 'views/error/401.html', controller: '' })
        .when('/forbidden', { templateUrl: 'views/error/403.html', controller: '' })
        .otherwise({ redirectTo: '/' });
}]);

// CORS configuration
recetarium.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Middleware
    $httpProvider.interceptors.push(function ($q, $location, $rootScope) {
        return {
            response: function (response) {
                return response;
            },
            responseError: function (response) {
                if (response.status === 401) {
                    if ($rootScope.globals.token) {
                        $location.path('/unauthorized')
                    } else {
                        $location.path('/login');
                    }
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
    $rootScope.lastSearchParams = [];
    $rootScope.lastSearchParams['/recipes'] = {
        page: 1,
        size: 10
    };

    if (localStorage.globals) {
        $rootScope.globals = JSON.parse(localStorage.globals);
    } else {
        $rootScope.globals = {};
    }

    $rootScope.$on('$routeChangeError', function (ev, next, current, rejection) {
        if (rejection == AuthService.UNAUTHORIZED) {
            $location.path("/login");
        } else if (rejection == AuthService.FORBIDDEN) {
            $location.path("/forbidden");
        }
    });

    $rootScope.$on('$locationChangeStart', function (ev, next, current, rejection) {
        $rootScope.IsAuthed = AuthService.IsAuthed();
        $rootScope.IsHome = ($location.path() == '/');
        $rootScope.HasBack = false;

        if ($rootScope.lastSearchParams[$location.path()]) {
            $location.search($rootScope.lastSearchParams[$location.path()]);
        }

        // Remove the params into URI
        if ($location.path() !== '/recipes') {
            $location.search({});
        }

        switch ($location.path()) {
            case '/login':
            case '/register':
                $rootScope.tabColor = '#00BFA5';
                $rootScope.headerTheme = 'header-theme-auth';
                $rootScope.loaderTheme = 'md-auth';
                $rootScope.bodyTheme = 'body-theme-auth';
                break;
            default:
                $rootScope.tabColor = '#DD2C00';
                $rootScope.headerTheme ='header-theme-default';
                $rootScope.loaderTheme = 'md-default';
                $rootScope.bodyTheme = 'body-theme-default';
        }
    });
});

// Function extras
String.prototype.trunc = function(n, useWordBoundary){
    var isTooLong = this.length > n,
    s_ = isTooLong ? this.substr(0,n-1) : this;
    s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  isTooLong ? s_ + '&hellip;' : s_;
};

$(document).ready(function () {
    $('.fancybox').fancybox();
});
