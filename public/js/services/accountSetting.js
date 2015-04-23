var accountSettingServices = angular.module('njax-email.accountSetting.service', ['ngResource']);
accountSettingServices.factory(
    'AccountSettingService',
    [
        '$resource',
        'NJaxBootstrap',
        function($resource, NJaxBootstrap){
            return $resource(NJaxBootstrap.api_url + '/account_settings/:accountSetting_id',
            	{
            		'accountSetting_id':'@_id'
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

