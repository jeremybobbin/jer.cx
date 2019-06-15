build: deps src/*.js sass
	PUBLIC_URL=/react yarn build

deps: package.json
	yarn install

sass: src/sass
	$(MAKE) -C src/sass build
	cp src/sass/index.css src/index.css

clean:
	$(MAKE) -C src/sass clean
	rm -fr build node_modules yarn.lock

watch: deps
	 ls src/sass/* | entr -s 'sassc src/sass/index.scss > src/index.css' & yarn start
