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

weather.cardinalPoint = weather.cardinalPoint || {};
weather.cardinalPoint.N1 = new homeinfo.Range(11.25);
weather.cardinalPoint.NNO = new homeinfo.Range(11.25, 33.75);
weather.cardinalPoint.NO = new homeinfo.Range(33.75, 56.25);
weather.cardinalPoint.ONO = new homeinfo.Range(56.25, 78.75);
weather.cardinalPoint.O = new homeinfo.Range(78.75, 101.25);
weather.cardinalPoint.OSO = new homeinfo.Range(101.25, 123.75);
weather.cardinalPoint.SO = new homeinfo.Range(123.75, 146.25);
weather.cardinalPoint.SSO = new homeinfo.Range(146.25, 168.75);
weather.cardinalPoint.S = new homeinfo.Range(168.75, 191.25);
weather.cardinalPoint.SSW = new homeinfo.Range(191.25, 213.75);
weather.cardinalPoint.SW = new homeinfo.Range(213.75, 236.25);
weather.cardinalPoint.WSW = new homeinfo.Range(236.25, 258.75);
weather.cardinalPoint.W = new homeinfo.Range(258.75, 281.25);
weather.cardinalPoint.WNW = new homeinfo.Range(281.25, 303.75);
weather.cardinalPoint.NW = new homeinfo.Range(303.75, 326.25);
weather.cardinalPoint.NNW = new homeinfo.Range(326.25, 348.75);
weather.cardinalPoint.N2 = new homeinfo.Range(348.75, 360.01);  // Compensate for lower <= degrees < upper


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

  this.cardinalPoint = function () {
    if (this.wind != null) {
      if (this.wind.deg != null) {
        if (weather.cardinalPoint.N1.contains(this.wind.deg) ||
            weather.cardinalPoint.N2.contains(this.wind.deg)) {
          return 'N';
        } else if (weather.cardinalPoint.NNO.contains(this.wind.deg)) {
          return 'NNO';
        } else if (weather.cardinalPoint.NO.contains(this.wind.deg)) {
          return 'NO';
        } else if (weather.cardinalPoint.ONO.contains(this.wind.deg)) {
          return 'ONO';
        } else if (weather.cardinalPoint.O.contains(this.wind.deg)) {
          return 'O';
        } else if (weather.cardinalPoint.OSO.contains(this.wind.deg)) {
          return 'OSO';
        } else if (weather.cardinalPoint.SO.contains(this.wind.deg)) {
          return 'SO';
        } else if (weather.cardinalPoint.SSO.contains(this.wind.deg)) {
          return 'SSO';
        } else if (weather.cardinalPoint.S.contains(this.wind.deg)) {
          return 'S';
        } else if (weather.cardinalPoint.SSW.contains(this.wind.deg)) {
          return 'SSW';
        } else if (weather.cardinalPoint.SW.contains(this.wind.deg)) {
          return 'SW';
        } else if (weather.cardinalPoint.WSW.contains(this.wind.deg)) {
          return 'WSW';
        } else if (weather.cardinalPoint.W.contains(this.wind.deg)) {
          return 'W';
        } else if (weather.cardinalPoint.WNW.contains(this.wind.deg) {
          return 'WNW';
        } else if (weather.cardinalPoint.NW.contains(this.wind.deg)) {
          return 'NW';
        } else if (weather.cardinalPoint.NNW.contains(this.wind.deg)) {
          return 'NNW';
        } else {
          throw 'Invalid degrees: ' + degrees + '.';
        }
      }
    }

    return 'N/A';
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

    if (mapping.wind != null) {
      if (mapping.wind.deg != null) {
        mapping.wind.deg.html(this.wind.deg);
      }

      if (mapping.wind.speed != null) {
        mapping.wind.speed.html(this.wind.speed);
      }
    }

    if (mapping.weather != null) {
      if (mapping.weather.description != null) {
        mapping.weather.description.html(this.weather.description);
      }

      if (mapping.weather.main != null) {
        mapping.weather.main.html(this.weather.main);
      }

      if (mapping.weather.icon != null) {
        mapping.weather.icon.html(this.weather.icon);
      }

      if (mapping.weather.id != null) {
        mapping.weather.id.html(this.weather.id);
      }
    }

    if (mapping.main != null) {
      if (mapping.main.pressure != null) {
        mapping.main.pressure.html(this.main.pressure);
      }

      if (mapping.main.humidity != null) {
        mapping.main.humidity.html(this.main.humidity);
      }

      if (mapping.main.temp_min != null) {
        mapping.main.temp_min.html(this.main.temp_min);
      }

      if (mapping.main.temp_max != null) {
        mapping.main.temp_max.html(this.main.temp_max);
      }

      if (mapping.main.sea_level != null) {
        mapping.main.sea_level.html(this.main.sea_level);
      }

      if (mapping.main.temp != null) {
        mapping.main.temp.html(this.main.temp);
      }

      if (mapping.main.grnd_level != null) {
        mapping.main.grnd_level.html(this.main.grnd_level);
      }
    }
  }
}
