/*
  HOMEINFO general-purpose Javascript library

  (C) 2015-2017 HOMEINFO - Digitale Informationssysteme GmbH

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
*/
"use strict";

/* Initialize namespace */
var homeinfo = homeinfo || {};


/* General stuff */

// Check if element exists and return boolean
homeinfo.isNull = function (element) {
  if (element === undefined || element === null) {
    return true;
  } else {
    return false;
  }
}


// Query string class
homeinfo.QueryString = function () {
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i = 0; i < vars.length; i++) {
    var assignment = vars[i].split("=");

    if (this[assignment[0]] == null) {
      this[assignment[0]] = decodeURIComponent(assignment[1]);
    } else if (typeof this[assignment[0]] === "string") {
      this[assignment[0]] = [this[assignment[0]], decodeURIComponent(assignment[1])];
    } else {
      this[assignment[0]].push(decodeURIComponent(assignment[1]));
    }
  }
}


// Generates query args list from
homeinfo.queryArgs = function (options) {
  var args = [];

  for (var option in options) {
    if (options.hasOwnProperty(option)) {
      args.push(option + '=' + options[option]);
    }
  }

  return args;
}


// Genrates a query string from query args list
homeinfo.queryString = function (queryArgs) {
  if (queryArgs.length > 0) {
    return '?' + queryArgs.join('&');
  } else {
    return '';
  }
}


// Range object
homeinfo.Range = function (lowerBoundary, upperBoundary) {
  if (upperBoundary == null) {
    upperBoundary = lowerBoundary;
    lowerBoundary = 0;
  }

  this.lowerBoundary = lowerBoundary;
  this.upperBoundary = upperBoundary;

  this.contains = function (number) {
    return number >= this.lowerBoundary && number < this.upperBoundary;
  }
}


/* String library */
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
  'ö': '&#ouml;',
  'ü': '&#uuml;',
  'Ä': '&#Auml;',
  'Ö': '&#Ouml;',
  'Ü': '&#Uuml;',
  'ß': '&#szlig;'
};


// Determines whether the string is considered empty
homeinfo.str.isEmpty = function (s) {
  return s == null || s.trim() == '';
}


// Capitalize First Letter
homeinfo.str.capitalizeFirstLetter = function (s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}


// Validates email addresses
homeinfo.str.isEmail = function (s) {
  return homeinfo.str.EMAIL.test(s);
}


// Fix for American-style -> German-style float interpunctuation
homeinfo.str.dot2comma = function (s) {
  return s.replace('.', ',');
}


// Fix for German-style -> American-style float interpunctuation
homeinfo.str.comma2dot = function (s) {
  return s.replace(',', '.');
}


// Padds a zero to a digit string if it has exactly one zero after the comma
homeinfo.str.padd0 = function (s) {
  if (s.substr(s.indexOf(',') + 1).length == 1) {
    return s + '0';
  } else {
    return s;
  }
}


// Capitalizes a string
homeinfo.str.capitalize = function (s) {
  return s.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  })
}


// Removes the string after the first occurence of character
homeinfo.str.terminate = function (s, character) {
  return s.substring(0, s.indexOf(character));
}


// Converts umlaut descriptions to actual umlauts
homeinfo.str.umlauts = function (s) {
  return s.replace(/Ae/g, 'Ä').replace(/Oe/g, 'Ö').replace(/Ue/g, 'Ü')
    .replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü');
}


// Strips leading zeros from number-like strings
homeinfo.str.strplz = function (s) {
  var i = 0;

  for (i; i < this.length; i++) {
    if (s[i] != '0') {
      break;
    }
  }

  return s.substr(i);
}


// Replace line feed for HTML
homeinfo.str.lf2html = function (s) {
  return s.replace(homeinfo.str.NEW_LINE, '<br/>');
}


// Escape HTML special characters
homeinfo.str.escapeHtml = function (string) {
  return string.replace(/[&<>"'\/äöüÄÖÜß]/g, function (s) {
    return homeinfo.str.ENTITYMAP[s];
  });
}


/* Numbers library */

homeinfo.num = homeinfo.num || {};

// Determines whether a number is odd
homeinfo.num.isOdd = function (num) {
  return num % 2;
}


// Determines whether a number is even
homeinfo.num.isEven = function (num) {
  return ! homeinfo.num.isOdd(num);
}

// Padds a leading zero
homeinfo.num.padd = function (num) {
  if (num < 10) {
    return '0' + num;
  } else {
    return '' + num;
  }
}


/* Array library */

homeinfo.arr = homeinfo.arr || {};

// Groups an iterable and counts occurences
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
}


/* Date library */

homeinfo.date = homeinfo.date || {};

// Returns time of date like <hh:mm>
homeinfo.date.time = function (date) {
  return homeinfo.num.padd(date.getHours()) + ':' + homeinfo.num.padd(date.getMinutes());
}


/* DOM elements */

homeinfo.dom = homeinfo.dom || {};

// Gets DOM elements by a name
homeinfo.dom.getElements = function (d, element_name) {
  var elements = d.getElementsByTagName(element_name);

  if (elements.length > 0) {
    return elements;
  } else {
    return [];
  }
}


// Gets a DOM element by its name
homeinfo.dom.getElement = function (d, element_name) {
  var elements = d.getElements(element_name);

  if (elements.length > 0) {
    if (elements[0] !== null) {
      return elements[0];
    } else {
      throw 'Element not found: ' + element_name;
    }
  } else {
    throw 'Element not found: ' + element_name;
  }
}


// Gets value of a DOM element by its name
homeinfo.dom.getElementValue = function (d, element_name) {
  var element = d.getElement(element_name);

  if (element !== null) {
    if (element.firstChild !== null) {
      return element.firstChild.nodeValue;
    } else {
      return null;
    }
  } else {
    return null;
  }
}


/* Logging facility */

homeinfo.logging = homeinfo.logging || {};

// Log levels
homeinfo.logging.ERROR = 0;
homeinfo.logging.WARNING = 10;
homeinfo.logging.INFO = 20;
homeinfo.logging.SUCCESS = 30;
homeinfo.logging.DEBUG = 40;

// Logger class
homeinfo.logging.Logger = function (name, level) {
  if (name == null) {
    this.name = 'logger';
  } else {
    this.name = name;
  }

  if (level == null) {
    this.level = homeinfo.logging.WARNING;
  } else {
    this.level = level;
  }

  this.log = function (prefix, msg) {
    console.log(prefix + ' ' + this.name + ': ' + msg);
  }

  this.error = function (msg) {
    if (this.level >= homeinfo.logging.ERROR) {
      this.log('[ fail ]', msg);
    }
  }

  this.warning = function (msg) {
    if (this.level >= homeinfo.logging.WARNING) {
      this.log('[ warn ]', msg);
    }
  }

  this.info = function (msg) {
    if (this.level >= homeinfo.logging.INFO) {
      this.log('[ info ]', msg);
    }
  }

  this.success = function (msg) {
    if (this.level >= homeinfo.logging.SUCCESS) {
      this.log('[  ok  ]', msg);
    }
  }

  this.debug = function (msg) {
    if (this.level >= homeinfo.logging.DEBUG) {
      this.log('[debug!]', msg);
    }
  }
}
