JS_DIR = src
SASS_DIR = src/sass

JS_SRC = $(shell find src -type f -name '*.js')
SASS_SRC = $(shell find src/sass -type f -name '*.scss')

install: build


build: node_modules $(JS_SRC) src/index.css
	PUBLIC_URL=/react yarn build

node_modules: package.json
	yarn install

clean:
	$(MAKE) -C src/sass clean
	rm -fr build node_modules yarn.lock

watch: node_modules
	 ls src/sass/* | entr -s 'sassc src/sass/index.scss > src/index.css' & yarn start


src/sass/index.css: $(SASS_SRC)
	$(MAKE) -C src/sass build

src/index.css: src/sass/index.css
	cp src/sass/index.css src/index.css
