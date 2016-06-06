var categoryService = angular.module('CategoryServices', ['ngResource']);

categoryService.factory('CategoryService',
    ['$http', '$rootScope', 'envService', '$q',
    function ($http, $rootScope, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl')
        };

        service.all = function (callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/categories',
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Accept-Pagination': false } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.search = function (params, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/categories',
                {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Accept-Pagination': true },
                    params: params
                }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.get = function (id, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/categories/' + id,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.create = function(category, callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/categories',
                category,
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.edit = function(category, callbackOk, callbackError) {
            $http.put(
                service.apiUrl + '/categories/' + category.id,
                category,
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.delete = function(id, callbackOk, callbackError) {
            $http.delete(
                service.apiUrl + '/categories/' + id,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function(response) {
                callbackOk(response);
            }, function(response) {
                callbackError(response);
            });
        };

        service.deleteMultiple = function(ids, callbackOk, callbackError) {
            $http.delete(
                service.apiUrl + '/categories',
                {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Accept-Pagination': true },
                    params: { ids: ids }
                }
            ).then(function(response) {
                callbackOk(response);
            }, function(response) {
                callbackError(response);
            });
        };

        return service;
    }]
);
