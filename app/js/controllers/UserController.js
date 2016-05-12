var userController = angular.module('UserController', []);

userController.constant('FRIENDS_FUNCTIONS', {
    AddFriend: function(UserService, NotificationProvider, currentUser, user, callback) {
        UserService.addFriend(currentUser.id, user.id, function (response) {
            NotificationProvider.notify({
                title: 'Amigo añadido',
                text: 'Has añadido a \'' + user.first_name +' ' + user.last_name + '\' como amigo.',
                type: 'success',
                addclass: 'custom-success-notify',
                icon: 'material-icons md-light',
                icon_class: 'check_circle',
                styling: 'fontawesome'
            });
            callback();
        }, function (response) {
            NotificationProvider.notify({
                title: 'Un error ha ocurrido',
                text: 'Ha ocurrido un error mientras se añadia a tus amigos. Por favor, intentelo más tarde.',
                type: 'error',
                addclass: 'custom-error-notify',
                icon: 'material-icons md-light',
                styling: 'fontawesome'
            });
        });
    },
    DeleteFriend: function(UserService, NotificationProvider, currentUser, user, callback) {
        UserService.deleteFriend(currentUser.id, user.id, function (response) {
            NotificationProvider.notify({
                title: 'Amigo borrado',
                text: 'Has borrado a \'' + user.first_name +' ' + user.last_name + '\' de tus amigos.',
                type: 'success',
                addclass: 'custom-success-notify',
                icon: 'material-icons md-light',
                icon_class: 'check_circle',
                styling: 'fontawesome'
            });
            callback();
        }, function (response) {
            NotificationProvider.notify({
                title: 'Un error ha ocurrido',
                text: 'Ha ocurrido un error mientras se borraba de tus amigos. Por favor, intentelo más tarde.',
                type: 'error',
                addclass: 'custom-error-notify',
                icon: 'material-icons md-light',
                styling: 'fontawesome'
            });
        });
    }
});

