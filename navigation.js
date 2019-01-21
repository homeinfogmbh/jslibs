/*
  navigation.js - URL hash based navigation library

  (C) 2015-2017 HOMEINFO - Digitale Informationssysteme GmbH

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

  Requires:
        * jQuery.
*/
'use strict';

var navigation = navigation || {};

/* eslint-enable classes */


/*
    Class to represent a single site.
*/
navigation.Site = class {
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
};


/*
    Class to represent a set of sites.
*/
navigation.Sites = class {
    constructor(sites, defaultHash) {
        this.sites = sites;
        this.defaultHash = defaultHash || '#startseite';
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
    getSite(hash) {
        for (let site of this.sites) {
            if (site.hash == hash) {
                return site;
            }
        }
    }

    /*
        Loads the respective site from the current window's hash.
    */
    load(targetElement) {
        const site = this.current;

        if (site != null) {
            document.title = site.title;
            targetElement.load(site.url);
        } else {
            swal('Fehler!', 'Konnte Seite "' + this.hash + '" nicht laden.', 'error');
        }
    }

    /*
        Binds loading of sites into the respective
        target element on the window.hashchange event.
    */
    bind(targetElement) {
        jQuery(window).on('hashchange', this.load.bind(this, targetElement));
    }
};
