"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductListCtrl", function ($scope, $routeParams) {
        $scope.category = $routeParams.category;
        $scope.products = _.values(productFixtures);
    });
