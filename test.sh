#!/bin/sh
make install DESTDIR=build
export PATH=$PATH:build/usr/local/bin
exec quark -p 8080 -h 0.0.0.0 -d build/srv/http -x
