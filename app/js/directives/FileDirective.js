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
                $scope.images.name = file.name;
                reader.onload = (function (theFile) {
                    return function(event) {
                        var image = document.getElementById(attrs.fileThumbnail);
                        image.src = event.target.result;
                    };
                })(file);
                reader.readAsDataURL(file);
            });
        }
    };
});

fileDirective.directive('dropzone', function (NotificationProvider) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            element.dropzone({
                url: attrs.url,
                paramName: 'file',
                uploadMultiple: false,
                headers: {'X-Auth-Token': JSON.parse(localStorage.globals).token },
                acceptedFiles: 'image/*',
                dictDefaultMessage: 'Arrastra y suelta las imágenes aquí',
                success: scope.successUpload,
                error: function (file, response) {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se guardaban las imágenes. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                }
            });
        }
    };
});
