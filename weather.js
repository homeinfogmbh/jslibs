/*
  weather.js - JavaScript library for OpenWeatherMap parsing

  (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

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
    * homeinfo.js
    * jquery.js
    * moment.js
    * sweetalert.js
*/
'use strict';

var weather = weather || {};

/* Logger. */
weather.logger = new homeinfo.logging.Logger('weather');

/* Cardinal points. */
weather.cardinalPoint = weather.cardinalPoint || {};
weather.cardinalPoint.N1 = new homeinfo.Range(11.25);
weather.cardinalPoint.NNE = new homeinfo.Range(11.25, 33.75);
weather.cardinalPoint.NE = new homeinfo.Range(33.75, 56.25);
weather.cardinalPoint.ENE = new homeinfo.Range(56.25, 78.75);
weather.cardinalPoint.E = new homeinfo.Range(78.75, 101.25);
weather.cardinalPoint.ESE = new homeinfo.Range(101.25, 123.75);
weather.cardinalPoint.SE = new homeinfo.Range(123.75, 146.25);
weather.cardinalPoint.SSE = new homeinfo.Range(146.25, 168.75);
weather.cardinalPoint.S = new homeinfo.Range(168.75, 191.25);
weather.cardinalPoint.SSW = new homeinfo.Range(191.25, 213.75);
weather.cardinalPoint.SW = new homeinfo.Range(213.75, 236.25);
weather.cardinalPoint.WSW = new homeinfo.Range(236.25, 258.75);
weather.cardinalPoint.W = new homeinfo.Range(258.75, 281.25);
weather.cardinalPoint.WNW = new homeinfo.Range(281.25, 303.75);
weather.cardinalPoint.NW = new homeinfo.Range(303.75, 326.25);
weather.cardinalPoint.NNW = new homeinfo.Range(326.25, 348.75);
weather.cardinalPoint.N2 = new homeinfo.Range(348.75, 360, true);


/*
  Get relative date from today's perspective.
*/
weather.realativeDate = function (date) {
    var now = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    if (now.toDateString() == date.toDateString()) {
        return 'Heute';
    } else if (tomorrow.toDateString() == date.toDateString()) {
        return 'Morgen';
    } else if (dayAfterTomorrow.toDateString() == date.toDateString()) {
        return 'Übermorgen';
    }
};


weather.iconURL = function (icon) {
    var baseURL = 'icons/';
    var suffix = '.png';
    return baseURL + icon + suffix;
};


/*
  Weather API client.
*/
weather.Client = function (city, maxForecasts) {
    this.city = city;

    if (maxForecasts == null) {
        this.maxForecasts = 3;
    } else {
        this.maxForecasts = maxForecasts;
    }

    this.retrieve = function () {
        return jQuery.ajax({url: 'https://ferengi.homeinfo.de/weather/' + self.city});
    };
};


