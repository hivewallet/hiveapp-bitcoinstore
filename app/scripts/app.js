"use strict";

angular.module("hiveBitcoinstoreApp", [])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/categories.html",
        controller: "CategoriesCtrl"
      })
      .otherwise({
        redirectTo: "/"
      });
  });
