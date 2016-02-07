moment.locale('es');

/* jshint ignore:start */
'use strict';
/* jshint ignore:end */
var recetarium = angular.module('recetariumApp', [
    'environment',
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ngSanitize',
    'ngAnimate',
    'textAngular',
    'ui.router',
    // My Javascript
    'Animations', 'TextEditor', 'NotificationProviders',
    'FileDirectives', 'TimeDirectives', 'ValidatorDirectives',
    'HomeController',
    'AuthServices', 'AuthController',
    'RecipeServices', 'RecipeFilters', 'RecipeController',
    'CategoryServices', 'CategoryController',
    'TagServices', 'IngredientServices'
]);

// Routes
recetarium.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', { templateUrl: 'views/home.html', controller: '' })
        .when('/login', { templateUrl: 'views/auth/login.html', controller: 'Login', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }],}})
        .when('/logout', { template: '', controller: 'Logout', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }],}})
        .when('/register', { templateUrl: 'views/auth/register.html', controller: 'Register', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }],}})
        .when('/reset/password', { templateUrl: 'views/auth/reset-password.html', controller: 'ResetPassword', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }],}})
        .when('/reset/password/:token', { templateUrl: 'views/auth/recover-password.html', controller: 'RecoverPassword', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }],}})
        .when('/recipes', { templateUrl: 'views/recipe/index.html', controller: 'RecipeAll' })
        .when('/recipes/:slug', { templateUrl: 'views/recipe/show.html', controller: 'RecipeShow' })
        .when('/recipes/:slug/edit', { templateUrl: 'views/recipe/edit.html', controller: 'RecipeEdit', resolve: { access: ["AuthService", "$route", "$rootScope", function (AuthService, $route, $rootScope) { $rootScope.progressBarActivated = true; return AuthService.IsMyRecipe($route.current.params.slug); }], }})
        .when('/new-recipe', { templateUrl: 'views/recipe/create.html', controller: 'RecipeCreate', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }],}})
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
                        $location.path('/unauthorized');
                    } else {
                        $location.path('/login');
                    }
                }
                return $q.reject(response);
            }
        };
    });
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
recetarium.run(function ($rootScope, $location, $http, AuthService, ICONS) {
    var authRegex = /\/login|\/register|\/reset\/password.*/
    $rootScope.location = $location;
    $rootScope.lastSearchParams = [];
    $rootScope.lastSearchParams['/recipes'] = {
        page: 1,
        size: 10
    };

    if (localStorage.globals) {
        $rootScope.globals = JSON.parse(localStorage.globals);
        // TODO
        //AuthService.CheckToken($rootScope.globals.token);
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
        // Auth header
        $http.defaults.headers.common['X-Auth-Token'] = $rootScope.globals.token;
        var $path = $location.path();

        $rootScope.IsAuthed = AuthService.IsAuthed();
        $rootScope.IsHome = ($path == '/');
        $rootScope.HasBack = false;
        $rootScope.errorMsg = false;
        $rootScope.progressBarActivated = false;

        if ($rootScope.lastSearchParams[$path]) {
            $location.search($rootScope.lastSearchParams[$path]);
        }

        // Remove the params into URI
        if ($path !== '/recipes') {
            $location.search({});
        }

        switch (true) {
            case (authRegex).test($path):
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
                break;
        }
    });

    $rootScope.$on('$viewContentLoaded', function () {
        // Scroll to top
        $("html, body").animate({ scrollTop: 0 }, "slow");

        $('.md-editor-toolbar').exists(function() {
            $('.md-editor-toolbar button').each(function() {
                var $this = $(this);
                $this.append('<div class="md-ripple-container"></div>');
                $this.children('.material-icons').replaceWith('<md-icon class="material-icons md-dark">'+ICONS[$this.attr('name')]+'</md-icon>');
            });
        });

        $('.fancybox').fancybox();
        $('.lolliclock-duration').lolliclock({
            hour24: true
        });

        $('.input-file-material').exists(function () {
            $(document).on('change', '.input-file-material', function () {
                $('.md-textfield-input').val(this.files[0].name);
            });
        });

        $('.md-ink-item').exists(function () {
            $(document).on('click', '.md-ink-item', function (e) {
                var $this = $(this);
                if ($this.find('.md-ink').length === 0) {
                    $this.prepend('<span class="md-ink"></span>');
                }
                var ink = $this.find('.md-ink');
                ink.removeClass('animate');
                if (!ink.height() && !ink.width()) {
                    var d = Math.max($this.outerWidth(), $this.outerHeight());
                    ink.css({
                        height: d,
                        width: d
                    });
                }

                var x = e.pageX - $this.offset().left - ink.width() / 2;
                var y = e.pageY - $this.offset().top - ink.height() / 2;
                ink.css({
                    top: y + 'px',
                    left: x + 'px',
                }).addClass('animate');
            });
        });
    });
});

// Function extras
String.prototype.trunc = function(n, useWordBoundary){
    var isTooLong = this.length > n,
    s_ = isTooLong ? this.substr(0,n-1) : this.substr(0,this.length);
    s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  isTooLong ? s_ + '&hellip;' : s_;
};

$.fn.exists = function(callback) {
    var args = [].slice.call(arguments, 1);
    if (this.length) {
        callback.call(this, args);
    }
    return this;
};

$.containsId = function(el, array) {
    var i = array.length;
    while (i--) {
       if (array[i].id === el.id) { return true; }
    }
    return false;
};

$.getArrayId = function(array) {
    var a = [];
    for (var el in array) {
        array[el].id && a.push(array[el].id);
    }
    return a;
};

$.parseError = function(error) {
    var msg = '';
    if (angular.isArray(error)) {
        msg += '<ul>';
        for (var i in error) {
            msg += '<li>' + $.parseError(error[i]) + '</li>';
        }
        msg += '</ul>';
    } else if (angular.isObject(error)) {
        for (var field in error) {
            msg += '<ul>';
            msg += '<li>' + field + '</li>' + $.parseError(error[field]);
            msg += '</ul>';
        }
    } else {
        msg += error;
    }
    return msg;
};
