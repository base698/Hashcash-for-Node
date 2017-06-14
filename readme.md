# Hashcash for Node 

Hashcash is a simple proof of work algorithm to prevent or slow down spam.  It works by giving the requester a challenge in the form of a sha1 hash.  After the hash is received the requesting client must find a hash of the challenge + number that has three leading zeros.  The client can find the challenge in the header: `x-hashcash` and add the solution as a string to `x-hashcash-solution`.

Using the middleware on an end-point in express will prevent the client from accessing the resource until an answer is found.

## How to Install

    npm install hashcash 

## How to use

First, require `hashcash`:

```js
var hashcash = require('hashcash');
var express = require('express');
var app = express.createServer();

app.get('/protected',hashcash.middleware(),function(req,res) {
	/* this will never get hit if the hashcash-answer is not present */
	res.send('Success!');
});

var port = 8080;
console.log('Listening on port: '+port);
app.listen(port);
```
