var authController = angular.module('AuthController', []);

authController.constant('DELAY_FUNCTIONS', {
    'initDelays': function($scope, $timeout) {
        $scope.setDelay1 = function(){
            $scope.delay1 = true;
            $scope.delay2 = true;
            $timeout(function(){
                $scope.delay1 = false;
            }, 1000);
        };

        $scope.setDelay2 = function(){
            $timeout(function(){
                $scope.delay2 = false;
            }, 1000);
        };
    }
});

authController.controller('Login',
    ['$scope', '$rootScope', '$location', '$translate', '$timeout', 'AuthService', 'NotificationProvider', 'NOTIFICATION', 'DELAY_FUNCTIONS',
    function ($scope, $rootScope, $location, $translate, $timeout, AuthService, NotificationProvider, NOTIFICATION, DELAY_FUNCTIONS) {
        DELAY_FUNCTIONS.initDelays($scope, $timeout);

        $scope.login = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            AuthService.login($scope.email, $scope.password, !$scope.expiration, function (response) {
                AuthService.SaveCredentials(response.data.auth_token, JSON.parse(AuthService.ParseJwt(response.data.auth_token).sub), response.data.pusher_key, response.data.language);
                if (!$scope.expiration) {
                    AuthService.StartCronCheckToken();
                }
                NotificationProvider.notify({
                    title: $translate.instant('login.header-title'),
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'cake',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
                $location.path('/');
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [400, 401], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('Register',
    ['$scope', '$rootScope', '$location', '$translate', '$timeout', 'AuthService', 'NotificationProvider', 'NOTIFICATION', 'DELAY_FUNCTIONS',
    function ($scope, $rootScope, $location, $translate, $timeout, AuthService, NotificationProvider, NOTIFICATION, DELAY_FUNCTIONS) {
        DELAY_FUNCTIONS.initDelays($scope, $timeout);

        $scope.register = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            var user = {
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                password_repeat: $scope.passwordRepeat,
                first_name: $scope.first_name,
                last_name: $scope.last_name
            };
            AuthService.register(user, function (response) {
                NotificationProvider.notify({
                    title: $translate.instant('register.thanks-title'),
                    text: $translate.instant('register.thanks-text'),
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'mail_outline',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
                $location.path('/');
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [400, 401], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('Logout',
    ['$scope', '$location', '$translate', 'AuthService', 'NotificationProvider', 'NOTIFICATION', 'DELAY_FUNCTIONS',
    function ($scope, $location, $translate, AuthService, NotificationProvider, NOTIFICATION) {
        NotificationProvider.notify({
            title: $translate.instant('logout.title'),
            text: $translate.instant('logout.text'),
            type: 'success',
            addclass: 'custom-success-notify',
            icon: 'material-icons md-light',
            icon_class: 'cake',
            styling: 'fontawesome'
        });
        AuthService.StopCronCheckToken();
        AuthService.ClearCredentials();
        $location.path('/');
    }]
);

authController.controller('ResetPassword',
    ['$scope', '$rootScope', '$location', '$translate', '$timeout', 'AuthService', 'NotificationProvider', 'NOTIFICATION', 'DELAY_FUNCTIONS',
    function ($scope, $rootScope, $location, $translate, $timeout, AuthService, NotificationProvider, NOTIFICATION, DELAY_FUNCTIONS) {
        DELAY_FUNCTIONS.initDelays($scope, $timeout);

        $scope.resetPassword = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.hasMessage = false;
            $scope.setDelay1();
            AuthService.resetPassword($scope.email, function (response) {
                $scope.msg = response.data.msg;
                NotificationProvider.notify({
                    title: response.data.msg,
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'mail_outline',
                    styling: 'fontawesome'
                });
                $scope.hasMessage = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [400, 404], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('RecoverPassword',
    ['$scope', '$rootScope', '$routeParams', '$location', '$translate', '$timeout', 'AuthService', 'NotificationProvider', 'NOTIFICATION', 'DELAY_FUNCTIONS',
    function ($scope, $rootScope, $routeParams, $location, $translate, $timeout, AuthService, NotificationProvider, NOTIFICATION, DELAY_FUNCTIONS) {
        DELAY_FUNCTIONS.initDelays($scope, $timeout);

        $scope.recoverPassword = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            AuthService.recoverPassword($scope.email, $scope.password, $routeParams.token, function (response) {
                NotificationProvider.notify({
                    title: $translate.instant('recover.changed'),
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'lock',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
                $location.path('/login');
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [400, 404], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('ValidateEmail',
    ['$scope', '$rootScope', '$routeParams', '$location', '$translate', 'AuthService', 'NotificationProvider', 'NOTIFICATION',
    function ($scope, $rootScope, $routeParams, $location, $translate, AuthService, NotificationProvider, NOTIFICATION) {
        $rootScope.errorMsg = false;
        $rootScope.progressBarActivated = true;

        AuthService.ValidateEmail($routeParams.token, function (response) {
            NotificationProvider.notify({
                title: $translate.instant('active.actived'),
                type: 'success',
                addClass: 'material-icons md-light',
                icon_class: 'check_circle',
                style: 'fontawesome',
            });
            $rootScope.progressBarActivated = false;
            $location.path('/login');
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [400, 404], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
        });
    }]
);

authController.controller('Profile',
    ['$scope', '$rootScope', '$location', '$timeout', '$sce', '$mdDialog', '$translate', 'AuthService', 'FileService', 'UserService', 'RecipeService', 'NotificationProvider', 'FileProvider', 'FRIENDS_FUNCTIONS', 'USER_FUNCTIONS', 'DELAY_FUNCTIONS', 'NOTIFICATION',
    function ($scope, $rootScope, $location, $timeout, $sce, $mdDialog, $translate, AuthService, FileService, UserService, RecipeService, NotificationProvider, FileProvider, FRIENDS_FUNCTIONS, USER_FUNCTIONS, DELAY_FUNCTIONS, NOTIFICATION) {
        $scope.user = $rootScope.globals.user;
        $scope.infiniteScroll = {
            recipes: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
                hasError: false,
            },
            recipesFavorites: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
                hasError: false,
            },
            images: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
                hasError: false,
            },
            friends: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
                hasError: false,
            },
        };

        DELAY_FUNCTIONS.initDelays($scope, $timeout);

        $scope.isMe = function(user) {
            return (user !== undefined && $rootScope.globals.user.id == user.id);
        };

        $scope.checkFriend = function(user) {
            var i = 0;
            if (user !== undefined) {
                while (i < user.friends.length) {
                    if (user.friends[i].user_id === $rootScope.globals.user.id) {
                        return true;
                    }
                    i++;
                }
            }
            return false;
        };

        USER_FUNCTIONS.Recipes($scope, $rootScope, $translate, $mdDialog, $rootScope.globals.user.id, UserService, RecipeService, NotificationProvider, NOTIFICATION);

        USER_FUNCTIONS.RecipesFavorites($scope, $rootScope, $translate, $mdDialog, $rootScope.globals.user.id, UserService, RecipeService, NotificationProvider, NOTIFICATION);

        USER_FUNCTIONS.Friends($scope, $rootScope, $translate, $rootScope.globals.user.id, UserService, NotificationProvider, FRIENDS_FUNCTIONS, NOTIFICATION);

        // TODO Refactor with infinite scroll
        $scope.loadUserImages = function() {
            $rootScope.progressBarActivated = true;
            FileService.loadUserImages($rootScope.globals.user, function (response) {
                $scope.images = response.data;
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
            });
        };

        $scope.openUploadImage = function($event) {
            $mdDialog.show({
                controller: FileProvider.openUploadDialog,
                templateUrl: 'views/partials/upload-images-dialog.html',
                parent: angular.element(document.body),
                locals: { data: {
                        user: $scope.user,
                    }
                },
                targetEvent: $event,
                clickOutsideToClose: true
            }).then(function(answer) {
                $scope.images = $scope.images.concat(answer);
            }, function() {});
        };

        $scope.description = function(steps) {
            if (steps) return $sce.trustAsHtml(steps.trunc(260, true));
        };

        $scope.remove = function(image, $event) {
            var msg = $translate.instant('dialog.remove-image-1',{ title: image.title });
            if (image.recipes > 0) msg += '<br><br>' + $translate.instant('dialog.remove-image-2');
            var confirm = $mdDialog.confirm()
                .title($translate.instant('btn.delete-text'))
                .htmlContent(nl2br(msg))
                .ariaLabel($translate.instant('btn.delete-text'))
                .targetEvent($event)
                .ok($translate.instant('btn.delete-text'))
                .cancel($translate.instant('btn.cancel-text'));
            $mdDialog.show(confirm).then(function () {
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
                    $scope.images.splice($scope.images.findIndex(function(imageInArray) { return image.id == imageInArray.id; }), 1);
                }, function(response) {
                    NOTIFICATION.ParseErrorResponse(response, [400, 404], $translate, $rootScope, NotificationProvider);
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        };
    }]
);

authController.controller('Settings',
    ['$scope', '$rootScope', '$location', '$translate', '$mdDialog', '$timeout', 'AuthService', 'FileProvider', 'NotificationProvider', 'NOTIFICATION', 'DELAY_FUNCTIONS',
    function ($scope, $rootScope, $location, $translate, $mdDialog, $timeout, AuthService, FileProvider, NotificationProvider, NOTIFICATION, DELAY_FUNCTIONS) {
        $rootScope.errorMsg = false;
        $rootScope.progressBarActivated = true;

        DELAY_FUNCTIONS.initDelays($scope, $timeout);

        $scope.setDelay1();
        AuthService.GetProfile(function (response) {
            $scope.user = response.data;
            if (!$scope.user.language) {
                $scope.user.language = (window.navigator.userLanguage || window.navigator.language);
            }
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = false;
            $scope.setDelay2();
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [401], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
            $scope.setDelay2();
        });

        $scope.save = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            var userObj = angular.copy($scope.user);
            if (userObj.avatar) {
                userObj.avatar = userObj.avatar.id;
            }
            AuthService.EditProfile(userObj, function (response) {
                $rootScope.progressBarActivated = false;
                $scope.user = response.data;
                $translate.use($scope.user.language);
                NotificationProvider.notify({
                    title: $translate.instant('response.saved'),
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'backup',
                    styling: 'fontawesome'
                });
                AuthService.CheckToken($scope.user);
                $scope.setDelay2();
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [400], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };


        $scope.selectAvatar = function(ev) {
            $mdDialog.show({
                controller: FileProvider.openGalleryDialog,
                templateUrl: 'views/partials/gallery-dialog.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        selectedImages: ($scope.user.avatar) ? [ $scope.user.avatar ] : [],
                        mode: 'selectAvatar',
                        user: $scope.user,
                    }
                },
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function(answer) {
                $scope.user.avatar = answer;
            }, function() {});
        };
    }]
);
