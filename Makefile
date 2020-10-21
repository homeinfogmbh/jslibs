.PHONY: pull install

default: | pull install

pull:
	@ git pull

install:
	@ install -vm 644 -t /srv/http/de/homeinfo/javascript *.js
