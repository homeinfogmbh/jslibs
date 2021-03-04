/*
  navigation.mjs - URL hash based navigation library

  (C) 2015-2021 HOMEINFO - Digitale Informationssysteme GmbH

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


/*
    Class to represent a single site.
*/
export class Site {
    constructor(name, title, url) {
        this.name = name;
        this.title = title;
        this.url = url;
    }

    /*
        Returns the hash for this site.
    */
    get hash() {
        return '#' + this.name;
    }
}


/*
    Class to represent a set of sites.
*/
export class Sites {
    constructor(sites, defaultHash = '#startseite') {
        this.sites = Array.from(sites);
        this.defaultHash = defaultHash;
    }

    /*
        Returns the hash.
    */
    get hash() {
        return window.location.hash || this.defaultHash;
    }

    /*
        Returns the current site.
    */
    get current() {
        return this.getSite(this.hash);
    }

    /*
        Returns the respective site for the provided hash.
    */
    getSite (hash) {
        for (const site of this.sites) {
            if (site.hash == hash)
                return site;
        }

        return null;
    }

    /*
        Loads the respective site from the current window's hash.
    */
    load (targetElement) {
        const site = this.current;

        if (site == null)
            return alert('Fehler!\nKonnte Seite "' + this.hash + '" nicht laden.');

        document.title = site.title;
        targetElement.load(site.url);   // XXX: Requires jQuery!
    }

    /*
        Binds loading of sites into the respective
        target element on the window.hashchange event.
    */
    bind (targetElement) {
        window.addEventListener('hashchange', this.load.bind(this, targetElement));
    }
}
