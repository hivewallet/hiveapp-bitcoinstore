'use strict';

angular.module('btcstore.controllers')

.controller('OrderSummaryCtrl', [
    '$scope',
    '$routeParams',
    function ($scope, $routeParams) {
        $scope.orderId = $routeParams.orderId;
    }]);
