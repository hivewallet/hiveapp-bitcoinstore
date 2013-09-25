'use strict';

angular.module('btcstore.controllers')

.controller('CheckoutCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$location',
    '$filter',
    '$q',
    '$timeout',
    'API_SERVER',
    'API_USERNAME',
    'API_PASSWORD',
    function ($scope, $rootScope, $routeParams, $location, $filter, $q, $timeout, API_SERVER, API_USERNAME, API_PASSWORD) {
        if (!$rootScope.cart) {
            $location.path('/').replace();
            $scope.$apply(); // Force path change
            return;
        }

        var client = new MagentoSoapClient(API_SERVER),
            cart = $rootScope.cart,
            product = cart.contents[0].product;

        $scope.checkout = function () {
            var payment = cart.payment;

            // Disable form button and display info about payment being processed
            $scope.loading = true;

            // Remove error message if there already is any
            $rootScope.errorHandler.apply($rootScope);

            bitcoin.sendCoins(payment.address, payment.amount, function (success, hash) {
                if (success) {
                    async.waterfall([
                        function (callback) {
                            client.login(API_USERNAME, API_PASSWORD)
                                .done(function () { callback(null); })
                                .fail(function () { callback(arguments); });
                        },
                        function (callback) {
                            function order(options) {
                                // Uses jQuery deferred API
                                client.cartOrder(cart.id)
                                    .done(function (orderId) {
                                        callback(null, orderId);
                                    })
                                    .fail(function () {
                                        if (options.retries > 0) {
                                            $timeout(function () {
                                                order({
                                                    retries: options.retries - 1,
                                                    delay: 3000
                                                });
                                            }, options.delay);
                                        } else {
                                            callback(arguments);
                                        }
                                    });
                            }

                            order({
                                retries: 10,
                                delay: 5000
                            });
                        }
                    ], function (err, orderId) {
                        if (err) {
                            $scope.loading = false;
                            $rootScope.errorHandler.apply($rootScope, err);
                        } else {
                            // Redirect to the order summary page
                            $location.path('/orders/' + orderId).replace();
                            $scope.$apply(); // Force path change
                        }
                    });
                } else {
                    $scope.loading = false;
                    $rootScope.errorHandler.apply($rootScope, [{}, 0, ""]);
                }
            });
        };
    }]);
