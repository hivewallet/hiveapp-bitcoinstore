"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $routeParams) {
        $scope.product = _.findWhere(_.values(productFixtures), {entity_id: $routeParams.productId});
    });
