var authController = angular.module('AuthController', []);

authController.controller('Login',
    ['$scope', '$rootScope', '$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Login';

        $scope.setDelay1 = function(){
            $scope.delay1 = true;
            $scope.delay2 = true;
            $timeout(function(){
                $scope.delay1 = false;
            }, 1000);
        };

        $scope.setDelay2 = function(){
            $timeout(function(){
                $scope.delay2 = false;
            }, 1000);
        };

        $scope.login = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            AuthService.Login($scope.email, $scope.password, !$scope.expiration, function (response) {
                AuthService.SaveCredentials(response.data.auth_token,
                    JSON.parse(AuthService.ParseJwt(response.data.auth_token).sub));
                $rootScope.progressBarActivated = false;
                $location.path('/');
            }, function (response) {
                if (response.status == 400 || response.status == 401) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data),
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se logueaba. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome',
                    });
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se logueaba.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('Register',
    ['$scope', '$rootScope','$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Registro';

        $scope.setDelay1 = function(){
            $scope.delay1 = true;
            $scope.delay2 = true;
            $timeout(function(){
                $scope.delay1 = false;
            }, 1000);
        };

        $scope.setDelay2 = function(){
            $timeout(function(){
                $scope.delay2 = false;
            }, 1000);
        };

        $scope.register = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            var user = {
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                password_repeat: $scope.passwordRepeat,
                first_name: $scope.first_name,
                last_name: $scope.last_name
            };
            AuthService.Register(user, function (response) {
                AuthService.SaveCredentials(response.data.auth_token,
                    JSON.parse(AuthService.ParseJwt(response.data.auth_token).sub));
                $rootScope.progressBarActivated = false;
                $location.path('/');
            }, function (response) {
                if (response.status == 400) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data),
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se registraba. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome',
                    });
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se registraba.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('Logout',
    ['$scope', '$location', 'AuthService', 'NotificationProvider',
    function ($scope,$location, AuthService, NotificationProvider) {
        NotificationProvider.notify({
            title: 'Adios :)',
            text: 'Gracias por venir. Vuelve pronto.',
            type: 'success',
            addclass: 'custom-success-notify',
            icon: 'material-icons md-light',
            styling: 'fontawesome',
        });
        $('.ui-pnotify.custom-success-notify .material-icons').html('cake');
        AuthService.ClearCredentials();
        $location.path('/');
    }]
);

authController.controller('ResetPassword',
    ['$scope', '$rootScope', '$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Recuperar contraseña';

        $scope.setDelay1 = function(){
            $scope.delay1 = true;
            $scope.delay2 = true;
            $timeout(function(){
                $scope.delay1 = false;
            }, 1000);
        };

        $scope.setDelay2 = function(){
            $timeout(function(){
                $scope.delay2 = false;
            }, 1000);
        };

        $scope.resetPassword = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.hasMessage = false;
            $scope.setDelay1();
            AuthService.ResetPassword($scope.email, function (response) {
                $scope.msg = response.data.msg;
                $scope.hasMessage = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            }, function (response) {
                if (response.status == 400 || response.status == 404) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data),
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se enviaba el email. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome',
                    });
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se enviaba el email.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            })
        }
    }]
);

authController.controller('RecoverPassword',
    ['$scope', '$rootScope', '$routeParams', '$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $routeParams, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Recuperar contraseña';

        $scope.setDelay1 = function(){
            $scope.delay1 = true;
            $scope.delay2 = true;
            $timeout(function(){
                $scope.delay1 = false;
            }, 1000);
        };

        $scope.setDelay2 = function(){
            $timeout(function(){
                $scope.delay2 = false;
            }, 1000);
        };

        $scope.recoverPassword = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.hasMessage = false;
            $scope.setDelay1();
            AuthService.RecoverPassword($scope.email, $scope.password, $routeParams.token, function (response) {
                NotificationProvider.notify({
                    title: 'Contraseña cambiada con existo',
                    text: '',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify.custom-success-notify .material-icons').html('lock');
                $rootScope.progressBarActivated = false;
                $location.path('/login');
            }, function (response) {
                if (response.status == 400) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data),
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se cambiaba la contraseña. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome',
                    });
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se cambiaba la contraseña.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            })
        }
    }]
);
