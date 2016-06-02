var authServices = angular.module('AuthServices', ['ngResource']);

authServices.factory('AuthService',
    ['$http', '$rootScope', '$timeout', '$interval', '$location', '$translate', 'envService', '$q', 'NotificationProvider',
    function ($http, $rootScope, $timeout, $interval, $location, $translate, envService, $q, NotificationProvider) {
        var service = {
            apiUrl: envService.read('apiUrl'),
            OK: 200,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403
        };

        service.login = function (email, password, expiration, callbackOk, callbackError) {
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

        service.register = function (user, callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/auth/register',
                user, { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.resetPassword = function (email, callbackOk, callbackError) {
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

        service.recoverPassword = function (email, password, token, callbackOk, callbackError) {
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

        service.SaveCredentials = function (token, user, pusherKey, language) {
            $rootScope.globals = {
                token: token,
                user: user.user,
                language: language,
            };

            $translate.use(language);

            if (!!pusherKey) {
                // Initialize pusher
                if ($rootScope.pusher === null || $rootScope.pusher === undefined) {
                    $rootScope.pusher = new Pusher(pusherKey, {
                        cluster: 'eu',
                        encrypted: true
                    });
                }

                if (!$rootScope.isBinded) {
                    $rootScope.channel = $rootScope.pusher.subscribe('user_' + user.user.id);
                    $rootScope.channel.bind('recipe_favorite', function(data) {
                        NotificationProvider.notificateFavorite(JSON.parse(data), function() {
                            $rootScope.$apply(function() {
                                $location.path(JSON.parse(data).redirect);
                            });
                        });
                    });
                    $rootScope.channel.bind('recipe_comment', function(data) {
                        NotificationProvider.notificateComment(JSON.parse(data), function() {
                            $rootScope.$apply(function() {
                                $location.path(JSON.parse(data).redirect);
                            });
                        });
                    });
                    $rootScope.channel.bind('comment_reply', function(data) {
                        NotificationProvider.notificateReply(JSON.parse(data), function() {
                            $rootScope.$apply(function() {
                                $location.path(JSON.parse(data).redirect);
                            });
                        });
                    });
                    $rootScope.isBinded = true;
                }
            }
            localStorage.globals = JSON.stringify($rootScope.globals);
        };

        service.ClearCredentials = function () {
            if (!!$rootScope.globals.user && !!$rootScope.globals.user.id && !!$rootScope.channel) {
                $rootScope.channel.unbind();
                $rootScope.pusher.unsubscribe('user_' + $rootScope.globals.user.id);
                $rootScope.isBinded = false;
            }
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
                service.SaveCredentials(response.data.auth_token, JSON.parse(service.ParseJwt(response.data.auth_token).sub), response.data.pusher_key, response.data.language);
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
                service.CheckToken($rootScope.globals.user);
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
