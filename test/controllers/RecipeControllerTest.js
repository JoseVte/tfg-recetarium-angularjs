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
            $httpBackend.when('HEAD', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {});
            $httpBackend.when('GET', /http:\/\/localhost:9000\/recipes\?(.*)/).respond(200, {});
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('POST', /http:\/\/localhost:9000\/auth\/check(.*)/).respond(200, {
                auth_token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTU0MzgxMzIsImp0aSI6ImVHejVlUGVzZ3cwcURBT3UtbU9FS2ciLCJpYXQiOjE0NTUzNTE3MzIsIm5iZiI6MTQ1NTM1MTYxMiwic3ViIjoie1widXNlclwiOntcImlkXCI6MSxcInVzZXJuYW1lXCI6XCJKb3Nyb21cIixcImVtYWlsXCI6XCJqdm9ydHNyb21lcm9AZ21haWwuY29tXCIsXCJmaXJzdF9uYW1lXCI6XCJKb3NlIFZpY2VudGVcIixcImxhc3RfbmFtZVwiOlwiT3J0cyBSb21lcm9cIixcInR5cGVcIjpcIkFETUlOXCIsXCJjcmVhdGVkX2F0XCI6MTQ1MjM2NjMyNzAwMCxcInVwZGF0ZWRfYXRcIjoxNDU0Njk0MDk2MDAwfSxcInNldEV4cGlyYXRpb25cIjp0cnVlfSJ9.hjYH9aa0_rE6AfR-uQLLWHB-X64Au0Vd_5kLvVrFj44'
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond({data: []});
            $httpBackend.flush();
            expect($scope.recipes).toEqual([]);
        });

        it('loading recipes', function() {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond({});
            $location.path('/recipes');
            $scope.$apply();
            $httpBackend.flush();
            expect($location.url()).toBe('/recipes');
        });

        it('error loading', function() {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond(404, {});
            $location.path('/recipes');
            $scope.$apply();
            $httpBackend.flush();
            expect($location.url()).toBe('/recipes');
        });

        it('description method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond({});
            $httpBackend.flush();
            expect($scope.description('<div>Code HTML with more than 260 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>').$$unwrapTrustedValue()).toEqual('<div>Code HTML with more than 260 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea&hellip;');
            expect($scope.description(null)).toBeUndefined();
        });

        it('isMine recipe', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET(/http:\/\/localhost:9000\/recipes(.*)/).respond({});
            $httpBackend.flush();
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

            $rootScope.globals = { user: user };
            expect($scope.isMine(user)).toBeTruthy();
            expect($scope.isMine(userAdmin)).toBeFalsy();
            $rootScope.globals = { user: userAdmin };
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
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('GET', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {
                image_main: { id: 1},
                title: 'Test',
                slug: 'test',
                media: [],
                favorites: [],
                rating: {
                    rating: 0.0,
                    ratings: {}
                }
            });
            $httpBackend.when('POST', /http:\/\/localhost:9000\/auth\/check(.*)/).respond(200, {
                auth_token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTU0MzgxMzIsImp0aSI6ImVHejVlUGVzZ3cwcURBT3UtbU9FS2ciLCJpYXQiOjE0NTUzNTE3MzIsIm5iZiI6MTQ1NTM1MTYxMiwic3ViIjoie1widXNlclwiOntcImlkXCI6MSxcInVzZXJuYW1lXCI6XCJKb3Nyb21cIixcImVtYWlsXCI6XCJqdm9ydHNyb21lcm9AZ21haWwuY29tXCIsXCJmaXJzdF9uYW1lXCI6XCJKb3NlIFZpY2VudGVcIixcImxhc3RfbmFtZVwiOlwiT3J0cyBSb21lcm9cIixcInR5cGVcIjpcIkFETUlOXCIsXCJjcmVhdGVkX2F0XCI6MTQ1MjM2NjMyNzAwMCxcInVwZGF0ZWRfYXRcIjoxNDU0Njk0MDk2MDAwfSxcInNldEV4cGlyYXRpb25cIjp0cnVlfSJ9.hjYH9aa0_rE6AfR-uQLLWHB-X64Au0Vd_5kLvVrFj44'
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
            expect($rootScope.progressBarActivated).toBeTruthy();
            expect($rootScope.HasBack).toBeTruthy();

            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $location.path('/recipes/test');
            $scope.$apply();
            $httpBackend.flush();
            expect($rootScope.progressBarActivated).toBeFalsy();
        });

        it('description method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.description('<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>').$$unwrapTrustedValue()).toEqual('<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>');
            expect($scope.description(null)).toBeUndefined();
        });

        it('difficulty method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getDifficulty('EASY')).toEqual('md-green');
            expect($scope.getDifficulty('MEDIUM')).toEqual('md-yellow');
            expect($scope.getDifficulty('HARD')).toEqual('md-red');
        });

        it('visibility class method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getVisibilityClass('PUBLIC')).toEqual('md-green');
            expect($scope.getVisibilityClass('FRIENDS')).toEqual('md-yellow');
            expect($scope.getVisibilityClass('PRIVATE')).toEqual('md-red');
        });

        it('visibility icon method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
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
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('HEAD', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {});
            $httpBackend.when('GET', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {
                image_main: { id: 1},
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
            $httpBackend.when('POST', /http:\/\/localhost:9000\/auth\/check(.*)/).respond(200, {
                auth_token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTU0MzgxMzIsImp0aSI6ImVHejVlUGVzZ3cwcURBT3UtbU9FS2ciLCJpYXQiOjE0NTUzNTE3MzIsIm5iZiI6MTQ1NTM1MTYxMiwic3ViIjoie1widXNlclwiOntcImlkXCI6MSxcInVzZXJuYW1lXCI6XCJKb3Nyb21cIixcImVtYWlsXCI6XCJqdm9ydHNyb21lcm9AZ21haWwuY29tXCIsXCJmaXJzdF9uYW1lXCI6XCJKb3NlIFZpY2VudGVcIixcImxhc3RfbmFtZVwiOlwiT3J0cyBSb21lcm9cIixcInR5cGVcIjpcIkFETUlOXCIsXCJjcmVhdGVkX2F0XCI6MTQ1MjM2NjMyNzAwMCxcInVwZGF0ZWRfYXRcIjoxNDU0Njk0MDk2MDAwfSxcInNldEV4cGlyYXRpb25cIjp0cnVlfSJ9.hjYH9aa0_rE6AfR-uQLLWHB-X64Au0Vd_5kLvVrFj44'
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
            expect($rootScope.progressBarActivated).toBeTruthy();
            expect($rootScope.HasBack).toBeTruthy();

            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $location.path('/recipes/test/edit');
            $scope.$apply();
            $httpBackend.flush();
            expect($rootScope.progressBarActivated).toBeFalsy();
        });

        it('difficulty method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getDifficulty('EASY')).toEqual('md-green');
            expect($scope.getDifficulty('MEDIUM')).toEqual('md-yellow');
            expect($scope.getDifficulty('HARD')).toEqual('md-red');
        });

        it('visibility class method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getVisibilityClass('PUBLIC')).toEqual('md-green');
            expect($scope.getVisibilityClass('FRIENDS')).toEqual('md-yellow');
            expect($scope.getVisibilityClass('PRIVATE')).toEqual('md-red');
        });

        it('visibility icon method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $httpBackend.flush();
            expect($scope.getVisibilityIcon('PUBLIC')).toEqual('lock_open');
            expect($scope.getVisibilityIcon('FRIENDS')).toEqual('lock_outline');
            expect($scope.getVisibilityIcon('PRIVATE')).toEqual('lock');
        });

        it('edit method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1');
            $scope.edit();
            $httpBackend.flush();

            expect($rootScope.progressBarActivated).toBeFalsy();
            expect($rootScope.errorMsg).toBeFalsy();
        });

        it('edit error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectGET('http://localhost:9000/recipes/test');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1').respond(400);
            $scope.edit();
            $httpBackend.flush();

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
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('GET', /http:\/\/localhost:9000\/recipes\/(.*)/).respond(200, {
                image_main: { id: 1},
                title: 'Test',
                slug: 'test',
                media: []
            });
            $httpBackend.when('GET', /http:\/\/localhost:9000\/categories(.*)/).respond(200, [{id:1,text:'test'}]);
            $httpBackend.when('POST', /http:\/\/localhost:9000\/recipes\/draft(.*)/).respond(200, {
                image_main: { id: 1},
                id: 1,
                title: 'Test',
                slug: 'test',
                media: []
            });
            $httpBackend.when('POST', /http:\/\/localhost:9000\/recipes\/create-from-draft(.*)/).respond(200, {
                image_main: { id: 1},
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
            $httpBackend.when('POST', /http:\/\/localhost:9000\/auth\/check(.*)/).respond(200, {
                auth_token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTU0MzgxMzIsImp0aSI6ImVHejVlUGVzZ3cwcURBT3UtbU9FS2ciLCJpYXQiOjE0NTUzNTE3MzIsIm5iZiI6MTQ1NTM1MTYxMiwic3ViIjoie1widXNlclwiOntcImlkXCI6MSxcInVzZXJuYW1lXCI6XCJKb3Nyb21cIixcImVtYWlsXCI6XCJqdm9ydHNyb21lcm9AZ21haWwuY29tXCIsXCJmaXJzdF9uYW1lXCI6XCJKb3NlIFZpY2VudGVcIixcImxhc3RfbmFtZVwiOlwiT3J0cyBSb21lcm9cIixcInR5cGVcIjpcIkFETUlOXCIsXCJjcmVhdGVkX2F0XCI6MTQ1MjM2NjMyNzAwMCxcInVwZGF0ZWRfYXRcIjoxNDU0Njk0MDk2MDAwfSxcInNldEV4cGlyYXRpb25cIjp0cnVlfSJ9.hjYH9aa0_rE6AfR-uQLLWHB-X64Au0Vd_5kLvVrFj44'
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
            expect($rootScope.progressBarActivated).toBeTruthy();
            expect($rootScope.HasBack).toBeTruthy();

            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $location.path('/new-recipe');
            $scope.$apply();
            $httpBackend.flush();
            expect($rootScope.progressBarActivated).toBeFalsy();
        });

        it('difficulty method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $httpBackend.flush();
            expect($scope.getDifficulty('EASY')).toEqual('md-green');
            expect($scope.getDifficulty('MEDIUM')).toEqual('md-yellow');
            expect($scope.getDifficulty('HARD')).toEqual('md-red');
        });

        it('visibility class method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $httpBackend.flush();
            expect($scope.getVisibilityClass('PUBLIC')).toEqual('md-green');
            expect($scope.getVisibilityClass('FRIENDS')).toEqual('md-yellow');
            expect($scope.getVisibilityClass('PRIVATE')).toEqual('md-red');
        });

        it('visibility icon method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $httpBackend.flush();
            expect($scope.getVisibilityIcon('PUBLIC')).toEqual('lock_open');
            expect($scope.getVisibilityIcon('FRIENDS')).toEqual('lock_outline');
            expect($scope.getVisibilityIcon('PRIVATE')).toEqual('lock');
        });

        it('save method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1');
            $scope.save();
            $httpBackend.flush();
            expect($rootScope.progressBarActivated).toBeFalsy();
        });

        it('save error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1').respond(400);
            $scope.save();
            $httpBackend.flush();

            expect($rootScope.progressBarActivated).toBeFalsy();
            expect($rootScope.errorMsg).toBeTruthy();
        });

        it('publish method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1');
            $scope.publish();
            $scope.$apply();
            $httpBackend.flush();

            expect($rootScope.progressBarActivated).toBeFalsy();
            expect($rootScope.errorMsg).toBeFalsy();
        });

        it('publish error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/recipes/draft');
            $scope.$apply();
            $httpBackend.flush();

            $httpBackend.expectPUT('http://localhost:9000/recipes/1').respond(400);
            $scope.publish();
            $httpBackend.flush();

            expect($rootScope.progressBarActivated).toBeFalsy();
            expect($rootScope.errorMsg).toBeTruthy();
        });
    });
});
