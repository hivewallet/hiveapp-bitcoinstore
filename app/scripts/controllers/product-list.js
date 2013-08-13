"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductListCtrl", function ($scope, $routeParams, config, mapper) {
        var productIds;
        $scope.categoryId = $routeParams.categoryId;
        $scope.currentPage = parseInt($routeParams.page || 1);
        $scope.products = [];

        var client = new MagentoSoapClient(config.storeUrl);
        client.login(config.storeUsername, config.storePassword).done(function () {
            client.categoryAssignedProducts($scope.categoryId).done(function (json) {
                productIds = _.map(json.callResponse.callReturn.item, function (item) {
                    return item.item[0].value.text;
                });

                client.productInfo(productIds).done(function (json) {
                    _.each(json.multiCallResponse.multiCallReturn.item, function (item) {
                        $scope.products.push(mapper.build(item));
                    });
                    $scope.$apply();
                });
            });
        });
    });
