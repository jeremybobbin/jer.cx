RS_SRC = src
JS = frontend
JS_O = $(JS)/build

run: build
	cargo run

build: $(RS_SRC) js
	cargo build


js: $(JS_SRC)
	$(MAKE) -C $(JS)
	mkdir -p public
	cp -r $(JS_O)/* $(PUBLIC)

clean:
	$(MAKE) -C $(JS) clean
	rm -rf target public Cargo.lock