userController.constant('USER_FUNCTIONS', {
    Users: function($scope) {
        $scope.users = [];
        $scope.searchText = '';
        $scope.total = 1;
        $scope.nextPageNumber = 1;

        $scope.reloadUsers = function() {
            $scope.users = [];
            $scope.total = 1;
            $scope.nextPageNumber = 1;
            $scope.getUsers();
        };

        $scope.$watch(function() {
            return $scope.searchText;
        }, function (newVal, oldVal) {
            $scope.reloadUsers();
        });

        $scope.nextPage = function () {
            if ($scope.total > $scope.users.length) {
                $scope.getUsers();
            }
        };
    },
    Recipes: function ($scope, $rootScope, $mdDialog, userId, UserService, RecipeService, NotificationProvider) {
        $scope.loadUserRecipes = function() {
            $rootScope.progressBarActivated = true;
            $scope.infiniteScroll.recipes.loadingNextPage = true;
            UserService.getRecipes(userId, {
                page: $scope.infiniteScroll.recipes.nextPageNumber,
                size: 10
            }, function (response) {
                $scope.infiniteScroll.recipes.data = $scope.infiniteScroll.recipes.data.concat(response.data.data);
                $scope.infiniteScroll.recipes.total = response.data.total;
                $rootScope.progressBarActivated = false;
                $scope.infiniteScroll.recipes.nextPageNumber++;
                $scope.infiniteScroll.recipes.loadingNextPage = false;
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

        $scope.nextPageRecipes = function () {
            if ($scope.infiniteScroll.recipes.total > $scope.infiniteScroll.recipes.data.length && !$scope.infiniteScroll.recipes.loadingNextPage) {
                $scope.loadUserRecipes();
            }
        };

        $scope.reloadUserRecipes = function() {
            $scope.infiniteScroll.recipes.data = [];
            $scope.infiniteScroll.recipes.total = 1;
            $scope.infiniteScroll.recipes.nextPageNumber = 1;
            $scope.loadUserRecipes();
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
                    $scope.reloadUserRecipes();
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
    },
    RecipesFavorites: function ($scope, $rootScope, $mdDialog, userId, UserService, RecipeService, NotificationProvider) {
        $scope.loadUserRecipesFavorites = function() {
            $rootScope.progressBarActivated = true;
            $scope.infiniteScroll.recipesFavorites.loadingNextPage = true;
            UserService.getRecipesFavorites(userId, {
                page: $scope.infiniteScroll.recipesFavorites.nextPageNumber,
                size: 10
            }, function (response) {
                $scope.infiniteScroll.recipesFavorites.data = $scope.infiniteScroll.recipesFavorites.data.concat(response.data.data);
                $scope.infiniteScroll.recipesFavorites.total = response.data.total;
                $rootScope.progressBarActivated = false;
                $scope.infiniteScroll.recipesFavorites.nextPageNumber++;
                $scope.infiniteScroll.recipesFavorites.loadingNextPage = false;
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

        $scope.nextPageRecipesFavorites = function () {
            if ($scope.infiniteScroll.recipesFavorites.total > $scope.infiniteScroll.recipesFavorites.data.length && !$scope.infiniteScroll.recipesFavorites.loadingNextPage) {
                $scope.loadUserRecipesFavorites();
            }
        };

        $scope.reloadUserRecipesFavorites = function() {
            $scope.infiniteScroll.recipesFavorites.data = [];
            $scope.infiniteScroll.recipesFavorites.total = 1;
            $scope.infiniteScroll.recipesFavorites.nextPageNumber = 1;
            $scope.loadUserRecipesFavorites();
        };

        $scope.removeFavorite = function(recipe, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            RecipeService.toggleFav(recipe.id, function (response) {
                NotificationProvider.notify({
                    title: 'Guardado',
                    text: '',
                    type: 'error',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: $scope.fav ? 'favorite' : 'favorite_border',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
                $scope.reloadUserRecipesFavorites();
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
            });
        };
    },
    Friends: function ($scope, $rootScope, userId, UserService, NotificationProvider, FRIENDS_FUNCTIONS) {
        $scope.loadFriends = function() {
            $rootScope.progressBarActivated = true;
            $scope.infiniteScroll.friends.loadingNextPage = true;
            UserService.getFriends(userId, {
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
    },
});

userController.controller('UserAll',
    ['$scope', '$rootScope', 'UserService', 'NotificationProvider', 'USER_FUNCTIONS',
    function ($scope, $rootScope, UserService, NotificationProvider, USER_FUNCTIONS) {
        $rootScope.headerTitle = 'Usuarios';

        USER_FUNCTIONS.Users($scope);

        $scope.getUsers = function() {
            $scope.loadingNextPage = true;
            UserService.search({
                page: $scope.nextPageNumber,
                size: 10,
                order: 'firstName',
                search: $scope.searchText,
            }, function (response) {
                var responseData = response.data;
                $scope.users = $scope.users.concat(responseData.data);
                $scope.nextPageNumber++;
                $scope.total = responseData.total;
                $scope.loadingNextPage = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban los usuarios. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaban los usuarios.'
                };
                $rootScope.errorMsg = true;
                $scope.loadingNextPage = false;
            });
        };
    }]
);

userController.controller('UserShow',
    ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', '$mdDialog', 'UserService', 'RecipeService', 'NotificationProvider', 'USER_FUNCTIONS', 'FRIENDS_FUNCTIONS',
    function ($scope, $rootScope, $location, $routeParams, $timeout, $mdDialog, UserService, RecipeService, NotificationProvider, USER_FUNCTIONS, FRIENDS_FUNCTIONS) {
        $rootScope.headerTitle = 'Perfil del usuario';
        $rootScope.HasBack = true;
        $scope.commentsActived = false;

        $scope.infiniteScroll = {
            recipes: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
            },
            recipesFavorites: {
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

        /** Aux **/
        $rootScope.back = function () {
            $location.path('/users');
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

        /** Personal **/
        $scope.loadPersonalData = function() {
            $rootScope.progressBarActivated = true;
            $scope.setDelay1();
            UserService.get($routeParams.id, function (response) {
                $scope.user = response.data;
                $rootScope.errorMsg = false;
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            }, function (response) {
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
                $rootScope.errorMsg = true;
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };

        $scope.addFriendHome = function (user) {
            FRIENDS_FUNCTIONS.AddFriend(UserService, NotificationProvider, $rootScope.globals.user.user, user, $scope.loadPersonalData);
        };

        $scope.deleteFriendHome = function (user) {
            FRIENDS_FUNCTIONS.DeleteFriend(UserService, NotificationProvider, $rootScope.globals.user.user, user, $scope.loadPersonalData);
        };

        USER_FUNCTIONS.Recipes($scope, $rootScope, $mdDialog, $routeParams.id, UserService, RecipeService, NotificationProvider);

        USER_FUNCTIONS.RecipesFavorites($scope, $rootScope, $mdDialog, $routeParams.id, UserService, RecipeService, NotificationProvider);

        USER_FUNCTIONS.Friends($scope, $rootScope, $routeParams.id, UserService, NotificationProvider, FRIENDS_FUNCTIONS);
    }]
);

userController.controller('FriendAll',
    ['$scope', '$rootScope', 'UserService', 'NotificationProvider', 'USER_FUNCTIONS',
    function ($scope, $rootScope, UserService, NotificationProvider, USER_FUNCTIONS) {
        $rootScope.headerTitle = 'Amigos';

        USER_FUNCTIONS.Users($scope);

        $scope.getUsers = function() {
            $scope.loadingNextPage = true;
            UserService.getFriends($rootScope.globals.user.user.id, {
                page: $scope.nextPageNumber,
                size: 10,
                order: 'firstName',
                search: $scope.searchText,
            }, function (response) {
                var responseData = response.data;
                $scope.users = $scope.users.concat(responseData.data);
                $scope.nextPageNumber++;
                $scope.total = responseData.total;
                $scope.loadingNextPage = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban los amigos. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaban los amigos.'
                };
                $rootScope.errorMsg = true;
                $scope.loadingNextPage = false;
            });
        };
    }]
);
