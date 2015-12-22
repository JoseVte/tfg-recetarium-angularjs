var recipeFilter = angular.module('RecipeFilters', []);

recipeFilter.filter('mainImage', ['RecipeService', function (RecipeService) {
    return function (input) {
        return RecipeService.getImages(input).main.href;
    };
}]);

recipeFilter.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
