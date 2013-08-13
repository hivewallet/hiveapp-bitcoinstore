"use strict";

angular.module("btcstoreFilters", []).filter("inStock", function () {
    return function (input) {
        return input === "1" ? "In stock" : "Out of stock";
    };
});
