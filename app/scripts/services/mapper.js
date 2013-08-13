"use strict";

angular.module("hiveBitcoinstoreApp").factory("mapper", function () {
    return {
        build: function (item) {
            var attributes = {};
            (item.item || []).forEach(function (element) {
                attributes[element.key.text] = element.value.text;
            });
            return attributes;
        }
    }
});
