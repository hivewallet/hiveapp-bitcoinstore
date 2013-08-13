"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $rootScope, $routeParams, $location, config, mapper) {
        $scope.categoryId = $routeParams.categoryId;
        $scope.productId = $routeParams.productId;

        $scope.product = _.findWhere($rootScope.products, {product_id: $scope.productId});
        if (!$scope.product) {
            // TODO: fetch from API
            $location.path("/categories/" + $scope.categoryId + "/products");
        }

        $scope.buy = function (productId) {
            alert("You bought " + productId);
        };
    });
