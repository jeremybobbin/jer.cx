
build: index.css

clean:
	rm -f index.css

index.css: $(shell find . -name '*.scss')
	sassc index.scss > index.css
