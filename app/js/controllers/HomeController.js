var homeController = angular.module('HomeController', []);

homeController.controller('Header',
    ['$scope', '$rootScope', '$mdSidenav', '$timeout', '$location', 'RecipeService',
    function ($scope, $rootScope, $mdSidenav, $timeout, $location, RecipeService) {
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

        $scope.searchRecipe = function() {
            $location.path('recipes').search('search', $scope.search);
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

        function desktopEvent(e) {
            var img = $('.img-logo');
            var motto = $('.motto');
            var search = $('.search-home');
            var button = $('.menuHome');
            var header = $('header md-toolbar.md-tall');
            var toolbar = $('.md-toolbar-tools');
            var heightForMove = 125;
            toolbar.css('display', 'flex');
            search.removeClass('hide');
            var distanceY = window.pageYOffset || document.documentElement.scrollTop;
            if (distanceY <= heightForMove) {
                var height = $.calcHeightDesktop(distanceY);
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
            if (distanceY > heightForMove) {
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
        }

        function tableEvent(e) {
            var img = $('.img-logo');
            var motto = $('.motto');
            var search = $('.search-home');
            var button = $('.menuHome');
            var header = $('header md-toolbar.md-tall');
            var toolbar = $('.md-toolbar-tools');
            var heightForMove = 125;
            var distanceY = window.pageYOffset || document.documentElement.scrollTop;
            toolbar.css('display', 'flex');
            search.removeClass('hide');
            if (distanceY == 0) {
                motto.removeClass('hide');
            } else if (distanceY <= heightForMove) {
                var height = $.calcHeightTablet(distanceY);
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
                motto.addClass('hide');
                button.addClass('hide');
                closeSideNav('left');
            }
            if (distanceY > heightForMove) {
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
        }

        function mobileEvent(e) {
            var img = $('.img-logo');
            var motto = $('.motto');
            var search = $('.search-home');
            var button = $('.menuHome');
            var header = $('header md-toolbar.md-tall');
            var toolbar = $('.md-toolbar-tools');
            var heightForMove = 125;
            var distanceY = window.pageYOffset || document.documentElement.scrollTop;
            if (distanceY == 0) {
                motto.removeClass('hide');
            } else if (distanceY <= heightForMove) {
                var height = $.calcHeightMobile(distanceY);
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
                search.removeClass('hide');
                header.css('max-height', height);
                header.css('height', height);
                motto.addClass('hide');
                button.addClass('hide');
                toolbar.css('display', 'none');
                closeSideNav('left');
            }
            if (distanceY > heightForMove) {
                img.css({
                    position: 'absolute',
                    top: 0,
                    left: 64,
                    'max-height': 64
                });
                search.addClass('hide');
                header.css('max-height', 64);
                header.css('height', 64);
                motto.addClass('hide');
                button.removeClass('hide');
                toolbar.css('display', 'flex');
            }
        }

        $scope.$on('$includeContentLoaded', function() {
            $('.img-logo').exists(function () {
                var button = $('.menuHome');
                var header = $('header md-toolbar.md-tall');

                if ($(window).width() > (960 - $.scrollbarWidth())) {
                    $rootScope.size = 'desktop';
                    window.addEventListener('scroll', desktopEvent, false);
                } else if($(window).width() <= (599 - $.scrollbarWidth())) {
                    $rootScope.size = 'mobile';
                    window.addEventListener('scroll', mobileEvent, false);
                } else {
                    $rootScope.size = 'table';
                    window.addEventListener('scroll', tableEvent, false);
                }

                // Check size
                $(window).resize(function() {
                    if ($(window).width() > (960 - $.scrollbarWidth())) {
                        if ($rootScope.size != 'desktop') {
                            window.removeEventListener('scroll', tableEvent, false);
                            window.removeEventListener('scroll', mobileEvent, false);
                        }
                        $rootScope.size = 'desktop';
                        header.css('max-height', 400);
                        header.css('height', 400);
                        button.addClass('hide');
                        desktopEvent();
                        window.addEventListener('scroll', desktopEvent, false);
                    } else if($(window).width() <= (599 - $.scrollbarWidth())) {
                        if ($rootScope.size != 'mobile') {
                            window.removeEventListener('scroll', desktopEvent, false);
                            window.removeEventListener('scroll', tableEvent, false);
                        }
                        $rootScope.size = 'mobile';
                        header.css('max-height', 300);
                        header.css('height', 300);
                        button.addClass('hide');
                        mobileEvent();
                        window.addEventListener('scroll', mobileEvent, false);
                    } else {
                        if ($rootScope.size != 'table') {
                            window.removeEventListener('scroll', desktopEvent, false);
                            window.removeEventListener('scroll', mobileEvent, false);
                        }
                        $rootScope.size = 'table';
                        header.css('max-height', 300);
                        header.css('height', 300);
                        button.addClass('hide');
                        tableEvent();
                        window.addEventListener('scroll', tableEvent, false);
                    }
                });
            });
        });
    }
]);

homeController.controller('Home',
    ['$scope', '$rootScope', '$location', 'RecipeService', 'NotificationProvider', 'DIFF',
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

        $scope.show = function(slug) {
            $location.path('/recipes/' + slug);
        };
    }
]);
