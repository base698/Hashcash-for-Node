var express = require('express');
var hashcash = require('./lib/hashcash');
var app = express.createServer();
app.use(express.static('lib'));
app.get('/protected',hashcash.middleware(),function(req,res) {
	res.send('Hello, World!');
});

app.get('/unprotected',function(req,res) {
	res.send('You should use protection.');
});

app.listen(1337);
