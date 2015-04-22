
module.exports = function(app){
	app.get('/unsubscribe', [
		//app.njax.email.accountSettingsMiddleware(),
		function(req, res, next){
			res.render('unsubscribe');
		}
	])
 	require('./postmark')(app);
	require('./iframe')(app);
}