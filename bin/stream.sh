#!/bin/sh
ARGV0="$(realpath "$0")"
PATH="${ARGV0%/*}:$PATH"
echo $PATH

trap cleanup 0 1 2 3 6

cleanup() {
	echo "caught some signal. exitting"
	kill "$rtsp"
	exit 1
}

rtsp-simple-server &
rtsp=$!


while kill -0 "$rtsp" 2>/dev/null; do
	transcode.sh
	sleep 1
done
