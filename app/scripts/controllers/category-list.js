"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("CategoryListCtrl", function ($scope) {
        $scope.categories = [
            "Electronics",
            "Fashion",
            "Health"
        ];
    });
