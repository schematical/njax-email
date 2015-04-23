'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){
    
        var accountsettingSchema = require('./_gen/accountSetting_gen')(app);
    
    /*
    Custom Code goes here
    */

    return app.mongoose.model('AccountSetting', accountsettingSchema);
}