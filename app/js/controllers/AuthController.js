var authController = angular.module('AuthController', []);

authController.controller('Login',
    ['$scope', '$rootScope', '$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Login';
        $rootScope.progressBarActivated = false;

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
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            AuthService.Login($scope.email, $scope.password, function (response) {
                AuthService.SaveCredentials(response.data.auth_token,
                    JSON.parse(AuthService.ParseJwt(response.data.auth_token).sub));
                $location.path('/');
            }, function (response) {
                $('#customErrorLogin').addClass('hide');
                $('#customErrorLoginEmail').addClass('hide');
                $('#customErrorLoginPassword').addClass('hide');

                if (response.status == 401) {
                    $scope.customErrorLogin = "El email o la contraseña son incorrectos";
                    $('#customErrorLogin').removeClass('hide');
                } else if (response.status == 400) {
                    var email = response.data.email;
                    if (email) {
                        $scope.customErrorLoginEmail = email;
                        $('#customErrorLoginEmail').removeClass('hide');
                    }

                    var password = response.data.password;
                    if (password) {
                        $scope.customErrorLoginPassword = password;
                        $('#customErrorLoginPassword').removeClass('hide');
                    }
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo mas tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome',
                    });
                    $('.ui-pnotify-icon .material-icons').html('warning');
                }
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
        $rootScope.progressBarActivated = false;

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
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            var user = {
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                passwordRepeat: $scope.passwordRepeat,
                first_name: $scope.first_name,
                last_name: $scope.last_name
            };
            AuthService.Register(user, function (response) {
                AuthService.SaveCredentials(response.data.auth_token,
                    JSON.parse(AuthService.ParseJwt(response.data.auth_token).sub));
                $location.path('/');
            }, function (response) {
                $('#customErrorRegister').addClass('hide');
                $('#customErrorRegisterUsername').addClass('hide');
                $('#customErrorRegisterEmail').addClass('hide');
                $('#customErrorRegisterPassword').addClass('hide');
                $('#customErrorRegisterPasswordRepeat').addClass('hide');

                if (response.status == 400) {
                    var username = response.data.username;
                    if (username) {
                        $scope.customErrorRegisterUsername = '';
                        for (var i = 0; i < username.length; i++) {
                            $scope.customErrorRegisterUsername += username[i] + '\n'
                        }
                        $('#customErrorRegisterUsername').removeClass('hide');
                    }

                    var email = response.data.email;
                    if (email) {
                        $scope.customErrorRegisterEmail = '';
                        for (var i = 0; i < email.length; i++) {
                            $scope.customErrorRegisterEmail += email[i] + '\n'
                        }
                        $('#customErrorRegisterEmail').removeClass('hide');
                    }

                    var password = response.data.password;
                    if (password) {
                        $scope.customErrorRegisterPassword = '';
                        for (var i = 0; i < password.length; i++) {
                            $scope.customErrorRegisterPassword += password[i] + '\n'
                        }
                        $('#customErrorRegisterPassword').removeClass('hide');
                    }

                    var passwordRepeat = response.data.passwordRepeat;
                    if (passwordRepeat) {
                        $scope.customErrorRegisterPasswordRepeat = '';
                        for (var i = 0; i < passwordRepeat.length; i++) {
                            $scope.customErrorRegisterPasswordRepeat += passwordRepeat[i] + '\n'
                        }
                        $('#customErrorRegisterPasswordRepeat').removeClass('hide');
                    }
                } else {
                    $scope.customErrorRegister = response.data.error;
                    $('#customErrorRegister').removeClass('hide');
                }
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        }
    }]
);

authController.controller('Logout',
    ['$scope', '$location', 'AuthService',
    function ($scope,$location, AuthService) {
        AuthService.ClearCredentials();
        $location.path('/');
    }]
);
