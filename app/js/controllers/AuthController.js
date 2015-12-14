var authController = angular.module('AuthController', []);

authController.controller('Login',
    ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
        $rootScope.headerTitle = 'Login';

        $scope.login = function () {
            $scope.dataLoading = true;
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
                }
                $scope.dataLoading = false;
            });
        };
    }]
);

authController.controller('Register',
    ['$scope', '$rootScope','$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
        $rootScope.headerTitle = 'Registro';

        $scope.register = function () {
            $scope.dataLoading = true;
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
                        $scope.customErrorRegisterUsername = username;
                        $('#customErrorRegisterUsername').removeClass('hide');
                    }

                    var email = response.data.email;
                    if (email) {
                        $scope.customErrorRegisterEmail = email;
                        $('#customErrorRegisterEmail').removeClass('hide');
                    }

                    var password = response.data.password;
                    if (password) {
                        $scope.customErrorRegisterPassword = password;
                        $('#customErrorRegisterPassword').removeClass('hide');
                    }

                    var passwordRepeat = response.data.passwordRepeat;
                    if (passwordRepeat) {
                        $scope.customErrorRegisterPasswordRepeat = passwordRepeat;
                        $('#customErrorRegisterPasswordRepeat').removeClass('hide');
                    }
                } else {
                    $scope.customErrorRegister = response.data.error;
                    $('#customErrorRegister').removeClass('hide');
                }
                $scope.dataLoading = false;
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
