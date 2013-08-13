"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $rootScope, $routeParams, $location, $filter, config) {
        var client = new MagentoSoapClient(config.storeUrl);

        $scope.category = $filter('findBy')('category_id', $rootScope.categories, $routeParams.categoryId);
        $scope.product = $filter('findBy')('product_id', $rootScope.products, $routeParams.productId);

        if (!$scope.category || !$scope.product) $location.path("/");

        $scope.buy = function (productId) {
            $scope.loading = true;

            client.login(config.storeUsername, config.storePassword).done(function () {
                client.cartCreate().done(function (cartId) {
                    var customer = {
                        firstname: "John",
                        lastname: "Doe",
                        email: "johndoe@example.com",
                        mode: "guest"
                    };

                    client.cartCustomerSet(cartId, customer).done(function () {
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

                        client.cartCustomerAddresses(cartId, addresses).done(function () {
                            var product = [{
                                id: $scope.product.product_id,
                                qty: 1
                            }];

                            client.cartProductAdd(cartId, product).done(function () {
                                var shippingMethod = "tablerate_bestway";

                                client.cartShippingMethod(cartId, shippingMethod).done(function () {
                                    var paymentMethod = "checkmo";

                                    client.cartPaymentMethod(cartId, paymentMethod).done(function () {
                                        client.cartOrder(cartId).done(function (orderId) {
                                            $location.path("/orders/" + orderId).replace();
                                            $scope.$apply(); // Force path change
                                        }).fail($rootScope.errorHandler);;
                                    }).fail($rootScope.errorHandler);;
                                }).fail($rootScope.errorHandler);;
                            }).fail($rootScope.errorHandler);;
                        }).fail($rootScope.errorHandler);;
                    }).fail($rootScope.errorHandler);;
                }).fail($rootScope.errorHandler);;
            }).fail($rootScope.errorHandler);;
        };
    });
