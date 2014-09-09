var async = require('async');
var _ = require('underscore');
module.exports = function(options){
    var njax_app = require('njax-app');

    njax_app._registerEmail = function(event, partial){
        njax_app.callbacks.listen(event, function(event, data){
            //Render this partial

            //Email it to the relivant people -> There should be one user in this right now

            console.log("SENDING PARTIAL: " + partial);
        });
    }



    var app = njax_app(options);
    app.njax.email = {};
    app.njax.email.registerEmail = _.bind(njax_app._registerEmail, app);
    return app;
}