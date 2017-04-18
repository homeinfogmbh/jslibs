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
  Degrees to cardinal point
*/
weather.deg2cp = function (degrees) {
  var N = new homeinfo.Range(348.75, 11.25);
  var NNO = new homeinfo.Range(11.25, 33.75);
  var NO = new homeinfo.Range(33.75, 56.25);
  var ONO = new homeinfo.Range(56.25, 78.75);
  var O = new homeinfo.Range(78.75, 101.25);
  var OSO = new homeinfo.Range(101.25, 123.75);
  var SO = new homeinfo.Range(123.75, 146.25);
  var SSO = new homeinfo.Range(146.25, 168.75);
  var S = new homeinfo.Range(168.75, 191.25);
  var SSW = new homeinfo.Range(191.25, 213.75);
  var SW = new homeinfo.Range(213.75, 236.25);
  var WSW = new homeinfo.Range(236.25, 258.75);
  var W = new homeinfo.Range(258.75, 281.25);
  var WNW = new homeinfo.Range(281.25, 303.75);
  var NW = new homeinfo.Range(303.75, 326.25);
  var NNW = new homeinfo.Range(326.25, 348.75);

  if N.contains(degrees) {
    return 'N';
  } else if NNO.contains(degrees) {
    return 'NNO';
  } else if NO.contains(degrees) {
    return 'NO';
  } else if ONO.contains(degrees) {
    return 'ONO';
  } else if O.contains(degrees) {
    return 'O';
  } else if OSO.contains(degrees) {
    return 'OSO';
  } else if SO.contains(degrees) {
    return 'SO';
  } else if SSO.contains(degrees) {
    return 'SSO';
  } else if S.contains(degrees) {
    return 'S';
  } else if SSW.contains(degrees) {
    return 'SSW';
  } else if SW.contains(degrees) {
    return 'SW';
  } else if WSW.contains(degrees) {
    return 'WSW';
  } else if W.contains(degrees) {
    return 'W';
  } else if WNW.contains(degrees) {
    return 'WNW';
  } else if NW.contains(degrees) {
    return 'NW';
  } else if NNW.contains(degrees) {
    return 'NNW';
  } else {
    throw 'Invalid degrees: ' + degrees + '.';
  }
}

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

    if (mapping.clouds != null) {
      mapping.clouds.html(this.clouds.all);
    }

    if (mapping.clouds != null) {
      mapping.clouds.html(this.clouds.all);
    }

    if (mapping.wind != null) {
      if (mapping.wind.deg != null) {
        mapping.wind.deg.html(this.wind.deg);
      }

      if (mapping.wind.speed != null) {
        mapping.wind.speed.html(this.wind.speed);
      }
    }
  }
}
