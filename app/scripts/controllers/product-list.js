"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductListCtrl", function ($scope) {
        $scope.products = _.values(productFixtures);
    });
