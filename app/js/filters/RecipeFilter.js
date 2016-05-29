var recipeFilter = angular.module('RecipeFilters', []);

recipeFilter.filter('mainImage', ['RecipeService', function (RecipeService) {
    return function (input) {
        return RecipeService.getImages(input).main.href;
    };
}]);

recipeFilter.filter('srcImage', function(envService) {
    return function(input, user) {
        if (!!input) {
            if (!!input.new_title) {
                return envService.read('apiUrl') + '/users/' + user.id +'/files/' + input.new_title;
            }
            if (!!input.email) {
                return 'https://www.gravatar.com/avatar/' + md5(input.email.toLowerCase().trim()) + '?d=identicon&f=y&s=200';
            }
            return 'https://www.gravatar.com/avatar/' + input.id + '?d=identicon&f=y&s=200';
        }
      return 'assets/img/favicon.png';
  };
});

recipeFilter.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  };
});

recipeFilter.filter('humanized', function($translate) {
    return function(input) {
        switch (input) {
            case 'EASY':
            case 'MEDIUM':
            case 'HARD':
            case 'PUBLIC':
            case 'FRIENDS':
            case 'PRIVATE':
                return $translate.instant('humanized.' + input);
            default:
                return '';
        }
    };
});

recipeFilter.filter('duration', function($translate) {
    return function(input) {
        var hour = moment.duration(input).hours();
        var minute = moment.duration(input).minutes();
        var duration = '';
        if (hour > 0){
            duration = moment.duration(hour, "hours").humanize();
            if (minute > 0) {
                duration += ' ' + $translate.instant('conjuntion.and') + ' ';
            }
        }
        if (minute > 0) {
            duration += moment.duration(minute, "minutes").humanize();
        }
        return duration;
    };
});

recipeFilter.filter('fromNow', function() {
    return function(date) {
        return moment(date).fromNow();
    };
});
