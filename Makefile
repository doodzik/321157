build: clean
	PRODUCTION=true node build.js

clean:
	rm -rf .tmp

serve:
	node build.js

.PHONY: build serve clean
