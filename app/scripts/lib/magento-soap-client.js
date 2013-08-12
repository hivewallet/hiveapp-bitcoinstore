// TODO:
// - handle SOAP errors in success callbacks and call deferred.reject
// - figure out storeId and websiteId for test server

var MagentoSoapClient = function (url) {
    this.url = url;
    this.sessionId = null;
    this.storeId = "1";
    this.websiteId = "1";

    $.soap({
        url: this.url,
        appendMethodToURL: false
    });
};

// Auth methods
MagentoSoapClient.prototype.login = function (username, apiKey) {
    var self = this,
        deferred = $.Deferred();

    $.soap({
        method: "ns1:login",
        params: {
            username: username,
            apiKey: apiKey
        },
        success: function (response) {
            var json = response.toJSON(),
                sessionId = json.Body.loginResponse.loginReturn.toString();

            self.sessionId = sessionId;
            deferred.resolve(sessionId);
        },
        error: function (response) {
            var json = response.toJSON();
            deferred.reject(json);
        }
    });

    return deferred.promise();
};

// Catalog methods
MagentoSoapClient.prototype.categoryLevel = function (categoryId) {
    var sessionId = this.sessionId,
        path = "category.level",
        args = [this.storeId, this.websiteId, categoryId],
        deferred = $.Deferred(),
        body;

    body = xml("ns1:call", {}, function () {
        this.xml("sessionId", {}, function () {
            this.text(sessionId);
        });
        this.xml("resourcePath", {}, function () {
            this.text(path);
        });

        this.xml("args", {"SOAP-ENC:arrayType": "xsd:string[" + args.length + "]", "xsi:type": "SOAP-ENC:Array"}, function () {
            for (var i = 0; i < args.length; i++) {
                this.xml("item", {}, function () { this.text(args[i]); });
            }
        });
    });

    $.soap({
        method: "call",
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON();
            deferred.resolve(json.Body);
        },
        error: function (response) {
            var json = response.toJSON();
            deferred.reject(json);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.categoryAssignedProducts = function (categoryId) {};
MagentoSoapClient.prototype.productInfo = function (productIds) {};

// Checkout methods
MagentoSoapClient.prototype.cartCreate = function () {};
MagentoSoapClient.prototype.cartInfo = function (cartId) {};

MagentoSoapClient.prototype.cartCustomerSet = function (cartId, customer) {};
MagentoSoapClient.prototype.cartCustomerAddresses = function (cartId, addresses) {};

MagentoSoapClient.prototype.cartProductAdd = function (cartId, products) {};

MagentoSoapClient.prototype.cartShippingList = function (cartId) {};
MagentoSoapClient.prototype.cartShippingMethod = function (cartId, method) {};

MagentoSoapClient.prototype.cartPaymentList = function (cartId) {};
MagentoSoapClient.prototype.cartPaymentMethod = function (cartId, method) {};

MagentoSoapClient.prototype.cartOrder = function (cartId) {};

// Helper methods
MagentoSoapClient.prototype._serialize = function (doc) {
    return new XMLSerializer().serializeToString(doc);
};
