var crypto = require('crypto');
var MINUTE = 1000*60*1;
var RAND = 0;
var ID = 2;
var TIME = 1;

// Example: http://en.wikipedia.org/wiki/Hashcash
// *ver*:*bits*:*date*:*resource*:*rand*:*counter*
// X-Hashcash: 1:40:1303030600:adam@cypherspace.org::McMybZIhxKXu57jd:FOvXX
function hash(str) {
  var shasum = crypto.createHash('sha1');
  shasum.update(str);
  return shasum.digest('hex');
}

function randomHex(n) {
	return Math.ceil(Math.random() * n).toString(16);
}

var getChallenge = function(id, url) {
	var time = new Date().getTime().toString(16);
	var rand = randomHex(10000000000);
	return rand + ':' + time + ':' + id  + ':' + encodeURIComponent(url) + ':';
}

var getRandomFrom = function(challenge) {
  var split = challenge.split(':');
  return parseInt(split[RAND], 16);
};

var getAddressFrom = function(challenge) {
  var split = challenge.split(':');
  return split[ID];
}

var getTimeFrom = function(challenge) {
  var split = challenge.split(':');
  return parseInt(split[TIME], 16);
};

var solveChallenge = function(challenge) {
  var randomNumber = getRandomFrom(challenge);
  randomNumber += 1;
  while(true) {
    if(isSolution(challenge, randomNumber)) {
      return randomNumber;
    }
    randomNumber++;
  }
};

var isSolution = function(challenge, nonce) {
  var answer = hash(challenge + nonce);
  return answer.slice(0,5) === '00000';
};

var HashCashMiddleWare = function() {

	return function(req, res, next) {
    var url = req.url;
    var address = req.connection.remoteAddress;
    var challenge = req.session['X-hashcash'] || getChallenge(address, url);
    var solution = req.headers['X-hashcash-solution'];
    if(solution && address.toString() === getAddressFrom(challenge) && isSolution(challenge, solution)) {
      next();
    } else {
      res.header('X-hashcash', challenge);
      res.send('Answer challenge', 400);
    }
    
	};

};

exports.solveChallenge = solveChallenge;
exports.isSolution = isSolution;
exports.getRandomFrom = getRandomFrom;
exports.getTimeFrom = getRandomFrom;
exports.getChallenge = getChallenge;
exports.middleware = HashCashMiddleWare;
