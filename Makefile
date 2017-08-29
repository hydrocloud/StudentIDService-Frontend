development:
	browserify -t babelify -o build/bundle.js src/index.js
	cp build/bundle.js ../Resources/static/js/bundle.min.js

production:
	NODE_ENV=production browserify -t babelify -o build/bundle.js src/index.js
	uglifyjs -o build/bundle.min.js build/bundle.js -m
	cp build/bundle.min.js ../Resources/static/js/bundle.min.js
