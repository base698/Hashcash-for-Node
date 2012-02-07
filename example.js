var express = require('express');
var hashcash = require('./lib/hashcash');
var app = express.createServer();
app.use(express.cookieParser());
app.use(express.session({ secret: "keyboard cat" }));
app.use(express.static('lib'));
app.get('/protected',hashcash.middleware(),function(req,res) {
	res.send('Hello, World!');
});

app.get('/unprotected',function(req,res) {
	res.send('You should use protection.');
});

console.log("Listening...");
app.listen(1337);
