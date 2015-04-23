'use strict';

/* Controllers */

angular.module('njax-email.account_setting.controller', [])
    .controller(
        'Account_settingEditFormCtl',
        [
            '$scope',
            'Account_settingService',
			'NJaxBootstrap',
            function($scope, Account_settingService, NJaxBootstrap) {
				if( NJaxBootstrap.account_setting){
					$scope.account_setting = new Account_settingService({
						
							
								'owner': NJaxBootstrap.account_setting.owner,
							
						
							
								'filter': NJaxBootstrap.account_setting.filter,
							
						
							
								'type': NJaxBootstrap.account_setting.type,
							
						
							
								'archiveDate': (NJaxBootstrap.account_setting.archiveDate && new Date(NJaxBootstrap.account_setting.archiveDate) || null,
							
						
						'_id': NJaxBootstrap.account_setting._id
					});
				}
                $scope.validate = function(){


                }
                $scope.save = function(){
					$scope.account_setting.save(function(){
						alert("Done");
					});
                }
            }
        ]
    )
	.controller(
		'Account_settingDetailCtl',
        [
            '$scope',
            'Account_settingService',
            'NJaxBootstrap',
            function($scope, Account_settingService, NJaxBootstrap) {
				if( NJaxBootstrap.account_setting){
					$scope.account_setting = new Account_settingService(NJaxBootstrap.account_setting);
				}

            }
        ]
    )
    .controller(
        'Account_settingListCtl',
        [
            '$scope',
            'Account_settingService',
            function($scope, Account_settingService) {

                $scope.search = function(){


                }
            }
        ]
    )
