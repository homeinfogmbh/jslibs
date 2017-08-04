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
*/
"use strict";

var navigation = navigation || {};


/*
  Class to represent a single site
*/
navigation.Site = class {
  constructor(name, title, url) {
    this.name = name;
    this.title = title;
    this.url =url;
  }

  /*
    Returns the hash for this site
  */
  get hash() {
    return '#' + this.name;
  }

  /*
    Renders the site into the provided target element
  */
  render(targetElement) {
    var self = this;
    $.ajax({
      url: self.url,
      dataType: 'html',
      success: function (html) {
        targetElement.html(html);

        if (self.title != null) {
          window.document.title = self.title;
        }
      },
      error: function () {
        swal('Fehler!', 'Konnte Seite "' + self.name + '" nicht laden.', 'error');
      }
    });
  }
}


/*
  Class to represent a set of sites
*/
navigation.Sites = class {
  constructor(sites, defaultHash) {
    this.sites = sites;
    this.defaultHash = defaultHash || '#startseite';
  }

  /*
    Returns the hash
  */
  get hash() {
    return window.location.hash || this.defaultHash;
  }

  /*
    Returns the current site
  */
  get current() {
    return this.getSite(this.hash);
  }

  /*
    Returns the respective site for the provided hash
  */
  getSite(hash) {
    for (let site of this.sites) {
      if (site.hash == hash) {
        return site;
      }
    }
  }

  /*
    Loads the respective site from the current window's hash
  */
  load() {
    var site = this.current;

    if (site != null) {
      site.render($('#content'));
    } else {
      swal('Fehler!', 'Konnte Seite "' + this.hash + '" nicht laden.', 'error')
    }
  }

  /*
    Binds to the window.hashchange event
  */
  bind() {
    /*
      Put current instance into a variable
      and encapsulate invocation of load()
      into a function, since this will be
      overridden in windows scope.
    */
    var self = this;
    $(window).on('hashchange', function() {
      self.load();
    });
  }
}
