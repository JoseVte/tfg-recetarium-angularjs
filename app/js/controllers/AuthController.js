var authController = angular.module('AuthController', []);

authController.controller('Login',
    ['$scope', '$rootScope', '$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Login';

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

        $scope.login = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            AuthService.Login($scope.email, $scope.password, !$scope.expiration, function (response) {
                AuthService.SaveCredentials(response.data.auth_token, JSON.parse(AuthService.ParseJwt(response.data.auth_token).sub));
                if (!$scope.expiration) {
                    AuthService.StartCronCheckToken();
                }
                $rootScope.progressBarActivated = false;
                $location.path('/');
            }, function (response) {
                if (response.status == 400 || response.status == 401) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data)
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se logueaba. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se logueaba.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('Register',
    ['$scope', '$rootScope','$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Registro';

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
            AuthService.Register(user, function (response) {
                AuthService.SaveCredentials(response.data.auth_token, JSON.parse(AuthService.ParseJwt(response.data.auth_token).sub));
                $rootScope.progressBarActivated = false;
                $location.path('/');
            }, function (response) {
                if (response.status == 400) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data)
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se registraba. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se registraba.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('Logout',
    ['$scope', '$location', 'AuthService', 'NotificationProvider',
    function ($scope,$location, AuthService, NotificationProvider) {
        NotificationProvider.notify({
            title: 'Adios :)',
            text: 'Gracias por venir. Vuelve pronto.',
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
    ['$scope', '$rootScope', '$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Recuperar contraseña';

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

        $scope.resetPassword = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.hasMessage = false;
            $scope.setDelay1();
            AuthService.ResetPassword($scope.email, function (response) {
                $scope.msg = response.data.msg;
                $scope.hasMessage = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            }, function (response) {
                if (response.status == 400 || response.status == 404) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data)
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se enviaba el email. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se enviaba el email.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('RecoverPassword',
    ['$scope', '$rootScope', '$routeParams', '$location', 'AuthService', '$timeout', 'NotificationProvider',
    function ($scope, $rootScope, $routeParams, $location, AuthService, $timeout, NotificationProvider) {
        $rootScope.headerTitle = 'Recuperar contraseña';

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

        $scope.recoverPassword = function () {
            $rootScope.errorMsg = false;
            $rootScope.progressBarActivated = true;
            $scope.hasMessage = false;
            $scope.setDelay1();
            AuthService.RecoverPassword($scope.email, $scope.password, $routeParams.token, function (response) {
                NotificationProvider.notify({
                    title: 'Contraseña cambiada con existo',
                    text: '',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'lock',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
                $location.path('/login');
            }, function (response) {
                if (response.status == 400) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data)
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se cambiaba la contraseña. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se cambiaba la contraseña.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };
    }]
);

authController.controller('ValidateEmail',
    ['$scope', '$rootScope', '$routeParams', '$location', 'AuthService', 'NotificationProvider',
    function ($scope, $rootScope, $routeParams, $location, AuthService, NotificationProvider) {
        $rootScope.headerTitle = 'Validando email';
        $rootScope.errorMsg = false;
        $rootScope.progressBarActivated = true;
        $scope.hasMessage = false;

        AuthService.ValidateEmail($routeParams.token, function (response) {
            NotificationProvider.notify({
                title: 'Email validado correctamente',
                type: 'success',
                addClass: 'material-icons md-light',
                icon_class: 'check_circle',
                style: 'fontawesome',
            });
            $rootScope.progressBarActivated = false;
            $location.path('/login');
        }, function (response) {
            if (response.status == 400) {
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Datos incorrectos',
                    msg: $.parseError(response.data)
                };
            } else {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se validaba el email. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se validaba el email.'
                };
            }
            $rootScope.errorMsg = true;
            $rootScope.progressBarActivated = false;
            $rootScope.headerTitle = 'Error';
        });
    }]
);

authController.controller('EditProfile',
    ['$scope', '$rootScope', '$location', '$timeout', '$sce', '$mdDialog', 'AuthService', 'FileService', 'NotificationProvider', 'FRIENDS_FUNCTIONS',
    function ($scope, $rootScope, $location, $timeout, $sce, $mdDialog, AuthService, FileService, NotificationProvider, FRIENDS_FUNCTIONS) {
        $rootScope.headerTitle = 'Editar perfil';

        $scope.infiniteScroll = {
            recipes: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
            },
            images: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
            },
            friends: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
            },
        };

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

        $scope.isMe = function(user) {
            return (user !== undefined && $rootScope.globals.user.user.id == user.id);
        };

        $scope.checkFriend = function(user) {
            var i = 0;
            if (user !== undefined) {
                while (i < user.friends.length) {
                    if (user.friends[i].user_id === $rootScope.globals.user.user.id) {
                        return true;
                    }
                    i++;
                }
            }
            return false;
        };

        $scope.loadPersonalData = function() {
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            AuthService.GetProfile(function (response) {
                $scope.user = response.data;
                $rootScope.errorMsg = false;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            }, function (response) {
                if (response.status !== 401){
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se cargaba el perfil. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se cargaba el perfil.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };

        $scope.loadUserRecipes = function() {
            $rootScope.progressBarActivated = true;
            AuthService.GetRecipes(function (response) {
                $scope.recipes = response.data;
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
            });
        };

        $scope.loadUserImages = function() {
            $rootScope.progressBarActivated = true;
            FileService.loadUserImages($rootScope.globals.user.user, function (response) {
                $scope.images = response.data;
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban las imagenes. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
            });
        };

        $scope.loadFriends = function() {
            $rootScope.progressBarActivated = true;
            $scope.infiniteScroll.friends.loadingNextPage = true;
            AuthService.getFriends($rootScope.globals.user.user, {
                page: $scope.infiniteScroll.friends.nextPageNumber,
                size: 10,
                order: 'firstName',
            }, function (response) {
                $scope.infiniteScroll.friends.data = $scope.infiniteScroll.friends.data.concat(response.data.data);
                $scope.infiniteScroll.friends.total = response.data.total;
                $rootScope.progressBarActivated = false;
                $scope.infiniteScroll.friends.nextPageNumber++;
                $scope.infiniteScroll.friends.loadingNextPage = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban los amigos. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
                $scope.infiniteScroll.friends.loadingNextPage = false;
            });
        };

        $scope.nextPageFriends = function () {
            if ($scope.infiniteScroll.friends.total > $scope.infiniteScroll.friends.data.length && !$scope.infiniteScroll.friends.loadingNextPage) {
                $scope.loadFriends();
            }
        };

        $scope.reloadFriends = function() {
            $scope.infiniteScroll.friends.data = [];
            $scope.infiniteScroll.friends.total = 1;
            $scope.infiniteScroll.friends.nextPageNumber = 1;
            $scope.loadFriends();
        };

        $scope.openUploadImage = function($event) {
            $mdDialog.show({
                controller: UserUploadDialogController,
                templateUrl: 'views/auth/upload_images_dialog.html',
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
                NotificationProvider.notify({
                    title: 'Datos guardados',
                    text: '',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'backup',
                    styling: 'fontawesome'
                });
                $scope.user = response.data;
                AuthService.CheckToken($scope.user);
                $scope.setDelay2();
            }, function (response) {
                if (response.status == 400) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data)
                    };
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se guardaba el perfil. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se guardaba el perfil.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };

        $scope.description = function(steps) {
            if (steps) return $sce.trustAsHtml(steps.trunc(260, true));
        };

        $scope.removeRecipe = function(recipe, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            var confirm = $mdDialog.confirm()
                .title('Borrar receta')
                .textContent('¿De verdad que quieres borrar la receta \'' + recipe.title +'\'?\nEsta acción no se puede deshacer.')
                .ariaLabel('Borrar')
                .targetEvent($event)
                .ok('Borrar')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function () {
                $rootScope.progressBarActivated = true;
                $rootScope.errorMsg = false;
                RecipeService.delete(recipe.id, function(response) {
                    NotificationProvider.notify({
                        title: 'Receta borrada',
                        text: 'Has borrado la receta \'' + recipe.title +'\'.',
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'check_circle',
                        styling: 'fontawesome'
                    });
                    $rootScope.progressBarActivated = false;
                    $scope.getRecipes();
                }, function(response) {
                    if (response.status == 404) {
                        $rootScope.error = {
                            icon: 'error_outline',
                            title: 'Receta no encontrada',
                            msg: $.parseError(response.data)
                        };
                    } else {
                        NotificationProvider.notify({
                            title: 'Un error ha ocurrido',
                            text: 'Ha ocurrido un error mientras se borraba la receta. Por favor, intentelo más tarde.',
                            type: 'error',
                            addclass: 'custom-error-notify',
                            icon: 'material-icons md-light',
                            styling: 'fontawesome'
                        });
                        $rootScope.error = {
                            icon: 'error_outline',
                            title: 'Algo ha ido mal',
                            msg: 'Ha ocurrido un error mientras se borraba la receta.'
                        };
                    }
                    $rootScope.errorMsg = true;
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        };

        $scope.remove = function(image, $event) {
            var msg = '¿De verdad que quieres borrar la imagen \'' + image.title +'\'?\r\nEsta acción no se puede deshacer.';
            if (image.recipes > 0) msg += '\r\nLa imagen desaparecerá de todas las recetas';
            var confirm = $mdDialog.confirm()
                .title('Borrar imagen')
                .textContent(msg)
                .ariaLabel('Borrar')
                .targetEvent($event)
                .ok('Borrar')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function () {
                $rootScope.progressBarActivated = true;
                $rootScope.errorMsg = false;
                FileService.deleteFile($scope.user, image.id, function(response) {
                    NotificationProvider.notify({
                        title: 'Receta borrada',
                        text: 'Has borrado la imagen \'' + image.title +'\'.',
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'check_circle',
                        styling: 'fontawesome'
                    });
                    $rootScope.progressBarActivated = false;
                    $scope.images.splice($scope.images.findIndex(function(imageInArray) { return image.id == imageInArray.id; }), 1);
                }, function(response) {
                    if (response.status == 404) {
                        $rootScope.error = {
                            icon: 'error_outline',
                            title: 'Receta no encontrada',
                            msg: $.parseError(response.data)
                        };
                    } else {
                        NotificationProvider.notify({
                            title: 'Un error ha ocurrido',
                            text: 'Ha ocurrido un error mientras se borraba la imagen. Por favor, intentelo más tarde.',
                            type: 'error',
                            addclass: 'custom-error-notify',
                            icon: 'material-icons md-light',
                            styling: 'fontawesome'
                        });
                        $rootScope.error = {
                            icon: 'error_outline',
                            title: 'Algo ha ido mal',
                            msg: 'Ha ocurrido un error mientras se borraba la imagen.'
                        };
                    }
                    $rootScope.errorMsg = true;
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        };

        $scope.addFriend = function (user, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            FRIENDS_FUNCTIONS.AddFriend(UserService, NotificationProvider, $rootScope.globals.user.user, user, $scope.reloadFriends);
        };

        $scope.deleteFriend = function (user, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            FRIENDS_FUNCTIONS.DeleteFriend(UserService, NotificationProvider, $rootScope.globals.user.user, user, $scope.reloadFriends);
        };

        $scope.selectAvatar = function(ev) {
            $mdDialog.show({
                controller: GalleryDialogController,
                templateUrl: 'views/user/gallery_dialog.html',
                parent: angular.element(document.body),
                locals: { data: {
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

function UserUploadDialogController($scope, $rootScope, $mdDialog, data, FileService, NotificationProvider) {
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
