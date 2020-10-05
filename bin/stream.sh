#!/bin/sh -x
# stream.sh - handles connections to indiviual streams

printf '\n'

IFS='&'
for s in $(echo "$QUERY_STRING"); do
	case "${s%%=*}" in
		seg) seg="${s#*=}";;
	esac
done

cd "${0%/*}"
if [ -n "$seg" ] && [ -f "$seg" ]; then
	cat "$seg"
elif [ -f streaming.m3u8 ]; then
	cat "streaming.m3u8"
fi
