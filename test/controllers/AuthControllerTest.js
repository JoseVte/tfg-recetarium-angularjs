'use strict';

describe('Module AuthController', function() {
    beforeEach(function () {
        module('recetariumApp');
    });

    var $controller;
    var $location;
    var $rootScope;
    var $httpBackend;

    var $scope = null;
    var ctrl = null;

    beforeEach(inject(function (_$controller_, _$location_, _$rootScope_, _$httpBackend_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    describe('Controller Login', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('Login', {
                $scope: $scope
            });
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('POST', /http:\/\/localhost:9000\/auth\/login(.*)/).respond(200, {
                auth_token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTU0MzgxMzIsImp0aSI6ImVHejVlUGVzZ3cwcURBT3UtbU9FS2ciLCJpYXQiOjE0NTUzNTE3MzIsIm5iZiI6MTQ1NTM1MTYxMiwic3ViIjoie1widXNlclwiOntcImlkXCI6MSxcInVzZXJuYW1lXCI6XCJKb3Nyb21cIixcImVtYWlsXCI6XCJqdm9ydHNyb21lcm9AZ21haWwuY29tXCIsXCJmaXJzdF9uYW1lXCI6XCJKb3NlIFZpY2VudGVcIixcImxhc3RfbmFtZVwiOlwiT3J0cyBSb21lcm9cIixcInR5cGVcIjpcIkFETUlOXCIsXCJjcmVhdGVkX2F0XCI6MTQ1MjM2NjMyNzAwMCxcInVwZGF0ZWRfYXRcIjoxNDU0Njk0MDk2MDAwfSxcInNldEV4cGlyYXRpb25cIjp0cnVlfSJ9.hjYH9aa0_rE6AfR-uQLLWHB-X64Au0Vd_5kLvVrFj44'
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('initialize controller', function() {
        });

        it('login method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/login');
            $scope.login();
            $scope.$apply();
            $httpBackend.flush();
            expect($location.url()).toBe('/');
        });

        it('login error method', function () {
            $httpBackend.expectPOST(/http:\/\/localhost:9000\/auth\/check(.*)/).respond(400);
            $httpBackend.expectPOST('http://localhost:9000/auth/login').respond(400);
            $scope.login();
            $httpBackend.flush();
            expect($rootScope.errorMsg).toBeTruthy();
        });
    });

    describe('Controller Register', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('Register', {
                $scope: $scope
            });
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('POST', /http:\/\/localhost:9000\/auth\/register(.*)/).respond(200, {
                auth_token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTU0MzgxMzIsImp0aSI6ImVHejVlUGVzZ3cwcURBT3UtbU9FS2ciLCJpYXQiOjE0NTUzNTE3MzIsIm5iZiI6MTQ1NTM1MTYxMiwic3ViIjoie1widXNlclwiOntcImlkXCI6MSxcInVzZXJuYW1lXCI6XCJKb3Nyb21cIixcImVtYWlsXCI6XCJqdm9ydHNyb21lcm9AZ21haWwuY29tXCIsXCJmaXJzdF9uYW1lXCI6XCJKb3NlIFZpY2VudGVcIixcImxhc3RfbmFtZVwiOlwiT3J0cyBSb21lcm9cIixcInR5cGVcIjpcIkFETUlOXCIsXCJjcmVhdGVkX2F0XCI6MTQ1MjM2NjMyNzAwMCxcInVwZGF0ZWRfYXRcIjoxNDU0Njk0MDk2MDAwfSxcInNldEV4cGlyYXRpb25cIjp0cnVlfSJ9.hjYH9aa0_rE6AfR-uQLLWHB-X64Au0Vd_5kLvVrFj44'
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
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.flush();
        });

        it('register method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/auth/register');
            $scope.register();
            $scope.$apply();
            $httpBackend.flush();
            expect($location.url()).toBe('/');
        });

        it('register error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/auth/register').respond(400);
            $scope.register();
            $httpBackend.flush();
            expect($rootScope.errorMsg).toBeTruthy();
        });
    });

    describe('Controller Logout', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('Logout', {
                $scope: $scope
            });
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
            $httpBackend.flush();
            $scope.$apply();
            $rootScope.$apply();
            expect($location.url()).toBe('/');
        });
    });

    describe('Controller ResetPassword', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('ResetPassword', {
                $scope: $scope
            });
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('POST', /http:\/\/localhost:9000\/auth\/reset\/password(.*)/).respond(200, {msg: 'test'});
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
            $httpBackend.flush();
        });

        it('resetPassword method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/auth/reset/password');
            $scope.resetPassword();
            $scope.$apply();
            $httpBackend.flush();
            expect($scope.hasMessage).toBeTruthy();
            expect($scope.msg).toBe('test');
        });

        it('resetPassword error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPOST('http://localhost:9000/auth/reset/password').respond(400);
            $scope.resetPassword();
            $httpBackend.flush();
            expect($rootScope.errorMsg).toBeTruthy();
        });
    });

    describe('Controller RecoverPassword', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('RecoverPassword', {
                $scope: $scope
            });
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('PUT', /http:\/\/localhost:9000\/auth\/reset\/password(.*)/).respond(200);
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
            $httpBackend.flush();
        });

        it('recoverPassword method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPUT('http://localhost:9000/auth/reset/password');
            $scope.recoverPassword();
            $scope.$apply();
            $httpBackend.flush();
            expect($location.url()).toBe('/login');
        });

        it('recoverPassword error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPUT('http://localhost:9000/auth/reset/password').respond(400);
            $scope.recoverPassword();
            $httpBackend.flush();
            expect($rootScope.errorMsg).toBeTruthy();
        });
    });

    describe('Controller Settings', function () {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            $rootScope.globals = { user: { user: { id: 1 }}};
            ctrl = $controller('Settings', {
                $rootScope: $rootScope,
                $scope: $scope
            });
            $httpBackend.when('GET', /views\/(.*)/).respond(200, {});
            $httpBackend.when('GET', /http:\/\/localhost:9000\/profile(.*)/).respond(200, {id:1});
            $httpBackend.when('GET', /http:\/\/localhost:9000\/users\/1\/files(.*)/).respond(200, [{id:1, email: 'test'}]);
            $httpBackend.when('PUT', /http:\/\/localhost:9000\/profile(.*)/).respond(200);
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
            $httpBackend.expectGET('http://localhost:9000/profile');
            $httpBackend.flush();
            expect($scope.user.id).toEqual(1);
        });

        it('save error method', function () {
            $httpBackend.expectPOST('http://localhost:9000/auth/check');
            $httpBackend.expectPUT('http://localhost:9000/profile').respond(400);
            $scope.user = { email: 'test' };
            $scope.save();
            $httpBackend.flush();
            expect($rootScope.errorMsg).toBeTruthy();
        });
    });
});
