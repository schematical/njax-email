var async = require('async');
var _ = require('underscore');
var Hogan = require('hogan.js');
var fs = require('fs');
var path = require('path');


module.exports = function(options){
    var njax_app = require('njax-app');
    var defaults = {
        app_dir:path.join(__dirname, '..', '..')
    }

    options = _.extend(defaults, options);
    var app = njax_app(options);

    app.njax.email = {};

    var postmark = require("postmark")(app.njax.config.postmark.api_key);

	njax_app._sendEmail = function (options, next) {

		// options should have properties:

		// From (optional)
		// To
		// Subject
		// HtmlBody
		// TextBody
		options.From = options.From || app.njax.config.postmark.from_address;

		// allow fire and forget
		next = next || function () {};
		
        postmark.send(
            options,
            function(err, success) {
                if(err) {
                    console.error("Unable to send via postmark: " + err.message);
                    return;
                }
                console.info("Sent to postmark for delivery");
                return next();
            }
        );
	};

    njax_app._registerEmail = function(event, options){

        var defaults = {
            fromAddress:app.njax.email.fromAddress,
            toAddress:false,
            subject:'I need a subject',
            html_template:null,
            text_template:null,
            body:null
        }
        options = _.extend(defaults, options);
        if(defaults.html_template){
            if(!fs.existsSync(defaults.html_template)){
                throw new Error("Missing Email '" + defaults.html_template + "'");
            }
            var html_template = Hogan.compile(fs.readFileSync(defaults.html_template).toString());
        }else{
            var html_template = {
                render:function(data){
                    return options.body
                }
            }
        }

        if(defaults.text_template){
            if(!fs.existsSync(defaults.text_template)){
                throw new Error("Missing Email '" + defaults.text_template + "'");
            }
            var text_template = Hogan.compile(fs.readFileSync(defaults.text_template).toString());
        }else{
            var text_template = {
                render:function(data){
                    return options.body
                }
            }
        }

        app.njax.callbacks.listen(event, function(event, data, next){
            if(!data){
                data = {};
            }

            //Render this partial
            if(html_template){
                var html_body = html_template.render(data);
            }
            if(text_template){
                var text_body = text_template.render(data);
            }
            var toAddress = _.isFunction(options.toAddress) ? options.toAddress(event, data) : ((data._account && data._account.email) || (data._email));
            if(!toAddress){
                //TODO: Fix this or you will get millions of emails
                toAddress = 'mlea@schematical.com';
            }
            //Email it to the relivant people -> There should be one user in this right now

            var email_data = {
                "From": _.isFunction(options.fromAddress) ? options.fromAddress(event, data) : options.fromAddress,
                "To": toAddress,
                "Subject": _.isFunction(options.subject) ? options.subject(event, data) : options.subject,
                "HtmlBody":html_body,
                "TextBody":text_body
            };
            /*console.log("Sending Postmark Data:", email_data);*/
			njax_app._sendEmail(email_data, next);
        });
    }


    app.njax.email.fromAddress = function(event, data){
        return app.njax.config.postmark.from_address;
    }

    app.njax.email.registerEmail = _.bind(njax_app._registerEmail, app);
    app.njax.email.sendEmail = _.bind(njax_app._sendEmail, app); 
    return app;
}
