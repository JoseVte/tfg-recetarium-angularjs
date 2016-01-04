var recipeController = angular.module('RecipeController', []);

recipeController.constant('DIFF', {
    'class': {
        'EASY': 'md-green',
        'MEDIUM': 'md-yellow',
        'HARD': 'md-red'
    },
    'name': ['EASY', 'MEDIUM', 'HARD']
});

recipeController.controller('RecipeAll',
    ['$scope', '$rootScope', '$location', '$sce', 'RecipeService', 'NotificationProvider',
    function ($scope, $rootScope, $location, $sce, RecipeService, NotificationProvider) {
        $rootScope.headerTitle = 'Recetas';
        $scope.pagination = {
            page: 1,
            size: 10
        };

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
        }

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
                    text: 'Ha ocurrido un error mientras se cargaban las recetas. Por favor, intentelo mas tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify-icon .material-icons').html('warning');
                $rootScope.progressBarActivated = false;
            });
        }

        $scope.description = function(steps) {
            if (steps) return $sce.trustAsHtml(steps.trunc(80, true));
        }

        $scope.show = function(slug) {
            $location.path('/recipes/' + slug);
        }
    }]
);

recipeController.controller('RecipeShow',
    ['$scope', '$rootScope', '$location', '$routeParams', '$sce', 'RecipeService', 'NotificationProvider', 'DIFF',
    function ($scope, $rootScope, $location, $routeParams, $sce, RecipeService, NotificationProvider, DIFF) {
        $rootScope.headerTitle = 'Cargando';
        $rootScope.progressBarActivated = true;
        $rootScope.errorMsg = false;
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
                $scope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaba la receta.'
                }
                $rootScope.errorMsg = true;
                $rootScope.headerTitle = 'Error';
                $rootScope.progressBarActivated = false;
            }
        }, function (response) {
            if (response.status == 404) {
                $scope.error = {
                    icon: 'error_outline',
                    title: 'Error 404',
                    msg: 'La receta \'' + $routeParams.slug + '\' no existe.'
                }
                $rootScope.errorMsg = true;
            } else {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaba la receta. Por favor, intentelo mas tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify-icon .material-icons').html('warning');
                $scope.error = {
                    icon: 'error_outline',
                    title: 'Algo ha ido mal',
                    msg: 'Ha ocurrido un error mientras se cargaba la receta.'
                }
                $rootScope.errorMsg = true;
            }
            $rootScope.headerTitle = 'Error';
            $rootScope.progressBarActivated = false;
        });

        $scope.getDifficulty = function (diff) { return DIFF.class[diff]; }
    }]
);

recipeController.controller('RecipeCreate',
    ['$scope', '$rootScope', '$location', 'RecipeService', 'CategoryService', 'TagService',
    'NotificationProvider', 'DIFF', '$timeout',
    function ($scope, $rootScope, $location, RecipeService, CategoryService, TagService,
        NotificationProvider, DIFF, $timeout) {
        $rootScope.headerTitle = 'Nueva receta';
        $rootScope.errorMsg = false;
        $rootScope.progressBarActivated = false;
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
            duration: new Date(0, 0, 0, 0, 0, 0),
            tags: []
        };
        $scope.images = {};
        $scope.imagesLink = {};
        $scope.thumbnail = $scope.progressBar = new Array();

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
            if ($scope.recipe.newIngredient != null && $scope.recipe.newIngredient.name != null) {
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
        }

        $scope.removeIngredient = function(index) {
            $scope.recipe.ingredients.splice(index, 1);
        }

        // Abort the check slug request
        $scope.abortSlugRequest = function () {
            return ($scope.requestSlug && $scope.requestSlug.abort());
        }

        $scope.getDifficulty = function (diff) { return DIFF.class[diff]; }

        $scope.loadCategories = function() {
            CategoryService.all(function (response) {
                $scope.categories = response.data;
                $scope.categories.unshift({ id: null, text: 'Ninguna'});
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban las categorias. Por favor, intentelo mas tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify-icon .material-icons').html('warning');
            });
        }

        $scope.loadTags = function(search) {
            return TagService.all(search, function (response) {
                return response.data;
            }, function (response) {
                NotificationProvider.notify({
                    title: 'Un error ha ocurrido',
                    text: 'Ha ocurrido un error mientras se cargaban las etiquetas. Por favor, intentelo mas tarde.',
                    type: 'error',
                    addclass: 'custom-error-notify',
                    icon: 'material-icons md-light',
                    styling: 'fontawesome',
                });
                $('.ui-pnotify-icon .material-icons').html('warning');
                return [];
            });
        }

        $scope.tagSearch = function(search) {
            if(search) {
                return $scope.loadTags(search).then(function(response) {
                    $scope.tags = response.filter(function (el) {
                        return !$.containsId(el, $scope.recipe.tags);
                    });
                    return $scope.tags;
                });
            }
            return [];
        }

        $scope.create = function() {
            $rootScope.progressBarActivated = true;
            $rootScope.errorMsg = false;
            var recipeObj = $scope.recipe;
            var auxDuration = recipeObj.duration;
            recipeObj.duration = auxDuration.getHours() + ':' + auxDuration.getMinutes() + ':' + auxDuration.getSeconds();
            recipeObj.tags = $.getArrayId(recipeObj.tags);
            RecipeService.create(recipeObj, function (response) {
                var mainFile = $scope.images.main;
                var slug = response.data.slug;
                RecipeService.uploadFile(mainFile, response.data.id, true,
                function(response) {
                    $rootScope.progressBarActivated = false;
                    $location.path('/recipes/' + slug);
                }, function (response) {
                    if (response.status == 400) {
                        $scope.error = {
                            icon: 'error_outline',
                            title: 'Datos incorrectos',
                            msg: response.data
                        }
                    } else {
                        NotificationProvider.notify({
                            title: 'Un error ha ocurrido',
                            text: 'Ha ocurrido un error mientras se guardaban las imagenes. Por favor, intentelo mas tarde.',
                            type: 'error',
                            addclass: 'custom-error-notify',
                            icon: 'material-icons md-light',
                            styling: 'fontawesome',
                        });
                        $('.ui-pnotify-icon .material-icons').html('warning');
                        $scope.error = {
                            icon: 'error_outline',
                            title: 'Algo ha ido mal',
                            msg: 'Ha ocurrido un error mientras se guardaban las imagenes.'
                        }
                    }
                    $rootScope.errorMsg = true;
                    $rootScope.progressBarActivated = false;
                });
            }, function (response) {
                if (response.status == 400) {
                    $scope.error = {
                        icon: 'error_outline',
                        title: 'Datos incorrectos',
                        msg: response.data
                    }
                } else {
                    NotificationProvider.notify({
                        title: 'Un error ha ocurrido',
                        text: 'Ha ocurrido un error mientras se creaba la receta. Por favor, intentelo mas tarde.',
                        type: 'error',
                        addclass: 'custom-error-notify',
                        icon: 'material-icons md-light',
                        styling: 'fontawesome',
                    });
                    $('.ui-pnotify-icon .material-icons').html('warning');
                    $scope.error = {
                        icon: 'error_outline',
                        title: 'Algo ha ido mal',
                        msg: 'Ha ocurrido un error mientras se creaba la receta.'
                    }
                }
                $rootScope.errorMsg = true;
                $rootScope.progressBarActivated = false;
            });
        };
    }]
);
