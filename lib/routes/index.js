
module.exports = function(app){
	app.get('/unsubscribe', [
		function(req, res, next) {
			// TODO: encrypt query string
			if(req.query.namespace){
				app.sdk.Account.findOne({ namespace: req.query.namespace }, function(err, account){
					if(err) return next(err);
					res.bootstrap('user', account);
					next();
				});
			}
			else{
				return next();
			}
		},
		app.njax.email.accountSettingsMiddleware(),
		function(req, res, next){
			res.render('unsubscribe');
		}
	])
 	require('./postmark')(app);
	require('./iframe')(app);
	require('./model')(app);
}