"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductsCtrl", function ($scope) {
        $scope.products = [
            "Electronics",
            "Fashion",
            "Health"
        ];
    });
