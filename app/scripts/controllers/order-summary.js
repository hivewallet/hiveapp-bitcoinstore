"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("OrderSummaryCtrl", function ($scope, $rootScope, $routeParams, $location) {
        $scope.categoryId = $routeParams.categoryId;
        $scope.productId = $routeParams.productId;

        $scope.product = _.findWhere($rootScope.products, {product_id: $scope.productId});
        if (!$scope.product) {
            $location.path("/categories/" + $scope.categoryId + "/products");
        }
    });
