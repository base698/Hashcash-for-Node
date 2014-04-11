
hashcash.ajax = function (options) {
	var og_success = options.success;

	var success = function(response,statusText,xhr) {
		var challenge = xhr.getResponseHeader('X-Hashcash');
		var start = new Date().getTime();
    HashCash.solveChallenge(challenge);
		options.headers = options.headers || {};
		options.headers['X-Hashcash'] = challenge;
		options.headers['X-Hashcash-solution'] = potential_answer;
		options.success = og_success;		
		$.ajax(options);

	}

	options.success = success;
	$.ajax(options);
}

