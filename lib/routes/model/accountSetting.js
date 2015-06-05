
module.exports = function(app){
    
        var route = require('./_gen/accountSetting.gen')(app);

	route.auth_update = [
		app.njax.email.routes.populateAccountFromHash(),
		function(req, res, next){

			if(req.user && (req.accountSetting && (req.accountSetting.owner && req.accountSetting.owner.equals(req.user._id)) || (req.is_admin))){
				return  next();//We have a legit users
			}

			return next(new Error(403));//We do not have a legit user

		}
	];
	route.auth_create  = [
		app.njax.email.routes.populateAccountFromHash(),
		function(req, res, next){
			//ENtities that have not been created do not have an owner to manage
			if(!req.user){
				return next(new Error(403));//res.redirect('/');
			}
			return next();

		}
	]



    /**
     * Custom Code Goes here
     */
    route.init();

}