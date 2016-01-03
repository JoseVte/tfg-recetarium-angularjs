var tagService = angular.module('TagServices', ['ngResource']);

tagService.factory('TagService',
    ['$http', '$rootScope', 'envService', '$q',
    function ($http, $rootScope, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl'),
        }

        service.all = function (search, callbackOk, callbackError) {
            return $http.get(
                service.apiUrl + '/tags',
                {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    params: { search: search }
                }
            ).then(function (response) {
                return callbackOk(response);
            }, function (response) {
                return callbackError(response);
            });
        };

        return service;
    }]
);
