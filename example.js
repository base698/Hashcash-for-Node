var express = require('express');
var hashcash = require('./');
var app = express();
app.use(express.cookieParser());
app.use(express.session({ secret: "keyboard cat" }));
app.use(express.static('lib'));

app.get('/protected',hashcash(),function(req,res) {
	res.send('Hello, World!');
});

app.get('/unprotected',function(req,res) {
	res.send('You should use protection.');
});

var port = 1337;
console.log("Listening on: " + port);
app.listen(port);
