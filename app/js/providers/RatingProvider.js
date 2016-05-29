var ratingProvider = angular.module('RatingProviders', []);

ratingProvider.provider('RatingProvider',
    [function () {
        this.$get = [ function() {
            return {
                openRatingDialog: function($scope, $rootScope, $location, $mdDialog, $translate, RecipeService, NotificationProvider, NOTIFICATION) {
                    $scope.rated = $rootScope.globals.rated;
                    $scope.recipe = $rootScope.globals.recipe;
                    $scope.hide = function() { $mdDialog.hide(); };
                    $scope.cancel = function() { $mdDialog.cancel(); };
                    $scope.rating = function() {
                        $rootScope.errorMsg = false;
                        if ($rootScope.globals.user) {
                            RecipeService.rating($scope.recipe.id, $scope.rated, function (response) {
                                NotificationProvider.notify({
                                    title: $translate.instant('response.saved'),
                                    type: 'success',
                                    addclass: 'custom-success-notify',
                                    icon: 'material-icons md-light',
                                    icon_class: 'star',
                                    styling: 'fontawesome'
                                });
                                $mdDialog.cancel();
                                $location.path('/recipes/' + $scope.recipe.slug);
                            }, function (response) {
                                NOTIFICATION.ParseErrorResponse(response, [400], $translate, $rootScope, NotificationProvider);
                            });
                        } else {
                            $location.path('/login');
                        }
                    };
                }
            };
        }];
    }]
);
