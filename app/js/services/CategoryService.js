var categoryService = angular.module('CategoryServices', ['ngResource']);

categoryService.factory('CategoryService',
    ['$http', '$rootScope', 'envService', '$q',
    function ($http, $rootScope, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl'),
        };

        service.all = function (callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/categories',
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        return service;
    }]
);
