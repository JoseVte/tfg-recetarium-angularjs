var homeController = angular.module('HomeController', []);

homeController.controller('Header',
    ['$scope', '$mdSidenav', '$timeout', '$location',
    function ($scope, $mdSidenav, $timeout, $location) {
        $scope.toggleLeft = buildDelayedToggler('left');

        $scope.navLinks = [
            { title: 'Home', url: '/'},
            { title: 'Recetas', url: '/recipes'}
        ];

        $scope.navTo = function (ev, url) {
            closeSideNav('left');
            if ($location.path() !== url) {
                $location.path(url);
            }
        };

        $scope.getClassActive = function(path) {
            var cur_path = $location.path().substr(0, path.length);
            if (cur_path == path) {
                if($location.path().substr(0).length > 1 && path.length == 1 )
                    return "";
                else
                    return "active";
            } else {
                return "";
            }
        };

        function debounce(func, wait, context) {
            var timer;
            return function debounce() {
                var context = $scope, args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        function buildDelayedToggler(navID) {
            return debounce(function() {
                $mdSidenav(navID).toggle().then(function () {});
            }, 0);
        }

        function closeSideNav(navID) {
            $mdSidenav(navID).close().then(function () {});
        }

        $scope.$on('$includeContentLoaded', function() {
            $('.img-logo').exists(function () {
                var button = $('.menuHome');
                var header = $('header md-toolbar.md-tall');
                var img = $('.img-logo');
                var motto = $('.motto');
                var search = $('.search-home');
                var heightForMove = 125;
                header.css('max-height', 400);
                header.css('height', 400);
                button.addClass('hide');
                window.addEventListener('scroll', function (e) {
                    var distanceY = window.pageYOffset || document.documentElement.scrollTop;
                    if (distanceY < heightForMove) {
                        var height = $.calcHeight(distanceY);
                        img.css('height', height/2);
                        img.css({
                            position: '',
                            top: '',
                            left: '',
                            'max-height': ''
                        });
                        search.css({
                            top: '',
                            position: '',
                            left: '',
                            margin: ''
                        });
                        header.css('max-height', height);
                        header.css('height', height);
                        motto.removeClass('hide');
                        button.addClass('hide');
                        closeSideNav('left');
                    }
                    if (distanceY >= heightForMove) {
                        img.css({
                            position: 'absolute',
                            top: 0,
                            left: 64,
                            'max-height': 64
                        });
                        search.css({
                            top: 0,
                            position: 'absolute',
                            left: 300,
                            margin: 10
                        });
                        header.css('max-height', 64);
                        header.css('height', 64);
                        motto.addClass('hide');
                        button.removeClass('hide');
                    }
                });
            });
        });
    }
]);

homeController.controller('Home',
    ['$scope', '$rootScope', '$location','RecipeService', 'NotificationProvider', 'DIFF',
    function ($scope, $rootScope, $location, RecipeService, NotificationProvider, DIFF) {
        $scope.recipes = [];
        $scope.total = 1;
        $scope.nextPageNumber = 1;
        $scope.loadingNextPage = true;

        RecipeService.search({
            page: $scope.nextPageNumber,
            size: 10
        }, function (response) {
            var responseData = response.data;
            $scope.recipes = responseData.data;
            $scope.nextPageNumber++;
            $scope.total = responseData.total;
            $scope.loadingNextPage = false;
        }, function (response) {
            NotificationProvider.notify({
                title: 'Un error ha ocurrido',
                text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo más tarde.',
                type: 'error',
                addclass: 'custom-error-notify',
                icon: 'material-icons md-light',
                styling: 'fontawesome'
            });
            $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
            $rootScope.error = {
                icon: 'error_outline',
                title: 'Algo ha ido mal',
                msg: 'Ha ocurrido un error mientras se cargaban las recetas.'
            };
            $rootScope.errorMsg = true;
            $scope.loadingNextPage = false;
        });

        $scope.getDifficulty = function (diff) { return DIFF.class[diff]; };

        $scope.nextPage = function () {
            if ($scope.total > $scope.recipes.length) {
                $scope.loadingNextPage = true;
                RecipeService.search({
                    page: $scope.nextPageNumber,
                    size: 10
                }, function (response) {
                    var responseData = response.data;
                    $scope.recipes = $scope.recipes.concat(responseData.data);
                    $scope.nextPageNumber++;
                    $scope.total = responseData.total;
                    $scope.loadingNextPage = false;
                }, function (response) {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se cargaban las recetas.'
                    };
                    $rootScope.errorMsg = true;
                    $scope.loadingNextPage = false;
                });
            }
        };
    }
]);
