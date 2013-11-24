var express = require('express');
//--------------------------------------
// Client
//--------------------------------------

var clientapp = express();
clientapp.use(express.static(__dirname + '/www'));
clientapp.listen(100);
console.log('! CONTENT server START on http://orz.dk:100');