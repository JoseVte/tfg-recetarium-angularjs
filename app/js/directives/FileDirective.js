var fileDirective = angular.module('FileDirectives', []);

fileDirective.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                var file = element[0].files[0];
                $scope.$apply(function(){
                    modelSetter($scope, file);
                });
            });
        }
    };
}]);

fileDirective.directive('fileThumbnail',function () {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            element.bind('change', function() {
                var reader = new FileReader();
                var file = element[0].files[0];
                reader.onload = (function (theFile) {
                    return function(event) {
                        var image = document.getElementById(attrs.fileThumbnail);
                        image.width = 260;
                        image.height = 220;
                        image.src = event.target.result;
                    };
                })(file);
                reader.readAsDataURL(file);
            });
        }
    };
});
