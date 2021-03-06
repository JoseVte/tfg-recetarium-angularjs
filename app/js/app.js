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
    'infinite-scroll',
    'elif',
    'pascalprecht.translate',
    'md.data.table',
    // My Javascript
    'Animations', 'Internationalization', 'TextEditor', 'AnimationDirectives',
    'CommentProviders', 'FileProviders', 'NotificationProviders', 'RatingProviders',
    'CommentServices', 'FileServices',
    'FileDirectives', 'FormDirectives', 'TimeDirectives', 'ValidatorDirectives',
    'HomeController',
    'UserServices', 'UserFilters', 'UserController',
    'AuthServices', 'AuthController',
    'RecipeServices', 'RecipeFilters', 'RecipeController',
    'CategoryServices', 'CategoryController', 'CategoryProviders',
    'TagServices', 'IngredientServices'
]);

// Routes
recetarium.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', { templateUrl: 'views/home.html', controller: 'Home' })
        // Auth
        .when('/login', { templateUrl: 'views/auth/login.html', controller: 'Login', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }]}})
        .when('/logout', { template: '', controller: 'Logout', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }]}})
        .when('/register', { templateUrl: 'views/auth/register.html', controller: 'Register', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }]}})
        .when('/reset/password', { templateUrl: 'views/auth/reset-password.html', controller: 'ResetPassword', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }]}})
        .when('/reset/password/:token', { templateUrl: 'views/auth/recover-password.html', controller: 'RecoverPassword', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }]}})
        .when('/active/:token', { templateUrl: 'views/auth/validate-email.html', controller: 'ValidateEmail', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAnonymous(); }]}})
        .when('/profile', { templateUrl: 'views/auth/profile.html', controller: 'Profile', permission: 'logged', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }]}})
        .when('/settings', { templateUrl: 'views/auth/settings.html', controller: 'Settings', permission: 'logged', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }]}})
        // Recipes
        .when('/recipes', { templateUrl: 'views/recipe/index.html', controller: 'RecipeAll' })
        .when('/recipes/:slug', { templateUrl: 'views/recipe/show.html', controller: 'RecipeShow' })
        .when('/recipes/:slug/edit', { templateUrl: 'views/recipe/edit.html', controller: 'RecipeEdit', resolve: { access: ["AuthService", "$route", "$rootScope", function (AuthService, $route, $rootScope) { $rootScope.progressBarActivated = true; return AuthService.IsMyRecipe($route.current.params.slug); }]}})
        .when('/new-recipe', { templateUrl: 'views/recipe/create.html', controller: 'RecipeCreate', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }]}})
        // Users
        .when('/users', { templateUrl: 'views/user/index.html', controller: 'UserAll', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }]}})
        .when('/users/:id', { templateUrl: 'views/user/show.html', controller: 'UserShow', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }]}})
        .when('/friends', { templateUrl: 'views/user/index.html', controller: 'FriendAll', resolve: { access: ["AuthService", function (AuthService) { return AuthService.IsAuthenticated(); }]}})
        // Admin - Categories
        .when('/categories', { templateUrl: 'views/categories/index.html', controller: 'CategoryAll', resolve: { access: ["AuthService", function (AuthService) { return AuthService.isAdmin(); }]}})
        // Errores
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
                    if ($rootScope.globals.token && !!$rootScope.IsAuthed) {
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
                apiUrl: 'http://localhost:9000',
                pusherLog: true,
            },
            production: {
                apiUrl: 'https://recetarium.herokuapp.com',
                pusherLog: false,
            }
        }
    });
    envServiceProvider.check();
}]);

//
recetarium.run(function ($rootScope, $location, $http, AuthService, NotificationProvider, envService, ICONS) {
    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500);
    var authRegex = /\/login|\/register|\/active.*|\/reset\/password.*/;
    var profileRegex = /\/profile.*|\/settings.*/;
    var userRegex = /\/users.*|\/friends/;
    var adminRegex = /\/categories/;
    $rootScope.location = $location;
    $rootScope.searchString = '';

    // Enable pusher logging
    Pusher.logToConsole = envService.read('pusherLog');

    if (localStorage.globals) {
        $rootScope.globals = JSON.parse(localStorage.globals);
        $http.defaults.headers.common['X-Auth-Token'] = $rootScope.globals.token;
        AuthService.CheckToken($rootScope.globals.user);
        AuthService.StartCronCheckToken();
    } else {
        $rootScope.globals = {};
    }

    $(document).on('click', '.no-implemented', function (e) {
        e.preventDefault();
        e.stopPropagation();
        NotificationProvider.notify({
            title: 'No implementado',
            text: 'Esta opcion esta en desarrollo y sera aplicada posteriormente.',
            type: 'error',
            addclass: 'custom-error-notify',
            icon: 'material-icons md-light',
            icon_class: 'update',
            styling: 'fontawesome'
        });
    });

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
        $rootScope.isAdmin = AuthService.isAdmin();
        if ($rootScope.IsAuthed) {
            $rootScope.userLogged = $rootScope.globals.user;
        }
        $rootScope.IsHome = ($path == '/');
        $rootScope.IsRecipeListPage = ($path == '/recipes');
        $rootScope.IsUserListPage = ($path == '/users' || $path == '/friends');
        $rootScope.scrollInTop = $rootScope.IsHome;
        $rootScope.HasBack = false;
        $rootScope.errorMsg = false;
        $rootScope.progressBarActivated = false;

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
                $rootScope.htmlTheme = 'html-theme-auth';
                break;
            case (profileRegex).test($path):
                $rootScope.tabColor = '#304FFE';
                $rootScope.headerTheme = 'header-theme-profile';
                $rootScope.loaderTheme = 'md-profile';
                $rootScope.bodyTheme = 'body-theme-profile';
                $rootScope.htmlTheme = 'html-theme-profile';
                break;
            case (userRegex).test($path):
                $rootScope.tabColor = '#FFC107';
                $rootScope.headerTheme = 'header-theme-user';
                $rootScope.loaderTheme = 'md-user';
                $rootScope.bodyTheme = 'body-theme-user';
                $rootScope.htmlTheme = 'html-theme-user';
                break;
            case (adminRegex).test($path):
                $rootScope.tabColor = '#03acac';
                $rootScope.headerTheme = 'header-theme-admin';
                $rootScope.loaderTheme = 'md-admin';
                $rootScope.bodyTheme = 'body-theme-admin';
                $rootScope.htmlTheme = 'html-theme-admin';
                break;
            default:
                $rootScope.tabColor = '#DD2C00';
                $rootScope.headerTheme ='header-theme-default';
                $rootScope.loaderTheme = 'md-default';
                $rootScope.bodyTheme = 'body-theme-default';
                $rootScope.htmlTheme = 'html-theme-default';
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
                    left: x + 'px'
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

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) { return true; }
    }
    return false;
};

