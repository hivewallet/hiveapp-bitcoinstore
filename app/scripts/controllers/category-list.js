"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("CategoryListCtrl", function ($scope, $rootScope, config, mapper) {
        $rootScope.categories = [];
        var client = new MagentoSoapClient(config.storeUrl);
        client.login(config.storeUsername, config.storePassword).done(function () {
            client.categoryLevel(config.storeRootCategoryId).done(function (json) {
                _.each(json.callResponse.callReturn.item, function (item) {
                    $rootScope.categories.push(mapper.build(item));
                });
                $rootScope.$apply();
            });
        });
    });
