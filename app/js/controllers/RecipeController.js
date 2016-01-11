var recipeController = angular.module('RecipeController', []);

recipeController.constant('DIFF', {
    'class': {
        'EASY': 'md-green',
        'MEDIUM': 'md-yellow',
        'HARD': 'md-red'
    },
    'name': ['EASY', 'MEDIUM', 'HARD']
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
        for (var i = 0, f; f = files[i]; i++) {
            index = scope.images.index;
            this.ParseFile(f, scope, compile, index, upload, RecipeService, NotificationProvider);
            scope.images.index++;
        }
    },
    ParseFile: function(file, scope, compile, index, upload, RecipeService, NotificationProvider) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.images-recipe-gallery').append(compile('<div class="image-removable" ng-if="images.show[' + index + ']" id="image-removable-' + index + '">' +
                '<img class="img-thumbnail" src="' + e.target.result + '" />' +
                '<md-button ng-click="removeImage(' + index + ')" class="md-fab md-mini md-remove" aria-label="Close"><md-icon class="material-icons">close</md-icon></md-button></div>')(scope));
        }
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
                    styling: 'fontawesome',
                });
                $('.ui-pnotify.custom-success-notify .material-icons').html('photo');
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se guardaban las imágenes. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome'
                });
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
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

recipeController.controller('RecipeAll',
    ['$scope', '$rootScope', '$location', '$sce', 'RecipeService', 'NotificationProvider', '$mdDialog',
    function ($scope, $rootScope, $location, $sce, RecipeService, NotificationProvider, $mdDialog) {
        $rootScope.headerTitle = 'Recetas';
        $scope.pagination = {
            page: 1,
            size: 10
        };
        $scope.recipes = [];
        $scope.sizes = [10, 30, 50];

        $scope.$watch(function() {
            return $location.search();
        }, function (newVal, oldVal) {
            if (!newVal.page) newVal.page = 1;
            if (!newVal.size) newVal.size = 10;
            $scope.pagination = newVal;
            if ($location.path() == '/recipes') {
                $rootScope.lastSearchParams['/recipes'] = $scope.pagination;
                $scope.getRecipes();
            }
        });

        $scope.selectSize = function () {
            $location.search("size", $scope.pagination.size);
        };

        $scope.getRecipes = function () {
            $rootScope.progressBarActivated = true;
            RecipeService.all($scope.pagination, function (response) {
                var responseData = response.data;
                $scope.recipes = responseData.data;
                $scope.total = responseData.total;
                $scope.current = responseData["link-self"];
                if (responseData["link-prev"]) $scope.prev = responseData["link-prev"];
                if (responseData["link-next"]) $scope.next = responseData["link-next"];
                $rootScope.progressBarActivated = false;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaban las recetas.'
                };
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
            });
        };

        $scope.description = function(steps) {
            if (steps) return $sce.trustAsHtml(steps.trunc(260, true));
        };

        $scope.show = function(slug) {
            $location.path('/recipes/' + slug);
        };

        $scope.isMine = function(user) {
            if ($rootScope.globals) {
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
                .cancel('Cancelar')
            $mdDialog.show(confirm).then(function () {
                var notify = NotificationProvider.notify({
                    title: 'Receta borrada',
                    text: 'Has borrado la receta \'' + recipe.title +'\'.',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify.custom-success-notify .material-icons').html('check_circle');
                $rootScope.progressBarActivated = true;
                $rootScope.errorMsg = false;
                RecipeService.delete(recipe.id, function(response) {
                    $rootScope.progressBarActivated = false;
                    $scope.getRecipes();
                }, function(response) {
                    if (response.status == 404) {
                        $rootScope.error = {
                            icon: 'error_outline',
                            title: 'Datos incorrectos',
                            msg: $.parseError(response.data),
                        }
                    } else {
                        NotificationProvider.notify({
                            title: 'Un error ha ocurrido',
                            text: 'Ha ocurrido un error mientras se borraba la receta. Por favor, intentelo más tarde.',
                            type: 'error',
                            addclass: 'custom-error-notify',
                            icon: 'material-icons md-light',
                            styling: 'fontawesome'
                        });
                        $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                        $rootScope.error = {
                            icon: 'error_outline',
                            title: 'Algo ha ido mal',
                            msg: 'Ha ocurrido un error mientras se borraba la receta.'
                        }
                    }
                    $rootScope.errorMsg = true;
                    $rootScope.progressBarActivated = false;
                });
            }, function() {});
        }
    }]
);

recipeController.controller('RecipeShow',
    ['$scope', '$rootScope', '$location', '$routeParams', '$sce', 'RecipeService', 'NotificationProvider', 'DIFF',
    function ($scope, $rootScope, $location, $routeParams, $sce, RecipeService, NotificationProvider, DIFF) {
        $rootScope.headerTitle = 'Cargando';
        $rootScope.progressBarActivated = true;
        $rootScope.HasBack = true;
        $rootScope.back = function () {
            $location.path('/recipes');
        };

        RecipeService.get($routeParams.slug, function (response) {
            try {
                $scope.recipe = response.data;
                $scope.images = RecipeService.getImages(response.data);
                $scope.tags = response.data.tags;
                $scope.comments = response.data.comments;

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
                $rootScope.errorMsg = true;
            } else {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaba la receta. Por favor, intentelo más tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaba la receta.'
                };
                $rootScope.errorMsg = true;
            }
            $rootScope.headerTitle = 'Error';
            $rootScope.progressBarActivated = false;
        });

        $scope.description = function(steps) {
            if (steps) return $sce.trustAsHtml(steps);
        };

        $scope.getDifficulty = function (diff) { return DIFF.class[diff]; }
    }]
);

recipeController.controller('RecipeCreate',
    ['$scope', '$rootScope', '$location', 'RecipeService', 'CategoryService', 'TagService',
    'NotificationProvider', 'DIFF', '$timeout', 'FILE_DROPZONE', '$compile',
    function ($scope, $rootScope, $location, RecipeService, CategoryService, TagService,
        NotificationProvider, DIFF, $timeout, FILE_DROPZONE, $compile) {
        $rootScope.headerTitle = 'Nueva receta';
        $rootScope.HasBack = true;
        $rootScope.back = function () {
            $location.path('/recipes');
        };

        $scope.requestSlug = null;
        $scope.validSlug = true;
        $scope.loadingSlug = false;
        $scope.diffs = DIFF.name;
        $scope.tags = [];
        $scope.recipe = {
            ingredients: [],
            num_persons: 0,
            difficulty: 'EASY',
            duration: '00:00',
            chipTags: []
        };
        $scope.images = {
            recipe: [],
            index: 0,
        };
        $scope.imagesLink = {};

        $scope.$watch(function() {
            return $scope.recipe.newIngredient ?
                $scope.recipe.newIngredient.name:
                $scope.recipe.newIngredient;
        }, function (newVal, oldVal) {
            $scope.newRecipe.newIngredientName.$error = {};
        });

        $scope.$watch(function() {
            return $scope.recipe.title;
        }, function (newVal, oldVal) {
            $scope.recipe.slug = RecipeService.getSlug(newVal);
        });

        $scope.$watch(function() {
            return $scope.recipe.slug;
        }, function (newVal, oldVal) {
            $scope.newRecipe.slug.$error = {};
            $scope.abortSlugRequest();
            if (newVal && newVal.length > 0) {
                $scope.loadingSlug = true;
                $scope.validSlugIcon = 'autorenew';
                $timeout(function() {
                    requestSlug = RecipeService.checkSlug(newVal).then(
                        function (response) {
                            $scope.loadingSlug = false;
                            if (response.status == 200) {
                                $scope.validSlugIcon = 'done';
                            } else {
                                $scope.newRecipe.slug.$error.validSlug = true;
                                $scope.validSlugIcon = 'error';
                            }
                        },
                        function (response) {
                            $scope.loadingSlug = false;
                            $scope.newRecipe.slug.$error.validSlug = true;
                            $scope.validSlugIcon = 'error';
                        }
                    );
                }, 500);
            } else {
                $scope.validSlugIcon = 'error';
            }
        });

        $scope.$watch(function() {
            return $scope.recipe.category_id;
        }, function (newVal, oldVal) {
            if (newVal == null) $scope.recipe.category_id = undefined;
        });

        $scope.addIngredient = function() {
            if ($scope.recipe.newIngredient != null && $scope.recipe.newIngredient.name != null && $scope.recipe.newIngredient.name != '') {
                $scope.newRecipe.newIngredientName.$error = {};
                $scope.recipe.ingredients.push({
                    name: $scope.recipe.newIngredient.name,
                    count: $scope.recipe.newIngredient.count,
                });
                $scope.recipe.newIngredient.name = null;
                $scope.recipe.newIngredient.count = null;
            } else {
                $scope.newRecipe.newIngredientName.$error.customRequired = true;
            }
        };

        $scope.removeIngredient = function(index) {
            $scope.recipe.ingredients.splice(index, 1);
        };

        // Abort the check slug request
        $scope.abortSlugRequest = function () {
            return ($scope.requestSlug && $scope.requestSlug.abort());
        };

        $scope.getDifficulty = function (diff) { return DIFF.class[diff]; }

        $scope.loadCategories = function() {
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
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
            });
        };

        $scope.loadTags = function(search) {
            return TagService.all(search, function (response) {
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
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                return [];
            });
        };

        $scope.transformChip = function(chip) {
            if (angular.isObject(chip)) {
                return chip;
            }
            return { text: chip, type: 'nuevo' }
        }

        $scope.tagSearch = function(search) {
            if(search) {
                return $scope.loadTags(search).then(function(response) {
                    $scope.tags = response.filter(function (el) {
                        return !$.containsId(el, $scope.recipe.chipTags);
                    });
                    return $scope.tags;
                });
            }
            return [];
        };

        $scope.create = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $rootScope.headerTitle = 'Creando receta';
            $("html, body").animate({ scrollTop: 0 }, "slow");
            var recipeObj = $scope.recipe;
            recipeObj.duration += ':00';
            recipeObj.newTags = RecipeService.getNewTags(recipeObj.chipTags);
            recipeObj.tags = $.getArrayId(recipeObj.chipTags);
            RecipeService.create(recipeObj, function (response) {
                var mainFile = $scope.images.main;
                var slug = response.data.slug;
                var recipeId = response.data.id;
                $rootScope.headerTitle = 'Subiendo imágenes';
                RecipeService.uploadFile(mainFile, recipeId, true, false,
                function(response) {
                    if ($scope.images.recipe.length > 0) {
                        RecipeService.uploadFile($scope.images.recipe, recipeId, false, true,
                        function(response) {
                            $rootScope.progressBarActivated = false;
                            $location.path('/recipes/' + slug);
                        }, function (response) {
                            if (response.status == 400) {
                                $rootScope.error = {
                                    icon: 'error_outline',
                                    title: 'Datos incorrectos',
                                    msg: $.parseError(response.data),
                                }
                            } else {
                                NotificationProvider.notify({
                                    title: 'Un error ha ocurrido',
                                    text: 'Ha ocurrido un error mientras se guardaban las imágenes. Por favor, intentelo más tarde.',
                                    type: 'error',
                                    addclass: 'custom-error-notify',
                                    icon: 'material-icons md-light',
                                    styling: 'fontawesome'
                                });
                                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                                $rootScope.error = {
                                    icon: 'error_outline',
                                    title: 'Algo ha ido mal',
                                    msg: 'Ha ocurrido un error mientras se guardaban las imágenes.'
                                }
                            }
                            $rootScope.errorMsg = true;
                            $rootScope.progressBarActivated = false;
                            $rootScope.headerTitle = 'Nueva receta';
                        });
                    } else {
                        $rootScope.progressBarActivated = false;
                        $location.path('/recipes/' + slug);
                    }
                }, function (response) {
                    if (response.status == 400) {
                        $rootScope.error = {
                            icon: 'error_outline',
                            title: 'Datos incorrectos',
                            msg: $.parseError(response.data),
                        }
                    } else {
                        NotificationProvider.notify({
                            title: 'Un error ha ocurrido',
                            text: 'Ha ocurrido un error mientras se guardaban las imágenes. Por favor, intentelo más tarde.',
                            type: 'error',
                            addclass: 'custom-error-notify',
                            icon: 'material-icons md-light',
                            styling: 'fontawesome'
                        });
                        $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                        $rootScope.error = {
                            icon: 'error_outline',
                            title: 'Algo ha ido mal',
                            msg: 'Ha ocurrido un error mientras se guardaban las imágenes.'
                        }
                    }
                    $rootScope.errorMsg = true;
                    $rootScope.progressBarActivated = false;
                    $rootScope.headerTitle = 'Nueva receta';
                });
            }, function (response) {
                if (response.status == 400) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data),
                    }
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se creaba la receta. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se creaba la receta.'
                    }
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $rootScope.headerTitle = 'Nueva receta';
            });
        };

        $scope.removeImage = function(index) {
            $('#image-removable-' + index).exists(function () {
                $('#image-removable-' + index).remove();
                $scope.images.recipe.splice(index, 1);
            });
        }

        $scope.$on('$viewContentLoaded', function() {
            if (window.File && window.FileList && window.FileReader) {
                var files = document.getElementById('files');
                var filedrag = document.getElementById('filedrag');

                files.addEventListener("change", function(e) { FILE_DROPZONE.FileHandler(e, $scope, $compile); }, false);
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    filedrag.addEventListener("dragover", function(e) { FILE_DROPZONE.FileDragOver(e, $scope); }, false);
                    filedrag.addEventListener("dragleave", function(e) { FILE_DROPZONE.FileDragOver(e, $scope); }, false);
                    filedrag.addEventListener("drop", function(e) { FILE_DROPZONE.FileHandler(e, $scope, $compile); }, false);
                    filedrag.style.display = "block";
                }
            }
        });
    }]
);

