"use strict";

angular.module("btcstoreFilters", []).filter('inStock', function () {
  return function (input) {
    return input ? 'In stock' : 'Out of stock';
  };
});
