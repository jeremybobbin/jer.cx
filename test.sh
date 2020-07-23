#!/bin/sh
PATH=$PATH:build/usr/local/bin
WEBROOT=build/srv/http
export PATH WEBROOT

trap cleanup 0 1 2 3 6

cleanup() {
	echo "caught some signal. exitting" 2>/dev/null
	kill $quark
}

make install DESTDIR=build
quark -p 8080 -h 0.0.0.0 -d build/srv/http -x &
quark=$!

stream.sh
