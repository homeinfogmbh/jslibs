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
  if (degrees > 348.75 || degrees <= 11.25) {
    return 'N';
  } else if (degrees > 11.25 && degrees <= 33.75) {
    return 'NNO';
  } else if (degrees > 33.75 && degrees <= 56.25) {
    return 'NO';
  } else if (degrees > 56.25 && degrees <= 78.75) {
    return 'ONO';
  } else if (degrees > 78.75 && degrees <= 101.25) {
    return 'O';
  } else if (degrees > 101.25 && degrees <= 123.75) {
    return 'OSO';
  } else if (degrees > 123.75 && degrees <= 146.25) {
    return 'SO';
  } else if (degrees > 146.25 && degrees <= 168.75) {
    return 'SSO';
  } else if (degrees > 168.75 && degrees <= 191.25) {
    return 'S';
  } else if (degrees > 191.25 && degrees <= 213.75) {
    return 'SSW';
  } else if (degrees > 213.75 && degrees <= 236.25) {
    return 'SW';
  } else if (degrees > 236.25 && degrees <= 258.75) {
    return 'WSW';
  } else if (degrees > 258.75 && degrees <= 281.25) {
    return 'W';
  } else if (degrees > 281.25 && degrees <= 303.75) {
    return 'WNW';
  } else if (degrees > 303.75 && degrees <= 326.25) {
    return 'NW';
  } else if (degrees > 326.25 && degrees <= 348.75) {
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