/*
  Weather forecast wrapper.
*/
weather.Forecast = function (weather) {
    for (var prop in weather) {
        if (weather.hasOwnProperty(prop)) {
            this[prop] = weather[prop];
        }
    }

    this.dateTime = function () {
        return new Date(this.dt);
    };

    this.cardinalPoint = function () {
        if (this.wind != null) {
            if (this.wind.deg != null) {
                if (weather.cardinalPoint.N1.contains(this.wind.deg) ||
                    weather.cardinalPoint.N2.contains(this.wind.deg)) {
                    return 'N';
                } else if (weather.cardinalPoint.NNE.contains(this.wind.deg)) {
                    return 'NNO';
                } else if (weather.cardinalPoint.NE.contains(this.wind.deg)) {
                    return 'NO';
                } else if (weather.cardinalPoint.ENE.contains(this.wind.deg)) {
                    return 'ONO';
                } else if (weather.cardinalPoint.E.contains(this.wind.deg)) {
                    return 'O';
                } else if (weather.cardinalPoint.ESE.contains(this.wind.deg)) {
                    return 'OSO';
                } else if (weather.cardinalPoint.SE.contains(this.wind.deg)) {
                    return 'SO';
                } else if (weather.cardinalPoint.SSE.contains(this.wind.deg)) {
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
                } else if (weather.cardinalPoint.WNW.contains(this.wind.deg)) {
                    return 'WNW';
                } else if (weather.cardinalPoint.NW.contains(this.wind.deg)) {
                    return 'NW';
                } else if (weather.cardinalPoint.NNW.contains(this.wind.deg)) {
                    return 'NNW';
                } else {
                    throw 'Invalid degrees: ' + this.wind.deg + '.';
                }
            }
        }

        return 'N/A';
    };

    this.title = function () {
        var dateTime = this.dateTime();
        var prefix = weather.realativeDate(dateTime);

        if (prefix != null) {
            return prefix + ' ' + dateTime.toLocaleString();
        } else {
            return dateTime.toLocaleString();
        }
    };

    /*
        Translates OpenWeatherMap icon codes
        to HOMEINFO weather icon codes.
    */
    this.translateIcon = function (icon) {
        if (icon == '01d' || icon == '01n') {
            return 22;
        } else if (icon == '02d' || icon == '02n') {
            return 0;
        } else if (icon == '03d' || icon == '03n') {
            return 12;
        } else if (icon == '04d' || icon == '04n') {
            return 9;
        } else if (icon == '09d' || icon == '09n') {
            return 21;
        } else if (icon == '10d' || icon == '10n') {
            return 2;
        } else if (icon == '11d' || icon == '11n') {
            return 1;
        } else if (icon == '13d' || icon == '13n') {
            return 10;
        } else if (icon == '50d' || icon == '50n') {
            return 19;
        }
    };

    this.icon = function () {
        if (this.weather != null) {
            var weather = this.weather[0];

            if (weather != null) {
                if (weather.icon != null) {
                    return this.translateIcon(weather.icon);
                }
            }
        }
    };

    /*
        Renders the weather data according to the mapping.
    */
    this.render = function (mapping) {
        if (mapping.title != null) {
            mapping.title.html(this.title());
        }

        if (mapping.icon != null) {
            var icon = this.icon();

            if (icon != null) {
                mapping.icon.attr('src', weather.iconURL(icon));
            } else {
                mapping.icon.attr('src', weather.iconURL('dummy'));
            }
        }

        if (mapping.type != null) {
            if (this.weather != null) {
                var weather = this.weather[0];

                if (weather != null) {
                    if (weather.description != null) {
                        mapping.type.html(weather.description);
                    }
                }
            }
        }

        if (mapping.temperature != null) {
            if (this.main != null) {
                if (this.main.temp_min != null && this.main.temp_max != null) {
                    mapping.temperature.html(this.main.temp_min + ' / ' + this.main.temp_max + ' °C');
                }
            }
        }
    };
};


