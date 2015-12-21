var recipeFilter = angular.module('RecipeFilters', []);

recipeFilter.filter('ingredient', function () {
    return function (input) {
        console.log(input);
        return input;
    };
});
