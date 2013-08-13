"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("CategoryListCtrl", function ($scope, config, mapper) {
        $scope.categories = [];
        var client = new MagentoSoapClient(config.storeUrl);
        client.login(config.storeUsername, config.storePassword).done(function () {
            client.categoryLevel(config.storeCategoryLevel).done(function (json) {
                _.each(json.callResponse.callReturn.item, function (item) {
                    $scope.categories.push(mapper.build(item));
                });
                $scope.$apply();
            });
        });
    });
