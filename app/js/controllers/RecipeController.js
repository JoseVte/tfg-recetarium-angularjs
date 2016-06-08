var recipeController = angular.module('RecipeController', []);

recipeController.constant('DIFF', {
    'class': {
        'EASY': 'md-green',
        'MEDIUM': 'md-yellow',
        'HARD': 'md-red'
    },
    'name': ['EASY', 'MEDIUM', 'HARD']
});

recipeController.constant('VISIBILITY', {
    'class': {
        'PUBLIC': 'md-green',
        'FRIENDS': 'md-yellow',
        'PRIVATE': 'md-red'
    },
    'icon': {
        'PUBLIC': 'lock_open',
        'FRIENDS': 'lock_outline',
        'PRIVATE': 'lock'
    },
    'name': ['PUBLIC', 'FRIENDS', 'PRIVATE']
});

recipeController.constant('EDIT_FUNCTIONS', {
    LoadScope: function ($scope, DIFF, VISIBILITY) {
        $scope.requestSlug = null;
        $scope.validSlug = true;
        $scope.loadingSlug = false;
        $scope.diffs = DIFF.name;
        $scope.visibilities = VISIBILITY.name;
        $scope.recipe = {};
        $scope.tags = [];
        $scope.images = {
            recipe: [],
            show: [],
            index: 0
        };
        $scope.imagesLink = {};
    },
    LoadRecipe: function($scope, $rootScope, $translate, RecipeService, CategoryService, NotificationProvider, NOTIFICATION, response) {
        try {
            $scope.recipe = response.data;
            $scope.recipe.chipTags = response.data.tags;

            CategoryService.all(function (response) {
                $scope.categories = response.data;
                $scope.categories.unshift({ id: null, text: 'Ninguna'});
                if ($scope.recipe.category) $scope.recipe.category_id = $scope.recipe.category.id;
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
            });

            $rootScope.progressBarActivated = false;
        } catch (err) {
            NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
            console.error(err);
            $rootScope.progressBarActivated = false;
        }
    },
    CommonFunctions: function($scope, $rootScope, $location, $timeout, $compile, $mdDialog, $translate,
        RecipeService, CategoryService, TagService, IngredientService,
        NotificationProvider, FileProvider, DIFF, VISIBILITY, EDIT_FUNCTIONS, NOTIFICATION) {
            /**
             * Auxiliars
             */
            $scope.getDifficulty = function (diff) { return DIFF.class[diff]; };
            $scope.getVisibilityIcon = function (visibility) { return VISIBILITY.icon[visibility]; };
            $scope.getVisibilityClass = function (visibility) { return VISIBILITY.class[visibility]; };

            /**
             * Ingredients
             */
            $scope.$watch(function() {
                return $scope.recipe.newIngredient ?
                $scope.recipe.newIngredient.name:
                $scope.recipe.newIngredient;
            }, function (newVal, oldVal) {
                $scope.formRecipe.newIngredientName.$error = {};
            });

            $scope.addIngredient = function() {
                if ($scope.recipe.newIngredient && $scope.recipe.newIngredient !== null && $scope.recipe.newIngredient.name !== null && $scope.recipe.newIngredient.name !== '') {
                    EDIT_FUNCTIONS.AddIngredient($scope, $rootScope, $translate, IngredientService, NotificationProvider, NOTIFICATION);
                } else {
                    $scope.formRecipe.newIngredientName.$error.customRequired = true;
                }
            };

            $scope.removeIngredient = function(index) {
                EDIT_FUNCTIONS.DeleteIngredient($scope, $rootScope, $translate, IngredientService, NotificationProvider, NOTIFICATION, index);
            };

            /**
             * Slug
             */
            $scope.$watch(function() {
                return $scope.recipe.title;
            }, function (newVal, oldVal) {
                $scope.recipe.slug = RecipeService.getSlug(newVal);
            });

            $scope.$watch(function() {
                return $scope.recipe.slug;
            }, function (newVal, oldVal) {
                $scope.formRecipe.slug.$error = {};
                $scope.abortSlugRequest();
                if (newVal && newVal.length > 0) {
                    $scope.loadingSlug = true;
                    $scope.validSlugIcon = 'autorenew';
                    $timeout(function() {
                        requestSlug = RecipeService.checkSlugWithId(newVal, $scope.recipe.id).then(
                            function (response) {
                                $scope.loadingSlug = false;
                                if (response.status == 200) {
                                    $scope.validSlugIcon = 'done';
                                } else {
                                    $scope.formRecipe.slug.$error.validSlug = true;
                                    $scope.validSlugIcon = 'error';
                                }
                            },
                            function (response) {
                                $scope.loadingSlug = false;
                                $scope.formRecipe.slug.$error.validSlug = true;
                                $scope.validSlugIcon = 'error';
                            }
                        );
                    }, 500);
                } else {
                    $scope.validSlugIcon = 'error';
                }
            });

            // Abort the check slug request
            $scope.abortSlugRequest = function () {
                return ($scope.requestSlug && $scope.requestSlug.abort());
            };

            /**
             * Categories
             */
            $scope.loadCategories = function() {
                EDIT_FUNCTIONS.AllCategories($scope, $rootScope, $translate, CategoryService, NotificationProvider, NOTIFICATION);
            };

            $scope.$watch(function() {
                return $scope.recipe.category_id;
            }, function (newVal, oldVal) {
                if (newVal === null) $scope.recipe.category_id = undefined;
            });

            /**
             * Tags
             */
            $scope.loadTags = function(search) {
                return EDIT_FUNCTIONS.SearchTag($scope, $rootScope, $translate, TagService, NotificationProvider, NOTIFICATION, search);
            };

            $scope.transformChip = function(chip) {
                if (angular.isObject(chip)) { return chip; }
                return { text: chip, type: 'nuevo' };
            };

            $scope.tagSearch = function(search) {
                if(search) {
                    return $scope.loadTags(search).then(function(response) {
                        $scope.tags = response.filter(function (el) { return !$.containsId(el, $scope.recipe.chipTags); });
                        return $scope.tags;
                    });
                }
                return [];
            };

            /**
             * Images
             */
            $scope.selectImageMain = function(ev) {
                $mdDialog.show({
                    controller: FileProvider.openGalleryDialog,
                    templateUrl: 'views/partials/gallery-dialog.html',
                    parent: angular.element(document.body),
                    locals: { data: {
                            selectedImages: ($scope.recipe.image_main) ? [ $scope.recipe.image_main ] : [],
                            mode: 'selectImageMain',
                            user: $scope.recipe.user,
                        }
                    },
                    targetEvent: ev,
                    clickOutsideToClose: true
                }).then(function(answer) {
                    $scope.recipe.image_main = answer;
                }, function() {});
            };

            $scope.selectImages = function(ev) {
                $mdDialog.show({
                    controller: FileProvider.openGalleryDialog,
                    templateUrl: 'views/partials/gallery-dialog.html',
                    parent: angular.element(document.body),
                    locals: { data: {
                        selectedImages: $scope.recipe.files,
                        mode: 'selectImages',
                        user: $scope.recipe.user,
                    }
                },
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function(answer) {
                $scope.recipe.files = answer;
            }, function() {});
        };

        $scope.removeImageFromRecipe = function(index) {
            $scope.recipe.files.splice(index, 1);
        };
    },
    AddIngredient: function($scope, $rootScope, $translate, IngredientService, NotificationProvider, NOTIFICATION) {
        $scope.formRecipe.newIngredientName.$error = {};
        $rootScope.errorMsg = false;
        $rootScope.progressBarActivated = true;
        var ingredient = {
            name: $scope.recipe.newIngredient.name,
            count: $scope.recipe.newIngredient.count
        };
        IngredientService.add($scope.recipe.id, ingredient, function (response) {
            $scope.recipe.ingredients.push(response.data);
            $rootScope.progressBarActivated = false;
            $scope.recipe.newIngredient.name = null;
            $scope.recipe.newIngredient.count = null;
            NotificationProvider.notify({
                title: $translate.instant('response.added'),
                type: 'success',
                addclass: 'custom-success-notify',
                icon: 'material-icons md-light',
                icon_class: 'restaurant_menu',
                styling: 'fontawesome'
            });
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [400, 401], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
            $scope.recipe.newIngredient.name = null;
            $scope.recipe.newIngredient.count = null;
        });
    },
    DeleteIngredient: function($scope, $rootScope, $translate, IngredientService, NotificationProvider, NOTIFICATION, index) {
        var ingredient = $scope.recipe.ingredients[index];
        $rootScope.errorMsg = false;
        $rootScope.progressBarActivated = true;
        IngredientService.delete($scope.recipe.id, ingredient.id, function (response) {
            $scope.recipe.ingredients.splice(index, 1);
            NotificationProvider.notify({
                title: $translate.instant('response.deleted'),
                type: 'success',
                addclass: 'custom-success-notify',
                icon: 'material-icons md-light',
                icon_class: 'restaurant_menu',
                styling: 'fontawesome'
            });
            $rootScope.progressBarActivated = false;
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [400, 401, 404], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
        });
    },
    AllCategories: function($scope, $rootScope, $translate, CategoryService, NotificationProvider, NOTIFICATION) {
        CategoryService.all(function (response) {
            $scope.categories = response.data;
            $scope.categories.unshift({ id: null, text: 'Ninguna'});
            $rootScope.errorMsg = false;
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
        });
    },
    SearchTag: function ($scope, $rootScope, $translate, TagService, NotificationProvider, NOTIFICATION, search) {
        return TagService.search(search, function (response) {
            $rootScope.errorMsg = false;
            return response.data;
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
            return [];
        });
    },
    AddTagById: function ($rootScope, $translate, TagService, NotificationProvider, NOTIFICATION, array, id) {
        TagService.searchById(id, function (response) {
            $rootScope.errorMsg = false;
            array.push(response.data);
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [404], $translate, $rootScope, NotificationProvider);
        });
    },
});