recipeController.controller('RecipeEdit',
    ['$scope', '$rootScope', '$location', 'RecipeService', 'CategoryService', 'TagService',
    'NotificationProvider', 'DIFF', '$timeout', 'FILE_DROPZONE', '$compile', '$routeParams', 'IngredientService',
    function ($scope, $rootScope, $location, RecipeService, CategoryService, TagService,
        NotificationProvider, DIFF, $timeout, FILE_DROPZONE, $compile, $routeParams, IngredientService) {
        $rootScope.headerTitle = 'Editar receta';
        $rootScope.HasBack = true;
        $rootScope.back = function () {
            $location.path('/recipes');
        };

        $scope.requestSlug = null;
        $scope.validSlug = true;
        $scope.loadingSlug = false;
        $scope.diffs = DIFF.name;
        $scope.recipe = {};
        $scope.tags = [];
        $scope.images = {
            recipe: [],
            show: [],
            index: 0,
        };
        $scope.imagesLink = {};

        RecipeService.get($routeParams.slug, function (response) {
            try {
                $scope.recipe = response.data;
                $scope.recipe.images = RecipeService.getImages(response.data);
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
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
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
                    styling: 'fontawesome',
                });
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                $rootScope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaba la receta.'
                };
            }
            $rootScope.errorMsg = true;
            $rootScope.progressBarActivated = false;
        });

        $scope.$watch(function() {
            return $scope.recipe.newIngredient ?
                $scope.recipe.newIngredient.name:
                $scope.recipe.newIngredient;
        }, function (newVal, oldVal) {
            $scope.editRecipe.newIngredientName.$error = {};
        });

        $scope.$watch(function() {
            return $scope.recipe.title;
        }, function (newVal, oldVal) {
            $scope.recipe.slug = RecipeService.getSlug(newVal);
        });

        $scope.$watch(function() {
            return $scope.recipe.slug;
        }, function (newVal, oldVal) {
            $scope.editRecipe.slug.$error = {};
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
                                $scope.editRecipe.slug.$error.validSlug = true;
                                $scope.validSlugIcon = 'error';
                            }
                        },
                        function (response) {
                            $scope.loadingSlug = false;
                            $scope.editRecipe.slug.$error.validSlug = true;
                            $scope.validSlugIcon = 'error';
                        }
                    );
                }, 500);
            } else {
                $scope.validSlugIcon = 'error';
            }
        });

        $scope.$watch(function() {
            return $scope.recipe.category_id;
        }, function (newVal, oldVal) {
            if (newVal == null) $scope.recipe.category_id = undefined;
        });

        $scope.addIngredient = function() {
            if ($scope.recipe.newIngredient != null && $scope.recipe.newIngredient.name != null && $scope.recipe.newIngredient.name != '') {
                $scope.editRecipe.newIngredientName.$error = {};
                var ingredient = {
                    name: $scope.recipe.newIngredient.name,
                    count: $scope.recipe.newIngredient.count,
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
                        styling: 'fontawesome',
                    });
                    $('.ui-pnotify.custom-success-notify .material-icons').html('restaurant_menu');
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
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                    $scope.recipe.newIngredient.name = null;
                    $scope.recipe.newIngredient.count = null;
                });
            } else {
                $scope.editRecipe.newIngredientName.$error.customRequired = true;
            }
        };

        $scope.removeIngredient = function(index) {
            var ingredient = $scope.recipe.ingredients[index];
            IngredientService.delete($scope.recipe.id, ingredient.id, function (response) {
                $scope.recipe.ingredients.splice(index, 1);
                NotificationProvider.notify({
                    title: 'Ingrediente borrado',
                    text: '',
                    type: 'success',
                    addclass: 'custom-success-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify.custom-success-notify .material-icons').html('restaurant_menu');
                console.log($scope.recipe);
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
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
            });
        };

        // Abort the check slug request
        $scope.abortSlugRequest = function () {
            return ($scope.requestSlug && $scope.requestSlug.abort());
        };

        $scope.getDifficulty = function (diff) { return DIFF.class[diff]; }

        $scope.loadCategories = function() {
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
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
            });
        };

        $scope.loadTags = function(search) {
            return TagService.all(search, function (response) {
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
                $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                return [];
            });
        };

        $scope.transformChip = function(chip) {
            if (angular.isObject(chip)) {
                return chip;
            }
            return { text: chip, type: 'nuevo' }
        }

        $scope.tagSearch = function(search) {
            if(search) {
                return $scope.loadTags(search).then(function(response) {
                    $scope.tags = response.filter(function (el) {
                        return !$.containsId(el, $scope.recipe.chipTags);
                    });
                    return $scope.tags;
                });
            }
            return [];
        };

        $scope.edit = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            $rootScope.headerTitle = 'Creando receta';
            $("html, body").animate({ scrollTop: 0 }, "slow");
            var recipeObj = $scope.recipe;
            recipeObj.duration += ':00';
            recipeObj.newTags = RecipeService.getNewTags(recipeObj.chipTags);
            recipeObj.tags = $.getArrayId(recipeObj.chipTags);
            RecipeService.edit(recipeObj, function (response) {
                var mainFile = $scope.images.main;
                var slug = response.data.slug;
                if (mainFile) {
                    var recipeId = response.data.id;
                    $rootScope.headerTitle = 'Subiendo imágenes';
                    RecipeService.uploadFile(mainFile, recipeId, true, false,
                    function(response) {
                        $rootScope.progressBarActivated = false;
                        $location.path('/recipes/' + slug);
                    }, function (response) {
                        if (response.status == 400) {
                            $rootScope.error = {
                                icon: 'error_outline',
                                title: 'Datos incorrectos',
                                msg: $.parseError(response.data),
                            }
                        } else {
                            NotificationProvider.notify({
                                title: 'Un error ha ocurrido',
                                text: 'Ha ocurrido un error mientras se guardaban las imágenes. Por favor, intentelo más tarde.',
                                type: 'error',
                                addclass: 'custom-error-notify',
                                icon: 'material-icons md-light',
                                styling: 'fontawesome'
                            });
                            $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                            $rootScope.error = {
                                icon: 'error_outline',
                                title: 'Algo ha ido mal',
                                msg: 'Ha ocurrido un error mientras se guardaban las imágenes.'
                            }
                        }
                        $rootScope.errorMsg = true;
                        $rootScope.progressBarActivated = false;
                        $rootScope.headerTitle = 'Editar receta';
                    });
                } else {
                    $rootScope.progressBarActivated = false;
                    $location.path('/recipes/' + slug);
                }
            }, function (response) {
                if (response.status == 400) {
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: $.parseError(response.data),
                    }
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se guardaba la receta. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                    $rootScope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se guardaba la receta.'
                    }
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
                $rootScope.headerTitle = 'Editar receta';
            });
        };

        $scope.removeImage = function(index) {
            $('#image-removable-' + index).exists(function () {
                RecipeService.deleteFile(index, function (response) {
                    NotificationProvider.notify({
                        title: 'Image borrada',
                        text: '',
                        type: 'success',
                        addclass: 'custom-success-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome',
                    });
                    $('.ui-pnotify.custom-success-notify .material-icons').html('photo_filter');
                    $('#image-removable-' + index).remove();
                    $scope.images.recipe.splice(index, 1);
                    $scope.images.show.splice(index, 1);
                }, function (response) {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se borraban las imágenes. Por favor, intentelo más tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome'
                    });
                    $('.ui-pnotify.custom-error-notify .material-icons').html('warning');
                })
            });
        }

        $scope.$on('$viewContentLoaded', function() {
            if (window.File && window.FileList && window.FileReader) {
                var files = document.getElementById('files');
                var filedrag = document.getElementById('filedrag');

                files.addEventListener("change", function(e) { FILE_DROPZONE.FileHandler(e, $scope, $compile, true, RecipeService, NotificationProvider); }, false);
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    filedrag.addEventListener("dragover", function(e) { FILE_DROPZONE.FileDragOver(e, $scope); }, false);
                    filedrag.addEventListener("dragleave", function(e) { FILE_DROPZONE.FileDragOver(e, $scope); }, false);
                    filedrag.addEventListener("drop", function(e) { FILE_DROPZONE.FileHandler(e, $scope, $compile, true, RecipeService, NotificationProvider); }, false);
                    filedrag.style.display = "block";
                }
            }
        });
    }]
);
