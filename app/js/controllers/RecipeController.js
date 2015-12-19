var recipeController = angular.module('RecipeController', []);

recipeController .controller('RecipeAll',
    ['$scope', '$rootScope', '$location', '$sce', 'RecipeService',
    function ($scope, $rootScope, $location, $sce, RecipeService) {
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
            RecipeService.all($scope.pagination, function (response) {
                var responseData = response.data;
                $scope.recipes = responseData.data;
                $scope.total = responseData.total;
                $scope.current = responseData["link-self"];
                if (responseData["link-prev"]) $scope.prev = responseData["link-prev"];
                if (responseData["link-next"]) $scope.next = responseData["link-next"];
            }, function (response) {
                console.error(response);
            });
        }

        $scope.description = function(recipeDescription) {
            if (recipeDescription) return $sce.trustAsHtml(recipeDescription.trunc(80, true));
        }
    }]
);
