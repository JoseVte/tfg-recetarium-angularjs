var categoryController = angular.module('CategoryController', []);

categoryController.controller('CategoryAll', [
    '$scope', '$rootScope', '$translate', '$mdEditDialog', '$mdDialog', 'CategoryService', 'CategoryProvider', 'NotificationProvider', 'NOTIFICATION',
    function ($scope, $rootScope, $translate, $mdEditDialog, $mdDialog, CategoryService, CategoryProvider, NotificationProvider, NOTIFICATION) {
        $scope.categories = [];
        $scope.selected = [];
        $scope.pagination = {
            page: 1,
            size: 10,
            search: '',
            order: 'id',
        };
        $scope.labels = {
            page: $translate.instant('pagination.page'),
            rowsPerPage: $translate.instant('pagination.rows-per-page'),
            of: $translate.instant('pagination.of'),
        };

        $scope.reloadCategories = function() {
            $scope.pagination.page = 1;
            $scope.getCategories();
        };

        $scope.getCategories = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $scope.loadingNextPage = true;
            CategoryService.search($scope.pagination, function (response) {
                var responseData = response.data;
                $scope.categories = responseData.data;
                $scope.total = responseData.total;
                $scope.loadingNextPage = false;
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $scope.hasError = true;
                $scope.loadingNextPage = false;
                $rootScope.progressBarActivated = false;
            });
        };

        $scope.getCategories();

        $scope.add = function ($ev) {
            $mdDialog.show({
                controller: CategoryProvider.openCategoryDialog,
                templateUrl: 'views/partials/category-dialog.html',
                parent: angular.element(document.body),
                targetEvent: $ev,
                clickOutsideToClose: true
            }).then($scope.getCategories);
        };

        $scope.edit = function($ev, category) {
            $ev.stopPropagation();
            $mdEditDialog.small({
                modelValue: category.text,
                save: function (input) {
                    category.text = input.$modelValue;
                    $rootScope.progressBarActivated = true;
                    $rootScope.errorMsg = false;
                    $scope.loadingNextPage = true;
                    CategoryService.edit(category, function (response) {
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
                        NOTIFICATION.ParseErrorResponse(response, [400, 401, 404], $translate, $rootScope, NotificationProvider);
                        $scope.hasError = true;
                        $scope.loadingNextPage = false;
                        $rootScope.progressBarActivated = false;
                    });
                },
                targetEvent: $ev,
                validators: {
                    'required': true
                }
            });
        };

        $scope.delete = function ($ev) {
            var msg = $translate.instant('dialog.remove-categories', { total: $scope.selected.length });
            var confirm = $mdDialog.confirm()
                .title($translate.instant('btn.delete-text'))
                .htmlContent(nl2br(msg))
                .ariaLabel($translate.instant('btn.delete-text'))
                .targetEvent($ev)
                .ok($translate.instant('btn.delete-text'))
                .cancel($translate.instant('btn.cancel-text'));
            $mdDialog.show(confirm).then(function () {
                $rootScope.progressBarActivated = true;
                $rootScope.errorMsg = false;
                $scope.loadingNextPage = true;
                CategoryService.deleteMultiple($.getArrayId($scope.selected), function (response) {
                    NotificationProvider.notify({
                        title: response.data.msg,
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'restaurant_menu',
                        styling: 'fontawesome'
                    });
                    $scope.loadingNextPage = false;
                    $rootScope.progressBarActivated = false;
                    $scope.reloadCategories();
                }, function (response) {
                    NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                    $scope.hasError = true;
                    $scope.loadingNextPage = false;
                    $rootScope.progressBarActivated = false;
                });
            });
        };
    }
]);
