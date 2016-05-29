var userController = angular.module('UserController', []);

userController.constant('FRIENDS_FUNCTIONS', {
    AddFriend: function($rootScope, $translate, UserService, NotificationProvider, NOTIFICATION, currentUser, user, callback) {
        $rootScope.progressBarActivated = true;
        $rootScope.errorMsg = false;
        UserService.addFriend(currentUser.id, user.id, function (response) {
            NotificationProvider.notify({
                title: $translate.instant('friend.added', { name: user.first_name + ' ' + user.last_name }),
                type: 'success',
                addclass: 'custom-success-notify',
                icon: 'material-icons md-light',
                icon_class: 'check_circle',
                styling: 'fontawesome'
            });
            $rootScope.progressBarActivated = false;
            callback();
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [400], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
        });
    },
    DeleteFriend: function($rootScope, $translate, UserService, NotificationProvider, NOTIFICATION, currentUser, user, callback) {
        $rootScope.progressBarActivated = true;
        $rootScope.errorMsg = false;
        UserService.deleteFriend(currentUser.id, user.id, function (response) {
            NotificationProvider.notify({
                title: $translate.instant('friend.deleted', { name: user.first_name + ' ' + user.last_name }),
                type: 'success',
                addclass: 'custom-success-notify',
                icon: 'material-icons md-light',
                icon_class: 'check_circle',
                styling: 'fontawesome'
            });
            $rootScope.progressBarActivated = false;
            callback();
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [400], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
        });
    }
});

userController.constant('USER_FUNCTIONS', {
    Users: function($scope) {
        $scope.users = [];
        $scope.searchText = '';
        $scope.total = 1;
        $scope.nextPageNumber = 1;
        $scope.hasError = false;
        $scope.loadingNextPage = false;

        $scope.reloadUsers = function() {
            $scope.users = [];
            $scope.total = 1;
            $scope.nextPageNumber = 1;
            $scope.hasError = false;
            $scope.getUsers();
        };

        $scope.$watch(function() {
            return $scope.searchText;
        }, function (newVal, oldVal) {
            $scope.reloadUsers();
        });

        $scope.nextPage = function () {
            if ($scope.total > $scope.users.length && !$scope.loadingNextPage && !$scope.hasError) {
                $scope.getUsers();
            }
        };
    },
    Recipes: function ($scope, $rootScope, $translate, $mdDialog, userId, UserService, RecipeService, NotificationProvider, NOTIFICATION) {
        $scope.loadUserRecipes = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
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
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.infiniteScroll.recipes.hasError = true;
            });
        };

        $scope.nextPageRecipes = function () {
            if ($scope.infiniteScroll.recipes.total > $scope.infiniteScroll.recipes.data.length && !$scope.infiniteScroll.recipes.loadingNextPage && !$scope.infiniteScroll.recipes.hasError) {
                $scope.loadUserRecipes();
            }
        };

        $scope.reloadUserRecipes = function() {
            $scope.infiniteScroll.recipes.data = [];
            $scope.infiniteScroll.recipes.total = 1;
            $scope.infiniteScroll.recipes.nextPageNumber = 1;
            $scope.infiniteScroll.recipes.hasError = false;
            $scope.loadUserRecipes();
        };

        $scope.removeRecipe = function(recipe, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            var msg = $translate.instant('dialog.remove-recipe', { title: recipe.title });
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
                RecipeService.delete(recipe.id, function(response) {
                    NotificationProvider.notify({
                        title: response.data.msg,
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'check_circle',
                        styling: 'fontawesome'
                    });
                    $rootScope.progressBarActivated = false;
                    $scope.reloadUserRecipes();
                }, function(response) {
                    NOTIFICATION.ParseErrorResponse(response, [404], $translate, $rootScope, NotificationProvider);
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        };
    },
    RecipesFavorites: function ($scope, $rootScope, $translate, $mdDialog, userId, UserService, RecipeService, NotificationProvider, NOTIFICATION) {
        $scope.loadUserRecipesFavorites = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
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
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.infiniteScroll.recipesFavorites.hasError = true;
            });
        };

        $scope.nextPageRecipesFavorites = function () {
            if ($scope.infiniteScroll.recipesFavorites.total > $scope.infiniteScroll.recipesFavorites.data.length && !$scope.infiniteScroll.recipesFavorites.loadingNextPage && !$scope.infiniteScroll.recipesFavorites.hasError) {
                $scope.loadUserRecipesFavorites();
            }
        };

        $scope.reloadUserRecipesFavorites = function() {
            $scope.infiniteScroll.recipesFavorites.data = [];
            $scope.infiniteScroll.recipesFavorites.total = 1;
            $scope.infiniteScroll.recipesFavorites.nextPageNumber = 1;
            $scope.infiniteScroll.recipesFavorites.hasError = false;
            $scope.loadUserRecipesFavorites();
        };

        $scope.removeFavorite = function(recipe, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            RecipeService.toggleFav(recipe.id, function (response) {
                NotificationProvider.notify({
                    title: $translate.instant('response.saved'),
                    type: 'error',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'favorite_border',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
                $scope.reloadUserRecipesFavorites();
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
            });
        };
    },
    Friends: function ($scope, $rootScope, $translate, userId, UserService, NotificationProvider, FRIENDS_FUNCTIONS, NOTIFICATION) {
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
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.infiniteScroll.friends.hasError = true;
            });
        };

        $scope.nextPageFriends = function () {
            if ($scope.infiniteScroll.friends.total > $scope.infiniteScroll.friends.data.length && !$scope.infiniteScroll.friends.loadingNextPage && !$scope.infiniteScroll.friends.hasError) {
                $scope.loadFriends();
            }
        };

        $scope.reloadFriends = function() {
            $scope.infiniteScroll.friends.data = [];
            $scope.infiniteScroll.friends.total = 1;
            $scope.infiniteScroll.friends.nextPageNumber = 1;
            $scope.infiniteScroll.friends.hasError = false;
            $scope.loadFriends();
        };

        $scope.addFriend = function (user, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            FRIENDS_FUNCTIONS.AddFriend($rootScope, $translate, UserService, NotificationProvider, NOTIFICATION, $rootScope.globals.user.user, user, $scope.loadPersonalData);
        };

        $scope.deleteFriend = function (user, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            FRIENDS_FUNCTIONS.DeleteFriend($rootScope, $translate, UserService, NotificationProvider, NOTIFICATION, $rootScope.globals.user.user, user, $scope.loadPersonalData);
        };
    },
});