/*
  Day forecast group.
*/
weather.DayForecast = function (forecasts) {
    this.forecasts = forecasts

    this.maxTemp = function () {
        var tempMax = -Infinity;

        for (var i = 0; i < this.forecasts.length; i++) {
            var forecast = this.forecasts[i];

            if (forecast.main != null) {
                if (forecast.main.temp_max != null) {
                    if (forecast.main.temp_max > tempMax) {
                        tempMax = forecast.main.temp_max;
                    }
                }
            }
        }

        return tempMax;
    };

    this.minTemp = function () {
        var tempMin = Infinity;

        for (var i = 0; i < this.forecasts.length; i++) {
            var forecast = this.forecasts[i];

            if (forecast.main != null) {
                if (forecast.main.temp_min != null) {
                    if (forecast.main.temp_min < tempMin) {
                        tempMin = forecast.main.temp_min;
                    }
                }
            }
        }

        return tempMin;
    };

    this.forecast = function (index) {
        if (index == null) {
            index = 0;
        }

        var forecast = this.forecasts[index];

        if (forecast == null) {
            swal({
                title: 'Fehler!',
                text: 'Konnte keine Wetterdaten finden.',
                type: 'error'
            });
        }

        return forecast;
    };

    this.dateTime = function () {
        return this.forecast().dateTime();
    };

    this.title = function () {
        var dateTime = this.dateTime();
        var localeDate = moment(dateTime).format('LL');
        var prefix = weather.realativeDate(dateTime);

        if (prefix != null) {
            return prefix + ' ' + localeDate;
        } else {
            return localeDate;
        }
    };

    this.icon = function () {
        return this.forecast().icon();
    };

    this.weather = function (index, forecastIndex) {
        if (index == null) {
            index = 0;
        }

        var weather = this.forecast(forecastIndex).weather[index];

        if (weather == null) {
            swal({
                title: 'Fehler!',
                text: 'Konnte keine Wetterdaten finden.',
                type: 'error'
            });
        }

        return weather;
    };

    this.type = function () {
        var weather_ = this.weather();

        if (weather_ != null) {
            if (weather_.description != null) {
                return weather_.description;
            }
        }

        return null;
    };

    this.temperature = function () {
        return Math.round(this.maxTemp()) + ' / ' + Math.round(this.minTemp()) + ' °C';
    };

    this.render = function () {
        return weather.dom.weatherContainer(
            weather.dom.weatherRow(
                weather.dom.weatherChart(
                    weather.dom.weatherDataContainer(
                        weather.dom.title(this.title()),
                        weather.dom.iconContainer(
                            weather.dom.icon(weather.iconURL(this.icon())),
                            weather.dom.type(this.type())
                        ),
                        weather.dom.temperature(this.temperature())
                    )
                )
            )
        );
    };
};


/*
  DOM models for element rendering
*/
weather.dom = weather.dom || {};

weather.dom.temperature = function (temperature) {
    var element = document.createElement('div');
    element.setAttribute('id', 'temperature');
    element.setAttribute('class', 'row row-centered temperature');
    element.innerHTML = temperature;
    return element;
};

weather.dom.type = function (type) {
    var element = document.createElement('div');
    element.setAttribute('id', 'type');
    element.setAttribute('class', 'type');
    element.innerHTML = type;
    return element;
};

weather.dom.icon = function (src) {
    var element = document.createElement('img');
    element.setAttribute('id', 'icon');
    element.setAttribute('class', 'icon');
    element.setAttribute('src', src || 'icons/0.png');
    return element;
};

weather.dom.iconContainer = function (icon, type) {
    var element = document.createElement('div');
    element.setAttribute('id', 'iconContainer');
    element.setAttribute('class', 'row row-centered iconContainer');
    element.appendChild(icon);
    element.appendChild(type);
    return element;
};

weather.dom.title = function (title) {
    var element = document.createElement('div');
    element.setAttribute('id', 'title');
    element.setAttribute('class', 'row row-centered title');
    element.innerHTML = title;
    return element;
};

weather.dom.weatherDataContainer = function (title, iconContainer, temperature) {
    var element = document.createElement('div');
    element.setAttribute('class', 'col col-md-12 weatherDataContainer');
    element.appendChild(title);
    element.appendChild(document.createElement('hr'));
    element.appendChild(iconContainer);
    element.appendChild(document.createElement('hr'));
    element.appendChild(temperature);
    return element;
};

weather.dom.weatherChart = function (weatherDataContainer) {
    var element = document.createElement('div');
    element.setAttribute('class', 'col col-md-12 weatherChart');
    element.appendChild(weatherDataContainer);
    return element;
};

weather.dom.weatherRow = function (weatherChart) {
    var element = document.createElement('div');
    element.setAttribute('class', 'row row-centered');
    element.appendChild(weatherChart);
    return element;
};

weather.dom.weatherContainer = function (weatherRow) {
    var element = document.createElement('div');
    element.setAttribute('class', 'col col-md-4 container');
    element.appendChild(weatherRow);
    return element;
};