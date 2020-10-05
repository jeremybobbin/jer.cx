# See LICENSE file for copyright and license details
# $(QUARK_SRC)/quark - simple web server
DESTDIR=
PREFIX=/usr/local
MANPREFIX=$(PREFIX)/share/man
SRV=$(DESTDIR)/srv/http
BIN=$(DESTDIR)$(PREFIX)/bin
MAN=$(DESTDIR)$(MANPREFIX)

ROOT=root
CSS_SRC=css
PUBLIC=$(SRV)/public
HTML=html
JS=js

BLOG=$(HTML)/blog

QUARK_SRC=quark
RTSP=rtsp-simple-server
WS=websocketd/

build: $(QUARK_SRC)/quark $(CSS_SRC)/index.css \
	$(HTML)/index.html $(HTML)/live/real-index.html $(HTML)/about/index.html \
	$(RTSP)/rtsp-simple-server $(JS)/stream.js $(JS)/index.js $(BLOG)/index.html \
	$(BLOG)/site.html $(BLOG)/virtualize_routeros.html $(WS)/websocketd

install: build
	mkdir -p "$(DESTDIR)/etc/systemd/system" "$(DESTDIR)/var"
	cp jer.cx.service $(DESTDIR)/etc/systemd/system/
	mkdir -p "$(SRV)"
	cp -a root/. $(SRV)
	touch $(SRV)/forbidden && chmod a-r $(SRV)/forbidden
	cp $(JS)/index.js $(JS)/stream.js $(JS)/websocket.js $(SRV)
	cp $(CSS_SRC)/index.css $(SRV)
	cp -a $(HTML)/index.html $(HTML)/live $(HTML)/about $(BLOG) $(SRV)
	mkdir -p "$(BIN)"
	cp $(QUARK_SRC)/quark $(RTSP)/rtsp-simple-server bin/* \
		$(WS)/websocketd $(BIN)
	chmod 755 "$(BIN)/quark" "$(BIN)/rtsp-simple-server" "$(BIN)/stream.sh"
	mkdir -p "$(MAN)/man1"
	cp $(QUARK_SRC)/quark.1 "$(MAN)/man1/quark.1"
	chmod 644 "$(MAN)/man1/quark.1"

# Markdown
%.html: %.md
	pandoc $< | m4 -D TITLE="$$(awk -F: '/^title:/ { print $$2; exit }' $<)" -I html base.m4 blog/blog.html.m4 - > $@ 

$(BLOG)/index.html.m4: $(BLOG)/site.md $(BLOG)/video_player.md \
	$(BLOG)/virtualize_routeros.md $(BLOG)/vpn.md

$(BLOG)/vpn.html: $(BLOG)/vpn.md
$(BLOG)/site.html: $(BLOG)/site.md
$(BLOG)/video_player.html: $(BLOG)/video_player.md
$(BLOG)/virtualize_routeros.html: $(BLOG)/virtualize_routeros.md

# HTML
%.html: %.html.m4
	m4 -I html base.m4 $< > $@

$(HTML)/defs.m4 $(HTML)/header.html.m4 $(HTML)/footer.html.m4 \
	$(HTML)/index.html.m4 $(HTML)/live/real-index.html.m4 \
	$(HTML)/about/index.html.m4 $(HTML)/blog/index.html.m4: $(HTML)/base.m4
$(HTML)/index.html: $(HTML)/index.html.m4

$(HTML)/live/real-index.html: $(HTML)/live/real-index.html.m4
$(HTML)/about/index.html: $(HTML)/about/index.html.m4
$(BLOG)/index.html: $(HTML)/about/index.html.m4

# CSS
%.css: %.scss
	sassc $< > $@

$(CSS_SRC)/index.scss: $(CSS_SRC)/about.scss $(CSS_SRC)/blog.scss \
	$(CSS_SRC)/downloads.scss $(CSS_SRC)/footer.scss $(CSS_SRC)/header.scss \
	$(CSS_SRC)/layout.scss $(CSS_SRC)/main.scss $(CSS_SRC)/vars.scss \
	$(CSS_SRC)/live.scss
	
$(CSS_SRC)/index.css: $(CSS_SRC)/index.scss

# QUARK
include $(QUARK_SRC)/config.mk

COMPONENTS = $(QUARK_SRC)/util $(QUARK_SRC)/sock $(QUARK_SRC)/http $(QUARK_SRC)/resp


$(QUARK_SRC)/util.o: $(QUARK_SRC)/util.c $(QUARK_SRC)/util.h $(QUARK_SRC)/config.mk
$(QUARK_SRC)/sock.o: $(QUARK_SRC)/sock.c $(QUARK_SRC)/sock.h $(QUARK_SRC)/util.h $(QUARK_SRC)/config.mk
$(QUARK_SRC)/http.o: $(QUARK_SRC)/http.c $(QUARK_SRC)/http.h $(QUARK_SRC)/util.h $(QUARK_SRC)/http.h $(QUARK_SRC)/resp.h $(QUARK_SRC)/config.h $(QUARK_SRC)/config.mk
$(QUARK_SRC)/resp.o: $(QUARK_SRC)/resp.c $(QUARK_SRC)/resp.h $(QUARK_SRC)/util.h $(QUARK_SRC)/http.h $(QUARK_SRC)/config.mk
$(QUARK_SRC)/main.o: $(QUARK_SRC)/main.c $(QUARK_SRC)/util.h $(QUARK_SRC)/sock.h $(QUARK_SRC)/http.h $(QUARK_SRC)/arg.h $(QUARK_SRC)/config.h $(QUARK_SRC)/config.mk

$(QUARK_SRC)/quark: $(COMPONENTS:=.o) $(COMPONENTS:=.h) $(QUARK_SRC)/main.o $(QUARK_SRC)/config.mk
	$(CC) -o $@ $(CPPFLAGS) $(CFLAGS) $(COMPONENTS:=.o) $(QUARK_SRC)/main.o $(LDFLAGS)

$(QUARK_SRC)/config.h:
	cp config.def.h $@

dist:
	rm -rf "$(QUARK_SRC)/quark-$(VERSION)"
	mkdir -p "$(QUARK_SRC)/quark-$(VERSION)"
	cp -R LICENSE Makefile $(QUARK_SRC)/arg.h config.$(QUARK_SRC)/def.h $(QUARK_SRC)/config.mk $(QUARK_SRC)/quark.1 \
		$(COMPONENTS:=.c) $(COMPONENTS:=.h) $(QUARK_SRC)/main.c "$(QUARK_SRC)/quark-$(VERSION)"
	tar -cf - "$(QUARK_SRC)/quark-$(VERSION)" | gzip -c > "$(QUARK_SRC)/quark-$(VERSION).tar.gz"
	rm -rf "$(QUARK_SRC)/quark-$(VERSION)"

uninstall:
	rm -f "$(DESTDIR)$(PREFIX)/bin/$(QUARK_SRC)/quark"
	rm -f "$(DESTDIR)$(MANPREFIX)/man1/$(QUARK_SRC)/quark.1"

# RTSP

$(RTSP)/rtsp-simple-server: $(RTSP)/conf.go $(RTSP)/main.go \
	$(RTSP)/main_test.go $(RTSP)/source.go $(RTSP)/utils.go \
	$(RTSP)/client.go $(RTSP)/logsyslog_unix.go \
	$(RTSP)/logsyslog_win.go $(RTSP)/metrics.go $(RTSP)/path.go \
	$(RTSP)/pprof.go $(RTSP)/servertcp.go $(RTSP)/serverudp.go
	cd $(RTSP) && go build

clean:
	rm -f $(HTML)/*.html
	rm -f $(QUARK_SRC)/quark $(QUARK_SRC)/main.o $(COMPONENTS:=.o)

LIBWS=$(WS)/libwebsocketd

WS_SRC=$(WS)/version.go $(WS)/help.go $(WS)/config.go \
	$(WS)/main.go $(LIBWS)/license.go $(LIBWS)/env.go $(LIBWS)/logscope.go \
	$(LIBWS)/process_endpoint.go $(LIBWS)/endpoint_test.go $(LIBWS)/handler.go \
	$(LIBWS)/endpoint.go $(LIBWS)/config.go $(LIBWS)/handler_test.go \
	$(LIBWS)/http_test.go $(LIBWS)/http.go $(LIBWS)/websocket_endpoint.go \
	$(LIBWS)/launcher.go

$(WS)/websocketd: $(WS_SRC)
	cd $(WS) && go build
