// TODO:
// - handle SOAP errors in success callbacks and call deferred.reject
// - figure out storeId and websiteId for test server

'use strict';

var MagentoSoapClient = function (url) {
    this.url = url;
    this.sessionId = null;
    this.storeId = '1';
    this.websiteId = '1';

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
        method: 'ns1:login',
        params: {
            username: username,
            apiKey: apiKey
        },
        success: function (response) {
            var json = response.toJSON(),
                sessionId;

            self._handleResponse(json, deferred, function () {
                sessionId = json.Body.loginResponse.loginReturn.toString();
                self.sessionId = sessionId;
                deferred.resolve(sessionId);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });
    return deferred.promise();
};

// Catalog methods
MagentoSoapClient.prototype.categoryLevel = function (categoryId) {
    var self = this,
        sessionId = this.sessionId,
        path = 'category.level',
        args = [this.storeId, this.websiteId, categoryId],
        deferred = $.Deferred(),
        body;

    body = xml('ns1:call', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('resourcePath', {}, function () { this.text(path); });
        this.xml('args', self._xmlStringArrayType(args.length), function () {
            for (var i = 0; i < args.length; i++) {
                this.xml('item', {}, function () { this.text(args[i]); });
            }
        });
    });

    $.soap({
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON(),
                items;

            self._handleResponse(json, deferred, function () {
                items = self._arrayWrap(json.Body.callResponse.callReturn.item);
                deferred.resolve(items);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.categoryAssignedProducts = function (categoryId) {
    var self = this,
        sessionId = this.sessionId,
        path = 'category.assignedProducts',
        deferred = $.Deferred();

    $.soap({
        method: 'ns1:call',
        params: {
            sessionId: sessionId,
            resourcePath: path,
            args: categoryId
        },
        success: function (response) {
            var json = response.toJSON(),
                items;

            self._handleResponse(json, deferred, function () {
                items = self._arrayWrap(json.Body.callResponse.callReturn.item);
                deferred.resolve(items);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.productInfo = function (productIds) {
    var self = this,
        sessionId = this.sessionId,
        path = 'product.info',
        deferred = $.Deferred(),
        body;

    body = xml('ns1:multiCall', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('calls', self._xmlUrFixedArrayType(productIds.length), function () {
            for (var i = 0; i < productIds.length; i++) {
                this.xml('item', self._xmlStringArrayType(2), function () {
                    var id = productIds[i];
                    this.xml('item', self._xmlStringType(), function () { this.text(path); });
                    this.xml('item', self._xmlStringType(), function () { this.text(id); });
                });
            }
        });
        this.xml('options', self._xmlNilType());
    });

    $.soap({
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON(),
                items;

            self._handleResponse(json, deferred, function () {
                items = self._arrayWrap(json.Body.multiCallResponse.multiCallReturn.item);
                deferred.resolve(items);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.productMediaList = function (productIds) {
    var self = this,
        sessionId = this.sessionId,
        path = 'product_media.list',
        deferred = $.Deferred(),
        body;

    body = xml('ns1:multiCall', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('calls', self._xmlUrFixedArrayType(productIds.length), function () {
            for (var i = 0; i < productIds.length; i++) {
                this.xml('item', self._xmlStringArrayType(2), function () {
                    var id = productIds[i];
                    this.xml('item', self._xmlStringType(), function () { this.text(path); });
                    this.xml('item', self._xmlIntType(), function () { this.text(id); });
                });
            }
        });
    });

    $.soap({
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON(),
                items;

            self._handleResponse(json, deferred, function () {
                items = self._arrayWrap(json.Body.multiCallResponse.multiCallReturn.item);
                deferred.resolve(items);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.productStockList = function (productIds) {
    var self = this,
        sessionId = this.sessionId,
        path = 'product_stock.list',
        deferred = $.Deferred(),
        body;

    body = xml('ns1:call', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('resourcePath', {}, function () { this.text(path); });
        this.xml('args', self._xmlArrayType(1), function () {
            this.xml('item', self._xmlStringArrayType(productIds.length), function () {
                for (var i = 0; i < productIds.length; i++) {
                    this.xml('item', self._xmlStringType, function () { this.text(productIds[i]); });
                }
            });
        });
    });

    $.soap({
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON(),
                items;

            self._handleResponse(json, deferred, function () {
                items = self._arrayWrap(json.Body.callResponse.callReturn.item);
                deferred.resolve(items);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

// Checkout methods
MagentoSoapClient.prototype.cartCreate = function () {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart.create',
        deferred = $.Deferred();

    $.soap({
        method: 'ns1:call',
        params: {
            sessionId: sessionId,
            resourcePath: path,
            args: this.storeId
        },
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = json.Body.callResponse.callReturn.toString();
                deferred.resolve(result);
            });

        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.cartInfo = function (cartId) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart.info',
        deferred = $.Deferred();

    $.soap({
        method: 'ns1:call',
        params: {
            sessionId: sessionId,
            resourcePath: path,
            args: cartId
        },
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = json.Body.callResponse.callReturn;
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.cartCustomerSet = function (cartId, customer) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart_customer.set',
        deferred = $.Deferred(),
        body;

    body = xml('ns1:call', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('resourcePath', {}, function () { this.text(path); });
        this.xml('args', self._xmlUrArrayType(2), function () {
            this.xml('item', self._xmlIntType(), function () { this.text(cartId); });
            this.xml('item', self._xmlMapType(), function () {
                Object.keys(customer).forEach(function (key) {
                    var value = customer[key];
                    this.xml('item', {}, function () {
                        this.xml('key', self._xmlStringType(), function () {
                            this.text(key);
                        });
                        this.xml('value', self._xmlStringType(), function () {
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
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = json.Body.callResponse.callReturn.item;
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.cartCustomerAddresses = function (cartId, addresses) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart_customer.addresses',
        deferred = $.Deferred(),
        body;

    body = xml('ns1:call', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('resourcePath', {}, function () { this.text(path); });
        this.xml('args', self._xmlUrArrayType(2), function () {
            this.xml('item', self._xmlIntType(), function () { this.text(cartId); });
            this.xml('item', self._xmlMapArrayType(addresses.length), function () {
                addresses.forEach(function (address) {
                    this.xml('item', self._xmlMapType(), function () {
                        Object.keys(address).forEach(function (key) {
                            var value = address[key];

                            this.xml('item', {}, function () {
                                this.xml('key', self._xmlStringType(), function () {
                                    this.text(key);
                                });
                                this.xml('value', self._xmlStringType(), function () {
                                    this.text(value);
                                });
                            });
                        }, this);
                    });
                }, this);
            });
        });
    });

    $.soap({
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = json.Body.callResponse.callReturn.item;
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

// products: [{id: '2', qty: 1}]
MagentoSoapClient.prototype.cartProductAdd = function (cartId, products) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart_product.add',
        deferred = $.Deferred(),
        body;

    body = xml('ns1:call', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('resourcePath', {}, function () { this.text(path); });
        this.xml('args', self._xmlUrArrayType(2), function () {
            this.xml('item', self._xmlIntType(), function () { this.text(cartId); });
            this.xml('item', self._xmlMapArrayType(products.length), function () {
                products.forEach(function (product) {
                    this.xml('item', self._xmlMapType(), function () {
                        this.xml('item', {}, function () {
                            this.xml('key', self._xmlStringType(), function () {
                                this.text('product_id');
                            });
                            this.xml('value', self._xmlStringType(), function () {
                                this.text(product.id);
                            });
                        });
                        this.xml('item', {}, function () {
                            this.xml('key', self._xmlStringType(), function () {
                                this.text('qty');
                            });
                            this.xml('value', self._xmlIntType(), function () {
                                this.text(product.qty);
                            });
                        });
                    });
                }, this);
            });
        });
    });

    $.soap({
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = json.Body.callResponse.callReturn.item;
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.cartShippingList = function (cartId) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart_shipping.list',
        deferred = $.Deferred();

    $.soap({
        method: 'ns1:call',
        params: {
            sessionId: sessionId,
            resourcePath: path,
            args: cartId
        },
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = self._arrayWrap(json.Body.callResponse.callReturn.item);
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.cartShippingMethod = function (cartId, method) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart_shipping.method',
        deferred = $.Deferred(),
        body;

    body = xml('ns1:call', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('resourcePath', {}, function () { this.text(path); });
        this.xml('args', self._xmlUrArrayType(2), function () {
            this.xml('item', self._xmlIntType(), function () { this.text(cartId); });
            this.xml('item', self._xmlStringType(), function () { this.text(method); });
        });
    });

    $.soap({
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = json.Body.callResponse.callReturn.item;
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.cartPaymentList = function (cartId) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart_payment.list',
        deferred = $.Deferred();

    $.soap({
        method: 'ns1:call',
        params: {
            sessionId: sessionId,
            resourcePath: path,
            args: cartId
        },
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = self._arrayWrap(json.Body.callResponse.callReturn.item);
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};
MagentoSoapClient.prototype.cartPaymentMethod = function (cartId, method) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart_payment.method',
        deferred = $.Deferred(),
        body;

    body = xml('ns1:call', {}, function () {
        this.xml('sessionId', {}, function () { this.text(sessionId); });
        this.xml('resourcePath', {}, function () { this.text(path); });
        this.xml('args', self._xmlUrArrayType(2), function () {
            this.xml('item', self._xmlIntType(), function () { this.text(cartId); });
            this.xml('item', self._xmlMapType(), function () {
                this.xml('item', {}, function () {
                    this.xml('key', self._xmlStringType(), function () {
                        this.text('method');
                    });
                    this.xml('value', self._xmlStringType(), function () {
                        this.text(method);
                    });
                });
            });

        });
    });

    $.soap({
        params: this._serialize(body),
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = json.Body.callResponse.callReturn.item;
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

// It's not really a SOAP call. It fetches HTML page with invoice from BitPay
MagentoSoapClient.prototype.paymentInfo = function (cartInfo) {
    var self = this,
        url = cartInfo.bitpay_invoice_url + "&view=iframe",
        deferred = $.Deferred(),
        xhr = $.get(url);

    xhr.done(function (response) {
        var html = $("<div>").html(response),
            amount = html.find("#amountSpan").text(),
            address = html.find("#addressCode").text();

        deferred.resolve({
            amount: amount,
            address: address
        });
    });

    xhr.fail(function (response) {
        deferred.reject(response, response.httpCode, response.httpText);
    });

    return deferred.promise();
};

MagentoSoapClient.prototype.cartOrder = function (cartId) {
    var self = this,
        sessionId = this.sessionId,
        path = 'cart.order',
        deferred = $.Deferred();

    $.soap({
        method: 'ns1:call',
        params: {
            sessionId: sessionId,
            resourcePath: path,
            args: cartId
        },
        success: function (response) {
            var json = response.toJSON(),
                result;

            self._handleResponse(json, deferred, function () {
                result = json.Body.callResponse.callReturn.toString();
                deferred.resolve(result);
            });
        },
        error: function (response) {
            deferred.reject(response, response.httpCode, response.httpText);
        }
    });

    return deferred.promise();
};

// Helper methods
MagentoSoapClient.prototype._handleResponse = function (json, deferred, callback) {
    if (json.Body.Fault) {
        // To be compatible with error handler for jQuery, we're faking first argument
        deferred.reject({}, json.Body.Fault.faultcode, json.Body.Fault.faultstring);
    } else {
        callback();
    }
};

MagentoSoapClient.prototype._arrayWrap = function (object) {
    object = object || [];
    return _.isArray(object) ? object : [{item: object.item}];
};

MagentoSoapClient.prototype._serialize = function (doc) {
    return new XMLSerializer().serializeToString(doc);
};

MagentoSoapClient.prototype._xmlNilType = function () {
    return {'xsi:nil': 'true'};
};

MagentoSoapClient.prototype._xmlIntType = function () {
    return {'xsi:type': 'xsd:int'};
};

MagentoSoapClient.prototype._xmlStringType = function () {
    return {'xsi:type': 'xsd:string'};
};

MagentoSoapClient.prototype._xmlMapType = function () {
    return {'xsi:type': 'ns2:Map'};
};

MagentoSoapClient.prototype._xmlArrayType = function (length) {
    return {'SOAP-ENC:arrayType': 'SOAP-ENC:Array[' + length + ']', 'xsi:type': 'SOAP-ENC:Array'};
};

MagentoSoapClient.prototype._xmlStringArrayType = function (length) {
    return {'SOAP-ENC:arrayType': 'xsd:string[' + length + ']', 'xsi:type': 'SOAP-ENC:Array'};
};

MagentoSoapClient.prototype._xmlUrArrayType = function (length) {
    return {'SOAP-ENC:arrayType': 'xsd:ur-type[' + length + ']', 'xsi:type': 'SOAP-ENC:Array'};
};

MagentoSoapClient.prototype._xmlUrFixedArrayType = function (length) {
    return {'SOAP-ENC:arrayType': 'xsd:ur-type[' + length + ']', 'xsi:type': 'ns1:FixedArray'};
};

MagentoSoapClient.prototype._xmlMapArrayType = function (length) {
    return {'SOAP-ENC:arrayType': 'ns2:Map[' + length + ']', 'xsi:type': 'SOAP-ENC:Array'};
};
