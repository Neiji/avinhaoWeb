//Logica para select no mysql
//var connection = require('./repositoryService').connection;
//var repository = require('../repository/indicadorRepository');

function getIndicadores(req, res) {

    //TODO: AQUI É ONDE FAREMOS OS ACESSOS A DADOS E REGRAS DE NEGÓCIO APLICÁVEIS A CADA REQUISIÇÃO
/*    connection.connect();
    connection.query('SELECT * from agenda', function(err, rows, fields) {
      if (!err)
        res.json(rows);
      else
        res.json({ sucess: false, message: "erou   " + err});
    });
    connection.end();
*/
}

module.exports = {
    getIndicadores: getIndicadores
};