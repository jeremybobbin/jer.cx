#!/bin/sh -e
PATH=$PATH:build/usr/local/bin
WEBROOT=build/srv/http
export PATH WEBROOT

trap cleanup 0 1 2 3 6

cleanup() {
	echo "caught some signal. exitting" 2>/dev/null
	kill $quark $ws
}

make install DESTDIR=build

if systemctl is-active --quiet jer.cx; then
	sudo systemctl stop jer.cx ||:
fi

if pgrep hitch >/dev/null 2>&1; then
	killall hitch
fi
hitch -u hitch -g cert --config=/etc/hitch.conf

websocketd -port 8081 ws.sh &
ws=$!

quark -p 8080 -h 0.0.0.0 -d build/srv/http -x &
quark=$!
stream.sh
