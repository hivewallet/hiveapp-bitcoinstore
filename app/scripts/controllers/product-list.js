"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductListCtrl", function ($scope, $rootScope, $routeParams, $filter, config, mapper) {
        var productIds, item, jsonPart;

        $scope.category = {
            id: $routeParams.categoryId,
            name: $filter('findBy')('category_id', $rootScope.categories, $routeParams.categoryId).name
        };
        $scope.currentPage = parseInt($routeParams.page || 1);
        $rootScope.products = [];

        var client = new MagentoSoapClient(config.storeUrl);
        client.login(config.storeUsername, config.storePassword).done(function () {
            client.categoryAssignedProducts($scope.category.id).done(function (json) {
                jsonPart = json.callResponse.callReturn.item;
                jsonPart = (_.isObject(jsonPart) && !_.isArray(jsonPart)) ? [{item: jsonPart.item}] : jsonPart;

                productIds = _.map(jsonPart, function (item) {
                    return item.item[0].value.text;
                });

                client.productInfo(productIds).done(function (json) {
                    jsonPart = json.multiCallResponse.multiCallReturn.item;
                    jsonPart = (_.isObject(jsonPart) && !_.isArray(jsonPart)) ? [{item: jsonPart.item}] : jsonPart;

                    _.each(jsonPart, function (item) {
                        var product = mapper.build(item);
                        $rootScope.products.push(product);
                    });
                    client.productMediaList(productIds).done(function (json) {
                        jsonPart = json.multiCallResponse.multiCallReturn.item;
                        jsonPart = (_.isObject(jsonPart) && !_.isArray(jsonPart)) ? [{item: jsonPart.item}] : jsonPart;

                        _.each(jsonPart, function (item, index) {
                            if (item.item) {
                                var mediaInfo = mapper.build(item.item);
                                $rootScope.products[index]["image"] = mediaInfo;
                            }
                        });

                        client.productStockList(productIds).done(function (json) {
                            jsonPart = json.callResponse.callReturn.item;
                            jsonPart = (_.isObject(jsonPart) && !_.isArray(jsonPart)) ? [{item: jsonPart.item}] : jsonPart;

                            _.each(jsonPart, function (item, index) {
                                var stockInfo = mapper.build(item);
                                $rootScope.products[index]["inventory"] = stockInfo;
                            });
                        });
                        $rootScope.$apply();
                    });
                });
            });
        });
    });
