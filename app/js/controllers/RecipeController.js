var recipeController = angular.module('RecipeController', []);

recipeController .controller('RecipeAll',
    ['$scope', '$rootScope', '$location', 'RecipeService',
    function ($scope, $rootScope, $location, RecipeService) {
        $rootScope.headerTitle = 'Recetas';

        RecipeService.all(1, 3, function (response) {
            var responseData = response.data;
            console.log(response);
            $scope.recipes = responseData.data;
            $scope.total = responseData.total;
            $scope.current = responseData.current;
            if (responseData.prev) $scope.prev = responseData.prev;
            if (responseData.next) $scope.next = responseData.next;
        }, function (response) {
            console.error(response);
        });
    }]
);
