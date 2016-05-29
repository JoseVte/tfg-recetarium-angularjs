var notificationProvider = angular.module('NotificationProviders', []);

notificationProvider.constant('NOTIFICATION', {
    ParseErrorResponse: function(response, httpCodes, $translate, $rootScope, NotificationProvider) {
        if (httpCodes.contains(response.status)) {
            if (response.status == 400) {
                $rootScope.error = {
                    icon: 'error_outline',
                    title: $translate.instant('error.400.title'),
                    msg: $.parseError(response.data)
                };
            } else {
                $rootScope.error = {
                    icon: 'error_outline',
                    title: response.data.error,
                };
            }
            $rootScope.errorMsg = true;
        } else {
            NotificationProvider.notify({
                title: ((!response || !response.data || !response.data.error) ? $translate.instant('error.500.title') : response.data.error),
                type: 'error',
                addclass: 'custom-error-notify',
                icon: 'material-icons md-light',
                styling: 'fontawesome'
            });
        }
    }
});


notificationProvider.provider('NotificationProvider',
    [function () {
        var settings = { styling: 'bootstrap3' };
        this.setDefaults = function(defaults) { settings = defaults; };
        // PNotify.desktop.permission();

        this.$get = [ function() {
            return {
                /* ========== SETTINGS RELATED METHODS =============*/
                getSettings: function() {
                    return settings;
                },
                /* ============== NOTIFICATION METHODS ==============*/
                notice: function(content) {
                    var hash = angular.copy(settings);
                    hash.type = 'notice';
                    hash.text = content;
                    return this.notify(hash);
                },
                info: function(content) {
                    var hash = angular.copy(settings);
                    hash.type = 'info';
                    hash.text = content;
                    return this.notify(hash);
                },
                success: function(content) {
                    var hash = angular.copy(settings);
                    hash.type = 'success';
                    hash.text = content;
                    return this.notify(hash);
                },
                error: function(content) {
                    var hash = angular.copy(settings);
                    hash.type = 'error';
                    hash.text = content;
                    return this.notify(hash);
                },
                notify: function(hash) {
                    hash.mobile = {
                        swipe_dismiss: true,
                        styling: true
                    };
                    var notification = new PNotify(hash);
                    if (hash.type === 'error' && (hash.icon_class === undefined || hash.icon_class === null)) {
                        notification.get().find('.material-icons').html('warning');
                    } else {
                        notification.get().find('.material-icons').html(hash.icon_class);
                    }

                    notification.get().click(function () {
                        notification.remove();
                        if (!!hash.callback && !!hash.callback.function) {
                            hash.callback.function();
                        }
                    });
                },
                notificateFavorite: function(data, callback){
                    return this.notify({
                        title: data.msg,
                        type: 'primary',
                        addclass: 'custom-primary-notify notify-clickable',
                        icon: 'material-icons md-light',
                        icon_class: 'favorite',
                        styling: 'fontawesome',
                        hide: false,
                        callback: {
                            function: callback,
                        }
                    });
                },
                notificateComment: function(data){
                    return this.notify({
                        title: data.msg,
                        type: 'primary',
                        addclass: 'custom-primary-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'comment',
                        styling: 'fontawesome'
                    });
                },
                notificateReply: function(data){
                    return this.notify({
                        title: data.msg,
                        type: 'primary',
                        addclass: 'custom-primary-notify',
                        icon: 'material-icons md-light',
                        icon_class: 'reply',
                        styling: 'fontawesome'
                    });
                },
            };
        }];
    }]
);
