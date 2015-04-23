
module.exports = function(app){
    
        var route = require('./_gen/account_setting.gen')(app);
    

    /**
     * Custom Code Goes here
     */
    route.init();

}