userController.controller('UserAll',
    ['$scope', '$rootScope', '$translate', 'UserService', 'NotificationProvider', 'USER_FUNCTIONS', 'NOTIFICATION',
    function ($scope, $rootScope, $translate, UserService, NotificationProvider, USER_FUNCTIONS, NOTIFICATION) {
        USER_FUNCTIONS.Users($scope);

        $scope.getUsers = function() {
            $scope.loadingNextPage = true;
            $rootScope.errorMsg = false;
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
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $scope.hasError = true;
                $scope.loadingNextPage = false;
                $rootScope.progressBarActivated = false;
            });
        };
    }]
);

userController.controller('UserShow',
    ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', '$mdDialog', '$translate', 'UserService', 'RecipeService', 'NotificationProvider', 'USER_FUNCTIONS', 'FRIENDS_FUNCTIONS', 'NOTIFICATION', 'DELAY_FUNCTIONS',
    function ($scope, $rootScope, $location, $routeParams, $timeout, $mdDialog, $translate, UserService, RecipeService, NotificationProvider, USER_FUNCTIONS, FRIENDS_FUNCTIONS, NOTIFICATION, DELAY_FUNCTIONS) {
        $rootScope.HasBack = true;
        $scope.commentsActived = false;

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
            friends: {
                data: [],
                total: 1,
                nextPageNumber: 1,
                loadingNextPage: false,
                hasError: false,
            },
        };

        /** Aux **/
        $rootScope.back = function () {
            $location.path('/users');
        };

        DELAY_FUNCTIONS.initDelays($scope, $timeout);

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
            $rootScope.errorMsg = false;
            $scope.setDelay1();
            UserService.get($routeParams.id, function (response) {
                $scope.user = response.data;
                $scope.header_title = {
                    name: $.getFullName($scope.user),
                };
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [404], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
                $scope.setDelay2();
            });
        };

        $scope.addFriendHome = function (user) {
            FRIENDS_FUNCTIONS.AddFriend($rootScope, $translate, UserService, NotificationProvider, NOTIFICATION, $rootScope.globals.user.user, user, $scope.loadPersonalData);
        };

        $scope.deleteFriendHome = function (user) {
            FRIENDS_FUNCTIONS.DeleteFriend($rootScope, $translate, UserService, NotificationProvider, NOTIFICATION, $rootScope.globals.user.user, user, $scope.loadPersonalData);
        };

        USER_FUNCTIONS.Recipes($scope, $rootScope, $translate, $mdDialog, $routeParams.id, UserService, RecipeService, NotificationProvider, NOTIFICATION);

        USER_FUNCTIONS.RecipesFavorites($scope, $rootScope, $translate, $mdDialog, $routeParams.id, UserService, RecipeService, NotificationProvider, NOTIFICATION);

        USER_FUNCTIONS.Friends($scope, $rootScope, $translate, $routeParams.id, UserService, NotificationProvider, FRIENDS_FUNCTIONS, NOTIFICATION);
    }]
);

userController.controller('FriendAll',
    ['$scope', '$rootScope', '$translate', 'UserService', 'NotificationProvider', 'USER_FUNCTIONS', 'NOTIFICATION',
    function ($scope, $rootScope, $translate, UserService, NotificationProvider, USER_FUNCTIONS, NOTIFICATION) {
        $rootScope.headerTitle = 'Amigos';

        USER_FUNCTIONS.Users($scope);

        $scope.getUsers = function() {
            $scope.loadingNextPage = true;
            $rootScope.errorMsg = false;
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
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $scope.hasError = true;
                $scope.loadingNextPage = false;
                $rootScope.progressBarActivated = false;
            });
        };
    }]
);
