/*
  HOMEINFO general-purpose JavaScript library

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
'use strict';

var homeinfo = homeinfo || {};

homeinfo.isNull = function (element) {
    return  element === undefined || element === null;
};


/*
    Sanitize value.
*/
homeinfo.sanitize = function (value) {
    if (typeof value == 'string') {
        return homeinfo.str.escapeHtml(value);
    } else {
        return value;
    }
};


/*
    Prototype to parse query strings.
*/
homeinfo.QueryString = function () {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
        var assignment = vars[i].split('=');

        if (this[assignment[0]] == null) {
            this[assignment[0]] = decodeURIComponent(assignment[1]);
        } else if (typeof this[assignment[0]] === 'string') {
            this[assignment[0]] = [this[assignment[0]], decodeURIComponent(assignment[1])];
        } else {
            this[assignment[0]].push(decodeURIComponent(assignment[1]));
        }
    }
};


/*
    Generates query args list from a QueryString instance.
*/
homeinfo.queryArgs = function (options) {
    var args = [];

    for (var option in options) {
        if (options.hasOwnProperty(option)) {
            args.push(option + '=' + options[option]);
        }
    }

    return args;
};


/*
    Genrates a query string from query args list.
*/
homeinfo.queryString = function (queryArgs) {
    if (queryArgs.length > 0) {
        return '?' + queryArgs.join('&');
    } else {
        return '';
    }
};


homeinfo.Range = function (lowerBoundary, upperBoundary, includeUpperBoundary) {
    if (upperBoundary == null) {
        this.upperBoundary = lowerBoundary;
        this.lowerBoundary = 0;
    } else {
        this.lowerBoundary = lowerBoundary;
        this.upperBoundary = upperBoundary;
    }

    if (includeUpperBoundary) {
        this.includeUpperBoundary = true;
    } else {
        this.includeUpperBoundary = false;
    }

    this.contains = function (number) {
        if (this.includeUpperBoundary) {
            return number >= this.lowerBoundary && number <= this.upperBoundary;
        } else {
            return number >= this.lowerBoundary && number < this.upperBoundary;
        }
    };
};


/*
    String library.
*/
homeinfo.str = homeinfo.str || {};
homeinfo.str.NEW_LINE = new RegExp('\r?\n','g');
homeinfo.str.EMAIL = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
homeinfo.str.ENTITYMAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    'ä': '&auml;',
    'ö': '&ouml;',
    'ü': '&uuml;',
    'Ä': '&Auml;',
    'Ö': '&Ouml;',
    'Ü': '&Uuml;',
    'ß': '&szlig;'
};


/*
    Determines whether the string is considered empty.
*/
homeinfo.str.isEmpty = function (string) {
    return homeinfo.isNull(string) || string.trim() == '';
};


homeinfo.str.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};


homeinfo.str.isEmail = function (string) {
    return homeinfo.str.EMAIL.test(string);
};


/*
    Fixes American-style -> German-style decimal interpunctuation.
*/
homeinfo.str.dot2comma = function (string) {
    return string.replace('.', ',');
};


/*
    Fixes German-style -> American-style float interpunctuation.
*/
homeinfo.str.comma2dot = function (string) {
    return string.replace(',', '.');
};


/*
    Padds a zero to a digit string if it has exactly one zero after the comma.
*/
homeinfo.str.padd0 = function (string) {
    if (string.substr(string.indexOf(',') + 1).length == 1) {
        return string + '0';
    } else {
        return string;
    }
};


homeinfo.str.capitalize = function (string) {
    return string.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


/*
    Removes the string after the first occurence of the specified character.
*/
homeinfo.str.terminate = function (string, character) {
    return string.substring(0, string.indexOf(character));
};


/*
    Converts umlaut descriptions to actual umlauts.
*/
homeinfo.str.umlauts = function (string) {
    return string.replace(/Ae/g, 'Ä').replace(/Oe/g, 'Ö').replace(/Ue/g, 'Ü')
        .replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü');
};


/*
    Strips leading zeros from number-like strings.
*/
homeinfo.str.strplz = function (string) {
    for (var i = 0; i < this.length; i++) {
        if (string[i] != '0') {
            break;
        }
    }

    return string.substr(i);
};


/*
    Replace line feed for HTML.
*/
homeinfo.str.lf2html = function (string) {
    return string.replace(homeinfo.str.NEW_LINE, '<br/>');
};


/*
    Escapes HTML special characters.
*/
homeinfo.str.escapeHtml = function (string) {
    return string.replace(/[&<>"'\/äöüÄÖÜß]/g, function (string) {
        return homeinfo.str.ENTITYMAP[string];
    });
};


/* Numbers library. */
homeinfo.num = homeinfo.num || {};

homeinfo.num.isOdd = function (num) {
    return num % 2;
};


homeinfo.num.isEven = function (num) {
    return ! homeinfo.num.isOdd(num);
};


homeinfo.num.padd = function (num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return '' + num;
    }
};


/* Array library. */
homeinfo.arr = homeinfo.arr || {};

/*
    Groups an iterable and counts occurences.
*/
homeinfo.arr.group = function (a) {
    var result = {};

    for (var i = 0; i < a.length; i++) {
        var match = false;

        for (var key in result) {
            if (key == a[i]) {
                result[key] = result[key] + 1;
                match = true;
                break;
            }
        }

        if (match == false) {
            result[a[i]] = 1;
        }
    }

    return result;
};


/* Date library. */
homeinfo.date = homeinfo.date || {};

/*
    Returns time of date like <%H:%M>.
*/
homeinfo.date.time = function (date) {
    return homeinfo.num.padd(date.getHours()) + ':' + homeinfo.num.padd(date.getMinutes());
};


/*
    Returns date like <%d.%m.%Y>.
*/
homeinfo.date.date = function (date) {
    var month = date.getMonth() + 1;
    return homeinfo.num.padd(date.getDate())
        + '.' + homeinfo.num.padd(month)
        + '.' + homeinfo.num.padd(date.getFullYear());
};


/* Logging facility. */
homeinfo.logging = homeinfo.logging || {};

// Log levels.
homeinfo.logging.ERROR = 0;
homeinfo.logging.WARNING = 10;
homeinfo.logging.INFO = 20;
homeinfo.logging.SUCCESS = 30;
homeinfo.logging.DEBUG = 40;


/*
    Logger prototype.
*/
homeinfo.logging.Logger = function (name, level) {
    this.name = name || 'logger';
    this.level = level || homeinfo.logging.WARNING;

    this.log = function (prefix, msg) {
        /* eslint-disable no-console */
        console.log(prefix + ' ' + this.name + ': ' + msg);
        /* eslint-enable no-console */
    };

    this.error = function (msg) {
        if (this.level >= homeinfo.logging.ERROR) {
            this.log('[ fail ]', msg);
        }
    };

    this.warning = function (msg) {
        if (this.level >= homeinfo.logging.WARNING) {
            this.log('[ warn ]', msg);
        }
    };

    this.info = function (msg) {
        if (this.level >= homeinfo.logging.INFO) {
            this.log('[ info ]', msg);
        }
    };

    this.success = function (msg) {
        if (this.level >= homeinfo.logging.SUCCESS) {
            this.log('[  ok  ]', msg);
        }
    };

    this.debug = function (msg) {
        if (this.level >= homeinfo.logging.DEBUG) {
            this.log('[debug!]', msg);
        }
    };
};