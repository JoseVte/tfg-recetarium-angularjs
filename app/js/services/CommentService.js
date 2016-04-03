var commentService = angular.module('CommentServices', ['ngResource']);

commentService.factory('CommentService',
    ['$http', '$rootScope', 'envService', '$q',
    function ($http, $rootScope, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl')
        };

        service.create = function (recipeId, id, text, callbackOk, callbackError) {
            var url = service.apiUrl + '/recipes/' + recipeId + '/comments';
            if (id !== undefined && id !== null) {
                url += '/' + id;
            }
            $http.post(
                url,
                { text: text },
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.edit = function (recipeId, id, text, callbackOk, callbackError) {
            $http.put(
                service.apiUrl + '/recipes/' + recipeId + '/comments/' + id,
                { text: text },
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.delete = function(recipeId, id, callbackOk, callbackError) {
            $http.delete(
                service.apiUrl + '/recipes/' + recipeId + '/comments/' + id,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function(response) {
                callbackOk(response);
            }, function(response) {
                callbackError(response);
            });
        };

        return service;
    }]
);