recipeController.controller('RecipeAll',
    ['$scope', '$rootScope', '$location', '$routeParams', '$sce', '$mdDialog', '$translate', 'RecipeService', 'TagService', 'NotificationProvider', 'EDIT_FUNCTIONS', 'NOTIFICATION',
    function ($scope, $rootScope, $location, $routeParams, $sce, $mdDialog, $translate, RecipeService, TagService, NotificationProvider, EDIT_FUNCTIONS, NOTIFICATION) {
        $scope.recipes = [];
        $scope.tags = [];
        $scope.tagsFromURI = [];
        $scope.total = 0;
        $scope.nextPageNumber = 1;
        $rootScope.progressBarActivated = true;
        $scope.hasError = false;
        $scope.loadingNextPage = false;
        var numTags = 0;
        var recipesLoaded = false;

        if ($routeParams !== null && !angular.equals({}, $routeParams) && $routeParams.hasOwnProperty('tag')) {
            if (angular.isArray($routeParams.tag)) {
                numTags = $routeParams.tag.length;
                for (var tagText in $routeParams.tag) {
                    if ($routeParams.tag.hasOwnProperty(tagText)) {
                        EDIT_FUNCTIONS.AddTagById($rootScope, $translate, TagService, NotificationProvider, NOTIFICATION, $scope.tagsFromURI, $routeParams.tag[tagText]);
                    }
                }
            } else {
                numTags = 1;
                EDIT_FUNCTIONS.AddTagById($rootScope, $translate, TagService, NotificationProvider, NOTIFICATION, $scope.tagsFromURI, $routeParams.tag);
            }
        }

        $scope.$watchCollection('tagsFromURI', function (newVal, oldVal) {
            if ($scope.tagsFromURI.length == numTags) {
                $scope.tags = angular.copy($scope.tagsFromURI);
            }
        });

        $scope.$watchCollection('tags', function (newVal, oldVal) {
            if (recipesLoaded) {
                $location.search({tag: $.getArrayId($scope.tags)});
                recipesLoaded = false;
            } else if ($scope.tagsFromURI.length == numTags) {
                $scope.reloadRecipes();
                recipesLoaded = true;
            }
        });

        $scope.reloadRecipes = function() {
            $scope.recipes = [];
            $scope.total = 1;
            $scope.nextPageNumber = 1;
            $scope.hasError = false;
            $scope.getRecipes();
        };

        $scope.getRecipes = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $scope.loadingNextPage = true;
            RecipeService.search({
                page: $scope.nextPageNumber,
                size: 10,
                search: $rootScope.searchString,
                tags: $.getArrayId($scope.tags),
            }, function (response) {
                var responseData = response.data;
                $scope.recipes = $scope.recipes.concat(responseData.data);
                $scope.nextPageNumber++;
                $scope.total = responseData.total;
                $scope.loadingNextPage = false;
                $rootScope.progressBarActivated = false;
                $('.md-scroll-mask').remove();
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $scope.hasError = true;
                $scope.loadingNextPage = false;
                $rootScope.progressBarActivated = false;
                $('.md-scroll-mask').remove();
            });
        };

        $scope.nextPage = function () {
            if ($scope.total > $scope.recipes.length && !$scope.loadingNextPage && !$scope.hasError) {
                $scope.getRecipes();
            }
        };

        $scope.tagSearch = function(search) {
            if(search) {
                return $scope.loadTags(search).then(function(response) {
                    return response;
                });
            }
            return [];
        };

        $scope.loadTags = function(search) {
            return EDIT_FUNCTIONS.SearchTag($scope, $rootScope, $translate, TagService, NotificationProvider, NOTIFICATION, search);
        };

        $scope.description = function(steps) {
            if (steps) return $sce.trustAsHtml(steps.trunc(260, true));
        };

        $scope.isMine = function(user) {
            if ($rootScope.globals.user) {
                var auth = $rootScope.globals.user;
                return (auth.id == user.id && auth.email == user.email && auth.username == user.username) || auth.type == 'ADMIN';
            }
            return false;
        };

        $scope.remove = function(recipe, $event) {
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
                    $scope.reloadRecipes();
                }, function(response) {
                    NOTIFICATION.ParseErrorResponse(response, [404], $translate, $rootScope, NotificationProvider);
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        };
    }]
);

