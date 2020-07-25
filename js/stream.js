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

function mediaErrorHandler(hls) {
	return function(event, data) {
		if (data.fatal) {
			switch(data.type) {
			case Hls.ErrorTypes.NETWORK_ERROR:
				// try to recover network error
				console.log("fatal network error encountered, try to recover");
				hls.startLoad();
				break;
			case Hls.ErrorTypes.MEDIA_ERROR:
				console.log("fatal media error encountered, try to recover");
				hls.recoverMediaError();
				break;
			default:
				// cannot recover
				hls.destroy();
				break;
			}
		}
	}
}

attachOnLoad(function() {
	var video = document.getElementById('video');
	var wrapper = document.getElementById('stream-container');
	var message = document.getElementById('video-message');
	var videoSrc = '/stream/stream/streaming.m3u8';

	video.autoplay = true;
	if (Hls.isSupported()) {
		console.log("works");
		var hls = new Hls();
		hls.loadSource(videoSrc);
		hls.attachMedia(video);
		hls.on(Hls.Events.MEDIA_ATTACHED, function () {
			console.log("video and hls.js are now bound together!");
			hls.loadSource(videoSrc);
			hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
				console.log("manifest loaded, found " + data.levels.length + " quality level");
			});
		});
		wrapper.onclick = function(event) {
			event.preventDefault();
			console.log("wrapper clicked");
			video.muted = false;
			message.style.display = "none";
		}
		video.addEventListener('loadedmetadata', function() {
			video.muted = true;
			video.play();
		});
		video.onended = function() {
			console.log("video ended");
			hls.loadSource(videoSrc);
			hls.attachMedia(video);
		}
		hls.liveDurationInfinity = true;
		hls.on(Hls.Events.ERROR, mediaErrorHandler(hls));
	} else {
		console.log("doesn't work.");
	}
});
