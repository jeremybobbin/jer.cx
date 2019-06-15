RS_SRC = src
JS = frontend
DATABASE = database

JS_O = $(JS)/build

DEST = /usr/srv/jer.cx/

install: build
	systemctl stop jer.cx.service
	mkdir -p $(DEST)
	cp -r Rocket.toml diesel.toml src assets $(DEST)
	cp jer.cx.service /etc/systemd/system/
	cp target/release/site /usr/bin/jer.cx
	systemctl daemon-reload

uninstall:
	systemctl stop jer.cx.service
	rm -rf /etc/systemd/system/jer.cx.service $(DEST)

build: js database $(RS_SRC)
	cargo build --release

database:
	$(MAKE) -C $(DATABASE)

js: $(JS_SRC)
	$(MAKE) -C $(JS)
	mkdir -p assets/react
	cp -r $(JS_O)/* assets/react

clean:
	$(MAKE) -C $(JS) clean
	rm -rf target assets/react Cargo.lock



run: build_debug
	cargo run

build_debug: $(RS_SRC) js
	cargo build
