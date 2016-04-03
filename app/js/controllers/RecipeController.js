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

recipeController.constant('FILE_DROPZONE', {
    FileDragOver: function(e, scope) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == "dragover" ? "hover" : "");
    },
    FileHandler: function(e, scope, compile, upload, RecipeService, NotificationProvider) {
        this.FileDragOver(e);
        var files = e.target.files || e.dataTransfer.files;
        var index = 0;
        /* jshint ignore:start */
        for (var i = 0, f; f = files[i]; i++) {
            index = scope.images.index;
            this.ParseFile(f, scope, compile, index, upload, RecipeService, NotificationProvider);
            scope.images.index++;
        }
        /* jshint ignore:end */
    },
    ParseFile: function(file, scope, compile, index, upload, RecipeService, NotificationProvider) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.images-recipe-gallery').append(compile('<div class="image-removable" ng-if="images.show[' + index + ']" id="image-removable-' + index + '">' +
                '<img class="img-thumbnail" src="' + e.target.result + '" />' +
                '<md-button ng-click="removeImage(' + index + ')" class="md-fab md-mini md-remove" aria-label="Close"><md-icon class="material-icons">close</md-icon></md-button></div>')(scope));
        };
        reader.readAsDataURL(file);
        scope.images.recipe[index] = file;
        scope.images.show[index] = false;
        if (upload) {
            RecipeService.uploadFile(file, scope.recipe.id, false, false, function (response) {
                scope.images.show[index] = true;
                NotificationProvider.notify({
                    title: 'Image añadida',
                    text: '',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'photo',
                    styling: 'fontawesome'
                });
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se guardaban las imágenes. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $('#image-removable-' + index).exists(function () {
                    $('#image-removable-' + index).remove();
                    $scope.images.recipe.splice(index, 1);
                    $scope.images.show.splice(index, 1);
                });
            });
        } else {
            scope.images.show[index] = true;
        }
    }
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
    LoadRecipe: function($scope, $rootScope, RecipeService, CategoryService, NotificationProvider, response) {
        try {
            $scope.recipe = response.data;
            $scope.recipe.chipTags = response.data.tags;

            CategoryService.all(function (response) {
                $scope.categories = response.data;
                $scope.categories.unshift({ id: null, text: 'Ninguna'});
                if ($scope.recipe.category) $scope.recipe.category_id = $scope.recipe.category.id;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban las categorias. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
            });

            $rootScope.progressBarActivated = false;
        } catch (err) {
            console.error(err);
            $rootScope.error = {
                icon: 'error_outline',
                title: 'Algo ha ido mal',
                msg: 'Ha ocurrido un error mientras se cargaba la receta.'
            };
            $rootScope.errorMsg = true;
            $rootScope.progressBarActivated = false;
        }
    },
    CommonFunctions: function($scope, $rootScope, $location, $timeout, $compile, $mdDialog,
        RecipeService, CategoryService, TagService, IngredientService,
        NotificationProvider, DIFF, VISIBILITY, FILE_DROPZONE, EDIT_FUNCTIONS) {
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
                    EDIT_FUNCTIONS.AddIngredient($scope, IngredientService, NotificationProvider);
                } else {
                    $scope.formRecipe.newIngredientName.$error.customRequired = true;
                }
            };

            $scope.removeIngredient = function(index) {
                EDIT_FUNCTIONS.DeleteIngredient($scope, IngredientService, NotificationProvider, index);
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
                EDIT_FUNCTIONS.AllCategories($scope, CategoryService, NotificationProvider);
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
                return EDIT_FUNCTIONS.SearchTag($scope, TagService, NotificationProvider, search);
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
                    controller: GalleryDialogController,
                    templateUrl: 'views/recipe/gallery_dialog.html',
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
                    controller: GalleryDialogController,
                    templateUrl: 'views/recipe/gallery_dialog.html',
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
    AddIngredient: function($scope, IngredientService, NotificationProvider) {
        $scope.formRecipe.newIngredientName.$error = {};
        var ingredient = {
            name: $scope.recipe.newIngredient.name,
            count: $scope.recipe.newIngredient.count
        };
        IngredientService.add($scope.recipe.id, ingredient, function (response) {
            $scope.recipe.ingredients.push(response.data);
            $scope.recipe.newIngredient.name = null;
            $scope.recipe.newIngredient.count = null;
            NotificationProvider.notify({
                title: 'Ingrediente añadido',
                text: '',
                type: 'success',
                addclass: 'custom-success-notify',
                icon: 'material-icons md-light',
                icon_class: 'restaurant_menu',
                styling: 'fontawesome'
            });
        }, function (response) {
            if (response.status == 400) {
                NotificationProvider.notify({
                    title: 'Datos incorrectos',
                    text: $.parseError(response.data),
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
            } else {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se añadía el ingrediente. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
            }
            $scope.recipe.newIngredient.name = null;
            $scope.recipe.newIngredient.count = null;
        });
    },
    DeleteIngredient: function($scope, IngredientService, NotificationProvider, index) {
        var ingredient = $scope.recipe.ingredients[index];
        IngredientService.delete($scope.recipe.id, ingredient.id, function (response) {
            $scope.recipe.ingredients.splice(index, 1);
            NotificationProvider.notify({
                title: 'Ingrediente borrado',
                text: '',
                type: 'success',
                addclass: 'custom-success-notify',
                icon: 'material-icons md-light',
                icon_class: 'restaurant_menu',
                styling: 'fontawesome'
            });
        }, function (response) {
            if (response.status == 400) {
                NotificationProvider.notify({
                    title: 'Datos incorrectos',
                    text: $.parseError(response.data),
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
            } else {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se borraba el ingrediente. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
            }
        });
    },
    AllCategories: function($scope, CategoryService, NotificationProvider) {
        CategoryService.all(function (response) {
            $scope.categories = response.data;
            $scope.categories.unshift({ id: null, text: 'Ninguna'});
        }, function (response) {
            NotificationProvider.notify({
                title: 'Un error ha ocurrido',
                text: 'Ha ocurrido un error mientras se cargaban las categorias. Por favor, intentelo más tarde.',
                type: 'error',
                addclass: 'custom-error-notify',
                icon: 'material-icons md-light',
                styling: 'fontawesome'
            });
        });
    },
    SearchTag: function ($scope, TagService, NotificationProvider, search) {
        return TagService.search(search, function (response) {
            return response.data;
        }, function (response) {
            NotificationProvider.notify({
                title: 'Un error ha ocurrido',
                text: 'Ha ocurrido un error mientras se cargaban las etiquetas. Por favor, intentelo más tarde.',
                type: 'error',
                addclass: 'custom-error-notify',
                icon: 'material-icons md-light',
                styling: 'fontawesome'
            });
            return [];
        });
    },
});

recipeController.controller('RecipeAll',
    ['$scope', '$rootScope', '$location', '$sce', 'RecipeService', 'NotificationProvider', '$mdDialog',
    function ($scope, $rootScope, $location, $sce, RecipeService, NotificationProvider, $mdDialog) {
        $rootScope.headerTitle = 'Recetas';
        $scope.recipes = [];
        $scope.total = 1;
        $scope.nextPageNumber = 1;
        $scope.loadingNextPage = true;

        RecipeService.search({
            page: $scope.nextPageNumber,
            size: 10,
            search: $rootScope.searchString
        }, function (response) {
            var responseData = response.data;
            $scope.recipes = responseData.data;
            $scope.nextPageNumber++;
            $scope.total = responseData.total;
            $scope.loadingNextPage = false;
        }, function (response) {
            NotificationProvider.notify({
                title: 'Un error ha ocurrido',
                text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo más tarde.',
                type: 'error',
                addclass: 'custom-error-notify',
                icon: 'material-icons md-light',
                styling: 'fontawesome'
            });
            $rootScope.error = {
                icon: 'error_outline',
                title: 'Algo ha ido mal',
                msg: 'Ha ocurrido un error mientras se cargaban las recetas.'
            };
            $rootScope.errorMsg = true;
            $scope.loadingNextPage = false;
        });

        $scope.nextPage = function () {
            if ($scope.total > $scope.recipes.length) {
                $scope.loadingNextPage = true;
                RecipeService.search({
                    page: $scope.nextPageNumber,
                    size: 10,
                    search: $rootScope.searchString,
                }, function (response) {
                    var responseData = response.data;
                    $scope.recipes = $scope.recipes.concat(responseData.data);
                    $scope.nextPageNumber++;
                    $scope.total = responseData.total;
                    $scope.loadingNextPage = false;
                }, function (response) {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se cargaban las recetas.'
                    };
                    $rootScope.errorMsg = true;
                    $scope.loadingNextPage = false;
                });
            }
        };

        $scope.description = function(steps) {
            if (steps) return $sce.trustAsHtml(steps.trunc(260, true));
        };

        $scope.show = function(slug) {
            $location.path('/recipes/' + slug);
        };

        $scope.isMine = function(user) {
            if ($rootScope.globals.user) {
                var auth = $rootScope.globals.user.user;
                return (auth.id == user.id && auth.email == user.email && auth.username == user.username) || auth.type == 'ADMIN';
            }
            return false;
        };

        $scope.edit = function(slug, $event) {
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            $scope.recipes = [];
            $location.path('/recipes/' + slug + '/edit');
        };

        $scope.remove = function(recipe, $event) {
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
    }]
);

recipeController.controller('RecipeShow',
    ['$scope', '$rootScope', '$location', '$routeParams', '$sce', '$compile', '$mdDialog', 'RecipeService', 'CommentService', 'NotificationProvider', 'DIFF', 'VISIBILITY',
    function ($scope, $rootScope, $location, $routeParams, $sce, $compile, $mdDialog, RecipeService, CommentService, NotificationProvider, DIFF, VISIBILITY) {
        $rootScope.headerTitle = 'Cargando';
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
                    $scope.fav = response.data.favorites.contains($rootScope.globals.user.user.id);
                    $scope.rated = response.data.rating.ratings[$rootScope.globals.user.user.id];
                    $rootScope.globals.rated = $scope.rated;
                    $rootScope.globals.recipe = $scope.recipe;
                }

                $rootScope.headerTitle = response.data.title;
                $rootScope.progressBarActivated = false;
            } catch (err) {
                console.error(err);
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaba la receta.'
                };
                $rootScope.errorMsg = true;
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
            }
        }, function (response) {
            if (response.status == 404) {
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Error 404',
                    msg: 'La receta \'' + $routeParams.slug + '\' no existe.'
                };
            } else if (response.status == 403) {
                $rootScope.error = {
                    icon: 'lock',
                    title: 'Receta privada',
                    msg: 'No tiene permisos suficientes para ver la receta \'' + $routeParams.slug + '\'.'
                };
            } else {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaba la receta. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaba la receta.'
                };
            }
            $rootScope.errorMsg = true;
            $rootScope.headerTitle = 'Error';
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

        $scope.toggleFav = function() {
            if ($rootScope.globals.user) {
                RecipeService.toggleFav($scope.recipe.id, function (response) {
                    $scope.fav = response.data.fav;
                    $scope.favorites = response.data.favorites;
                    NotificationProvider.notify({
                        title: 'Guardado',
                        text: '',
                        type: 'error',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: $scope.fav ? 'favorite' : 'favorite_border',
                        styling: 'fontawesome'
                    });
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
            } else {
                $location.path('/login');
            }
        };

        $scope.showRating = function(ev) {
            $mdDialog.show({
                controller: RatingDialogController,
                templateUrl: 'views/recipe/rating_dialog.html',
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
            if ($('#replies-' + comment.id).text() == '') {
                $('#replies-' + comment.id).append($compile('<div ng-repeat="comment in comments.getByIdWithParent(' + comment.id + ').replies | orderBy:created_at:true" flex="100">' +
                    '<md-card class="comment-list-card"><md-card-title><md-card-title-media>' +
                    '<div class="md-media-md card-media" layout="row" layout-align="center center"><img ng-src="{{ comment.user | srcImage:recipe.user }}" /></div>' +
                    '</md-card-title-media><md-card-title-text>' +
                        '<span class="md-headline">{{ comment.text }}</span>' +
                        '<span class="md-subhead" ng-if="comment.updated_at != comment.created_at">Ultima modificación el <em>{{ comment.updated_at | date:medium }}</em></span>' +
                        '<span class="md-subhead">Creado el <em>{{ comment.created_at | date:medium }}</em></span>' +
                        '<span class="md-subhead"><strong>{{ comment.user.first_name + " " + comment.user.last_name }}</strong></span>' +
                    '</md-card-title-text></md-card-title><md-card-actions layout="row" layout-align="end end" flex ng-if="IsAuthed"><md-card-icons-actions>' +
                        '<md-button class="md-icon-button" aria-label="Comentar" ng-click="addComment(comment.id, $event)"><md-icon class="material-icons md-dark">reply</md-icon></md-button>' +
                        '<md-button class="md-icon-button-lg" aria-label="Respuestas" ng-click="toggleReplies(comment, $event)" ng-if="comment.replies.length > 0"><md-icon class="material-icons md-dark">expand_more</md-icon> {{ comment.replies.length }}</md-button>' +
                        '<md-button class="md-icon-button" aria-label="Editar" ng-click="editComment(comment.id, comment.text, $event)" ng-if="isMine(comment.user)"><md-icon class="material-icons md-green">edit</md-icon></md-button>' +
                        '<md-button class="md-icon-button" aria-label="Borrar" ng-click="deleteComment(comment, $event)" ng-if="isMine(comment.user)"><md-icon class="material-icons md-red">delete_forever</md-icon></md-button>' +
                    '</md-card-icons-actions></md-card-actions><md-content id="replies-{{ comment.id }}"></md-content></md-card></div>')($scope));
            } else {
                $('#replies-' + comment.id).empty();
            }
        };

        $scope.addComment = function(parent, ev) {
            $mdDialog.show({
                controller: CommentDialogController,
                templateUrl: 'views/recipe/comment_dialog.html',
                parent: angular.element(document.body),
                locals: { data: { text: '' } },
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                CommentService.create($scope.recipe.id, parent, answer, function(response) {
                    if (parent === null) {
                        $scope.comments.push(response.data);
                    } else {
                        $scope.comments.getByIdWithParent(parent).replies.push(response.data);
                    }

                    NotificationProvider.notify({
                        title: 'Comentario añadido',
                        text: '',
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'check_circle',
                        styling: 'fontawesome'
                    });
                },  function(response) {
                    var icon = 'error_outline';
                    var title = 'Un error ha ocurrido';
                    var msg = 'Ha ocurrido un error mientras se guardaba el comentario. Por favor, intentelo más tarde.';
                    if (response.status == 404) {
                        title = 'Error 404';
                        msg = 'La receta \'' + $scope.recipe.id + '\' no existe.';
                    } else if (response.status == 403) {
                        icon = 'lock';
                        title = 'Acceso prohibido';
                        msg = 'Necesitas estar logueado para comentar.';
                    } else if (response.status == 400) {
                        icon = 'lock';
                        title = 'Error en el formulario';
                        msg = 'El texto del comentario el obligatorio.';
                    }
                    NotificationProvider.notify({
                        title: title,
                        text: msg,
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        icon_class: icon,
                        styling: 'fontawesome'
                    });
                });
            }, function() {});
        };

        $scope.editComment = function(id, text, ev) {
            $mdDialog.show({
                controller: CommentDialogController,
                templateUrl: 'views/recipe/comment_dialog.html',
                parent: angular.element(document.body),
                locals: { data: { text: text } },
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                CommentService.edit($scope.recipe.id, id, answer, function(response) {
                    $scope.comments.getByIdWithParent(id).text = response.data.text;

                    NotificationProvider.notify({
                        title: 'Comentario editado',
                        text: '',
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'comment',
                        styling: 'fontawesome'
                    });
                },  function(response) {
                    var icon = 'error_outline';
                    var title = 'Un error ha ocurrido';
                    var msg = 'Ha ocurrido un error mientras se guardaba el comentario. Por favor, intentelo más tarde.';
                    if (response.status == 404) {
                        title = 'Error 404';
                        msg = 'El comentario \'' + id + '\' no existe.';
                    } else if (response.status == 403) {
                        icon = 'lock';
                        title = 'Acceso prohibido';
                        msg = 'Necesitas estar logueado para comentar.';
                    } else if (response.status == 400) {
                        icon = 'lock';
                        title = 'Error en el formulario';
                        msg = 'El texto del comentario el obligatorio.';
                    }
                    NotificationProvider.notify({
                        title: title,
                        text: msg,
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        icon_class: icon,
                        styling: 'fontawesome'
                    });
                });
            }, function() {});
        };

        $scope.deleteComment = function(comment, $event) {
            var confirm = $mdDialog.confirm()
                .title('Borrar receta')
                .textContent('¿De verdad que quieres borrar el comentario?\nEsta acción no se puede deshacer.\nSe borraran las respuestas.')
                .ariaLabel('Borrar')
                .targetEvent($event)
                .ok('Borrar')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function () {
                CommentService.delete($scope.recipe.id, comment.id, function(response) {
                    if (comment.parent === null) {
                        $scope.comments.removeById(comment.id);
                    } else {
                        $scope.comments.getByIdWithParent(comment.parent.id).replies.removeById(comment.id);
                    }

                    NotificationProvider.notify({
                        title: 'Comentario borrado',
                        text: '',
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'comment',
                        styling: 'fontawesome'
                    });
                }, function(response) {
                    var icon = 'error_outline';
                    var title = 'Un error ha ocurrido';
                    var msg = 'Ha ocurrido un error mientras se borraba el comentario. Por favor, intentelo más tarde.';
                    if (response.status == 404) {
                        title = 'Error 404';
                        msg = 'El comentario \'' + id + '\' no existe.';
                    }
                    NotificationProvider.notify({
                        title: title,
                        text: msg,
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        icon_class: icon,
                        styling: 'fontawesome'
                    });
                });
            }, function() {});
        };

        $scope.isMine = function(user) {
            if ($rootScope.globals.user) {
                var auth = $rootScope.globals.user.user;
                return (auth.id == user.id && auth.email == user.email && auth.username == user.username) || auth.type == 'ADMIN';
            }
            return false;
        };
    }]
);

recipeController.controller('RecipeCreate',
    ['$scope', '$rootScope', '$location', '$timeout', '$compile', '$mdDialog',
    'RecipeService', 'CategoryService', 'TagService', 'IngredientService',
    'NotificationProvider', 'DIFF', 'VISIBILITY', 'FILE_DROPZONE', 'EDIT_FUNCTIONS',
    function ($scope, $rootScope, $location, $timeout, $compile, $mdDialog,
        RecipeService, CategoryService, TagService, IngredientService,
        NotificationProvider, DIFF, VISIBILITY, FILE_DROPZONE, EDIT_FUNCTIONS) {
        $rootScope.headerTitle = 'Nueva receta (borrador)';
        $rootScope.progressBarActivated = true;
        $rootScope.HasBack = true;
        $rootScope.back = function () {
            $location.path('/recipes');
        };

        EDIT_FUNCTIONS.LoadScope($scope, DIFF, VISIBILITY);

        EDIT_FUNCTIONS.CommonFunctions($scope, $rootScope, $location, $timeout, $compile, $mdDialog,
            RecipeService, CategoryService, TagService, IngredientService,
            NotificationProvider, DIFF, VISIBILITY, FILE_DROPZONE, EDIT_FUNCTIONS);

        /**
         * Get
         */
        RecipeService.getDraft(function (response) {
            EDIT_FUNCTIONS.LoadRecipe($scope, $rootScope, RecipeService, CategoryService, NotificationProvider, response);
        }, function (response) {
            NotificationProvider.notify({
                title: 'Un error ha ocurrido',
                text: 'Ha ocurrido un error mientras se cargaba el borrador de la receta. Por favor, intentelo más tarde.',
                type: 'error',
                addclass: 'custom-error-notify',
                icon: 'material-icons md-light',
                styling: 'fontawesome'
            });
            $rootScope.error = {
                icon: 'error_outline',
                title: 'Algo ha ido mal',
                msg: 'Ha ocurrido un error mientras se cargaba el borrador de la receta.'
            };
            $rootScope.errorMsg = true;
            $rootScope.progressBarActivated = false;
        });

        /**
         * Save
         */
        $scope.save = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $rootScope.headerTitle = 'Guardando borrador';
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
                    title: 'Receta guardada',
                    text: '',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'save',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
                $rootScope.errorMsg = false;
                $rootScope.headerTitle = 'Nueva receta (borrador)';
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
                        text: 'Ha ocurrido un error mientras se guardaba la receta. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se guardaba la receta.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $rootScope.headerTitle = 'Nueva receta (borrador)';
            });
        };

        /**
         * Publish
         */
        $scope.publish = function($event) {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $rootScope.headerTitle = 'Guardando borrador';
            $("html, body").animate({ scrollTop: 0 }, "slow");
            var recipeObj = angular.copy($scope.recipe);
            recipeObj.image_main = recipeObj.image_main.id;
            recipeObj.duration += ':00';
            recipeObj.new_tags = RecipeService.getNewTags(recipeObj.chipTags);
            recipeObj.tags = $.getArrayId(recipeObj.chipTags);
            recipeObj.files = $.getArrayId(recipeObj.files);
            RecipeService.edit(recipeObj, function (response) {
                $rootScope.progressBarActivated = false;
                $rootScope.headerTitle = 'Nueva receta (borrador)';
                var confirm = $mdDialog.confirm()
                    .title('Publicar receta')
                    .textContent('¿Quiere publicar la receta \'' +recipeObj.title +'\'?')
                    .ariaLabel('Publicar')
                    .targetEvent($event)
                    .openFrom({
                        top: -50,
                        width: 50
                    })
                    .closeTo({
                        top: 50,
                        width: 50
                    })
                    .ok('Publicar')
                    .cancel('Cancelar');
                $mdDialog.show(confirm).then(function () {
                    $rootScope.progressBarActivated = true;
                    $rootScope.headerTitle = 'Publicando receta';
                    RecipeService.createFromDraft(function (response) {
                        NotificationProvider.notify({
                            title: 'Receta publicada',
                            text: '',
                            type: 'success',
                            addclass: 'custom-success-notify',
                            icon: 'material-icons md-light',
                            icon_class: 'publish',
                            styling: 'fontawesome'
                        });
                        $location.path('/recipes/' + response.data.slug);
                    }, function(response) {
                        if (response.status == 404) {
                            $rootScope.error = {
                                icon: 'error_outline',
                                title: 'Datos incorrectos',
                                msg: $.parseError(response.data)
                            };
                        } else {
                            NotificationProvider.notify({
                                title: 'Un error ha ocurrido',
                                text: 'Ha ocurrido un error mientras se publicaba la receta. Por favor, intentelo más tarde.',
                                type: 'error',
                                addclass: 'custom-error-notify',
                                icon: 'material-icons md-light',
                                styling: 'fontawesome'
                            });
                            $rootScope.error = {
                                icon: 'error_outline',
                                title: 'Algo ha ido mal',
                                msg: 'Ha ocurrido un error mientras se publicaba la receta.'
                            };
                        }
                        $rootScope.errorMsg = true;
                        $rootScope.progressBarActivated = false;
                        $rootScope.headerTitle = 'Nueva receta (borrador)';
                    });
                }, function() {});
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
                        text: 'Ha ocurrido un error mientras se guardaba la receta. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se guardaba la receta.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $rootScope.headerTitle = 'Nueva receta (borrador)';
            });
        };
    }]
);

