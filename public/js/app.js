'use strict';


// Declare app level module which depends on filters, and services
angular.module(
        'njax-email',
    [
        'ngRoute',
        'ngCookies',
		'njax.bootstrap',
        
            'njax-email.account_setting.service',
            'njax-email.account_setting.controller',
            'njax-email.account_setting.directives',
        
        'njax-email.filters',
        'njax-email.directives'
    ]
).config(
        [
            '$routeProvider',
            function($routeProvider) {

        }
    ]
);