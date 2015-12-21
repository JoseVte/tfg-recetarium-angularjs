var recipeController = angular.module('RecipeController', []);

recipeController.controller('RecipeAll',
    ['$scope', '$rootScope', '$location', '$sce', 'RecipeService', 'NotificationProvider',
    function ($scope, $rootScope, $location, $sce, RecipeService, NotificationProvider) {
        $rootScope.headerTitle = 'Recetas';
        $scope.pagination = {
            page: 1,
            size: 10
        };

        $scope.sizes = [10, 30, 50];

        $scope.$watch(function() {
            return $location.search();
        }, function (newVal, oldVal) {
            if (!newVal.page) newVal.page = 1;
            if (!newVal.size) newVal.size = 10;
            $scope.pagination = newVal;
            $scope.getRecipes();
        });

        $scope.selectSize = function () {
            $location.search("size", $scope.pagination.size);
        }

        $scope.getRecipes = function () {
            $rootScope.progressBarActivated = true;
            RecipeService.all($scope.pagination, function (response) {
                var responseData = response.data;
                $scope.recipes = responseData.data;
                $scope.total = responseData.total;
                $scope.current = responseData["link-self"];
                if (responseData["link-prev"]) $scope.prev = responseData["link-prev"];
                if (responseData["link-next"]) $scope.next = responseData["link-next"];
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo mas tarde.',
                    type: 'error',
                    addclass: 'custom-error',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify-icon .material-icons').html('warning');
                $rootScope.progressBarActivated = false;
            });
        }

        $scope.description = function(recipeDescription) {
            if (recipeDescription) return $sce.trustAsHtml(recipeDescription.splitRecipe().steps.trunc(80, true));
        }

        $scope.show = function(slug) {
            $location.path('/recipes/' + slug);
        }
    }]
);

recipeController.controller('RecipeShow',
    ['$scope', '$rootScope', '$location', '$routeParams', '$sce', 'RecipeService', 'NotificationProvider',
    function ($scope, $rootScope, $location, $routeParams, $sce, RecipeService, NotificationProvider) {
        $rootScope.headerTitle = 'Cargando...';
        $rootScope.progressBarActivated = true;
        $rootScope.errorMsg = false;

        RecipeService.get($routeParams.slug, function (response) {
            $scope.recipe = response.data;
            $rootScope.headerTitle = response.data.title;
            $rootScope.progressBarActivated = false;
        }, function (response) {
            if (response.status == 404) {
                $scope.error = {
                    title: 'Error 404',
                    msg: 'La receta \'' + $routeParams.slug + '\' no existe.'
                }
                $rootScope.errorMsg = true;
            } else {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaba la receta. Por favor, intentelo mas tarde.',
                    type: 'error',
                    addclass: 'custom-error',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify-icon .material-icons').html('warning');
            }
            $rootScope.headerTitle = 'Error';
            $rootScope.progressBarActivated = false;
        });
    }]
);
