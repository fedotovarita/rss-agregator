install:
	npm install

publish:
	npm publish --dry-run

lint:
	npx eslint . --no-error-on-unmatched-pattern