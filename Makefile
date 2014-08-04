SOURCES  = dist/greiner-hormann.leaflet.js dist/greiner-hormann.es5.js dist/greiner-hormann.js
QS       = compilation_level=SIMPLE_OPTIMIZATIONS&output_format=text
URL      = http://closure-compiler.appspot.com/compile
CODE     = js_code@dist/greiner-hormann.js
CODE_ES5 = js_code@dist/greiner-hormann.es5.js
CODE_L   = js_code@dist/greiner-hormann.leaflet.js

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

compile: dist/greiner-hormann.min.js dist/greiner-hormann.es5.min.js dist/greiner-hormann.leaflet.min.js

dist/greiner-hormann.min.js: dist/greiner-hormann.js
	@echo "Building dist/greiner-hormann.min.js...                  "
	@curl --silent --show-error --data-urlencode "${CODE}" --data "${QS}&output_info=compiled_code" ${URL} -o dist/greiner-hormann.min.js
	@echo " Done"
	@echo "Getting compression stats...                        "
	@echo " Done\n\n" "`curl --silent --show-error --data-urlencode "${CODE}" --data "${QS}&output_info=statistics" ${URL}`"
	@echo ${STATS}

dist/greiner-hormann.es5.min.js: dist/greiner-hormann.es5.js
	@echo "Building dist/greiner-hormann.es5.min.js...                  "
	@curl --silent --show-error --data-urlencode "${CODE_ES5}" --data "${QS}&output_info=compiled_code" ${URL} -o dist/greiner-hormann.es5.min.js
	@echo " Done"
	@echo "Getting compression stats...                        "
	@echo " Done\n\n" "`curl --silent --show-error --data-urlencode "${CODE}" --data "${QS}&output_info=statistics" ${URL}`"
	@echo ${STATS}

dist/greiner-hormann.leaflet.min.js: dist/greiner-hormann.leaflet.js
	@echo "Building dist/greiner-hormann.leaflet.min.js...                  "
	@curl --silent --show-error --data-urlencode "${CODE_L}" --data "${QS}&output_info=compiled_code" ${URL} -o dist/greiner-hormann.leaflet.min.js
	@echo " Done"
	@echo "Getting compression stats...                        "
	@echo " Done\n\n" "`curl --silent --show-error --data-urlencode "${CODE}" --data "${QS}&output_info=statistics" ${URL}`"
	@echo ${STATS}


