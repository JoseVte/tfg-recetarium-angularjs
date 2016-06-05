var categoryController = angular.module('CategoryController', []);

categoryController.controller('CategoryAll', [
    '$scope', '$rootScope', '$translate', 'CategoryService', 'NotificationProvider', 'NOTIFICATION',
    function ($scope, $rootScope, $translate, CategoryService, NotificationProvider, NOTIFICATION) {
        $scope.categories = [];
        $scope.selected = [];
        $scope.pagination = {
            page: 1,
            size: 10,
            search: '',
            order: 'id',
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
    }
])
