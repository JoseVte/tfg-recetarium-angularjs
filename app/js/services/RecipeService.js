var recipeService = angular.module('RecipeServices', ['ngResource']);

recipeService.factory('RecipeService',
    ['$http', '$rootScope', 'envService', '$q',
    function ($http, $rootScope, envService, $q) {
        var service = {
            apiUrl: envService.read('apiUrl'),
            regexMainImage: /^main\..+$/,
            charmap: {
                ' ': " ", '¡': "!", '¢': "c", '£': "lb", '¥': "yen", '¦': "|", '§': "SS", '¨': "\"", '©': "(c)", 'ª': "a",
                '«': "<<", '¬': "not", '­': "-", '®': "(R)", '°': "^0", '±': "+/-", '²': "^2", 'û': "^u", 'ü': '"u', 'ð': "d",
                '³': "^3", '´': "'", 'µ': "u", '¶': "P", '·': ".", '¸': ",", '¹': "^1", 'º': "o", '»': ">>", '¼': " 1/4 ",
                '½': " 1/2 ", '¾': " 3/4 ", '¿': "?", 'À': "`A", 'Á': "'A", 'Â': "^A",'Ã': "~A", 'â': "^a", 'á': "'a",
                'Ä': '"A', 'Å': "A", 'Æ': "AE", 'Ç': "C", 'È': "`E", 'É': "'E", 'Ê': "^E", 'Ë': '"E', 'Ì': "`I", 'Í': "'I",
                'Î': "^I", 'Ï': '"I', 'Ð': "D", 'Ñ': "~N", 'Ò': "`O", 'Ó': "'O", 'í': "'i", 'î': "^i", 'ï': '"i', 'à': "`a",
                'Ô': "^O", 'Õ': "~O", 'Ö': '"O', '×': "x", 'Ø': "O", 'Ù': "`U", 'Ú': "'U", 'Û': "^U", 'Ü': '"U', 'Ý': "'Y",
                'ã': "~a", 'ä': '"a', 'å': "a", 'æ': "ae", 'ç': "c", 'è': "`e", 'é': "'e", 'ê': "^e", 'ë': '"e', 'ì': "`i",
                'ñ': "~n", 'ò': "`o", 'ó': "'o", 'ô': "^o", 'õ': "~o", 'ö': '"o', '÷': ":", 'ø': "o", 'ù': "`u", 'ú': "'u",
                'þ': "th", 'ÿ': '"y', 'Ā': "A", 'ā': "a", 'Ă': "A", 'ă': "a", 'Ą': "A", 'ą': "a", 'Ć': "'C", 'ć': "'c",
                'Ċ': "C", 'ċ': "c", 'Č': "C", 'č': "c", 'Ď': "D", 'ď': "d", 'Đ': "D", 'đ': "d", 'Ē': "E", 'ē': "e",
                'ĕ': "e", 'Ė': "E", 'ė': "e", 'Ę': "E", 'ę': "e", 'Ě': "E", 'ě': "e", 'Ĝ': "^G", 'ĝ': "^g", 'Ğ': "G",
                'Ġ': "G", 'ġ': "g", 'Ģ': "G", 'ģ': "g", 'Ĥ': "^H", 'ĥ': "^h", 'Ħ': "H", 'ħ': "h", 'Ĩ': "~I", 'ß': "ss",
                'ĩ': "~i", 'Ī': "I", 'ī': "i", 'Ĭ': "I", 'ĭ': "i", 'Į': "I", 'į': "i", 'İ': "I", 'ı': "i", 'Ĳ': "IJ",
                'ĳ': "ij", 'Ĵ': "^J", 'ĵ': "^j", 'Ķ': "K", 'ķ': "k", 'Ĺ': "L", 'ĺ': "l", 'Ļ': "L", 'ļ': "l", 'Ľ': "L",
                'ŀ': "l", 'Ł': "L", 'ł': "l", 'Ń': "'N", 'ń': "'n", 'Ņ': "N", 'ņ': "n", 'Ň': "N", 'ň': "n", 'ŉ': "'n",
                'ō': "o", 'Ŏ': "O", 'ŏ': "o", 'Ő': '"O', 'ő': '"o', 'Œ': "OE", 'œ': "oe", 'Ŕ': "'R", 'ŕ': "'r", 'Ŗ': "R",
                'ŗ': "r", 'Ŷ': "^Y", 'Ō': "O", 'ľ': "l", 'Ŀ': "L", 'ğ': "g", 'Ĕ': "E", 'Ĉ': "^C", 'ĉ': "^c", 'ý': "'y",
                'Ř': "R", 'ř': "r", 'Ś': "'S", 'ś': "'s", 'Ŝ': "^S", 'ŝ': "^s", 'Ş': "S", 'ş': "s", 'Š': "S", 'š': "s",
                'Ţ': "T", 'ţ': "t", 'Ť': "T", 'ť': "t", 'Ŧ': "T", 'ŧ': "t", 'Ũ': "~U", 'ũ': "~u", 'Ū': "U", 'ū': "u",
                'Ŭ': "U", 'ŭ': "u", 'Ů': "U", 'ů': "u", 'Ű': '"U', 'ű': '"u', 'Ų': "U", 'ų': "u", 'Ŵ': "^W", 'ŵ': "^w",
                'ŷ': "^y", 'Ÿ': '"Y', 'Ź': "'Z", 'ź': "'z", 'Ż': "Z", 'ż': "z", 'Ž': "Z", 'ž': "z", 'ſ': "s", 'Þ': "Th"
            }
        };

        service.search = function (data, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/recipes',
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    params: data
                }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.get = function (slug, callbackOk, callbackError) {
            $http.get(
                service.apiUrl + '/recipes/' + slug,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.getDraft = function (callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/recipes/draft',
                {},
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.createFromDraft = function(callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/recipes/create-from-draft',
                {},
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.getImages = function(recipe) {
            var mainImage = recipe.media.filter(function(obj) {
                return service.regexMainImage.exec(obj.filename) !== null;
            })[0];
            var main = mainImage ? { id: mainImage.id, title: mainImage.filename, href: service.apiUrl + '/recipes/' + recipe.id + '/media/' + mainImage.filename } : { href: 'http://lorempixel.com/g/480/480/food/Placeholder'};
            var gallery = [];

            for (var i = 0; i < recipe.media.length; i++) {
                var image = recipe.media[i];
                var filename = image.filename.substr(0, image.filename.lastIndexOf('.'));
                if (image !== mainImage) gallery.push({ id: image.id, title: filename, href: service.apiUrl + '/recipes/' + recipe.id + '/media/' + image.filename });
            }

            return {
                main: main,
                gallery: gallery
            };
        };

        service.getSlug = function(s) {
            if (!s) return "";
            var ascii = [];
            var ch, cp;
            for (var i = 0; i < s.length; i++) {
                if ((cp = s.charCodeAt(i)) < 0x180) {
                    ch = String.fromCharCode(cp);
                    ascii.push(service.charmap[ch] || ch);
                }
            }
            s = ascii.join("");
            s = s.replace(/[^\w\s-]/g, "").trim().toLowerCase();
            return s.replace(/[-\s]+/g, "-");
        };

        service.checkSlug = function(slug) {
            var deferredAbort = $q.defer();
            var request = $http({
                method: "HEAD",
                url: service.apiUrl + '/recipes/' + slug + '/check',
                timeout: deferredAbort.promise
            });
            var promise = request.then(
                function(response) { return response; },
                function(response) { return response; }
            );

            promise.abort = function() { deferredAbort.resolve(); };
            promise.finally(function() {
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            });

            return promise;
        };

        service.checkSlugWithId = function(slug, id) {
            var deferredAbort = $q.defer();
            var request = $http({
                method: "HEAD",
                url: service.apiUrl + '/recipes/' + slug + '/check/' + id,
                timeout: deferredAbort.promise
            });
            var promise = request.then(
                function(response) { return response; },
                function(response) { return response; }
            );

            promise.abort = function() { deferredAbort.resolve(); };
            promise.finally(function() {
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            });

            return promise;
        };

        service.getNewTags = function(array) {
            var a = [];
            for (var el in array) {
                !array[el].id && a.push(array[el].text);
            }
            return a;
        };

        service.create = function(recipe, callbackOk, callbackError) {
            $http.post(
                service.apiUrl + '/recipes',
                recipe,
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.edit = function(recipe, callbackOk, callbackError) {
            $http.put(
                service.apiUrl + '/recipes/' + recipe.id,
                recipe,
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.uploadFile = function(file, id, isMain, isMultiple, callbackOk, callbackError) {
            var fd = new FormData();
            if (file instanceof Array) {
                for (var i = 0; i < file.length; i++) {
                    fd.append('file', file[i]);
                }
            } else {
                fd.append('file', file);
            }
            fd.append('is_main', isMain);
            fd.append('is_multiple', isMultiple);
            $http.post(
                service.apiUrl + '/recipes/' + id + '/media',
                fd,
                { transformRequest: angular.identity, headers: {'Content-Type': undefined} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.deleteFile = function(idRecipe, id, callbackOk, callbackError) {
            $http.delete(
                service.apiUrl + '/recipes/' + idRecipe + '/media/' + id,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.delete = function(id, callbackOk, callbackError) {
            $http.delete(
                service.apiUrl + '/recipes/' + id,
                { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
            ).then(function(response) {
                callbackOk(response);
            }, function(response) {
                callbackError(response);
            });
        };

        service.toggleFav = function(idRecipe, callbackOk, callbackError) {
            $http.patch(
                service.apiUrl +'/recipes/' + idRecipe + '/fav',
                {},
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        service.rating = function(idRecipe, rating, callbackOk, callbackError) {
            $http.put(
                service.apiUrl + '/recipes/' + idRecipe + '/rating',
                { rating: rating },
                { headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} }
            ).then(function (response) {
                callbackOk(response);
            }, function (response) {
                callbackError(response);
            });
        };

        return service;
    }]
);
