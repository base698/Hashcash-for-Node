var crypto = require('crypto');
var MINUTE = 1000*60*1;


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

var getChallenge = function(url) {
	var time = new Date().getTime().toString(16);
	var rand = randomHex(10000000);
	return rand + ':' + time + ':' + url + ':';
}

var getRandomFromChallenge = function(challenge) {
  return parseInt(challenge.substring(0, challenge.indexOf(':')));
};

var solveChallenge = function(challenge) {
  var randomNumber = getRandomFromChallenge(challenge);
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
  return answer.slice(0,4) === '0000';
};


var HashCashMiddleWare = function() {

	return function(req, res, next) {
    var url = req.url;
    var challenge = req.session['X-hashcash'] || getChallenge(url);
    var solution = req.headers['X-hashcash-solution'];
    if(solution && isSolution(challenge, solution)) {
      next();
    } else {
      res.header('X-hashcash', challenge);
      res.send('Answer challenge', 400);
    }
    
	};

};

exports.solveChallenge = solveChallenge;
exports.isSolution = isSolution;
exports.getRandomFromChallenge = getRandomFromChallenge;
exports.getChallenge = getChallenge;
exports.middleware = HashCashMiddleWare;
