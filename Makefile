RS_SRC = src
RS_O = target
JS = frontend
JS_SRC = $(JS)/src
JS_O = $(JS)/build
PUBLIC = public
SASS = $(JS_SRC)/sass

run: build
	cargo run

build: $(RS_O) $(PUBLIC) 

$(RS_O): $(RS_SRC)

$(PUBLIC): $(JS_O)
	mkdir -p $(PUBLIC)
	cp -r $(JS_O)/* $(PUBLIC)

$(JS_O): $(JS_SRC)
	yarn --cwd $(JS) build

$(JS_SRC)/index.css: $(SASS)
	sassc $(SASS)/index.scss > $(JS_SRC)/index.css
