include(base.m4)
SCRIPT(https://cdn.jsdelivr.net/npm/hls.js@latest) END
SCRIPT(/live.js) END
DIV(class="live")
	DIV(id="stream-container")
		VIDEO(id="video") END
		DIV(id="overlay")
			P(id="video-message")
				IMG(src="/public/mute.svg" style='height: 1em; width: 1em;') END
				PRESS TO UNMUTE
			END
		END
	END
END
