var bitcoinstoreApi = {
    host: "https://www.bitcoinstore.com/api/rest",
    // host: "http://74.116.248.195/api/rest",

    getProductList: function (params) {
        params = params || {};
        return $.getJSON(bitcoinstoreApi.host + "/products", params);
    },

    // Probably this can be fetched from product list when cached
    getProductDetail: function (productId, params) {
        params = params || {};
        return $.getJSON(bitcoinstoreApi.host + "/products/" + productId, params);
    }
};
