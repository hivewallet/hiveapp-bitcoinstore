"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductListCtrl", function ($scope, $routeParams) {
        $scope.category = $routeParams.category;
        $scope.currentPage = 1;

        // TODO: add some spinner - sometimes it takes lot of time to load products
        $scope.getPage = function (page) {
            $scope.currentPage = page;
            bitcoinstoreApi.getProductList({page: page}).done(function (data) {
                $scope.products = _.values(data);
                $scope.$apply(); // TODO: investigate if this is really needed
            })
        };

        $scope.getPage($scope.currentPage);
    });
