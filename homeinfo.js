/*
  HOMEINFO general-purpose Javascript library

  (C) 2015 HOMEINFO - Digitale Informationssysteme GmbH

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

/* Initialize namespace */
var homeinfo = homeinfo || {};


/* General stuff */

// Check if element exists and return boolean
homeinfo.isNull = function(element) {
  if (element === undefined || element === null) {
    return true;
  } else {
    return false;
  }
}


/* String library */
homeinfo.str = homeinfo.str || {};


homeinfo.str.NEW_LINE = new RegExp('\r?\n','g');
homeinfo.str.EMAIL = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;


// Capitalize First Letter
homeinfo.str.capitalizeFirstLetter = function(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};


// Validates email addresses
homeinfo.str.isEmail = function(s) {
  return homeinfo.str.EMAIL.test(s);
};


// Fix for American-style -> German-style float interpunctuation
homeinfo.str.dot2comma = function(s) {
  return s.replace(".", ",");
};


// Fix for German-style -> American-style float interpunctuation
homeinfo.str.comma2dot = function(s) {
  return s.replace(",", ".");
};


// Padds a zero to a digit string if it has exactly one zero after the comma
homeinfo.str.padd0 = function(s) {
  if (s.substr(s.indexOf(",") + 1).length == 1) {
    return s + "0";
  } else {
    return s;
  }
};


// Capitalizes a string
homeinfo.str.capitalize = function(s) {
  return s.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  })
};


// Removes the string after the first occurence of character
homeinfo.str.terminate = function(s, character) {
  return s.substring(0, s.indexOf(character));
};


// Converts umlaut descriptions to actual umlauts
homeinfo.str.umlauts = function(s) {
  return s.replace(/Ae/g, "Ä").replace(/Oe/g, "Ö").replace(/Ue/g, "Ü")
    .replace(/ae/g, "ä").replace(/oe/g, "ö").replace(/ue/g, "ü");
};


// Strips leading zeros from number-like strings
homeinfo.str.strplz = function(s) {
  var i = 0;

  for (i; i < this.length; i++) {
    if (s[i] != "0") {
      break;
    }
  }

  return s.substr(i);
};


// Replace line feed for HTML
homeinfo.str.lf2html = function(s) {
  return s.replace(homeinfo.str.NEW_LINE, "<br />");
};


/* Numbers library */

homeinfo.num = homeinfo.num || {};


// Determines whether a number is even
homeinfo.num.isEven = function(num) {
  return true ? num % 2 == 0 : false;
}


// Determines whether a number is odd
homeinfo.num.isOdd = function(num) {
  return ! homeinfo.num.isEven(num)
}


/* Array library */

homeinfo.arr = homeinfo.arr || {};

// Groups an iterable and counts occurences
homeinfo.arr.group = function(a) {
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


/* DOM elements */

homeinfo.dom = homeinfo.dom || {};

// Gets DOM elements by a name
homeinfo.dom.getElements = function(d, element_name) {
  var elements = d.getElementsByTagName(element_name);

  if (elements.length > 0) {
    return elements;
  } else {
    return [];
  }
};


// Gets a DOM element by its name
homeinfo.dom.getElement = function(d, element_name) {
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
};


// Gets value of a DOM element by its name
homeinfo.dom.getElementValue = function(d, element_name) {
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
};


/* Logging facility */

homeinfo.log = homeinfo.log || {};
homeinfo.log.level = 1;
homeinfo.log.name = 'homeinfo';


homeinfo.log.log = function(prefix, msg) {
  console.log(prefix + ' ' + homeinfo.log.name + ': ' + msg);
}


homeinfo.log.error = function(msg) {
  if (homeinfo.log.level >= 0) {
    homeinfo.log('[ fail ]', msg);
  }
}


homeinfo.log.warning = function(msg) {
  if (homeinfo.log.level >= 1) {
    homeinfo.log('[ warn ]', msg);
  }
}


homeinfo.log.info = function(msg) {
  if (homeinfo.log.level >= 3) {
    homeinfo.log('[ info ]', msg);
  }
}


homeinfo.log.success = function(msg) {
  if (homeinfo.log.level >= 4) {
    homeinfo.log('[  ok  ]', msg);
  }
}


homeinfo.log.debug = function(msg) {
  if (homeinfo.log.level >= 5) {
    homeinfo.log('!<DEBUG>', msg);
  }
}
