var categoryProvider = angular.module('CategoryProviders', []);

categoryProvider.provider('CategoryProvider',
    [function () {
        this.$get = [ function() {
            return {
                openCategoryDialog: function($scope, $rootScope, $mdDialog, $translate, CategoryService, NotificationProvider, NOTIFICATION) {
                    $scope.hide = function() { $mdDialog.hide(); };
                    $scope.cancel = function() { $mdDialog.cancel(); };
                    $scope.save = function() {
                        $mdDialog.hide();
                        $rootScope.progressBarActivated = true;
                        $rootScope.errorMsg = false;
                        $scope.loadingNextPage = true;
                        CategoryService.create({ text: $scope.text}, function (response) {
                            NotificationProvider.notify({
                                title: $translate.instant('response.saved'),
                                type: 'success',
                                addclass: 'custom-success-notify',
                                icon: 'material-icons md-light',
                                icon_class: 'restaurant_menu',
                                styling: 'fontawesome'
                            });
                            $scope.loadingNextPage = false;
                            $rootScope.progressBarActivated = false;
                        }, function (response) {
                            NOTIFICATION.ParseErrorResponse(response, [400, 401], $translate, $rootScope, NotificationProvider);
                            $scope.hasError = true;
                            $scope.loadingNextPage = false;
                            $rootScope.progressBarActivated = false;
                        });
                    };
                }
            };
        }];
    }]
);
