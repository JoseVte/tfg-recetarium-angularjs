var userFilter = angular.module('UserFilters', []);

userFilter.filter('userImage', function(envService) {
    return function(input) {
        if (!!input && !!input.email) {
            return 'https://www.gravatar.com/avatar/' + md5(input.email.toLowerCase().trim()) + '?d=identicon&f=y&s=200';
        }
        if (!!input && !!input.avatar.new_title) {
            return envService.read('apiUrl') + '/users/' + input.id +'/files/' + input.avatar.new_title;
        }
    };
});

userFilter.filter('fullname', function() {
    return function(input) {
        return (!!input) ? input.first_name + ' ' + input.last_name : '';
    };
});
