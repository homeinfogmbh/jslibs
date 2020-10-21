/*
  caching.js - HOMEINFO local storage caching library.

  (C) 2020 HOMEINFO - Digitale Informationssysteme GmbH

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this library.  If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>
*/
'use strict';

import { WARNING, Logger } from './logging.js';


/*
    Updates the respective cache.
*/
function update (cache) {
    return function (value) {
        const now = new Date();
        const json = {'timestamp': now.toString(), 'value': value};
        cache.set(json);
        return json;
    };
}


/*
    Class to store JSON data in local storage.
*/
export class JSONStorage {
    constructor (key) {
        this.key = key;
    }

    get () {
        const raw = localStorage.getItem(this.key);

        if (raw == null)
            return null;

        return JSON.parse(raw);
    }

    set (value) {
        localStorage.setItem(this.key, JSON.stringify(value));
    }

    clear () {
        return localStorage.removeItem(this.key);
    }
}


/*
    JSON data cache.
*/
export class Cache extends JSONStorage {
    constructor (key, refreshFunction, lifetime = 3600000, logLevel = WARNING) {
        super(key);
        this.refreshFunction = refreshFunction;
        this.lifetime = lifetime;
        this.logger = new Logger('cache "' + this.key + '"', logLevel);
    }

    get value () {
        return this.getValue();
    }

    get timestamp () {
        return this.getTimestamp();
    }

    refresh () {
        return this.refreshFunction().then(update(this));
    }

    get (force = false) {
        if (force) {
            this.logger.info('Forcing refresh.');
            return this.refresh();
        }

        const json = super.get();

        if (json == null) {
            this.logger.info('Empty cache.');
            return this.refresh();
        }

        const timestamp = Date.parse(json['timestamp']);
        const now = new Date();

        if ((now - timestamp) > this.lifetime) {
            this.logger.info('Cache miss.');
            return this.refresh();
        }

        return Promise.resolve(json);
    }

    getValue (force = false) {
        return this.get(force).then(json => json['value']);
    }

    getTimestamp (force = false) {
        return this.get(force).then(json => json['timestamp']);
    }
}
