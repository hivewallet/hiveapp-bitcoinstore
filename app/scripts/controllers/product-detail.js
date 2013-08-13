"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $rootScope, $routeParams, $location, $filter) {
        $scope.category = $filter('findBy')('category_id', $rootScope.categories, $routeParams.categoryId);
        $scope.product = $filter('findBy')('product_id', $rootScope.products, $routeParams.productId);
        if (!$scope.category || !$scope.product) $location.path("/");

        $scope.buy = function (productId) {
            // TODO: handle payment
            $location.path("/categories/" + $scope.category.category_id + "/products/" + $scope.product.product_id + "/order-summary");
        };
    });
