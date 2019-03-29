RS_SRC = src
RS_O = target
JS = frontend
JS_SRC = $(JS)/src
JS_O = $(JS)/build
PUBLIC = public

run: build
	cargo run

build: $(RS_O) $(PUBLIC)

$(RS_O): $(RS_SRC)

$(PUBLIC): $(JS_O)
	cp -r $(JS_O)/* $(PUBLIC)

$(JS_O): $(JS_SRC)
	yarn --cwd $(JS) build
