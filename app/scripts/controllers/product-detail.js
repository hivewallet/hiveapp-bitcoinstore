"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $routeParams) {
        $scope.category = $routeParams.category;

        $scope.buy = function (productId) {
            alert("You bought " + productId);
        };

        bitcoinstoreApi.getProductDetail($routeParams.productId).done(function (data) {
            $scope.product = data
            $scope.$apply(); // TODO: investigate if this is really needed
        })

    });
