// Fake Hive API.
// You don't need this library in production Hive app.

'use strict';

var bitcoin = bitcoin || {
    getClientInfo: function (callback) {
        var info = {
            firstname: 'Homer',
            lastname:  'Simpson',
            email:     'homer@fake.com',
            address:   'poqjer23rfc234laq',
            street:    'next to Flanders',
            zipcode:   '12233',
            city:      'Springfield',
            country:   'USA'
        };

        return callback(info);
    }
};
