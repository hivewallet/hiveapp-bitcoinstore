"use strict";

angular.module("hiveBitcoinstoreApp", [])
    .config(function ($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "views/categories.html",
            controller: "CategoriesCtrl"
        })
        .when("/categories/:category/products", {
            templateUrl: "views/products.html",
            controller: "ProductsCtrl"
        })
        .otherwise({
            redirectTo: "/"
        });
    });
