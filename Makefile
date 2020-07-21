# See LICENSE file for copyright and license details
# $(QUARK_SRC)/quark - simple web server
SRV=srv
ROOT=root
QUARK_SRC=quark
CSS_SRC=css
PUBLIC=$(SRV)/public
HTML=html
JS=js


build: $(QUARK_SRC)/quark $(CSS_SRC)/index.css \
	$(HTML)/index.html $(HTML)/stream.html
	cp -a root/. $(SRV)
	cp $(JS)/stream.js $(SRV)
	cp $(CSS_SRC)/index.css $(SRV)
	cp $(HTML)/index.html $(HTML)/stream.html $(SRV)


build: $(QUARK_SRC)/quark $(CSS_SRC)/index.css \
	$(HTML)/index.html $(HTML)/stream.html
	cp -a root/. $(SRV)
	cp $(JS)/stream.js $(SRV)
	cp $(CSS_SRC)/index.css $(SRV)
	cp $(HTML)/index.html $(HTML)/stream.html $(SRV)


# HTML
%.html: %.html.m4
	m4 -I html $< > $@

$(HTML)/base.m4: $(HTML)/defs.m4 $(HTML)/header.html.m4 $(HTML)/footer.html.m4
$(HTML)/index.html.m4 $(HTML)/stream.html.m4: $(HTML)/base.m4
$(HTML)/index.html: $(HTML)/index.html.m4
$(HTML)/stream.html: $(HTML)/stream.html.m4

# CSS
%.css: %.scss
	sassc $< > $@

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

clean:
	rm -f $(QUARK_SRC)/quark $(QUARK_SRC)/main.o $(COMPONENTS:=.o)

dist:
	rm -rf "$(QUARK_SRC)/quark-$(VERSION)"
	mkdir -p "$(QUARK_SRC)/quark-$(VERSION)"
	cp -R LICENSE Makefile $(QUARK_SRC)/arg.h config.$(QUARK_SRC)/def.h $(QUARK_SRC)/config.mk $(QUARK_SRC)/quark.1 \
		$(COMPONENTS:=.c) $(COMPONENTS:=.h) $(QUARK_SRC)/main.c "$(QUARK_SRC)/quark-$(VERSION)"
	tar -cf - "$(QUARK_SRC)/quark-$(VERSION)" | gzip -c > "$(QUARK_SRC)/quark-$(VERSION).tar.gz"
	rm -rf "$(QUARK_SRC)/quark-$(VERSION)"

install: all
	mkdir -p "$(DESTDIR)$(PREFIX)/bin"
	cp -f $(QUARK_SRC)/quark "$(DESTDIR)$(PREFIX)/bin"
	chmod 755 "$(DESTDIR)$(PREFIX)/bin/$(QUARK_SRC)/quark"
	mkdir -p "$(DESTDIR)$(MANPREFIX)/man1"
	cp $(QUARK_SRC)/quark.1 "$(DESTDIR)$(MANPREFIX)/man1/$(QUARK_SRC)/quark.1"
	chmod 644 "$(DESTDIR)$(MANPREFIX)/man1/$(QUARK_SRC)/quark.1"

uninstall:
	rm -f "$(DESTDIR)$(PREFIX)/bin/$(QUARK_SRC)/quark"
	rm -f "$(DESTDIR)$(MANPREFIX)/man1/$(QUARK_SRC)/quark.1"
