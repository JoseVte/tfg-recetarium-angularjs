var authServices = angular.module('AuthServices', ['ngResource']);

authServices.factory('AuthService',
    ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {
        var service = {};

        service.Login = function (email, password, callbackOk, callbackError) {
            $http.post(
                'https://recetarium.herokuapp.com/auth/login',
                { email: email, password: password },
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.Register = function (user, callbackOk, callbackError) {
            $http.post(
                'https://recetarium.herokuapp.com/auth/register',
                user, { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.SaveCredentials = function (token, user) {
            $rootScope.globals = {
                token: token,
                user: user,
            };

            localStorage.globals = JSON.stringify($rootScope.globals);
        };

        service.ClearCredentials = function () {
            $rootScope.globals = {};
            localStorage.removeItem('globals');
        };

        service.ParseJwt = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(atob(base64));
        };

        service.GetJwt = function() {
            if ($rootScope.globals) return $rootScope.globals.token;
            else return null;
        };

        service.IsAuthed = function() {
            var token = service.GetJwt();
            if (token) {
                var params = service.ParseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        };

        return service;
    }]
);
