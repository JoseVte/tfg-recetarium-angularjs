var timeDirective = angular.module('TimeDirectives', []);

timeDirective.directive('strToTime', function() {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModelController) {
            ngModelController.$parsers.push(function (data) {
                if (!data) return "";
                return ('0' + data.getHours().toString()).slice(-2) + ':' + ('0' + data.getMinutes().toString().slice(-2));
            });

            ngModelController.$formatters.push(function (data) {
                if (!data) return null;
                var d = new Date(1970, 1, 1);
                var splitted = data.split(':');
                d.setHours(splitted[0]);
                d.setMinutes(splitted[1]);
                return d;
            });
        }
    }
})
