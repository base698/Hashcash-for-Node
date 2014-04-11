var express = require('express');
var hashcash = require('./');
var app = express();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" }));
  app.use(app.router);
  app.use(express.static(__dirname));
});

app.get('/protected',hashcash.middleware(),function(req,res) {
	res.send('Hello, World!');
});

app.get('/unprotected',function(req,res) {
	res.send('You should use protection.');
});

var port = 8000;
console.log("Listening on: " + port);
app.listen(port);