recipeController.controller('RecipeShow',
    ['$scope', '$rootScope', '$location', '$routeParams', '$sce', '$compile', '$mdDialog', '$translate', '$window', 'RecipeService', 'CommentService', 'CommentProvider', 'NotificationProvider', 'RatingProvider', 'DIFF', 'VISIBILITY', 'NOTIFICATION',
    function ($scope, $rootScope, $location, $routeParams, $sce, $compile, $mdDialog, $translate, $window, RecipeService, CommentService, CommentProvider, NotificationProvider, RatingProvider, DIFF, VISIBILITY, NOTIFICATION) {
        $rootScope.progressBarActivated = true;
        $rootScope.HasBack = true;
        $scope.commentsActived = false;
        $rootScope.back = function () {
            $location.path('/recipes');
        };

        RecipeService.get($routeParams.slug, function (response) {
            try {
                $scope.recipe = response.data;
                $scope.images = response.data.files;
                $scope.tags = response.data.tags;
                $scope.comments = response.data.comments;
                $scope.favorites = response.data.favorites.length;
                if ($rootScope.globals.user) {
                    $scope.fav = response.data.favorites.contains($rootScope.globals.user.id);
                    $scope.rated = response.data.rating.ratings[$rootScope.globals.user.id];
                    $rootScope.globals.rated = $scope.rated;
                    $rootScope.globals.recipe = $scope.recipe;
                }

                $rootScope.headerTitle = response.data.title;
                $rootScope.progressBarActivated = false;
            } catch (err) {
                console.error(err);
                NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
            }
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [403, 404], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
        });

        $scope.description = function(steps) {
            if (steps) return $sce.trustAsHtml(steps);
        };

        $scope.getDifficulty = function (diff) { return DIFF.class[diff]; };

        $scope.getVisibilityIcon = function (visibility) { return VISIBILITY.icon[visibility]; };

        $scope.getVisibilityClass = function (visibility) { return VISIBILITY.class[visibility]; };

        $scope.getRatingIcon = function (rating) {
            if (rating >= 4.0) {
                return 'star';
            } else if (rating < 2.0) {
                return 'star_border';
            } else {
                return 'star_half';
            }
        };

        $scope.openShareMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        $scope.shareBy = function(via) {
            switch (via) {
                case 'email':
                    var subject = $translate.instant('share.title', { title: $scope.recipe.title });
                    var message = $translate.instant('share.body', { url: $location.absUrl() });
                    $window.open('mailto:?subject=' + subject + '&body=' + message, '_blank');
                    break;
            }
        };

        $scope.toggleFav = function() {
            if ($rootScope.globals.user) {
                RecipeService.toggleFav($scope.recipe.id, function (response) {
                    $scope.fav = response.data.fav;
                    $scope.favorites = response.data.favorites;
                    NotificationProvider.notify({
                        title: $translate.instant('response.saved'),
                        type: 'error',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: $scope.fav ? 'favorite' : 'favorite_border',
                        styling: 'fontawesome'
                    });
                }, function (response) {
                    NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                });
            } else {
                $location.path('/login');
            }
        };

        $scope.showRating = function(ev) {
            $mdDialog.show({
                controller: RatingProvider.openRatingDialog,
                templateUrl: 'views/partials/rating-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
            .then(function(answer) {}, function() {});
        };

        $scope.toggleComments = function() {
            $scope.commentsActived = !$scope.commentsActived;
        };

        $scope.toggleReplies = function(comment, ev) {
            if ($('#replies-' + comment.id).text() === '') {
                $('#replies-' + comment.id).append($compile('<div ng-repeat="comment in comments.getByIdWithParent(' + comment.id + ').replies | orderBy:created_at:true" flex="100">' +
                    '<md-card class="comment-list-card"><md-card-title><md-card-title-media>' +
                    '<div class="md-media-md card-media" layout="row" layout-align="center center"><img ng-src="{{ comment.user | userImage:recipe.user }}" /></div>' +
                    '</md-card-title-media><md-card-title-text>' +
                        '<span class="md-headline">{{ comment.text }}</span>' +
                        '<span class="md-subhead" ng-if="comment.updated_at != comment.created_at">' + $translate.instant('comment.last-update') + ' <em>{{ comment.updated_at | date:medium }}</em></span>' +
                        '<span class="md-subhead">' + $translate.instant('comment.created-at') + ' <em>{{ comment.created_at | date:medium }}</em></span>' +
                        '<span class="md-subhead"><strong>{{ comment.user.first_name + " " + comment.user.last_name }}</strong></span>' +
                    '</md-card-title-text></md-card-title><md-card-actions layout="row" layout-align="end end" flex><md-card-icons-actions>' +
                        '<md-button class="md-icon-button" aria-label="' + $translate.instant('btn.comment-text') + '" ng-click="addComment(comment.id, $event)" ng-if="IsAuthed"><md-icon class="material-icons md-dark">reply</md-icon></md-button>' +
                        '<md-button class="md-icon-button-lg" aria-label="' + $translate.instant('btn.replies-text') + '" ng-click="toggleReplies(comment, $event)" ng-if="comment.replies.length > 0"><md-icon class="material-icons md-dark">expand_more</md-icon> {{ comment.replies.length }}</md-button>' +
                        '<md-button class="md-icon-button" aria-label="' + $translate.instant('btn.edit-text') + '" ng-click="editComment(comment.id, comment.text, $event)" ng-if="isMine(comment.user)"><md-icon class="material-icons md-green">edit</md-icon></md-button>' +
                        '<md-button class="md-icon-button" aria-label="' + $translate.instant('btn.delete-text') + '" ng-click="deleteComment(comment, $event)" ng-if="isMine(comment.user)"><md-icon class="material-icons md-red">delete_forever</md-icon></md-button>' +
                    '</md-card-icons-actions></md-card-actions><md-content id="replies-{{ comment.id }}"></md-content></md-card></div>')($scope));
            } else {
                $('#replies-' + comment.id).empty();
            }
        };

        $scope.addComment = function(parent, ev) {
            $mdDialog.show({
                controller: CommentProvider.openCommentDialog,
                templateUrl: 'views/partials/comment-dialog.html',
                parent: angular.element(document.body),
                locals: { data: { text: '' } },
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                $rootScope.progressBarActivated = true;
                $rootScope.errorMsg = false;
                CommentService.create($scope.recipe.id, parent, answer, function(response) {
                    if (parent === null) {
                        $scope.comments.push(response.data);
                    } else {
                        $scope.comments.getByIdWithParent(parent).replies.push(response.data);
                    }
                    NotificationProvider.notify({
                        title: $translate.instant('response.saved'),
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'check_circle',
                        styling: 'fontawesome'
                    });
                    $rootScope.progressBarActivated = false;
                },  function(response) {
                    NOTIFICATION.ParseErrorResponse(response, [400, 403, 404], $translate, $rootScope, NotificationProvider);
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        };

        $scope.editComment = function(id, text, ev) {
            $mdDialog.show({
                controller: CommentProvider.openCommentDialog,
                templateUrl: 'views/partials/comment-dialog.html',
                parent: angular.element(document.body),
                locals: { data: { text: text } },
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                $rootScope.progressBarActivated = true;
                $rootScope.errorMsg = false;
                CommentService.edit($scope.recipe.id, id, answer, function(response) {
                    $scope.comments.getByIdWithParent(id).text = response.data.text;
                    NotificationProvider.notify({
                        title: $translate.instant('response.saved'),
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'comment',
                        styling: 'fontawesome'
                    });
                    $rootScope.progressBarActivated = false;
                },  function(response) {
                    NOTIFICATION.ParseErrorResponse(response, [400, 403, 404], $translate, $rootScope, NotificationProvider);
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        };

        $scope.deleteComment = function(comment, $event) {
            var msg = $translate.instant('dialog.remove-comment');
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
                CommentService.delete($scope.recipe.id, comment.id, function(response) {
                    if (comment.parent === null) {
                        $scope.comments.removeById(comment.id);
                    } else {
                        $scope.comments.getByIdWithParent(comment.parent.id).replies.removeById(comment.id);
                    }
                    NotificationProvider.notify({
                        title: response.data.msg,
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'comment',
                        styling: 'fontawesome'
                    });
                    $rootScope.progressBarActivated = false;
                }, function(response) {
                    NOTIFICATION.ParseErrorResponse(response, [400, 404], $translate, $rootScope, NotificationProvider);
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        };

        $scope.isMine = function(user) {
            if ($rootScope.globals.user) {
                var auth = $rootScope.globals.user;
                return (auth.id == user.id && auth.email == user.email && auth.username == user.username) || auth.type == 'ADMIN';
            }
            return false;
        };

        $scope.searchByTag = function(tag) {
            $location.path('/recipes').search({tag: tag});
        };
    }]
);

recipeController.controller('RecipeCreate',
    ['$scope', '$rootScope', '$location', '$timeout', '$compile', '$mdDialog', '$translate',
    'RecipeService', 'CategoryService', 'TagService', 'IngredientService',
    'NotificationProvider', 'FileProvider', 'DIFF', 'VISIBILITY', 'EDIT_FUNCTIONS', 'NOTIFICATION',
    function ($scope, $rootScope, $location, $timeout, $compile, $mdDialog, $translate,
        RecipeService, CategoryService, TagService, IngredientService,
        NotificationProvider, FileProvider, DIFF, VISIBILITY, EDIT_FUNCTIONS, NOTIFICATION) {
        $rootScope.progressBarActivated = true;
        $rootScope.HasBack = true;
        $rootScope.back = function () {
            $location.path('/recipes');
        };

        EDIT_FUNCTIONS.LoadScope($scope, DIFF, VISIBILITY);

        EDIT_FUNCTIONS.CommonFunctions($scope, $rootScope, $location, $timeout, $compile, $mdDialog, $translate,
            RecipeService, CategoryService, TagService, IngredientService,
            NotificationProvider, FileProvider, DIFF, VISIBILITY, EDIT_FUNCTIONS, NOTIFICATION);

        /**
         * Get
         */
        RecipeService.getDraft(function (response) {
            EDIT_FUNCTIONS.LoadRecipe($scope, $rootScope, $translate, RecipeService, CategoryService, NotificationProvider, NOTIFICATION, response);
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
        });

        /**
         * Save
         */
        $scope.save = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $('html, body').animate({ scrollTop: 0 }, 'slow');
            var recipeObj = angular.copy($scope.recipe);
            if (recipeObj.image_main) {
                recipeObj.image_main = recipeObj.image_main.id;
            }
            recipeObj.duration += ':00';
            recipeObj.new_tags = RecipeService.getNewTags(recipeObj.chipTags);
            recipeObj.tags = $.getArrayId(recipeObj.chipTags);
            recipeObj.files = $.getArrayId(recipeObj.files);
            RecipeService.edit(recipeObj, function (response) {
                NotificationProvider.notify({
                    title: $translate.instant('response.saved'),
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'save',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [400, 401], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
            });
        };

        /**
         * Publish
         */
        $scope.publish = function($event) {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $("html, body").animate({ scrollTop: 0 }, "slow");
            var recipeObj = angular.copy($scope.recipe);
            recipeObj.image_main = recipeObj.image_main.id;
            recipeObj.duration += ':00';
            recipeObj.new_tags = RecipeService.getNewTags(recipeObj.chipTags);
            recipeObj.tags = $.getArrayId(recipeObj.chipTags);
            recipeObj.files = $.getArrayId(recipeObj.files);
            RecipeService.edit(recipeObj, function (response) {
                $rootScope.progressBarActivated = false;
                var msg = $translate.instant('dialog.publish', { title: recipeObj.title });
                var confirm = $mdDialog.confirm()
                    .title($translate.instant('btn.publish'))
                    .textContent(msg)
                    .ariaLabel($translate.instant('btn.publish'))
                    .targetEvent($event)
                    .openFrom({ top: -50, width: 50 })
                    .closeTo({ top: 50, width: 50 })
                    .ok($translate.instant('btn.publish'))
                    .cancel($translate.instant('btn.cancel-text'));
                $mdDialog.show(confirm).then(function () {
                    $rootScope.progressBarActivated = true;
                    RecipeService.createFromDraft(function (response) {
                        NotificationProvider.notify({
                            title: $translate.instant('response.published'),
                            type: 'success',
                            addclass: 'custom-success-notify',
                            icon: 'material-icons md-light',
                            icon_class: 'publish',
                            styling: 'fontawesome'
                        });
                        $location.path('/recipes/' + response.data.slug);
                    }, function(response) {
                        NOTIFICATION.ParseErrorResponse(response, [], $translate, $rootScope, NotificationProvider);
                        $rootScope.progressBarActivated = false;
                    });
                }, function() {});
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [400, 401], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
            });
        };
    }]
);

recipeController.controller('RecipeEdit',
    ['$scope', '$rootScope', '$location', '$timeout', '$compile', '$routeParams', '$mdDialog', '$translate',
    'RecipeService', 'CategoryService', 'TagService', 'IngredientService',
    'NotificationProvider', 'FileProvider', 'DIFF', 'VISIBILITY', 'EDIT_FUNCTIONS', 'NOTIFICATION',
    function ($scope, $rootScope, $location, $timeout, $compile, $routeParams, $mdDialog, $translate,
        RecipeService, CategoryService, TagService, IngredientService,
        NotificationProvider, FileProvider, DIFF, VISIBILITY, EDIT_FUNCTIONS, NOTIFICATION) {
        $rootScope.progressBarActivated = true;
        $rootScope.HasBack = true;
        $rootScope.back = function () {
            $location.path('/recipes');
        };

        EDIT_FUNCTIONS.LoadScope($scope, DIFF, VISIBILITY);

        EDIT_FUNCTIONS.CommonFunctions($scope, $rootScope, $location, $timeout, $compile, $mdDialog, $translate,
            RecipeService, CategoryService, TagService, IngredientService,
            NotificationProvider, FileProvider, DIFF, VISIBILITY, EDIT_FUNCTIONS, NOTIFICATION);

        /**
         * Get
         */
        RecipeService.get($routeParams.slug, function (response) {
            EDIT_FUNCTIONS.LoadRecipe($scope, $rootScope, $translate, RecipeService, CategoryService, NotificationProvider, NOTIFICATION, response);
        }, function (response) {
            NOTIFICATION.ParseErrorResponse(response, [404], $translate, $rootScope, NotificationProvider);
            $rootScope.progressBarActivated = false;
        });

        /**
         * Edit
         */
        $scope.edit = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $('html, body').animate({ scrollTop: 0 }, 'slow');
            var recipeObj = angular.copy($scope.recipe);
            if (recipeObj.image_main) {
                recipeObj.image_main = recipeObj.image_main.id;
            }
            recipeObj.duration += ':00';
            recipeObj.new_tags = RecipeService.getNewTags(recipeObj.chipTags);
            recipeObj.tags = $.getArrayId(recipeObj.chipTags);
            recipeObj.files = $.getArrayId(recipeObj.files);
            RecipeService.edit(recipeObj, function (response) {
                NotificationProvider.notify({
                    title: $translate.instant('response.saved'),
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'save',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NOTIFICATION.ParseErrorResponse(response, [400, 401], $translate, $rootScope, NotificationProvider);
                $rootScope.progressBarActivated = false;
            });
        };
    }]
);
