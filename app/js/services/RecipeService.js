var recipeService = angular.module('RecipeServices', ['ngResource']);

recipeService.factory('RecipeService',
    ['$http', '$rootScope', 'envService',
    function ($http, $rootScope, envService) {
        var service = {
            apiUrl: envService.read('apiUrl')
        };

        service.all = function (pagination, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/recipes',
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    params: pagination
                }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.get = function (slug, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/recipes/' + slug,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        return service;
    }]
);
