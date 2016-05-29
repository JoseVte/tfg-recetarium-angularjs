var homeController = angular.module('HomeController', []);

homeController.controller('Header',
    ['$scope', '$rootScope', '$mdSidenav', '$timeout', '$location', '$route', '$translate', 'RecipeService',
    function ($scope, $rootScope, $mdSidenav, $timeout, $location, $route, $translate, RecipeService) {
        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.search = $rootScope.searchString;

        $scope.navLinks = [
            { title: '<i class="material-icons">fiber_new</i> ' + $translate.instant('menu.last-recipes'), url: '/recipes' },
            { title: '<i class="material-icons">stars</i> ' + $translate.instant('menu.top-recipes'), url: '/top-recipes', class: 'no-implemented'},
            { title: '<i class="material-icons">perm_identity</i> ' + $translate.instant('menu.all-users'), url: '/users' },
            { title: '<i class="material-icons">weekend</i> ' + $translate.instant('menu.friends'), url: '/friends' },
            { title: '<i class="material-icons">edit</i> ' + $translate.instant('menu.write-recipe'), url: '/new-recipe' },
        ];

        var originatorEv;
        $scope.openDropdrown = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

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
            $rootScope.searchString = $scope.search;
            $location.path('recipes');
            $route.reload();
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

        function changeHeader(e) {
            var heightForMove = 125;
            var distanceY = window.pageYOffset || document.documentElement.scrollTop;
            if (distanceY <= heightForMove && $rootScope.IsHome) {
                $rootScope.scrollInTop = true;
            } else {
                $rootScope.scrollInTop = false;
            }
        }
        $scope.$on('$includeContentLoaded', function() {
            if ($rootScope.IsHome) {
                window.addEventListener('scroll', changeHeader, false);
            }
        });
    }
]);

homeController.controller('Home',
    ['$scope', '$rootScope', '$location', '$translate', 'RecipeService', 'NotificationProvider', 'DIFF', 'NOTIFICATION',
    function ($scope, $rootScope, $location, $translate, RecipeService, NotificationProvider, DIFF, NOTIFICATION) {
        $scope.recipes = [];
        $scope.total = 1;
        $scope.nextPageNumber = 1;
        $scope.loadingNextPage = false;
        $scope.hasError = false;

        $scope.getRecipes = function() {
            $scope.loadingNextPage = true;
            $rootScope.progressBarActivated = true;
            RecipeService.search({
                page: $scope.nextPageNumber,
                size: 10
            }, function (response) {
                var responseData = response.data;
                $scope.recipes = responseData.data;
                $scope.nextPageNumber++;
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

        $scope.getDifficulty = function (diff) { return DIFF.class[diff]; };

        $scope.nextPage = function () {
            if ($scope.total > $scope.recipes.length && !$scope.loadingNextPage && !$scope.hasError) {
                $scope.getRecipes();
            }
        };

        $scope.show = function(slug) {
            $location.path('/recipes/' + slug);
        };
    }
]);