Array.prototype.removeItem = function(item) {
    var index = this.indexOf(item);
    if (index > -1) {
        return this.splice(item, 1);
    }
    return this;
};

Array.prototype.getById = function(id) {
    var i = this.length;
    while (i--) {
        if (this[i] !== undefined && this[i] !== null && this[i].id === id) { return this[i]; }
    }
    return null;
};

Array.prototype.getByIdWithParent = function(id) {
    return $.getByIdWithParent(this, id);
};

Array.prototype.setById = function(id, data) {
    var object = this.getByIdWithParent(id);
    if (object !== undefined && object !== null && object.id === id) {
        object = data;
        return object;
    }
    return null;
};

Array.prototype.removeById = function(id) {
    var i = this.length;
    while (i--) {
        if (this[i] !== undefined && this[i] !== null && this[i].id === id) { return this.splice(i, 1); }
    }
    return null;
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
       if (array[i] !== undefined && array[i] !== null && array[i].id === el.id) { return true; }
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

$.getArrayText = function(array) {
    var a = [];
    for (var el in array) {
        array[el].text && a.push(array[el].text);
    }
    return a;
};

$.getByIdWithParent = function(array, id) {
    if (array) {
        for (var i = 0; i < array.length; i++) {
            var object = array.getById(id);
            if (object !== null) {
                return object;
            }
            object = $.getByIdWithParent(array[i].replies, id);
            if (object) return object;
        }
    }
};

$.parseError = function(error) {
    var msg = '';
    if (angular.isArray(error)) {
        msg += '<ul>';
        for (var i in error) {
            if (error.hasOwnProperty(i)) {
                msg += '<li>' + $.parseError(error[i]) + '</li>';
            }
        }
        msg += '</ul>';
    } else if (angular.isObject(error)) {
        for (var field in error) {
            if (field === 'error') {
                msg += '<ul><li>' + error[field] + '</li></ul>';
            } else {
                msg += '<ul>';
                msg += '<li>' + field + '</li>' + $.parseError(error[field]);
                msg += '</ul>';
            }
        }
    } else {
        msg += error;
    }
    return msg;
};

$.calcHeightDesktop = function(x) {
    // (((-3)) / 15625 * x^(3)) + (18 / 625 * x^(2)) - (49 / 25 * x) + 400
    return (((-3)) / 15625 * x*x*x) + (18 / 625 * x*x) - (49 / 25 * x) + 400;
};

$.calcHeightTablet = function(x) {
    // (((-3)) / 15625 * x^(3)) + (18 / 625 * x^(2)) - (49 / 25 * x) + 300
    return (((-3)) / 15625 * x*x*x) + (18 / 625 * x*x) - (49 / 25 * x) + 300;
};

$.calcHeightMobile = function(x) {
    // (((-3)) / 15625 * x^(3)) + (18 / 625 * x^(2)) - (49 / 25 * x) + 200
    return (((-3)) / 15625 * x*x*x) + (18 / 625 * x*x) - (49 / 25 * x) + 200;
};

$.scrollbarWidth = function() {
    var parent, child, width;
    if(width===undefined) {
        parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
        child = parent.children();
        width=child.innerWidth()-child.height(99).innerWidth();
        parent.remove();
    }
    return width;
};

$.getFullName = function(user) {
    var name = '';
    if (!!user) {
        if (!!user.first_name) {
            name += user.first_name;
        }
        if (user.last_name) {
            name += ' ' + user.last_name;
        }
        if (name === '') {
            return user.username;
        }
        return name;
    }
    return name;
};

function nl2br (str, isXhtml) {
    var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br ' + '/>' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
