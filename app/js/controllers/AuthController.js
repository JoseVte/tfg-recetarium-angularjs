var authController = angular.module('AuthController', []);

authController.controller('Login',
    ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
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

authController.controller('Logout',
    ['$scope', '$location', 'AuthService',
    function ($scope,$location, AuthService) {
        AuthService.ClearCredentials();
        $location.path('/');
    }]
);
