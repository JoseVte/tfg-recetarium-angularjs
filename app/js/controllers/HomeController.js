var homeController = angular.module('HomeController', []);

homeController.controller('Header',
    ['$scope', '$mdSidenav', '$timeout', '$log',
    function ($scope, $mdSidenav, $timeout, $log) {
        $scope.toggleLeft = buildDelayedToggler('left');

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
    }
]);
