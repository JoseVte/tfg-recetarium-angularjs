var formDirective = angular.module('FormDirectives', []);

formDirective.directive('onKeyup', function() {
    return function(scope, elm, attrs) {
        var allowedKeys = scope.$eval(attrs.keys);
        elm.bind('keydown', function(evt) {
            angular.forEach(allowedKeys, function(key) {
                if (key == evt.which) {
                    evt.preventDefault(); // Doesn't work at all
                    window.stop(); // Works in all browsers but IE
                    document.execCommand("Stop"); // Works in IE
                    return false; // Don't even know why it's here. Does nothing.
                }
            });
        });
    };
});
