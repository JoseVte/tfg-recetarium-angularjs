var fileService = angular.module('FileServices', ['ngResource']);

fileService.factory('FileService',
    ['$http', '$rootScope', 'envService', '$q',
    function ($http, $rootScope, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl'),
        };

        service.getUrlUpload = function(user) { return service.apiUrl + '/users/' + user.id + '/files'; };

        service.loadUserImages = function(user, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/users/' + user.id + '/files',
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.uploadImage = function(user, file, callbackOk, callbackError) {
            var fd = new FormData();
            fd.append('file', file);
            $http.post(
                service.apiUrl + '/users/' + user.id + '/files',
                fd,
                { transformRequest: angular.identity, headers: {'Content-Type': undefined} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.deleteFile = function(user, id, callbackOk, callbackError) {
            $http.delete(
                service.apiUrl + '/users/' + user.id + '/files/' + id,
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
