
module.exports = function(app){
	app.njax.email._settings = {};
	app.njax.email.createSetting = function(namespace, config){
		config.namespace = namespace;
		app.njax.email._settings[namespace] = config;
	}
	/**
	 * This determines if a user should get an email
	 */
	app.njax.email.canSendToUser = function(account, event, data, _cb){
		//Determine which type of email it is
		//var allowEmail = true;
		var accountSetting = null;
		async.eachSeries(
		    Object.keys(app.njax.email._settings),
		    function(key, cb){
				var setting = app.njax.email._settings[key];

				//Check the filter
				if(_.isString(setting.filter)){
					//Regex it
					if(!(setting.filter == event || new RegExp(setting.filter).test(event))){
						return cb();
					}
					//Yes there is a setting for it
					return app.njax.email.loadAccountSetting(account, setting.namespace,function(err, _accountSetting){
						if(err) return cb(err);
						if(accountSetting && accountSetting.type =='block'){
							return _cb(null,false);
						}
						return cb();
					});
				}else if(_.isFunction(setting.filter)){
					return setting.filter(event, data, function(err, matches_namespace){
						if(err) return cb(err);
						if(!matches_namespace){
							return cb();//Go for it
						}
						return app.njax.email.loadAccountSetting(account, setting.namespace,function(err, accountSetting){
							if(err) return cb(err);

							if(accountSetting && accountSetting.type =='block'){
								return _cb(null,false);
							}
							return cb();
						});

					})
				}else{
					return _cb(new Error("Invalid filter. Needs to be string/regex or function"));
				}

		    },
		    function(errs){

				return _cb(null, true);//If it gets this far you can send it to the user
		    }
		);


	}


	app.njax.email.loadAccountSetting = function(account, namespace, callback){
		return app.model.AccountSetting.findOne({ owner: account._id, setting_namespace:namespace }).exec(function(err, accountSetting){
			if(err) return callback(err);
			return callback(null, accountSetting);
		});
	}




	app.njax.email.accountSettingsMiddleware = function(){
		return function(req, res, next){
			if(!req.user){
				return next(new Error(403));
			}
			res.bootstrap('email_setting_catigories', app.locals.email_setting_catigories);

			return app.model.AccountSetting.find({ owner: req.user._id }).exec(function(err, accountSettings){
				if(err) return next(err);
				res.bootstrap('account_settings', accountSettings);
				return next();
			});
		}
	}
}