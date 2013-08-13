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
                        firstname: "testFirstname",
                        lastname: "testLastName",
                        email: "testEmail@example.com",
                        website_id: "1",
                        store_id: "1",
                        mode: "guest"
                    };

                    client.cartCustomerSet(cartId, customer).done(function () {
                        var addresses = [
                            {
                                mode: "shipping",
                                firstname: "testFirstname",
                                lastname: "testLastname",
                                company: "testCompany",
                                street: "testStreet",
                                city: "testCity",
                                region: "testRegion",
                                postcode: "testPostcode",
                                country_id: "id",
                                telephone: "0123456789",
                                fax: "0123456789",
                                is_default_shipping: 0,
                                is_default_billing: 0
                            },
                            {
                                mode: "billing",
                                firstname: "testFirstname",
                                lastname: "testLastname",
                                company: "testCompany",
                                street: "testStreet",
                                city: "testCity",
                                region: "testRegion",
                                postcode: "testPostcode",
                                country_id: "id",
                                telephone: "0123456789",
                                fax: "0123456789",
                                is_default_shipping: 0,
                                is_default_billing: 0
                            }
                        ];

                        client.cartCustomerAddresses(cartId, addresses).done(function () {
                            var product = [{
                                id: $scope.product.product_id,
                                qty: 1
                            }];

                            client.cartProductAdd(cartId, product).done(function () {
                                var shippingMethod = "flatrate_flatrate";

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
