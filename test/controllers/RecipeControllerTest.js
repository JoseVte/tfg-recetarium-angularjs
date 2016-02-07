'use strict';

describe('Module RecipeController', function() {
    beforeEach(function () {
        module('recetariumApp');
    });

    var $controller;
    var $location;
    var $rootScope;

    var $scope = null;
    var ctrl = null;

    beforeEach(inject(function(_$controller_, _$location_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $location = _$location_;
        $rootScope = _$rootScope_;
    }));

    describe('Controller RecipeAll', function() {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('RecipeAll', {
                $scope: $scope
            });
        }));

        it('initialize controller', function() {
            expect($rootScope.headerTitle).toEqual('Recetas');
            expect($scope.pagination.page).toEqual(1);
            expect($scope.pagination.size).toEqual(10);
            expect($scope.pagination.search).toEqual(null);
            expect($scope.recipes).toEqual([]);
            expect($scope.sizes).toEqual([10, 30, 50]);
        });
    });
});
