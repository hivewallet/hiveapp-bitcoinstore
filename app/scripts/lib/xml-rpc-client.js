// TODO:
// - make it async
// - handle error responses

var XMLRPCClient = function (url) {
    this.url = url;
    this.sessionId = null;
};

XMLRPCClient.prototype.login = function (user, password) {
    var req = new XmlRpcRequest(this.url, "login"),
        res;

    req.addParam(user);
    req.addParam(this.escape(password));
    res = req.send();

    this.sessionId = res.parseXML().toString();
    return this.sessionId;
};

XMLRPCClient.prototype.call = function (method) {
    var req = new XmlRpcRequest(this.url, "call"),
        params = Array.prototype.slice.call(arguments, 1),
        res;

    req.addParam(this.sessionId);
    req.addParam(method);
    params.forEach(function (param) {
        req.addParam(param);
    });
    res = req.send();

    return res.parseXML();
};

XMLRPCClient.prototype.escape = function (string) {
    var tag = document.createElement('pre'),
        text = document.createTextNode(string);

    tag.appendChild(text);
    return tag.innerHTML;
};
