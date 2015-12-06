var authController = angular.module('AuthController', []);

authController.controller('Login',
    ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthService.Login($scope.email, $scope.password, function (response) {
                console.log(response);
                $location.path('#/');
            }, function (response) {
                console.error(response);
                $scope.dataLoading = false;
            });
        };
    }]
);
