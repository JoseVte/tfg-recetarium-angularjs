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
            if ($location.path() !== url) $location.path(url);
        }

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
        }

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
        };

        function buildDelayedToggler(navID) {
            return debounce(function() {
                $mdSidenav(navID).toggle().then(function () {});
            }, 200);
        };

        function closeSideNav(navID) {
            $mdSidenav(navID).close().then(function () {});
        }
    }
]);
