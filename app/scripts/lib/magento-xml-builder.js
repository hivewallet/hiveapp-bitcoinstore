var magentoXmlBuilder = {
    build: function (sessionId, method, args) {
        var xmlDoc;
        args = args || [];
        xmlDoc = xml("ns1:call", {}, function () {
            this.xml("sessionId", {}, function () {
                this.text(sessionId);
            });
            this.xml("resourcePath", {}, function () {
                this.text(method);
            });

            this.xml("args", {"SOAP-ENC:arrayType": "xsd:string[" + args.length + "]", "xsi:type": "SOAP-ENC:Array"}, function () {
                for (var i = 0; i < args.length; i++) {
                    this.xml("item", magentoXmlBuilder.getType(args[i]), function() {
                        this.text(magentoXmlBuilder.getContent(args[i]));
                    });
                }
            });
        });
        return new XMLSerializer().serializeToString(xmlDoc);
    },

    getType: function (item) {
        return item === null ? {"xsi:nil": "true"} : {};
    },

    getContent: function (item) {
        return item === null ? "" : item;
    },
}
