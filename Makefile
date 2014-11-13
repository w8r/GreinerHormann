SOURCES  = dist/greiner-hormann.leaflet.js dist/greiner-hormann.js
COMPILED = dist/greiner-hormann.leaflet.min.js dist/greiner-hormann.min.js
QS       = compilation_level=ADVANCED_OPTIMIZATIONS&output_format=text
URL      = http://closure-compiler.appspot.com/compile

all: clean sources compile

clean:
	@rm -rf dist/*

dist/greiner-hormann.js:
	@browserify -s greinerHormann src/greiner-hormann.js > dist/greiner-hormann.js

dist/greiner-hormann.leaflet.js:
	@browserify -s greinerHormann src/leaflet.js > dist/greiner-hormann.leaflet.js

sources: ${SOURCES}

compile: ${COMPILED}

%.min.js: %.js
	@echo " - $(<) -> $(@)";
	@curl --silent --show-error --data-urlencode "js_code@$(<)" --data-urlencode "js_externs@src/externs.js" \
	 --data "${QS}&output_info=compiled_code" ${URL} -o $(@)
