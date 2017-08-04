.PHONY: pull homeinfo trias weather navigation

default: | pull install

pull:
	@ git pull

install: | homeinfo trias weather navigation

homeinfo:
	@ install -vm 644 homeinfo.js /srv/http/de/homeinfo/javascript/homeinfo.js

trias:
	@ install -vm 644 trias.js /srv/http/de/homeinfo/javascript/trias.js

weather:
	@ install -vm 644 weather.js /srv/http/de/homeinfo/javascript/weather.js

navigation:
	@ install -vm 644 navigation.js /srv/http/de/homeinfo/javascript/navigation.js
