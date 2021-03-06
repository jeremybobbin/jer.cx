#!/bin/sh -x
ARGV0="$(realpath "$0")"
PATH="${ARGV0%/*}:$PATH"
echo $PATH

#trap cleanup 0 1 2 3 6

cleanup() {
	die "caught some signal. exitting"
}

err() {
	tput setaf 1
	echo "$*" 
	tput setaf 7
} 1>&2

die() {
	err "${0##*/}: $*"
	exit 1
}

# transcode <url> <webroot> <path>
transcode() {
	mkdir -p "$2/$3"
	ln -s $ROOT/usr/local/bin/stream.sh "$2/$3/index.html"
	ffmpeg \
		-fflags nobuffer \
		-rtsp_transport udp \
		-i "$1" \
		-vsync 0 \
		-copyts \
		-vcodec copy \
		-acodec copy \
		-movflags frag_keyframe+empty_moov \
		-hls_flags delete_segments \
		-hls_list_size 1 \
		-f hls \
		-hls_time 1 \
		-hls_list_size 3 \
		-hls_allow_cache 0 \
		-hls_wrap 4 \
		-hls_segment_filename "$2/$3/%d.ts" \
		-hls_base_url "$3?seg=" \
		"$2/$3/streaming.m3u8" </dev/null
	rm -rf "$2/$3"
}

rtsp-simple-server 2>&1 | while read -r date time count rel ip event; do
	err event: $event
	case "$event" in
		# the stream path is printed on next line in quotes
		RECORD) if read line; path=${line%\'*}; path=${path#*\'};then
				echo path=$path
				# BUG: when ffmpeg panicks, rtsp-simple-server exits
				# TODO: run transcode async
				transcode "rtsp://localhost:8554/$path" "${WEBROOT:-/srv/http}/live" "$path"
			else
				die "couldn't read rtsp-simple-server line"
			fi;;
		TEARDOWN);;
	esac
done
