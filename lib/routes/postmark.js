var async = require('async');
var _ = require('underscore');
module.exports = function(app){
	if(!app.njax.config.send_from_domain){
		throw new Error("Need a 'sent from domain'. Please add it to the config");
	}
	app.njax.email._postmarkInboundCallbacks = {};
	app.all('/postmark', [
		function(req, res, next){
			var email_data = req.body;
			if(req.query.fake) {
				email_data = {
					FromName: 'Postmarkapp Support',
					From: 'support@postmarkapp.com',
					FromFull: {
						Email: 'support@postmarkapp.com',
						Name: 'Postmarkapp Support',
						MailboxHash: ''
					},
					To: '"Firstname Lastname" <mailbox+SampleHash@inbound.postmarkapp.com>',
					ToFull: [{
						Email: 'projects.blah@schematcial.com',
						Name: 'Firstname Lastname',
						MailboxHash: 'SampleHash'
					}],
					Cc: '"First Cc" <firstcc@postmarkapp.com>, secondCc@postmarkapp.com',
					CcFull: [{
						Email: 'firstcc@postmarkapp.com',
						Name: 'First Cc',
						MailboxHash: ''
					},
						{Email: 'secondCc@postmarkapp.com', Name: '', MailboxHash: ''}],
					Bcc: '"First Bcc" <firstbcc@postmarkapp.com>, secondbcc@postmarkapp.com',
					BccFull: [{
						Email: 'firstbcc@postmarkapp.com',
						Name: 'First Bcc',
						MailboxHash: ''
					},
						{Email: 'secondbcc@postmarkapp.com', Name: '', MailboxHash: ''}],
					OriginalRecipient: 'mailbox+SampleHash@inbound.postmarkapp.com',
					Subject: 'Test subject',
					MessageID: '73e6d360-66eb-11e1-8e72-a8904824019b',
					ReplyTo: 'replyto@postmarkapp.com',
					MailboxHash: 'SampleHash',
					Date: 'Mon, 6 Apr 2015 14:57:14 -0400',
					TextBody: 'This is a test text body.',
					HtmlBody: '&lt;html&gt;&lt;body&gt;&lt;p&gt;This is a test html body.&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;',
					StrippedTextReply: 'This is the reply text',
					Tag: 'TestTag',
					Headers: [{Name: 'X-Header-Test', Value: ''}],
					Attachments: [{
						Name: 'test.txt',
						Content: 'VGhpcyBpcyBhdHRhY2htZW50IGNvbnRlbnRzLCBiYXNlLTY0IGVuY29kZWQu',
						ContentType: 'text/plain',
						ContentLength: 45
					}]
				};

			}

			return app.njax.email.triggerPostmarkInbound(email_data, next);
		},
		function(req, res, next){
		    return res.send("DOnski!");
		}
	])
	/**
	 * Parses an inbound address
	 */
	app.njax.email.registerPostmarkInboundAddressParser = function(fun){
		app.njax.email._PostmarkInboundAddressParser = fun;
	}
	/**
	 * Creates an outbound address
	 */
	app.njax.email.registerPostmarkInboundAddressCreator = function(fun){
		app.njax.email._PostmarkInboundAddressCreator = fun;
	}
	app.njax.email.registerPostmarkInbound = function(route, callback){
		app.njax.email._postmarkInboundCallbacks[route] = callback;
	}
	app.njax.email.triggerPostmarkInbound = function(email_data, onComplete){
		var toAddresses = email_data.ToFull.concat(email_data.CcFull).concat(email_data.BccFull);
		var _postmarkInboundCallbacks = [];
		return async.eachSeries(
			toAddresses,
			function(_toFull, cb){


				return app.njax.email._PostmarkInboundAddressParser(_toFull.Email, email_data, function(err, email_funs){
					if(err) console.error(err);
					if(email_funs){
						_postmarkInboundCallbacks = _postmarkInboundCallbacks.concat(email_funs);
					}
					return cb();
				});

			},
			function(errs){
				return async.eachSeries(
					_postmarkInboundCallbacks,
					function(event_fun, cb){
						if(!_.isFunction(event_fun)){
							console.error('Unexpected data type:', event_fun);
							return cb();
						}
						return event_fun(email_data, cb);
					},
					function(errs){
						return onComplete();
					}
				)
			}
		)


	}
	/**
	 * This sets the inbound address parser that determines what an address should do
	 */
	app.njax.email.registerPostmarkInboundAddressParser(function(_toFull, email_data, onComplete){
		var split = _toFull.length - (app.njax.config.send_from_domain.length + 1);
		var domain = _toFull.substr(split);
		var callbacks = [];
		if(domain != '@' + app.njax.config.send_from_domain){
			return onComplete(null, callbacks);

		}
		var first_part = _toFull.substr(0,split);

		for(var i in app.njax.email._postmarkInboundCallbacks){

			if(i == first_part || new RegExp(i).test(first_part)){
				callbacks.push(function(email_data, next){
					app.njax.email._postmarkInboundCallbacks[i](_toFull, email_data, next)
				});
			}
		}
		return onComplete(null, callbacks);
	})
	/*app.njax.email.registerPostmarkInbound(
		'100opp.opportunity.contact',
		{
			subject:function(event, data){
				return data.contact_user.name + ' has sent you a message about ' + data.opportunity.name;
			},
			html_template:path.join(app.njax.config.tpl_dir, '100opp', 'opportunity', 'contact.hjs')
		}
	);*/
}


