
module.exports = function(app){
	app.njax.email.routes = {
		init:function(){
			app.get('/unsubscribe', app.njax.email.routes.route_unsubscribe());
		},
		route_unsubscribe:function() {
			return [
				app.njax.email.routes.populateAccountFromHash(),
				app.njax.email.accountSettingsMiddleware(),
				function (req, res, next) {

					return res.render('unsubscribe');
				}
			]
		},
		populateAccountFromHash:function(){
			return function(req, res, next) {
				// TODO: encrypt query string
				var hash = req.body.hash || req.query.hash || null;
				if(!hash) {
					return next();
				}
				res.bootstrap('_hash', hash);
				var account_id =  app.njax.crypto.decrypt(hash, app.njax.config.client_secret);
				//console.log(account_id, req.query.hash, app.njax.config.client_secret);
				return app.sdk.Account.findOne({ uri: '/accounts/' + account_id }, function(err, account){
					if(err) return next(err);
					//console.log(account);
					res.bootstrap('user', account);
					return next();
				});

			}
		}
	}

 	require('./postmark')(app);
	require('./iframe')(app);
	require('./model')(app);
}