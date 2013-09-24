'use strict';

angular.module('btcstore.controllers')

.controller('ProductListCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$location',
    '$filter',
    'mapper',
    'API_SERVER',
    'API_USERNAME',
    'API_PASSWORD',
    function ($scope, $rootScope, $routeParams, $location, $filter, mapper, API_SERVER, API_USERNAME, API_PASSWORD) {
        var client = new MagentoSoapClient(API_SERVER);

        $scope.category = $filter('findBy')('category_id', $rootScope.categories, $routeParams.categoryId);
        $rootScope.products = [];
        $scope.currentPage = parseInt($routeParams.page || 1, 10);

        if ($scope.category) {
            async.waterfall([
                function (callback) {
                    client.login(API_USERNAME, API_PASSWORD)
                        .done(function () { callback(null); })
                        .fail(function () { callback(arguments); });
                },
                function (callback) {
                    client.categoryAssignedProducts($scope.category.category_id)
                        .done(function (result) {
                            // Limit number of displayed products to 25
                            var productIds  =  _.map(result, function (item) {
                                return item.item[0].value.text;
                            }).slice(0, 25);
                            callback(null, productIds);
                        })
                        .fail(function () { callback(arguments); });
                },
                // Fetch product info in parallel to speed it up
                function (productIds, callback) {
                    async.parallel([
                        function (parallelCallback) {
                            client.productInfo(productIds)
                                .done(function (result) {
                                    parallelCallback(null, result);
                                })
                                .fail(function () {
                                    parallelCallback(arguments);
                                });
                        },
                        function (parallelCallback) {
                            client.productStockList(productIds)
                                .done(function (result) {
                                    parallelCallback(null, result);
                                })
                                .fail(function () {
                                    parallelCallback(arguments);
                                });
                        },
                        function (parallelCallback) {
                            client.productMediaList(productIds)
                                .done(function (result) {
                                    parallelCallback(null, result);
                                })
                                .fail(function () {
                                    parallelCallback(arguments);
                                });
                        }
                    ], function (err, results) {
                        var productInfos, mediaInfos, stockInfos;

                        if (err) {
                            callback(err);
                        } else {
                            productInfos = results[0];
                            stockInfos = results[1];
                            mediaInfos = results[2];

                            _.each(productInfos, function (productInfo, index) {
                                var mediaInfo = mediaInfos[index],
                                    stockInfo = stockInfos[index],
                                    product, image, inventory;

                                // Build product
                                product = mapper.build(productInfo);

                                // Add image info
                                if (mediaInfo.item) {
                                    mediaInfo = _.isArray(mediaInfo.item) ? mediaInfo.item[0] : mediaInfo.item,
                                    image = mapper.build(mediaInfo);
                                    product.image = image;
                                }

                                // Add inventory info
                                inventory = mapper.build(stockInfo);
                                inventory.is_in_stock = _.contains(["true", "1"], inventory.is_in_stock);
                                product.inventory = inventory;

                                // Add product to the list
                                $rootScope.products.push(product);
                            });

                            callback(null);
                        }
                    });
                }
            ], function (err) {
                if (err) {
                    $rootScope.errorHandler.apply($rootScope, err);
                } else {
                    $rootScope.$apply();
                }
            });
        } else {
            $location.path('/');
        }
    }]);
