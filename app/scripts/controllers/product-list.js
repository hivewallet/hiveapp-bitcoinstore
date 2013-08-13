"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductListCtrl", function ($scope, $rootScope, $routeParams, config, mapper) {
        var productIds, item;
        $scope.categoryId = $routeParams.categoryId;
        $scope.currentPage = parseInt($routeParams.page || 1);
        $rootScope.products = [];

        var client = new MagentoSoapClient(config.storeUrl);
        client.login(config.storeUsername, config.storePassword).done(function () {
            client.categoryAssignedProducts($scope.categoryId).done(function (json) {
                productIds = _.map(json.callResponse.callReturn.item, function (item) {
                    return item.item[0].value.text;
                });

                client.productInfo(productIds).done(function (json) {
                    _.each(json.multiCallResponse.multiCallReturn.item, function (item) {
                        item = mapper.build(item);
                        $rootScope.products.push(item)
                    });

                    client.productMediaList(productIds).done(function (json) {
                        _.each(json.multiCallResponse.multiCallReturn.item, function (item, index) {
                            if (item.item) {
                                item = mapper.build(item.item);
                                $rootScope.products[index]["image"] = item;
                            }
                        });

                        client.productStockList(productIds).done(function (json) {
                            _.each(json.callResponse.callReturn.item, function (item, index) {
                                item = mapper.build(item);
                                $rootScope.products[index]["inventory"] = item;
                            });
                        });
                        $rootScope.$apply();
                    });
                });
            });
        });
    });
