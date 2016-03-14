var notificationProvider = angular.module('NotificationProviders', []);

notificationProvider.provider('NotificationProvider',
    [function () {
        var settings = { styling: 'bootstrap3' };
        this.setDefaults = function(defaults) { settings = defaults; };
        PNotify.desktop.permission();

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
                    });
                }
            };
        }];
    }]
);
