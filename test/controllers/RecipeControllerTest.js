'use strict';

describe('Module RecipeController', function() {
    beforeEach(function () {
        module('recetariumApp');
    });

    var $controller;
    var $location;
    var $rootScope;
    var $httpBackend;

    var $scope = null;
    var ctrl = null;

    beforeEach(inject(function(_$controller_, _$location_, _$rootScope_, _$httpBackend_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    describe('Controller RecipeAll', function() {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('RecipeAll', {
                $scope: $scope
            });
            $httpBackend.when('GET', /http:\/\/localhost:9000\/recipes\?(.*)/).respond(200, {});
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
            expect($rootScope.headerTitle).toEqual('Recetas');
            expect($scope.pagination.page).toEqual(1);
            expect($scope.pagination.size).toEqual(10);
            expect($scope.pagination.search).toBeNull();
            expect($scope.recipes).toEqual([]);
            expect($scope.sizes).toEqual([10, 30, 50]);
        });

        it('search location', function() {
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond({});
            $location.path('/recipes');
            $scope.$apply();
            $httpBackend.flush();
            expect($location.url()).toBe('/recipes');

            $scope.pagination.search = 'test';
            $scope.searchRecipe();
            expect($location.url()).toBe('/recipes?page=1&size=10&search=test');
        });

        it('size location', function() {
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond({});
            $location.path('/recipes');
            $scope.$apply();
            $httpBackend.flush();
            expect($location.url()).toBe('/recipes');

            $scope.pagination.size = 50;
            $scope.searchRecipe();
            expect($location.url()).toBe('/recipes?page=1&size=50');
        });

        it('page location', function() {
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond({});
            $location.path('/recipes');
            $scope.$apply();
            $httpBackend.flush();
            expect($location.url()).toBe('/recipes');

            $scope.pagination.page = 5;
            $scope.searchRecipe();
            expect($location.url()).toBe('/recipes?page=5&size=10');
        });

        it('error loading', function() {
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond(404, {});
            $location.path('/recipes');
            $scope.$apply();
            $httpBackend.flush();
            expect($rootScope.errorMsg).toBeTruthy();
            expect($rootScope.error.icon).toBe('error_outline');
            expect($rootScope.error.title).toBe('Algo ha ido mal');
            expect($rootScope.error.msg).toBe('Ha ocurrido un error mientras se cargaban las recetas.');
            expect($location.url()).toBe('/recipes');
        });

        it('description method', function () {
            expect($scope.description('<div>Code HTML with more than 260 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>').$$unwrapTrustedValue()).toEqual('<div>Code HTML with more than 260 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea&hellip;');
            expect($scope.description(null)).toBeUndefined();
        });

        it('show recipe', function () {
            $scope.show('test');
            $scope.$apply();
            expect($location.path()).toBe('/recipes/test');
        });

        it('edit recipe', function () {
            $scope.edit(1, $scope.$broadcast("click"));
            $scope.$apply();
            expect($location.url()).toBe('/recipes/1/edit');
        });

        it('isMine recipe', function () {
            var user = {
                id: 1,
                username: 'test',
                email: 'test@email.com'
            };
            var userAdmin = {
                id: 2,
                username: 'admin',
                email: 'admin@email.com',
                type: 'ADMIN'
            };

            $rootScope.globals = { user: { user: user } };
            expect($scope.isMine(user)).toBeTruthy();
            expect($scope.isMine(userAdmin)).toBeFalsy();
            $rootScope.globals = { user: { user: userAdmin } };
            expect($scope.isMine(user)).toBeTruthy();
        });
    });

    describe('Controller RecipeShow', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('RecipeShow', {
                $scope: $scope,
                $routeParams: { slug: 'test' }
            });
            $httpBackend.when('GET', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {
                title: 'Test',
                slug: 'test',
                media: [],
                favorites: [],
                rating: {
                    rating: 0.0,
                    ratings: {}
                }
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
            expect($rootScope.headerTitle).toEqual('Cargando');
            expect($rootScope.progressBarActivated).toBeTruthy();
            expect($rootScope.HasBack).toBeTruthy();

            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $location.path('/recipes/test');
            $scope.$apply();
            $httpBackend.flush();
            expect($rootScope.headerTitle).toEqual('Test');
            expect($rootScope.progressBarActivated).toBeFalsy();
        });

        it('description method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.description('<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>').$$unwrapTrustedValue()).toEqual('<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>');
            expect($scope.description(null)).toBeUndefined();
        });

        it('difficulty method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getDifficulty('EASY')).toEqual('md-green');
            expect($scope.getDifficulty('MEDIUM')).toEqual('md-yellow');
            expect($scope.getDifficulty('HARD')).toEqual('md-red');
        });

        it('visibility class method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getVisibilityClass('PUBLIC')).toEqual('md-green');
            expect($scope.getVisibilityClass('FRIENDS')).toEqual('md-yellow');
            expect($scope.getVisibilityClass('PRIVATE')).toEqual('md-red');
        });

        it('visibility icon method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getVisibilityIcon('PUBLIC')).toEqual('lock_open');
            expect($scope.getVisibilityIcon('FRIENDS')).toEqual('lock_outline');
            expect($scope.getVisibilityIcon('PRIVATE')).toEqual('lock');
        });
    });

    describe('Controller RecipeEdit', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            $scope.formRecipe = {
                newIngredientName: {},
                slug: ''
            };
            ctrl = $controller('RecipeEdit', {
                $scope: $scope,
                $routeParams: { slug: 'test' }
            });
            $httpBackend.when('GET', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {
                id: 1,
                title: 'Test',
                slug: 'test',
                media: []
            });
            $httpBackend.when('GET', /http:\/\/localhost:9000\/categories(.*)/).respond(200, [{id:1,text:'test'}]);
            $httpBackend.when('PUT', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {
                id: 1,
                title: 'Test',
                slug: 'test',
                media: []
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
            expect($rootScope.headerTitle).toEqual('Editar receta');
            expect($rootScope.progressBarActivated).toBeTruthy();
            expect($rootScope.HasBack).toBeTruthy();

            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $location.path('/recipes/test/edit');
            $scope.$apply();
            $httpBackend.flush();
            expect($rootScope.headerTitle).toEqual('Editar receta');
            expect($rootScope.progressBarActivated).toBeFalsy();
        });

        it('difficulty method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getDifficulty('EASY')).toEqual('md-green');
            expect($scope.getDifficulty('MEDIUM')).toEqual('md-yellow');
            expect($scope.getDifficulty('HARD')).toEqual('md-red');
        });

        it('visibility class method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getVisibilityClass('PUBLIC')).toEqual('md-green');
            expect($scope.getVisibilityClass('FRIENDS')).toEqual('md-yellow');
            expect($scope.getVisibilityClass('PRIVATE')).toEqual('md-red');
        });

        it('visibility icon method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getVisibilityIcon('PUBLIC')).toEqual('lock_open');
            expect($scope.getVisibilityIcon('FRIENDS')).toEqual('lock_outline');
            expect($scope.getVisibilityIcon('PRIVATE')).toEqual('lock');
        });

        it('edit method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1');
            $scope.edit();
            $httpBackend.flush();

            expect($location.url()).toBe('/recipes/test');
        });

        it('edit error method', function () {
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1').respond(400);
            $scope.edit();
            $httpBackend.flush();

            expect($rootScope.headerTitle).toEqual('Editar receta');
            expect($rootScope.progressBarActivated).toBeFalsy();
            expect($rootScope.errorMsg).toBeTruthy();
        });
    });

    describe('Controller RecipeCreate', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            $scope.formRecipe = {
                newIngredientName: {},
                slug: ''
            };
            ctrl = $controller('RecipeCreate', {
                $scope: $scope
            });
            $httpBackend.when('GET', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {
                title: 'Test',
                slug: 'test',
                media: []
            });
            $httpBackend.when('GET', /http:\/\/localhost:9000\/categories(.*)/).respond(200, [{id:1,text:'test'}]);
            $httpBackend.when('POST', /http:\/\/localhost:9000\/recipes\/draft(.*)/).respond(200, {
                id: 1,
                title: 'Test',
                slug: 'test',
                media: []
            });
            $httpBackend.when('POST', /http:\/\/localhost:9000\/recipes\/create-from-draft(.*)/).respond(200, {
                id: 1,
                title: 'Test',
                slug: 'test',
                media: []
            });
            $httpBackend.when('GET', /http:\/\/localhost:9000\/categories(.*)/).respond(200, [{id:1,text:'test'}]);
            $httpBackend.when('PUT', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {
                id: 1,
                title: 'Test',
                slug: 'test',
                media: []
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
            expect($rootScope.headerTitle).toEqual('Nueva receta (borrador)');
            expect($rootScope.progressBarActivated).toBeTruthy();
            expect($rootScope.HasBack).toBeTruthy();

            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $location.path('/new-recipe');
            $scope.$apply();
            $httpBackend.flush();
            expect($rootScope.headerTitle).toEqual('Nueva receta (borrador)');
            expect($rootScope.progressBarActivated).toBeFalsy();
        });

        it('difficulty method', function () {
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $httpBackend.flush();
            expect($scope.getDifficulty('EASY')).toEqual('md-green');
            expect($scope.getDifficulty('MEDIUM')).toEqual('md-yellow');
            expect($scope.getDifficulty('HARD')).toEqual('md-red');
        });

        it('visibility class method', function () {
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $httpBackend.flush();
            expect($scope.getVisibilityClass('PUBLIC')).toEqual('md-green');
            expect($scope.getVisibilityClass('FRIENDS')).toEqual('md-yellow');
            expect($scope.getVisibilityClass('PRIVATE')).toEqual('md-red');
        });

        it('visibility icon method', function () {
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $httpBackend.flush();
            expect($scope.getVisibilityIcon('PUBLIC')).toEqual('lock_open');
            expect($scope.getVisibilityIcon('FRIENDS')).toEqual('lock_outline');
            expect($scope.getVisibilityIcon('PRIVATE')).toEqual('lock');
        });

        it('save method', function () {
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1');
            $scope.save();
            $httpBackend.flush();
            expect($rootScope.headerTitle).toEqual('Nueva receta (borrador)');
            expect($rootScope.progressBarActivated).toBeFalsy();
        });

        it('save error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1').respond(400);
            $scope.save();
            $httpBackend.flush();

            expect($rootScope.headerTitle).toEqual('Nueva receta (borrador)');
            expect($rootScope.progressBarActivated).toBeFalsy();
            expect($rootScope.errorMsg).toBeTruthy();
        });

        it('publish method', function () {
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1');
            $httpBackend.expectPOST('http://localhost:9000/recipes/create-from-draft');
            $scope.publish();
            $scope.$apply();
            $httpBackend.flush();

            expect($location.url()).toBe('/recipes/test/edit');
        });

        it('publish error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1').respond(400);
            $scope.publish();
            $httpBackend.flush();

            expect($rootScope.headerTitle).toEqual('Nueva receta (borrador)');
            expect($rootScope.progressBarActivated).toBeFalsy();
            expect($rootScope.errorMsg).toBeTruthy();
        });
    });
});
