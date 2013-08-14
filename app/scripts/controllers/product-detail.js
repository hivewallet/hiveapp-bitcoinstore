"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $rootScope, $routeParams, $location, $filter, config, mapper) {
        var client = new MagentoSoapClient(config.storeUrl);

        $scope.category = $filter('findBy')('category_id', $rootScope.categories, $routeParams.categoryId);
        $scope.product = $filter('findBy')('product_id', $rootScope.products, $routeParams.productId);

        if (!$scope.category || !$scope.product) $location.path("/");

        $scope.buy = function (productId) {
            var customer = {
                firstname: "John",
                lastname: "Doe",
                email: "johndoe@example.com",
                mode: "guest"
            };

            var addresses = [
                {
                    mode: "shipping",
                    firstname: "John",
                    lastname: "Doe",
                    street: "Sesame Str",
                    city: "New York",
                    region_id: 43,
                    postcode: "10000",
                    country_id: "US",
                    telephone: "0123456789"
                },
                {
                    mode: "billing",
                    firstname: "John",
                    lastname: "Doe",
                    email: "johndoe@example.com",
                    street: "Sesame Str",
                    city: "New York",
                    region_id: 43,
                    postcode: "10000",
                    country_id: "US",
                    telephone: "0123456789"
                }
            ];

            var product = [{
                id: $scope.product.product_id,
                qty: 1
            }];

            // Disable form button and display info about payment being processed
            $scope.loading = true;

            // TODO Add back $rootScope.errorHandler
            async.waterfall([
                function (callback) {
                    client.login(config.storeUsername, config.storePassword)
                        .done(function () { callback(null); })
                        .fail(function () { callback({}); });
                },
                function (callback) {
                    client.cartCreate()
                        .done(function (cartId) { callback(null, cartId); })
                        .fail(function () { callback({}); });
                },
                function (cartId, callback) {
                    client.cartCustomerSet(cartId, customer)
                        .done(function () { callback(null, cartId); })
                        .fail(function () { callback({}); });
                },
                function (cartId, callback) {
                    client.cartCustomerAddresses(cartId, addresses)
                        .done(function () { callback(null, cartId); })
                        .fail(function () { callback({}); });
                },
                function (cartId, callback) {
                    client.cartProductAdd(cartId, product)
                        .done(function () { callback(null, cartId); })
                        .fail(function () { callback({}); });
                },
                function (cartId, callback) {
                    client.cartShippingList(cartId)
                        .done(function (shippingMethods) {
                            var shippingMethod;
                            if (shippingMethods.length) {
                                shippingMethod = mapper.build(shippingMethods[0]).code;
                                callback(null, cartId, shippingMethod);
                            } else {
                                callback({});
                            }
                        })
                        .fail(function () { callback({}); });
                },
                function (cartId, shippingMethod, callback) {
                    client.cartShippingMethod(cartId, shippingMethod)
                        .done(function () { callback(null, cartId); })
                        .fail(function () { callback({}); });
                },
                function (cartId, callback) {
                    var paymentMethod = "checkmo";
                    client.cartPaymentMethod(cartId, paymentMethod)
                        .done(function () { callback(null, cartId); })
                        .fail(function () { callback({}); });
                },
                function (cartId, callback) {
                    client.cartOrder(cartId)
                        .done(function (orderId) { callback(null, orderId); })
                        .fail(function () { callback({}); });
                }
            ], function (err, orderId) {
                if (err) throw "There was an error during processing the payment";

                // Redirect to order summary page
                $location.path("/orders/" + orderId).replace();
                $scope.$apply(); // Force path change
            });
        };
    });
