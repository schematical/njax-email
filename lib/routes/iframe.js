
module.exports = function(app){
	app.get('/iframes/account_settings', [
		app.njax.email.accountSettingsMiddleware(),
		function(req, res, next){
			res.render('iframes/account_settings');
		}
	]);
}