build: install src/*.js sass
	yarn build

install: package.json
	yarn install

sass: src/sass
	$(MAKE) -C src/sass
	cp src/sass/index.css src/index.css

clean:
	$(MAKE) -C src/sass clean
	rm -fr build node_modules yarn.lock
