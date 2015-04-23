'use strict';

/* Directives */


angular.module('njax.email.directives', [])
	.directive('emailSettings', [ '$timeout', 'NJaxBootstrap', 'AccountSettingService', function($timeout, NJaxBootstrap, AccountSettingService) {
	return {
		replace:true,
		scope:{
			'emailSettingCatigories':'@emailSettingCatigories',
			'account_settings':'@accountSettings'
		},
		templateUrl: NJaxBootstrap.www_url + '/templates/directives/emailSettings.html',
		link:function(scope, element, attrs) {
			//blah
			if(!scope.emailSettingCatigories){
				scope.emailSettingCatigories = NJaxBootstrap.email_setting_catigories;
			}
			if(!scope.emailSettingCatigories){
				throw new Error("No emailSettingCatigories. Please bootstrap them in");
			}
			if(!scope.account_settings){
				scope.account_settings = NJaxBootstrap.account_settings;
			}
			if(!scope.account_settings){
				throw new Error("No account_settings. Please bootstrap them in");
			}

			for(var ii in scope.emailSettingCatigories){
				for(var i in scope.account_settings){
					if(scope.account_settings[i].setting_namespace == scope.emailSettingCatigories[ii].namespace){
						scope.emailSettingCatigories[ii].account_setting = scope.account_settings[i];
					}
				}
				if(!scope.emailSettingCatigories[ii].account_setting){
					scope.emailSettingCatigories[ii].account_setting = {
						setting_namespace: scope.emailSettingCatigories[ii].namespace,
						type:'allow',
						owner:NJaxBootstrap.user._id
					}
				}
				scope.emailSettingCatigories[ii].account_setting = new AccountSettingService(scope.emailSettingCatigories[ii].account_setting);
			}
			scope.saveAccountSetting = function(account_setting){
				account_setting._changed = true;
				account_setting.$save(function(){
					account_setting._changed = false;
					account_setting._saved = true;
					$timeout(function(){
						account_setting._saved = false;
					}, 2000)
				})
			}
			/*scope.saveEmailSettings = function(){

			}*/
		}

	};
}])