recipeController.controller('RecipeEdit',
    ['$scope', '$rootScope', '$location', '$timeout', '$compile', '$routeParams', '$mdDialog',
    'RecipeService', 'CategoryService', 'TagService', 'IngredientService',
    'NotificationProvider', 'DIFF', 'VISIBILITY', 'FILE_DROPZONE', 'EDIT_FUNCTIONS',
    function ($scope, $rootScope, $location, $timeout, $compile, $routeParams, $mdDialog,
        RecipeService, CategoryService, TagService, IngredientService,
        NotificationProvider, DIFF, VISIBILITY, FILE_DROPZONE, EDIT_FUNCTIONS) {
        $rootScope.headerTitle = 'Editar receta';
        $rootScope.progressBarActivated = true;
        $rootScope.HasBack = true;
        $rootScope.back = function () {
            $location.path('/recipes');
        };

        EDIT_FUNCTIONS.LoadScope($scope, DIFF, VISIBILITY);

        EDIT_FUNCTIONS.CommonFunctions($scope, $rootScope, $location, $timeout, $compile, $mdDialog,
            RecipeService, CategoryService, TagService, IngredientService,
            NotificationProvider, DIFF, VISIBILITY, FILE_DROPZONE, EDIT_FUNCTIONS);

        /**
         * Get
         */
        RecipeService.get($routeParams.slug, function (response) {
            EDIT_FUNCTIONS.LoadRecipe($scope, $rootScope, RecipeService, CategoryService, NotificationProvider, response);
        }, function (response) {
            if (response.status == 404) {
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Error 404',
                    msg: 'La receta \'' + $routeParams.slug + '\' no existe.'
                };
            } else {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaba la receta. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaba la receta.'
                };
            }
            $rootScope.errorMsg = true;
            $rootScope.progressBarActivated = false;
        });

        /**
         * Edit
         */
        $scope.edit = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $rootScope.headerTitle = 'Guardando receta';
            $('html, body').animate({ scrollTop: 0 }, 'slow');
            var recipeObj = angular.copy($scope.recipe);
            recipeObj.image_main = recipeObj.image_main.id;
            recipeObj.duration += ':00';
            recipeObj.new_tags = RecipeService.getNewTags(recipeObj.chipTags);
            recipeObj.tags = $.getArrayId(recipeObj.chipTags);
            recipeObj.files = $.getArrayId(recipeObj.files);
            RecipeService.edit(recipeObj, function (response) {
                NotificationProvider.notify({
                    title: 'Receta guardada',
                    text: '',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'save',
                    styling: 'fontawesome'
                });
                $rootScope.progressBarActivated = false;
                $rootScope.errorMsg = false;
                $rootScope.headerTitle = 'Editar receta';
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
                        text: 'Ha ocurrido un error mientras se guardaba la receta. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se guardaba la receta.'
                    };
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $rootScope.headerTitle = 'Editar receta';
            });
        };
    }]
);

