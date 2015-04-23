'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){
    
        var account_settingSchema = require('./_gen/account_setting_gen')(app);
    
    /*
    Custom Code goes here
    */

    return app.mongoose.model('AccountSetting', account_settingSchema);
}