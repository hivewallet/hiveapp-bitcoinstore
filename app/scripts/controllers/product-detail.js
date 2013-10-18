'use strict';

angular.module('btcstore.controllers')

.controller('ProductDetailCtrl', [
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
        $scope.product = $filter('findBy')('product_id', $rootScope.products, $routeParams.productId);
        // TODO convert cart to a service
        $rootScope.cart = {}; // Reset cart

        if (!$scope.category || !$scope.product) {
            $location.path('/');
        }

        $scope.addProduct = function () {
            bitcoin.getUserInfo(function (clientInfo) {
                var customer = {
                    firstname: clientInfo.firstname,
                    lastname:  clientInfo.lastname,
                    email:     clientInfo.email,
                    mode:      'guest'
                };

                var addresses = [
                    {
                        mode:       'shipping',
                        firstname:  clientInfo.firstname,
                        lastname:   clientInfo.lastname,
                        street:     clientInfo.street,
                        city:       clientInfo.city,
                        region_id:  43, // missing
                        postcode:   clientInfo.zipcode,
                        country_id: 'US', // missing
                        telephone:  '0' // missing
                    },
                    {
                        mode:       'billing',
                        firstname:  clientInfo.firstname,
                        lastname:   clientInfo.lastname,
                        street:     clientInfo.street,
                        city:       clientInfo.city,
                        region_id:  43, // missing
                        postcode:   clientInfo.zipcode,
                        country_id: 'US', // missing
                        telephone:  '0' // missing
                    }
                ];

                var contents = [{
                    id: $scope.product.product_id,
                    qty: 1
                }];

                // Disable form button and display info about payment being processed
                $scope.loading = true;

                async.waterfall([
                    function (callback) {
                        client.login(API_USERNAME, API_PASSWORD)
                            .done(function () { callback(null); })
                            .fail(function () { callback(arguments); });
                    },
                    function (callback) {
                        client.cartCreate()
                            .done(function (cartId) {
                                $rootScope.cart.id = cartId;
                                callback(null, cartId);
                            })
                            .fail(function () { callback(arguments); });
                    },
                    function (cartId, callback) {
                        client.cartCustomerSet(cartId, customer)
                            .done(function () {
                                $rootScope.cart.customer = customer;
                                callback(null, cartId);
                            })
                            .fail(function () { callback(arguments); });
                    },
                    function (cartId, callback) {
                        client.cartCustomerAddresses(cartId, addresses)
                            .done(function () {
                                $rootScope.cart.addresses = addresses;
                                callback(null, cartId);
                            })
                            .fail(function () { callback(arguments); });
                    },
                    function (cartId, callback) {
                        client.cartProductAdd(cartId, contents)
                            .done(function () {
                                $rootScope.cart.contents = [{
                                    product: $scope.product,
                                    qty: 1
                                }];
                                callback(null, cartId);
                            })
                            .fail(function () { callback(arguments); });
                    },
                    function (cartId, callback) {
                        client.cartShippingList(cartId)
                            .done(function (shippingMethods) {
                                var shippingMethod;

                                if (shippingMethods.length) {
                                    shippingMethod = mapper.build(shippingMethods[0]);
                                    callback(null, cartId, shippingMethod);
                                } else {
                                    // TODO: provide more meaningful error message
                                    callback({});
                                }
                            })
                            .fail(function () { callback(arguments); });
                    },
                    function (cartId, shippingMethod, callback) {
                        client.cartShippingMethod(cartId, shippingMethod.code)
                            .done(function () {
                                $rootScope.cart.shipping = shippingMethod;
                                callback(null, cartId);
                            })
                            .fail(function () { callback(arguments); });
                    },
                    function (cartId, callback) {
                        var paymentMethod = 'Bitcoins';
                        client.cartPaymentMethod(cartId, paymentMethod)
                            .done(function () {
                                callback(null, cartId);
                            })
                            .fail(function () { callback(arguments); });
                    },
                    function (cartId, callback) {
                        client.cartInfo(cartId)
                            .done(function (cartInfo) {
                                var info = mapper.build(cartInfo);
                                $rootScope.cart.info = info;
                                callback(null, info);
                            })
                            .fail(function () { callback(arguments); });
                    },
                    function (cartInfo, callback) {
                        client.paymentInfo(cartInfo)
                            .done(function (paymentInfo) {
                                $rootScope.cart.payment = paymentInfo;
                                callback(null);
                            })
                            .fail(function () { callback(arguments); });
                    }
                ], function (err) {
                    var product;

                    if (err) {
                        $rootScope.errorHandler.apply($rootScope, err);
                    } else {
                        // Redirect to checkout page
                        $location.path('/checkout').replace();
                        $scope.$apply(); // Force path change
                    }
                });
            });
        };
    }]);
