var recipeService = angular.module('RecipeServices', ['ngResource']);

recipeService.factory('RecipeService',
    ['$http', '$rootScope', 'envService',
    function ($http, $rootScope, envService) {
        var service = {
            apiUrl: envService.read('apiUrl'),
            regexMainImage: /^main\..+$/
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

        service.getImages = function(recipe) {
            var mainImage = recipe.media.filter(function(obj) {
                return service.regexMainImage.exec(obj.filename) !== null;
            })[0];
            var gallery = [];

            for (var image of recipe.media) {
                gallery.push({ title: 'Imagen ' + image.id, href: service.apiUrl + '/media/' + recipe.id + '/' + image.filename });
            }

            return {
                main: { href: service.apiUrl + '/media/' + recipe.id + '/' + mainImage.filename },
                gallery: gallery
            };
        }

        return service;
    }]
);
