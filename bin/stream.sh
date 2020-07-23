#!/bin/sh
ARGV0="$(realpath "$0")"
PATH="${ARGV0%/*}:$PATH"
echo $PATH

trap cleanup 0 1 2 3 6

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

# transcode <url> <dir>
transcode() {
	mkdir -p "$2"
	exec ffmpeg \
		-fflags nobuffer \
		-rtsp_transport udp \
		-i "$1" \
		-vsync 0 \
		-copyts \
		-vcodec copy \
		-movflags frag_keyframe+empty_moov \
		-an \
		-hls_flags delete_segments \
		-hls_list_size 1 \
		-f segment \
		-segment_list_flags live \
		-segment_time 2 \
		-segment_list_size 5 \
		-segment_wrap 20 \
		-segment_format mpegts \
		-segment_list "$2/streaming.m3u8" \
		-segment_list_type m3u8 \
		"$2/%d.ts"
}

rtsp-simple-server 2>&1 | while read -r date time count rel ip event; do
	err event: $event
	case "$event" in
		# the stream path is printed on next line in quotes
		RECORD) if read line; path=${line%\'*}; path=${path#*\'};then
				echo path=$path
				# BUG: when ffmpeg panicks, rtsp-simple-server exits
				# TODO: run transcode async
				transcode "rtsp://localhost:8554/$path" "srv/stream/$path"
			else
				die "couldn't read rtsp-simple-server line"
			fi;;
		TEARDOWN);;
	esac
done
