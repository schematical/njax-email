'use strict';

/* Controllers */

angular.module('njax-email.accountSetting.controller', [])
    .controller(
        'AccountSettingEditFormCtl',
        [
            '$scope',
            'AccountSettingService',
			'NJaxBootstrap',
            function($scope, AccountSettingService, NJaxBootstrap) {
				if( NJaxBootstrap.accountSetting){
					$scope.accountSetting = new AccountSettingService({
						
							
								'owner': NJaxBootstrap.accountSetting.owner,
							
						
							
								'setting_namespace': NJaxBootstrap.accountSetting.setting_namespace,
							
						
							
								'type': NJaxBootstrap.accountSetting.type,
							
						
							
								'archiveDate': (NJaxBootstrap.accountSetting.archiveDate && new Date(NJaxBootstrap.accountSetting.archiveDate) || null,
							
						
						'_id': NJaxBootstrap.accountSetting._id
					});
				}
                $scope.validate = function(){


                }
                $scope.save = function(){
					$scope.accountSetting.save(function(){
						alert("Done");
					});
                }
            }
        ]
    )
	.controller(
		'AccountSettingDetailCtl',
        [
            '$scope',
            'AccountSettingService',
            'NJaxBootstrap',
            function($scope, AccountSettingService, NJaxBootstrap) {
				if( NJaxBootstrap.accountSetting){
					$scope.accountSetting = new AccountSettingService(NJaxBootstrap.accountSetting);
				}

            }
        ]
    )
    .controller(
        'AccountSettingListCtl',
        [
            '$scope',
            'AccountSettingService',
            function($scope, AccountSettingService) {

                $scope.search = function(){


                }
            }
        ]
    )
