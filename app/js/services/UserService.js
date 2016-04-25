var userService = angular.module('UserServices', ['ngResource']);

userService.factory('UserService',
    ['$http', '$rootScope', 'envService', '$q',
    function ($http, $rootScope, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl'),
        };

        service.search = function (data, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/users',
                {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    params: data
                }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.get = function (id, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/users/' + id,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.create = function(user, callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/users',
                user,
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.edit = function(user, callbackOk, callbackError) {
            $http.put(
                service.apiUrl + '/users/' + user.id,
                user,
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.delete = function(id, callbackOk, callbackError) {
            $http.delete(
                service.apiUrl + '/users/' + id,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function(response) {
                callbackOk(response);
            }, function(response) {
                callbackError(response);
            });
        };

        service.getRecipes = function (userId, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/users/' + userId + '/recipes',
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
