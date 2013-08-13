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
    var self = this,
        sessionId = this.sessionId,
        path = "category.level",
        args = [this.storeId, this.websiteId, categoryId],
        deferred = $.Deferred(),
        body;

    body = xml("ns1:call", {}, function () {
        this.xml("sessionId", {}, function () { this.text(sessionId); });
        this.xml("resourcePath", {}, function () { this.text(path); });
        this.xml("args", self._xmlStringArrayType(args.length), function () {
            for (var i = 0; i < args.length; i++) {
                this.xml("item", {}, function () { this.text(args[i]); });
            }
        });
    });

    $.soap({
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

MagentoSoapClient.prototype.categoryAssignedProducts = function (categoryId) {
    var sessionId = this.sessionId,
        path = "category.assignedProducts",
        deferred = $.Deferred();

    $.soap({
        method: "ns1:call",
        params: {
            sessionId: sessionId,
            resourcePath: path,
            args: categoryId
        },
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

MagentoSoapClient.prototype.productInfo = function (productIds) {
    var self = this,
        sessionId = this.sessionId,
        path = "product.info",
        deferred = $.Deferred(),
        body;

    body = xml("ns1:multiCall", {}, function () {
        this.xml("sessionId", {}, function () { this.text(sessionId); });
        this.xml("calls", self._xmlUrFixedArrayType(productIds.length), function () {
            for (var i = 0; i < productIds.length; i++) {
                this.xml("item", self._xmlStringArrayType(2), function () {
                    var id = productIds[i];
                    this.xml("item", self._xmlStringType(), function () { this.text(path); });
                    this.xml("item", self._xmlStringType(), function () { this.text(id); });
                });
            }
        });
        this.xml("options", self._xmlNilType());
    });

    $.soap({
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

// Checkout methods
MagentoSoapClient.prototype.cartCreate = function () {
    var sessionId = this.sessionId,
        path = "cart.create",
        deferred = $.Deferred();

    $.soap({
        method: "ns1:call",
        params: {
            sessionId: sessionId,
            resourcePath: path
        },
        success: function (response) {
            var json = response.toJSON(),
                cartId = json.Body.callResponse.callReturn.toString();
            deferred.resolve(cartId);
        },
        error: function (response) {
            var json = response.toJSON();
            deferred.reject(json);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.cartInfo = function (cartId) {
    var sessionId = this.sessionId,
        path = "cart.info",
        deferred = $.Deferred();

    $.soap({
        method: "ns1:call",
        params: {
            sessionId: sessionId,
            resourcePath: path,
            args: cartId
        },
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

MagentoSoapClient.prototype.cartCustomerSet = function (cartId, customer) {
    var self = this,
        sessionId = this.sessionId,
        path = "cart_customer.set",
        deferred = $.Deferred(),
        body;

    body = xml("ns1:call", {}, function () {
        this.xml("sessionId", {}, function () { this.text(sessionId); });
        this.xml("resourcePath", {}, function () { this.text(path); });
        this.xml("args", self._xmlUrArrayType(2), function () {
            this.xml("item", self._xmlIntType(), function () { this.text(cartId); });
            this.xml("item", self._xmlMapType(), function () {
                Object.keys(customer).forEach(function (key) {
                    var value = customer[key];
                    this.xml("item", {}, function () {
                        this.xml("key", self._xmlStringType(), function () {
                            this.text(key);
                        });
                        this.xml("value", self._xmlStringType(), function () {
                            this.text(value);
                        });
                    });
                }, this);
            });
        });
    });

    $.soap({
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

MagentoSoapClient.prototype._xmlNilType = function () {
    return {"xsi:nil": "true"};
};

MagentoSoapClient.prototype._xmlIntType = function () {
    return {"xsi:type": "xsd:int"};
};

MagentoSoapClient.prototype._xmlStringType = function () {
    return {"xsi:type": "xsd:string"};
};

MagentoSoapClient.prototype._xmlMapType = function () {
    return {"xsi:type": "ns2:Map"};
};

MagentoSoapClient.prototype._xmlStringArrayType = function (length) {
    return {"SOAP-ENC:arrayType": "xsd:string[" + length + "]", "xsi:type": "SOAP-ENC:Array"};
};

MagentoSoapClient.prototype._xmlUrArrayType = function (length) {
    return {"SOAP-ENC:arrayType": "xsd:ur-type[" + length + "]", "xsi:type": "SOAP-ENC:Array"};
};

MagentoSoapClient.prototype._xmlUrFixedArrayType = function (length) {
    return {"SOAP-ENC:arrayType": "xsd:ur-type[" + length + "]", "xsi:type": "ns1:FixedArray"};
};
