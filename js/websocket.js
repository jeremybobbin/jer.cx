var user, message, messages;

function attachOnLoad(fn) {
	if(window.attachEvent) {
		window.attachEvent('onload', fn);
	} else {
		if(window.onload) {
			var curronload = window.onload;
			var newonload = function(evt) {
				curronload(evt);
				fn(evt);
			};
			window.onload = newonload;
		} else {
			window.onload = fn;
		}
	}
}

attachOnLoad(function() {
	// Create WebSocket connection.
	const socket = new WebSocket(location.protocol === 'https:' ?
		"wss://jer.cx:8444" :
		"ws://jer.cx:8081");

	// Connection opened
	socket.addEventListener('open', function (event) {
		var cookies, id;
		cookies = document.cookie.split("; ");
		for (i in cookies) {
			var pair = cookies[i].split("=");
			if (pair[0] && pair[0] == "ID") {
				id = pair[1];
				break;
			}
		}

		if (!id) {
			console.log("err: no ID in cookies; closing socket");
			socket.close();
		} else {
			socket.send(id + ': 0');
		}
	});

	// Listen for messages
	socket.addEventListener('message', function (event) {
		var s = event.data.split(':');
		user = s.shift();
		message = s.join(':');
		console.log(user + " says " + event.data);

		/* uimplemented */
	});
});
