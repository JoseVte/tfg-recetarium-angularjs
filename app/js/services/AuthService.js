var authServices = angular.module('AuthServices', ['ngResource']);

authServices.factory('AuthService',
    ['$http', '$rootScope', '$timeout', 'envService', '$q',
    function ($http, $rootScope, $timeout, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl'),
            OK: 200,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403
        };

        service.Login = function (email, password, expiration, callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/auth/login',
                { email: email, password: password, setExpiration: expiration },
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.Register = function (user, callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/auth/register',
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
                if (!$rootScope.globals.user.setExpiration) return true;
                var params = service.ParseJwt(token);
                if (Math.round(new Date().getTime() / 1000) <= params.exp) {
                    return true;
                } else {
                    service.ClearCredentials();
                    return false;
                }
            } else {
                return false;
            }
        };

        service.IsAnonymous = function() {
            var deferred = $q.defer();
            if (service.GetJwt() == null) deferred.resolve(service.OK);
            else deferred.reject(service.FORBIDDEN);
            return deferred.promise;
        };

        service.IsAuthenticated = function() {
            var deferred = $q.defer();
            if (service.IsAuthed()) deferred.resolve(service.OK);
            else deferred.reject(service.UNAUTHORIZED);
            return deferred.promise;
        };

        return service;
    }]
);
