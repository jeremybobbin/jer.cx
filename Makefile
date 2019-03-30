RS_SRC = src
JS = frontend
JS_O = $(JS)/build

install: build
	systemctl stop jer.cx.service
	cp jer.cx.service /etc/systemd/system/
	mkdir -p /www
	chmod 644 /www
	cp target/release/site /www/jer.cx
	cp -r public /www

uninstall:
	systemctl stop jer.cx.service
	rm -rf /etc/systemd/system/jer.cx.service /www/public /www/jer.cx

run: build
	cargo run

build_debug: $(RS_SRC) js
	cargo build

build: $(RS_SRC) js
	cargo build --release

js: $(JS_SRC)
	$(MAKE) -C $(JS)
	mkdir -p public
	cp -r $(JS_O)/* public

clean:
	$(MAKE) -C $(JS) clean
	rm -rf target public Cargo.lock

