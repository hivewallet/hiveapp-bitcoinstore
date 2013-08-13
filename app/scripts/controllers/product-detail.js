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

            client.login(config.storeUsername, config.storePassword).done(function () {
                client.cartCreate().done(function (cartId) {
                    client.cartCustomerSet(cartId, customer).done(function () {
                        client.cartCustomerAddresses(cartId, addresses).done(function () {
                            client.cartProductAdd(cartId, product).done(function () {
                                client.cartShippingList(cartId).done(function (shippingMethods) {
                                    // TODO: Fail if there are no shipping methods
                                    var shippingMethod = mapper.build(shippingMethods[0]).code;

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
            }).fail($rootScope.errorHandler);;
        };
    });
