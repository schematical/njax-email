
module.exports = function(options){
    var njax_app = require('njax-app');
    njax_app(options);
    njax_app.prototype.registerEmail = function(event, partial){
        njax_app.callback.listen(event, function(event, data){
            //Render this partial

            //Email it to the relivant people -> There should be one user in this right now


        });
    }



    return njax_app;
}