"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $routeParams) {
        $scope.category = $routeParams.category;
        $scope.product = _.findWhere(_.values(productFixtures), {entity_id: $routeParams.productId});

        $scope.buy = function (productId) {
            alert("You bought " + productId);
        };
    });
