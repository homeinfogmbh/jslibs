/*
  weather.js - JavaScript library for the Trias API

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
    * moment.js
*/
"use strict"

var weather = weather || {};


/*
  Weather API client
*/
var weather.Client = function (city, maxForecasts) {
  this.city = city;
  this.maxForecasts = maxForecasts;

  this.retrieve = function (callback) {
    return $.ajax({
      url: 'https://tls.homeinfo.de/ferengi/weather/' + self.city,
      success = callback,
      error = function (jqXHR, textStatus, errorThrown) {
        weather.logger.error(jqXHR);
        weather.logger.debug(textStatus);
        weather.logger.debug(errorThrown);
        callback();
      }
    });
  }
}


/*
  Weather data wrapper
*/
var weather.Weather = function (weather) {
  for (var prop in weather) {
    if (weather.hasOwnProperty(prop)) {
        this[prop] = weather[prop];
    }
  }

  this.dateTime = function () {
    return new Date(this.dt);
  }

  /*
    Renders the weather data accorting to the mapping
  */
  this.render = function (mapping) {
    if (mapping.dt != null) {
      mapping.dt.html(this.dt);
    }

    if (mapping.dt != null) {
      mapping.dt.html(this.dt);
    }
  }
}
