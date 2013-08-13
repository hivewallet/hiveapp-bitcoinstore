"use strict";

angular.module("hiveBitcoinstoreApp", ["btcstoreFilters"])
    .config(function ($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "views/category-list.html",
            controller: "CategoryListCtrl"
        })
        .when("/categories/:categoryId/products", {
            templateUrl: "views/product-list.html",
            controller: "ProductListCtrl"
        })
        .when("/categories/:categoryId/products/:productId", {
            templateUrl: "views/product-detail.html",
            controller: "ProductDetailCtrl"
        })
        .otherwise({
            redirectTo: "/"
        });
    });
