'use strict';

describe('Module RecipeFilters', function() {
    beforeEach(function () {
        module('recetariumApp');
    });

    describe('Filter capitalize', function () {
        it('capitalize the first letter of sentence', inject (function (capitalizeFilter) {
            var input = 'something whatever';
            var expectedOutput = 'Something whatever';
            expect(capitalizeFilter(input)).toEqual(expectedOutput);
        }));
    });
});
