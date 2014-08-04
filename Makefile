SOURCES  = dist/greiner-hormann.leaflet.js dist/greiner-hormann.es5.js dist/greiner-hormann.js
COMPILED = dist/greiner-hormann.leaflet.min.js dist/greiner-hormann.es5.min.js dist/greiner-hormann.min.js
QS       = compilation_level=SIMPLE_OPTIMIZATIONS&output_format=text
URL      = http://closure-compiler.appspot.com/compile

all: clean sources compile

clean:
	@rm -rf dist/*

dist/greiner-hormann.js:
	@cat src/start.js \
	     src/vertex.js \
	     src/intersection.js \
	     src/polygon.js \
	     src/driver.js \
	     src/end.js > dist/greiner-hormann.js

dist/greiner-hormann.es5.js:
	@cat src/start.js \
	     lib/es5.isarray.js \
	     src/vertex.js \
	     src/intersection.js \
	     src/polygon.js \
	     src/driver.js \
	     src/end.js > dist/greiner-hormann.es5.js

dist/greiner-hormann.leaflet.js:
	@cat src/start.js \
	     lib/es5.isarray.js \
	     src/vertex.js \
	     src/intersection.js \
	     src/polygon.js \
	     src/driver.leaflet.js \
	     src/end.js > dist/greiner-hormann.leaflet.js

sources: ${SOURCES}

compile: ${COMPILED}

%.min.js: %.js
	@echo " - $(<) -> $(@)";
	@curl --silent --show-error --data-urlencode "js_code@$(<)" \
	 --data "${QS}&output_info=compiled_code" ${URL} -o $(@)
