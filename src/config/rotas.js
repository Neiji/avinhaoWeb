// var indicadorService = require('../app/service/indicadorService');
var path = require('path');
//
// function addRotas(apiRoutes) {
//     apiRoutes.get('/indicadores/', indicadorService.getIndicadores);
// }

function addViews(diretorio, apiRoutes) {
    apiRoutes.get('/', function (req, res) {
        res.sendfile(diretorio + '/public/index.html');
    });
    apiRoutes.get('/login', function(req, res){
        res.sendfile(diretorio + '/public/app/components/login/login.html');
    });

}

module.exports = {
    //addRotas: addRotas,
    addViews: addViews
};