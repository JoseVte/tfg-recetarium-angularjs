var authServices = angular.module('AuthServices', ['ngResource']);

authServices.factory('AuthService',
    ['$http', '$rootScope', '$timeout', '$interval', 'envService', '$q',
    function ($http, $rootScope, $timeout, $interval, envService, $q) {
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

        service.ResetPassword = function (email, callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/auth/reset/password',
                { email: email },
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.RecoverPassword = function (email, password, token, callbackOk, callbackError) {
            $http.put(
                service.apiUrl + '/auth/reset/password',
                { email: email, password: password, token: token },
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.ValidateEmail = function (token, callbackOk, callbackError) {
            $http.put(
                service.apiUrl + '/auth/active',
                { token: token },
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.GetProfile = function (callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/profile',
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.EditProfile = function (user, callbackOk, callbackError) {
            $http.put(
                service.apiUrl + '/profile',
                user,
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.getFriends = function (user, params, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/users/' + user.id + '/friends',
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    params: params
                }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.SaveCredentials = function (token, user) {
            $rootScope.globals = {
                token: token,
                user: user
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

        service.CheckToken = function (user) {
            $http.post(
                service.apiUrl + '/auth/check',
                { email: user.email, expiration: $rootScope.globals.user.setExpiration },
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                service.SaveCredentials(response.data.auth_token, JSON.parse(service.ParseJwt(response.data.auth_token).sub));
            }, function (response) {
                if (response.status == 401) {
                    service.ClearCredentials();
                } else {
                    console.error(response.status);
                }
            });
        };

        service.StartCronCheckToken = function() {
            $rootScope.cronToken = $interval(function () {
                service.CheckToken($rootScope.globals.user.user);
            }, 1000 * 30 * 60); // 30 min
        };

        service.StopCronCheckToken = function () {
            if (angular.isDefined($rootScope.cronToken)) {
                $interval.cancel($rootScope.cronToken);
            }
        };

        /**
         * @return {object}
         */
        service.GetJwt = function() {
            if ($rootScope.globals) return $rootScope.globals.token;
            else return null;
        };

        /**
         * @return {boolean}
         */
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
            if (service.GetJwt() === (null || undefined)) deferred.resolve(service.OK);
            else deferred.reject(service.FORBIDDEN);
            return deferred.promise;
        };

        service.IsAuthenticated = function() {
            var deferred = $q.defer();
            if (service.IsAuthed()) deferred.resolve(service.OK);
            else deferred.reject(service.UNAUTHORIZED);
            return deferred.promise;
        };

        service.IsMyRecipe = function(slug) {
            var deferred = $q.defer();
            $http({
                method: "HEAD",
                url: service.apiUrl + '/recipes/' + slug + '/mine',
                timeout: deferred.promise
            }).then(function() { deferred.resolve(service.OK); }, function() { deferred.reject(service.UNAUTHORIZED); });
            return deferred.promise;
        };

        return service;
    }]
);
