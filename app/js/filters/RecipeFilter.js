var recipeFilter = angular.module('RecipeFilters', []);

recipeFilter.filter('mainImage', ['RecipeService', function (RecipeService) {
    return function (input) {
        return RecipeService.getImages(input).main.href;
    };
}]);

recipeFilter.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  };
});

recipeFilter.filter('humanized', function() {
    return function(input) {
        switch (input) {
            case 'EASY':
                return 'Fácil';
            case 'MEDIUM':
                return 'Media';
            case 'HARD':
                return 'Difícil';
            case 'PUBLIC':
                return 'Pública';
            case 'FRIENDS':
                return 'Solo amigos';
            case 'PRIVATE':
                return 'Privado';
            default:
                return '';
        }
    };
});

recipeFilter.filter('duration', function() {
    return function(input) {
        var hour = moment.duration(input).hours();
        var minute = moment.duration(input).minutes();
        var duration = '';
        if (hour > 0){
            duration = moment.duration(hour, "hours").humanize();
            if (minute > 0) {
                duration += ' y ';
            }
        }
        duration += moment.duration(minute, "minutes").humanize();
        return duration;
    };
});
