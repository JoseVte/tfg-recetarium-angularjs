var animationDirective = angular.module('AnimationDirectives', []);

animationDirective.directive('ngShowWithAnimation', [function () {
    return {
        restrict: 'A',
        multiElement: true,
        link: function($scope, element, attrs) {
            $scope.$watch(attrs.ngShowWithAnimation, function (value) {
                if (!!value) {
                    element.slideDown();
                } else {
                    element.slideUp();
                }
            });
        }
    };
}]);
