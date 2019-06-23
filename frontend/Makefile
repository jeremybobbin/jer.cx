JS_DIR = src
SASS_DIR = src/sass

JS_SRC = $(shell find src -type f -name '*.js')
SASS_SRC = $(shell find src/sass -type f -name '*.scss')

build: node_modules $(JS_SRC)
	PUBLIC_URL=/react yarn build

node_modules: package.json
	yarn install

src/index.css: $(SASS_DIR)/index.scss
	$(MAKE) -C src/sass build
	cp src/sass/index.css src/index.css

clean:
	$(MAKE) -C src/sass clean
	rm -fr build node_modules yarn.lock

watch: deps
	 ls src/sass/* | entr -s 'sassc src/sass/index.scss > src/index.css' & yarn start
