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

attachOnLoad(function(e) {
	var img = document.getElementById("cat");
	fetch('https://cataas.com/cat/cute')
		.then(response => response.blob())
		.then(image => img.src = URL.createObjectURL(image));
});
