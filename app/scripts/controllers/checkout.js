'use strict';

angular.module('hiveBitcoinstoreApp')
    .controller('CheckoutCtrl', function ($scope, $rootScope, $routeParams, $location, $filter, config) {
        if (!$rootScope.cart) {
            $location.path('/').replace();
            $scope.$apply(); // Force path change
            return;
        }

        var client = new MagentoSoapClient(config.storeUrl),
            cart = $rootScope.cart,
            product = cart.contents[0].product;

        $scope.checkout = function () {
            var payment = cart.payment;

            // Disable form button and display info about payment being processed
            $scope.loading = true;

            bitcoin.sendCoins(payment.address, payment.amount, function (success, hash) {
                if (success) {
                    // Redirect to the order summary page
                    $location.path('/orders/' + cart.id).replace();
                    $scope.$apply(); // Force path change

                    // TODO:
                    // Calling "cart.order" should be retried until payment is processed.
                    // However, it's disabled for the presentation.

                    // async.waterfall([
                    //     function (callback) {
                    //         client.login(config.storeUsername, config.storePassword)
                    //             .done(function () { callback(null); })
                    //             .fail(function () { callback(arguments); });
                    //     },
                    //     // TODO call untill it stops returning an error
                    //     function (callback) {
                    //         client.cartOrder(cart.id)
                    //             .done(function (orderId) { callback(null, orderId); })
                    //             .fail(function () { callback(arguments); });
                    //     }
                    // ], function (err, orderId) {
                    //     if (err) {
                    //         $rootScope.errorHandler.apply($rootScope, err);
                    //     } else {
                    //         // Redirect to the order summary page
                    //         $location.path('/orders/' + orderId).replace();
                    //         $scope.$apply(); // Force path change
                    //     }
                    // });
                } else {
                    $rootScope.errorHandler.apply($rootScope, [{}, 0, ""]);
                }
            });
        };
    });
