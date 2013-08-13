"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductListCtrl", function ($scope, $rootScope, $routeParams, config, mapper) {
        var productIds, item, jsonPart;
        $scope.categoryId = $routeParams.categoryId;
        $scope.currentPage = parseInt($routeParams.page || 1);
        $rootScope.products = [];

        var client = new MagentoSoapClient(config.storeUrl);
        client.login(config.storeUsername, config.storePassword).done(function () {
            client.categoryAssignedProducts($scope.categoryId).done(function (json) {
                jsonPart = json.callResponse.callReturn.item;
                jsonPart = (_.isObject(jsonPart) && !_.isArray(jsonPart)) ? [{item: jsonPart.item}] : jsonPart;

                productIds = _.map(jsonPart, function (item) {
                    return item.item[0].value.text;
                });

                client.productInfo(productIds).done(function (json) {
                    jsonPart = json.multiCallResponse.multiCallReturn.item;
                    jsonPart = (_.isObject(jsonPart) && !_.isArray(jsonPart)) ? [{item: jsonPart.item}] : jsonPart;

                    _.each(jsonPart, function (item) {
                        item = mapper.build(item);
                        $rootScope.products.push(item)
                    });
                    client.productMediaList(productIds).done(function (json) {
                        jsonPart = json.multiCallResponse.multiCallReturn.item;
                        jsonPart = (_.isObject(jsonPart) && !_.isArray(jsonPart)) ? [{item: jsonPart.item}] : jsonPart;

                        _.each(jsonPart, function (item, index) {
                            if (item.item) {
                                item = mapper.build(item.item);
                                $rootScope.products[index]["image"] = item;
                            }
                        });

                        client.productStockList(productIds).done(function (json) {
                            jsonPart = json.callResponse.callReturn.item;
                            jsonPart = (_.isObject(jsonPart) && !_.isArray(jsonPart)) ? [{item: jsonPart.item}] : jsonPart;

                            _.each(jsonPart, function (item, index) {
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
