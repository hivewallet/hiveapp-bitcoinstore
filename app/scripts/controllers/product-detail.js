"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $rootScope, $routeParams, config, mapper) {
        $scope.categoryId = $routeParams.categoryId;
        $scope.productId = $routeParams.productId;

        // TODO: if not found fetch from API
        $scope.product = _.findWhere($rootScope.products, {product_id: $scope.productId});

        $scope.buy = function (productId) {
            alert("You bought " + productId);
        };
    });
