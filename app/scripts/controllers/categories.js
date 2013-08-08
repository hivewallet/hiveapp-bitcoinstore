"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("CategoriesCtrl", function ($scope) {
        $scope.categories = [
            "Electronics",
            "Fashion",
            "Health"
        ];
    });
