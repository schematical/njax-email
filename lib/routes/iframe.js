
module.exports = function(app){
	app.all('/iframes/account_settings', [
		app.njax.email.accountSettingsMiddleware(),
		function(req, res, next){
			res.render('iframes/account_settings');
		}
	]);
}