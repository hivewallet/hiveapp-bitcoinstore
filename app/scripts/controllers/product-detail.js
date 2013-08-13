"use strict";

angular.module("hiveBitcoinstoreApp")
    .controller("ProductDetailCtrl", function ($scope, $routeParams, config, mapper) {
        $scope.categoryId = $routeParams.categoryId;
        $scope.productId = $routeParams.productId;

        var client = new MagentoSoapClient(config.storeUrl);
        client.login(config.storeUsername, config.storePassword).done(function () {
            client.productInfo([$scope.productId]).done(function (json) {
                $scope.product = mapper.build(json.multiCallResponse.multiCallReturn.item);
                $scope.$apply();
            });
        });

        $scope.buy = function (productId) {
            alert("You bought " + productId);
        };
    });
