RS_SRC = $(shell find src -type f)

RS_DEBUG = target/debug/site
RS_RELEASE = target/release/site

JS_OUT = $(shell find frontend/build -type f)
REACT = $(shell find assets/react -type f)

DEST = /usr/src/jer.cx/

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

build: react $(RS_RELEASE)

$(RS_RELEASE): $(RS_SRC)
	cargo build --release

$(RS_DEBUG): $(RS_SRC)
	cargo build

react: $(JS_OUT)
	$(MAKE) -C frontend
	mkdir -p assets/react
	cp -r frontend/build/* assets/react

clean:
	$(MAKE) -C frontend clean
	rm -rf target assets/react Cargo.lock

run: react
	cargo run

