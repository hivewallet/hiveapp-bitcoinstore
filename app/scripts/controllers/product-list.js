"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductListCtrl", function ($scope, $rootScope, $routeParams, $location, $filter, config, mapper) {
        var client = new MagentoSoapClient(config.storeUrl);

        $scope.category = $filter('findBy')('category_id', $rootScope.categories, $routeParams.categoryId);
        $rootScope.products = [];
        $scope.currentPage = parseInt($routeParams.page || 1);

        if ($scope.category) {
            async.waterfall([
                function (callback) {
                    client.login(config.storeUsername, config.storePassword)
                        .done(function () { callback(null); })
                        .fail(function () { callback(arguments); });
                },
                // function (callback) {
                //     client.categoryAssignedProducts($scope.category.category_id)
                //         .done(function (result) {
                //             // Limit number of displayed products to 25
                //             var productIds  =  _.map(result, function (item) {
                //                 return item.item[0].value.text;
                //             }).slice(0, 25);
                //             callback(null, productIds);
                //         })
                //         .fail(function () { callback(arguments); });
                // },
                function (callback) {
                    callback(null, ["1248219", "1343479"]);
                },
                function (productIds, callback) {
                    client.productInfo(productIds)
                        .done(function (result) {
                            _.each(result, function (item) {
                                var product = mapper.build(item);
                                $rootScope.products.push(product);
                            });
                            callback(null, productIds);
                        })
                        .fail(function () { callback(arguments); });
                },
                function (productIds, callback) {
                    client.productMediaList(productIds)
                        .done(function (result) {
                            _.each(result, function (item, index) {
                                if (item.item) {
                                    var mediaInfo = mapper.build(item.item);
                                    $rootScope.products[index]["image"] = mediaInfo;
                                }
                            });
                            callback(null, productIds);
                        })
                        .fail(function () { callback(arguments); });
                },
                function (productIds, callback) {
                    client.productStockList(productIds)
                        .done(function (result) {
                            _.each(result, function (item, index) {
                                var stockInfo = mapper.build(item);
                                $rootScope.products[index]["inventory"] = stockInfo;
                            });
                            callback(null);
                        })
                        .fail(function () { callback(arguments); });
                }
            ], function (err) {
                if (err) {
                    $rootScope.errorHandler.apply($rootScope, err);
                } else {
                    $rootScope.$apply();
                }
            });
        } else {
            $location.path("/");
        }
    });
