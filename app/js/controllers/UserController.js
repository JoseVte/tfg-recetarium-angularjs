var userController = angular.module('UserController', []);

userController.controller('UserAll',
    ['$scope', '$rootScope', '$location', 'UserService', 'NotificationProvider',
    function ($scope, $rootScope, $location, UserService, NotificationProvider) {
        $rootScope.headerTitle = 'Usuarios';
        $scope.users = [];
        $scope.total = 1;
        $scope.nextPageNumber = 1;

        $scope.reloadUsers = function() {
            $scope.users = [];
            $scope.total = 1;
            $scope.nextPageNumber = 1;
            $scope.getUsers();
        };

        $scope.getUsers = function() {
            $scope.loadingNextPage = true;
            UserService.search({
                page: $scope.nextPageNumber,
                size: 10,
            }, function (response) {
                var responseData = response.data;
                $scope.users = $scope.users.concat(responseData.data);
                $scope.nextPageNumber++;
                $scope.total = responseData.total;
                $scope.loadingNextPage = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban los usuarios. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaban los usuarios.'
                };
                $rootScope.errorMsg = true;
                $scope.loadingNextPage = false;
            });
        };

        $scope.nextPage = function () {
            if ($scope.total > $scope.users.length) {
                $scope.getUsers();
            }
        };
    }]
);

userController.controller('UserShow',
    ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'UserService', 'FileService', 'NotificationProvider',
    function ($scope, $rootScope, $location, $routeParams, $timeout, UserService, FileService, NotificationProvider) {
        $rootScope.headerTitle = 'Perfil del usuario';
        $rootScope.HasBack = true;
        $scope.commentsActived = false;
        $rootScope.back = function () {
            $location.path('/users');
        };

        $scope.setDelay1 = function(){
            $scope.delay1 = true;
            $scope.delay2 = true;
            $timeout(function(){
                $scope.delay1 = false;
            }, 1000);
        };

        $scope.setDelay2 = function(){
            $timeout(function(){
                $scope.delay2 = false;
            }, 1000);
        };

        $scope.loadPersonalData = function() {
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            UserService.get($routeParams.id, function (response) {
                $scope.user = response.data;
                $rootScope.errorMsg = false;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaba el perfil. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaba el perfil.'
                };
                $rootScope.errorMsg = true;
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };

        $scope.loadUserRecipes = function() {
            $rootScope.progressBarActivated = true;
            UserService.getRecipes($routeParams.id, function (response) {
                $scope.recipes = response.data;
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
            });
        };
    }]
);
