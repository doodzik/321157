
build: clean
	PRODUCTION=true node serve.js

clean:
	rm -rf build

serve:
	node serve.js

.PHONY: build serve clean
