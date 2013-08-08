"use strict";

angular.module("hiveBitcoinstoreApp", [])
    .config(function ($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "views/category-list.html",
            controller: "CategoryListCtrl"
        })
        .when("/categories/:category/products", {
            templateUrl: "views/product-list.html",
            controller: "ProductListCtrl"
        })
        .when("/categories/:category/products/:productId", {
            templateUrl: "views/product-detail.html",
            controller: "ProductDetailCtrl"
        })

        .otherwise({
            redirectTo: "/"
        });
    });
