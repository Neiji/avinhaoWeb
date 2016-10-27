var app = angular.module("myApp", ['ngMaterial', 'ui.router', 'smart-table'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('green', {
                'default': '500'
            });
    });
