'use strict';

angular.module('hiveBitcoinstoreApp')
    .controller('CategoryListCtrl', function ($scope, $rootScope, config, mapper) {
        var client = new MagentoSoapClient(config.storeUrl);

        $rootScope.categories = [];

        async.waterfall([
            function (callback) {
                client.login(config.storeUsername, config.storePassword)
                    .done(function () { callback(null); })
                    .fail(function () { callback(arguments); });
            },
            function (callback) {
                client.categoryLevel(config.storeRootCategoryId)
                    .done(function (categories) { callback(null, categories); })
                    .fail(function () { callback(arguments); });
            }
        ], function (err, categories) {
            if (err) {
                $rootScope.errorHandler.apply($rootScope, err);
            } else {
                _.each(categories, function (item) {
                    $rootScope.categories.push(mapper.build(item));
                });
                $rootScope.$apply();
            }
        });
    });
