"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("OrderSummaryCtrl", function ($scope, $routeParams) {
        $scope.orderId = $routeParams.orderId;
    });
