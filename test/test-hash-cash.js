var hashcash = require('../lib/hashcash');
var assert = require('assert');

describe('hash cash', function() {
  it('gets challenge for url', function(done) {
      var challenge = hashcash.getChallenge(1, '123aaa');
      assert.ok(challenge.indexOf('123aaa') != -1);
      done();
  });
  it('solves a challenge', function(done) {
    var challenge = hashcash.getChallenge('123', '123aaa');
    var nonce = hashcash.solveChallenge(challenge);
    assert.ok(hashcash.isSolution(challenge, nonce));
    done();
  });

  it('issues challenge on new request', function(done) {
    var req = {url: '/123', connection: {remoteAddress: 123}, headers: {}, session: {}};
    var res = { 
      header: function(k, v) {},
      send: function(str, status) {
        assert.ok( status === 400 );
        done();
      }
    };
    hashcash.middleware()(req, res, function() { });
  });

  it('denies access for solution with different remoteAddress', function(done) {
    var challenge;
    var calls = 0;
    var req = {url: '/123', connection: {remoteAddress: 123}, headers: {}, session: {}};
    var res = { 
      header: function(k, v) {challenge = v;},
      send: function(str, status) {
        assert.ok(status === 400);
        if(calls++ === 1) {
          done();
        }
          
      }
    };

    hashcash.middleware()(req, res, function() { });

    var solution = hashcash.solveChallenge(challenge);
    var solutionReq = {url: '/123', connection: {remoteAddress: 1}, headers: {'x-hashcash-solution': solution}, session: {'x-hashcash': challenge}};
    hashcash.middleware()(solutionReq, res, function() { throw 'shouldnt hit' });
  });

  it('should get solutions for nounce and key', function(done) {
    var solution = hashcash.isSolution('1eec8a5c2:1455300cc03:127.0.0.1:%2Fprotected:', 8301123093);
    assert.ok(solution);
    done();
  });

  it('allows access for solution to challenge', function(done) {
    var challenge;
    var req = {url: '/123', connection: {remoteAddress: 123}, headers: {}, session: {}};
    var res = { 
      header: function(k, v) {challenge = v;},
      send: function(str, status) {
      }
    };

    hashcash.middleware()(req, res, function() { });

    var solution = hashcash.solveChallenge(challenge);
    var solutionReq = {url: '/123', connection: {remoteAddress: 123}, headers: {'x-hashcash-solution': solution}, session: {'x-hashcash': challenge}};
    hashcash.middleware()(solutionReq, res, function() { 
      done(); 
    });
  });

});
