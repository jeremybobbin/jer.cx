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
	const socket = new WebSocket('ws://jer.cx:8081');

	// Connection opened
	socket.addEventListener('open', function (event) {
	    socket.send('Hello Server!');
	});

	// Listen for messages
	socket.addEventListener('message', function (event) {
	    console.log('Message from server ', event.data);
	});
});
