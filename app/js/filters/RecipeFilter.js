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

recipeFilter.filter('searchFor',
    ['RecipeService', '$rootScope', '$scope', 'NotificationProvider',
    function(RecipeService, $rootScope, $scope, NotificationProvider) {
        return function(result, search) {
            if (!search) {
                return result;
            }
            search = search.toLowerCase();
            $rootScope.progressBarActivated = true;
            $scope.pagination.search = search;
            RecipeService.search($scope.pagination, function (response) {
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
                    text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaban las recetas.'
                };
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
            });
        };
    }
]);
