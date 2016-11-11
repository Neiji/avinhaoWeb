app.config(function ($stateProvider, $urlRouterProvider) {

    var comando = {
        name: 'comando',
        url: '/comando',
        templateUrl: 'app/components/comando/comando.html'
        //controller: 'app/components/comando/comando.controller.js'
    }

    var report = {
        name: 'report',
        url: '/report',
        templateUrl: 'app/components/report/report.html'
    }

    $urlRouterProvider.otherwise('/');

    //$stateProvider.state(loginState);
    $stateProvider.state(report);
    $stateProvider.state(comando);

});