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
        .otherwise({
            redirectTo: "/"
        });
    });
