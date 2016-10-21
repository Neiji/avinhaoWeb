var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
});
//TODO: CONEXÃO BASE DO SERVIDOR
// connection.connect();

// connection.query('SELECT * from < table name >', function(err, rows, fields) {
//   if (!err)
//     console.log('The solution is: ', rows);
//   else
//     console.log('Error while performing Query.');
// });

// connection.end();

module.exports = {
    connection: connection
};