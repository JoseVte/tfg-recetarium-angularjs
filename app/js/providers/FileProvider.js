var fileProvider = angular.module('FileProviders', []);

fileProvider.provider('FileProvider',
    [function () {
        this.$get = [ function() {
            return {
                openGalleryDialog: function($scope, $rootScope, $mdDialog, $translate, data, FileService, NotificationProvider, NOTIFICATION) {
                    $scope.selectedImages = data.selectedImages;
                    $scope.mode = data.mode;
                    $scope.user = data.user;
                    $scope.urlUpload = FileService.getUrlUpload($scope.user);
                    FileService.loadUserImages($scope.user, function(response) {
                        $scope.images = response.data;
                        $scope.checkImagesSelected($scope.images);
                    }, function(response) {
                        NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                    });

                    $scope.toggleImageSelected = function(image) {
                        if (image.selected) {
                            $scope.selectedImages.splice($scope.selectedImages.findIndex(function(imageInArray) { return image.id == imageInArray.id; }), 1);
                            image.selected = false;
                        } else {
                            // If you click in other image
                            if ($scope.mode == 'selectImageMain' || $scope.mode == 'selectAvatar') {
                                $scope.selectedImages= [];
                                $scope.checkImagesSelected($scope.images);
                            }
                            $scope.selectedImages.push(image);
                            image.selected = true;
                        }
                    };

                    $scope.checkImagesSelected = function(images) {
                        for (var image in images) {
                            if ($scope.images.hasOwnProperty(image)) {
                                $scope.images[image].selected = $.containsId($scope.images[image], $scope.selectedImages);
                            }
                        }
                    };

                    $scope.removeImage = function(image, $event) {
                        if ($event.stopPropagation) $event.stopPropagation();
                        if ($event.preventDefault) $event.preventDefault();
                        $event.cancelBubble = true;
                        $event.returnValue = false;
                        var msg = $translate.instant('dialog.remove-image-1',{ title: image.title });
                        if (image.recipes > 0) msg += '<br><br>' + $translate.instant('dialog.remove-image-2');
                        var confirm = $mdDialog.confirm()
                            .title($translate.instant('btn.delete-text'))
                            .textContent(msg)
                            .ariaLabel($translate.instant('btn.delete-text'))
                            .targetEvent($event)
                            .ok($translate.instant('btn.delete-text'))
                            .cancel($translate.instant('btn.cancel-text'));
                        $scope.returnSelected();
                        $mdDialog.show(confirm).then(function () {
                            if (image.selected) {
                                $scope.selectedImages.splice($scope.selectedImages.findIndex(function(imageInArray) { return image.id == imageInArray.id; }), 1);
                                image.selected = false;
                            }
                            $rootScope.progressBarActivated = true;
                            $rootScope.errorMsg = false;
                            FileService.deleteFile($scope.user, image.id, function(response) {
                                NotificationProvider.notify({
                                    title: response.data.msg,
                                    type: 'success',
                                    addclass: 'custom-success-notify',
                                    icon: 'material-icons md-light',
                                    icon_class: 'check_circle',
                                    styling: 'fontawesome'
                                });
                                $rootScope.progressBarActivated = false;
                            }, function(response) {
                                NOTIFICATION.ParseErrorResponse(response, [400, 404], $translate, $rootScope, NotificationProvider);
                                $rootScope.progressBarActivated = false;
                            });
                        }, function() {});
                    };

                    $scope.successUpload = function(file, response) {
                        $scope.images.push(response);
                        $rootScope.progressBarActivated = false;
                    };

                    $scope.hide = function() { $mdDialog.hide(); };
                    $scope.cancel = function() { $mdDialog.cancel(); };
                    $scope.returnSelected = function() {
                        if ($scope.mode == 'selectImageMain' || $scope.mode == 'selectAvatar') {
                            $mdDialog.hide($scope.selectedImages[0]);
                        } else {
                            $mdDialog.hide($scope.selectedImages);
                        }
                    };
                },
                openUploadDialog: function($scope, $rootScope, $mdDialog, data, FileService, NotificationProvider) {
                    $scope.user = data.user;
                    $scope.images = [];
                    $scope.urlUpload = FileService.getUrlUpload($scope.user);

                    $scope.successUpload = function(file, response) {
                        $scope.images.push(response);
                    };
                    $scope.hide = function() { $mdDialog.hide(); };
                    $scope.cancel = function() { $mdDialog.cancel(); };
                    $scope.returnUploaded = function() {
                        $mdDialog.hide($scope.images);
                    };
                }
            };
        }];
    }]
);
