.PHONY: pull homeinfo trias weather

default: | pull install

pull:
	@ git pull

install: | homeinfo trias weather

homeinfo:
	@ install -vm 644 homeinfo.js /srv/http/de/homeinfo/javascript/homeinfo.js

trias:
	@ install -vm 644 trias.js /srv/http/de/homeinfo/javascript/trias.js

weather:
	@ install -vm 644 weather.js /srv/http/de/homeinfo/javascript/weather.js