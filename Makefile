.PHONY: pull homeinfo trias weather

default: | pull install

pull:
	@ git pull

install: | homeinfo trias weather

homeinfo:
	@ install -m 644 homeinfo.js /srv/http/de/homeinfo/jslibs/homeinfo.js

trias:
	@ install -m 644 trias.js /srv/http/de/homeinfo/jslibs/trias.js

weather:
	@ install -m 644 weather.js /srv/http/de/homeinfo/jslibs/weather.js
