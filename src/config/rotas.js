var indicadorService = require('../app/service/indicadorService');
var path = require('path');

function addRotas(apiRoutes) {
    apiRoutes.get('/indicadores/', indicadorService.getIndicadores);
}

function addViews(diretorio, apiRoutes) {
    apiRoutes.get('/', function (req, res) {
        res.sendfile(diretorio + '/public/index.html');
    });

}

module.exports = {
    addRotas: addRotas,
    addViews: addViews
};