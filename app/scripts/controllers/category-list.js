'use strict';

angular.module('btcstore.controllers')

.controller('CategoryListCtrl', [
    '$scope',
    '$rootScope',
    'mapper',
    'API_SERVER',
    'API_USERNAME',
    'API_PASSWORD',
    'ROOT_CATEGORY_ID',
    function ($scope, $rootScope, mapper, API_SERVER, API_USERNAME, API_PASSWORD, ROOT_CATEGORY_ID) {
        var client = new MagentoSoapClient(API_SERVER);

        $rootScope.categories = [];

        async.waterfall([
            function (callback) {
                client.login(API_USERNAME, API_PASSWORD)
                    .done(function () { callback(null); })
                    .fail(function () { callback(arguments); });
            },
            function (callback) {
                client.categoryLevel(ROOT_CATEGORY_ID)
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
    }]);
