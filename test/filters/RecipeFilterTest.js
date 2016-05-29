'use strict';

describe('Module RecipeFilters', function() {
    beforeEach(module('recetariumApp', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    describe('Filter capitalize', function () {
        it('capitalize the first letter of sentence when is capital letter', inject (function (capitalizeFilter) {
            var input = 'something whatever';
            var expectedOutput = 'Something whatever';
            expect(capitalizeFilter(input)).toEqual(expectedOutput);
        }));

        it('capitalize the first letter of sentence when isn\'t capital letter', inject (function (capitalizeFilter) {
            var input = 'Something whatever';
            var expectedOutput = 'Something whatever';
            expect(capitalizeFilter(input)).toEqual(expectedOutput);
        }));
    });

    describe('Filter humanized', function () {
        it('humanize existing difficulty', inject ( function (humanizedFilter) {
            expect(humanizedFilter('EASY')).toEqual('Fácil');
            expect(humanizedFilter('MEDIUM')).toEqual('Media');
            expect(humanizedFilter('HARD')).toEqual('Difícil');
            expect(humanizedFilter('PUBLIC')).toEqual('Pública');
            expect(humanizedFilter('FRIENDS')).toEqual('Solo amigos');
            expect(humanizedFilter('PRIVATE')).toEqual('Privada');
        }));

        it('humanize no existing difficulty', inject ( function (humanizedFilter) {
            expect(humanizedFilter('NO_EXIST')).toEqual('');
        }));
    });

    describe('Filter duration', function () {
        it('duration is a date', inject ( function (durationFilter) {
            moment.locale('en');
            expect(durationFilter('00:00')).toEqual('');
            expect(durationFilter('00:10')).toEqual('10 minutes');
            expect(durationFilter('02:20')).toEqual('2 hours and 20 minutes');
        }));

        it('duration isn\'t a date', inject ( function (durationFilter) {
            expect(durationFilter('string')).toEqual('');
        }));
    });
});
