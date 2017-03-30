/*
  trias.js - JavaScript library for the Trias API

  (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>

  Requires:
    * homeinfo.js
    * jquery.js
    * sweetalert.js
*/
"use strict"

var trias = trias || {};

// Logger
trias.logger = new homeinfo.logging.Logger('trias', homeinfo.logging.DEBUG);

// Configuration
trias.config = {};

trias.TriasClient = function (url, requestorRef) {
  this.url = url;
  this.requestorRef = requestorRef;

  this.getLocation = function (locationName, numberOfResults, language) {
    var xml = document.implementation.createDocument('trias', 'Trias');
    xml.writeAttributeString('version', '1.0');
    xml.createElement("ServiceRequest");
    console.log(xml.flush());
  }
}
