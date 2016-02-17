var ingredientService = angular.module('IngredientServices', ['ngResource']);

ingredientService.factory('IngredientService',
    ['$http', '$rootScope', 'envService', '$q',
    function ($http, $rootScope, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl')
        };

        service.add = function (id, ingredient, callbackOk, callbackError) {
            return $http.post(
                service.apiUrl + '/recipes/' + id + '/ingredient',
                ingredient,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                return callbackOk(response);
            }, function (response) {
                return callbackError(response);
            });
        };

        service.delete = function (id, ingredientId, callbackOk, callbackError) {
            return $http.delete(
                service.apiUrl + '/recipes/' + id + '/ingredient/' + ingredientId,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                return callbackOk(response);
            }, function (response) {
                return callbackError(response);
            });
        };

        return service;
    }]
);
