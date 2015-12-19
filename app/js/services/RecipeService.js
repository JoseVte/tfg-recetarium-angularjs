var recipeService = angular.module('RecipeServices', ['ngResource']);

recipeService.factory('RecipeService',
    ['$http', '$rootScope', 'envService',
    function ($http, $rootScope, envService) {
        var service = {
            apiUrl: envService.read('apiUrl')
        };

        service.all = function (page, size, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/recipes',
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    params: {
                        page: page,
                        size: size
                    }
                }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        }

        return service;
    }]
);
