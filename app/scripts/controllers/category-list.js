"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("CategoryListCtrl", function ($scope, config) {
        var client = new MagentoSoapClient(config.storeUrl);
        client.login(config.storeUsername, config.storePassword).done(function () {
            client.categoryLevel(config.storeCategoryLevel).done(function (json) {
                _.each(json.callResponse.callReturn.item, function (item) {
                    $scope.categories.push({
                        id:   item.item[0].value.text,
                        name: item.item[2].value.text
                    });
                });
                $scope.$apply();
            });
        });
    });
