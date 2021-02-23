/*
  caching.js - HOMEINFO local storage caching library.

  (C) 2020-2021 HOMEINFO - Digitale Informationssysteme GmbH

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


const CACHE_LIFETIME = 60 * 60 * 1000;  // One hour in milliseconds.


/*
    Updates the respective cache.
*/
function update (cache) {
    return value => {
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

    set (value) {
        localStorage.setItem(this.key, JSON.stringify(value));
    }

    get () {
        const raw = localStorage.getItem(this.key);

        if (raw == null)
            return null;

        return JSON.parse(raw);
    }

    clear () {
        return localStorage.removeItem(this.key);
    }
}


/*
    JSON data cache.
*/
export class Cache extends JSONStorage {
    constructor (key, refreshFunction, lifetime = CACHE_LIFETIME) {
        super(key);
        this.refreshFunction = refreshFunction;
        this.lifetime = lifetime;
    }

    refresh () {
        return this.refreshFunction().then(update(this));
    }

    /*
        Loads the value from the cache and returns
        a promise resolving to the cached value.
    */
    load (force = false) {
        if (force)
            return this.refresh();

        const json = super.get();

        if (json == null)   // Cache miss.
            return this.refresh();

        const timestamp = Date.parse(json['timestamp']);
        const now = new Date();

        if ((now - timestamp) > this.lifetime)  // Cache timeout.
            return this.refresh();

        return Promise.resolve(json);
    }

    /*
        Returns a promise resolving to the cached value.
    */
    get (force = false) {
        return this.load(force).then(json => json['value']);
    }
}
