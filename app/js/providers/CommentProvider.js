var commentProvider = angular.module('CommentProviders', []);

commentProvider.provider('CommentProvider',
    [function () {
        this.$get = [ function() {
            return {
                openCommentDialog: function($scope, $rootScope, $mdDialog, data, NotificationProvider) {
                    $scope.text = data.text;
                    $scope.hide = function() { $mdDialog.hide(); };
                    $scope.cancel = function() { $mdDialog.cancel(); };
                    $scope.save = function() {
                        $mdDialog.hide($scope.text);
                    };
                }
            };
        }];
    }]
);
