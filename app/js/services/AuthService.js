var authServices = angular.module('AuthServices', ['ngResource']);

authServices.factory('AuthService',
    ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {
        var service = {};

        service.Login = function (email, password, callbackOk, callbackError) {
            $http.post(
                'http://localhost:9000/auth/login',
                { email: email, password: password },
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        return service;
    }]
);
