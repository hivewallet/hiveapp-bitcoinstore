"use strict";

angular.module("btcstoreFilters", [])
    .filter("inStock", function () {
        return function (input) {
            return input === "1" ? "In stock" : "Out of stock";
        };
    })
    .filter('findBy', function() {
        return function(attrName, collection, attrValue) {
            return _.detect(collection, function (item) {
                return item[attrName] === attrValue;
            });
        };
    });