function RatingDialogController($scope, $rootScope, $location, $mdDialog, RecipeService, NotificationProvider) {
    $scope.rated = $rootScope.globals.rated;
    $scope.recipe = $rootScope.globals.recipe;
    $scope.hide = function() { $mdDialog.hide(); };
    $scope.cancel = function() { $mdDialog.cancel(); };
    $scope.rating = function() {
        if ($rootScope.globals.user) {
            RecipeService.rating($scope.recipe.id, $scope.rated, function (response) {
                NotificationProvider.notify({
                    title: 'Guardado',
                    text: '',
                    type: 'error',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'star',
                    styling: 'fontawesome'
                });
                $mdDialog.cancel();
                $location.path('/recipes/' + $scope.recipe.slug);
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
        } else {
            $location.path('/login');
        }
    };
}

function GalleryDialogController($scope, $rootScope, $mdDialog, data, FileService, NotificationProvider) {
    $scope.selectedImages = data.selectedImages;
    $scope.mode = data.mode;
    $scope.user = data.user;
    $scope.urlUpload = FileService.getUrlUpload($scope.user);
    FileService.loadUserImages($scope.user, function(response) {
        $scope.images = response.data;
        $scope.checkImagesSelected($scope.images);
    }, function(response) {
        NotificationProvider.notify({
            title: 'Un error ha ocurrido',
            text: 'Ha ocurrido un error mientras se cargaban las imagenes. Por favor, intentelo más tarde.',
            type: 'error',
            addclass: 'custom-error-notify',
            icon: 'material-icons md-light',
            styling: 'fontawesome'
        });
    });

    $scope.toggleImageSelected = function(image) {
        if (image.selected) {
            $scope.selectedImages.splice($scope.selectedImages.findIndex(function(imageInArray) { return image.id == imageInArray.id; }), 1);
            image.selected = false;
        } else {
            // If you click in other image
            if ($scope.mode == 'selectImageMain') {
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
        var confirm = $mdDialog.confirm()
            .title('Borrar imagen')
            .textContent('¿De verdad que quieres borrar la imagen \'' + image.title +'\'? \nEsta acción no se puede deshacer.')
            .ariaLabel('Borrar')
            .targetEvent($event)
            .ok('Borrar')
            .cancel('Cancelar');
        $scope.returnSelected();
        $mdDialog.show(confirm).then(function () {
            if (image.selected) {
                $scope.selectedImages.splice($scope.selectedImages.findIndex(function(imageInArray) { return image.id == imageInArray.id; }), 1);
                image.selected = false;
            }
            FileService.deleteFile($scope.user, image.id, function(response) {
                NotificationProvider.notify({
                    title: 'Imagen borrada',
                    text: 'Has borrado la imagen \'' + image.title +'\'.',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    icon_class: 'check_circle',
                    styling: 'fontawesome'
                });
            }, function(response) {
                if (response.status == 400 || response.status == 404) {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: response.data.error,
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se borraba la receta. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                }
            });
        }, function() {});
    };

    $scope.successUpload = function(file, response) {
        $scope.images.push(response);
    };

    $scope.hide = function() { $mdDialog.hide(); };
    $scope.cancel = function() { $mdDialog.cancel(); };
    $scope.returnSelected = function() {
        if ($scope.mode == 'selectImageMain') {
            $mdDialog.hide($scope.selectedImages[0]);
        } else {
            $mdDialog.hide($scope.selectedImages);
        }
    };
}

function CommentDialogController($scope, $rootScope, $mdDialog, data, NotificationProvider) {
    $scope.text = data.text;

    $scope.hide = function() { $mdDialog.hide(); };
    $scope.cancel = function() { $mdDialog.cancel(); };
    $scope.save = function() {
        $mdDialog.hide($scope.text);
    };
}
