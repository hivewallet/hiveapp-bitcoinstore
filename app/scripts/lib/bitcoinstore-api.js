var bitcoinstoreApi = {
    host: "https://www.bitcoinstore.com/api/rest",
    // host: "http://74.116.248.195/api/rest",

    getProducts: function (params) {
        params = params || {};
        return $.getJSON(bitcoinstoreApi.host + "/products", params);
    }
}
