var account_settingServices = angular.module('njax-email.account_setting.service', ['ngResource']);
account_settingServices.factory(
    'AccountSettingService',
    [
        '$resource',
        'NJaxBootstrap',
        function($resource, NJaxBootstrap){
            return $resource(NJaxBootstrap.api_url + '/account_settings/:account_setting_id',
            	{
            		'account_setting_id':'@_id'
            	},
            	{
					query: {
						method:'GET',
						params:{

						},
						isArray:true
					}
            	}
            );
        }
    ]
);

