var userFilter = angular.module('UserFilters', []);

userFilter.filter('userImage', function(envService) {
    return function(input) {
        if (!!input && !!input.avatar && !!input.avatar.new_title) {
            return envService.read('apiUrl') + '/users/' + input.id +'/files/' + input.avatar.new_title;
        }
        if (!!input && !!input.email) {
            return 'https://www.gravatar.com/avatar/' + md5(input.email.toLowerCase().trim()) + '?d=identicon&f=y&s=200';
        }
    };
});

userFilter.filter('fullname', function() {
    return function(input) {
        return $.getFullName(input);
    };
});
