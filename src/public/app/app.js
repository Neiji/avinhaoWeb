var app = angular.module("myApp", ['ngMaterial', 'ui.router'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('green', {
                'default': '500'
            });
    });


// .config(function myAppConfig($routeProvider) {
//     'use strict';
//     $routeProvider
//         .when('/login', {
//             template: 'Oii'
//             controller: 'components/login/login.controller.js'
//         })
//         .when('/', {
//             templateUrl: '../index.html'
//         })
//         .otherwise({ redirectTo: '/' });
// });