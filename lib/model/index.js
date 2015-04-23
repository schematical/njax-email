'use strict';
module.exports = function(app){
    
        app.model.AccountSetting =  require('./accountSetting')(app);
    
}