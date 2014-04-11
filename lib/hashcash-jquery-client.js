
HashCash.ajax = function (options) {
	var og_success = options.success;
  var og_error = options.error;

	options.error = function(xhr) {
		var challenge = xhr.getResponseHeader('x-hashcash');
    var solution = HashCash.solveChallenge(challenge);
		options.headers = options.headers || {};
		options.headers['x-hashcash'] = challenge;
		options.headers['x-hashcash-solution'] = solution;
		options.success = og_success;		
		options.error = og_error;		
		$.ajax(options);
	};

	$.ajax(options);
}

