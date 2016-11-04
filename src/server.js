var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var morgan = require('morgan');
var rotas = require('./config/rotas');
var port = process.env.PORT || 8080;
var path = require('path');
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
//app.use(morgan('dev'));
app.use(express.static('./public'));

// Start the server
app.listen(port);
console.log('Rodando no endereço: http://localhost:' + port);

// bundle our routes
var apiRoutes = express.Router();

//Primeiro configuramos as rotas de views
rotas.addViews(__dirname, app);

// connect the api routes under /api/*
// rotas.addRotas(apiRoutes);

app.use('/api', apiRoutes);
