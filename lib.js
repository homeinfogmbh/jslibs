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


    XXX: Development notice:

    1)  Four spaces per indentation level - no hard tabs
    2)  Let the code breathe - spaces around if/else blocks and while loops
    3)  Avoid line length > 79 characters
    4)  Comment methods. Describe what they do. Do not state the obvious.
    5)  Prefer prototype extenstions over global functions.
    6)  If you comment out stuff, say why.
    7)  State your changes to this repository in the Git commit message.
*/


/**********************
 *  Global constants  *
 **********************/
var NEW_LINE = new RegExp('\r?\n','g');


/****************************
 *  Prototype extensions    *
 ****************************/

/*** Numbers ***/

// Determines whether a number is odd
Number.prototype["isOdd"] = function () {
    if (this % 2 == 0) {
        return false;
    } else {
        return true;
    }
};


/*** Strings ***/

// Capitalize First Letter
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


// Validates email addresses
String.prototype.isEmail = function() {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return true ? emailReg.test(this) : false;
};


// Fix for American-style -> German-style float interpunctuation
String.prototype["dot2comma"] = function () {
    return this.replace(".", ",");
};


// Fix for German-style -> American-style float interpunctuation
String.prototype["comma2dot"] = function () {
    return this.replace(",", ".");
};


// Padds a zero to a digit string if it has exactly one zero after the comma
String.prototype["padd0"] = function () {
    if (this.substr(this.indexOf(",") + 1).length == 1) {
        return this + "0";
    } else {
        return this;
    }
};


// Capitalizes a string
String.prototype["capitalize"] = function () {
    if (this != "" || this != 'undefined') {
        return this.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    } else {
        return this;
    }
};


// Remove evrything after the specified character
String.prototype["terminate"] = function (character) {
    return this.substring(0, this.indexOf(character));
};


// Convert umlaut descriptions to actual umlauts
String.prototype["umlauts"] = function () {
    return this.replace("Ae", "Ä").replace("Oe", "Ö").replace("Ue", "Ü")
        .replace("ae", "ä").replace("oe", "ö").replace("ue", "ü");
};


// Strips leading zeros from number-like strings
String.prototype["strplz"] = function () {
    var i = 0;

    for (i; i < this.length; i++) {
        if (this[i] != "0") {
            break;
        }
    }

    return this.substr(i);
};


// Replace line feed for HTML
String.prototype["lf2html"] = function () {
    return this.replace(NEW_LINE, "<br />");
};


/*** Arrays ***/

// Remove from array
Array.prototype.remove_from_array = function() {
    var what, a = arguments, L = a.length, ax;

    while (L && this.length) {
        what = a[--L];

        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }

    return this;
};


// Removes an item from an array
Array.prototype["remove"] = function(item) {
    var index = this.indexOf(item);

    if (index > -1) {
        this.splice(index, 1);
    }

    return this;
};


// Groups an iterable and counts occurences
Array.prototype["group"] = function () {
    var result = {};

    for (var i = 0; i < this.length; i++) {
        var match = false;

        for (var key in result) {
            if (key == this[i]) {
                result[key] = result[key] + 1;
                match = true;
                break;
            }
        }

        if (match == false) {
            result[this[i]] = 1;
        }
    }

    return result;
};


/*** DOM elements ***/

// Gets DOM elements by a name
Element.prototype.getElements = function (element_name) {
    var elements = this.getElementsByTagName(element_name);

    if (elements.length > 0) {
        return elements;
    } else {
        return [];
    }
};


// Gets a DOM element by its name
Element.prototype.getElement = function (element_name) {
    var elements = this.getElements(element_name);

    if (elements.length > 0) {
        if (elements[0] !== null) {
            return elements[0];
        } else {
            return null;
        }
    } else {
        return null;
    }
};


// Gets value of a DOM element by its name
Element.prototype.getElementValue = function (element_name) {
    var element = this.getElement(element_name);

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


/**********************
 *  Global functions  *
 *      (legacy)      *
 **********************/

// Gets text content of an object, preferring the
// textContent attribute over innerText attribute
function getText(obj) {
    return obj.textContent ? obj.textContent : obj.innerText;
}


// Validates email addresses
function validateEmail(email) {
    return email.is_email();
}


// Check if element exists and return boolean
function check_if_element_exists_boolean(element) {
    if (typeof(element) == 'undefined' && element == null) {
        return false;  // Element does not exists
    } else {
        return true;  // Element exists
    }
}


// Remove evrything after the dynamic character parameter
function removeAfterCertainCharacter(string, character) {
    return string.substring(0, string.indexOf(character));
}


// Check if value start from 0 and fix it because thatose numbers are address nr.
function checkIfNumberStartsFromZero(object_number) {
    if (object_number.charAt(2) == 0) {//get first 000
        return object_number.substr(3);
    } else if (object_number.charAt(1) == 0) {//get first 00
        return object_number.substr(2);
    } else if (object_number.charAt(0) == 0) {//get first 0
        return object_number.substr(1);
    }
}


// Capitalise function (first char toUpperCase and all the rest toLowerCase)
function capitalise(string) {
    if (typeof string != 'undefined') {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    } else {
        return string;
    }
}


// Check whether the last character of a string is only one 0 (price)
function ifLastCharIsOnlyOneNull(str) {
    var afterComma = str.substr(str.indexOf(",") + 1);
    var char_length = afterComma.length;

    if (char_length == 1) {
        return str + "0";
    } else {
        return str;
    }
}


//replace comma with dot
function replaceCommaWithDot(str) {
    return str.replace(",", ".");
}


// Replace dot with comma
function replaceDotWithComma(value) {
    return value.replace(".", ",");
}


// Trim string to two characters after a comma
function afterCommaKeep2Char(str) {
    var afterCommaKeep2Char = str;
    var valueBeforeComma = str.substr(0, str.indexOf(','));

    // Check if value contains a comma
    if (afterCommaKeep2Char.indexOf(',') > -1) {
        afterCommaKeep2Char = afterCommaKeep2Char.substr(afterCommaKeep2Char.indexOf(",") + 1)
        //return valueBeforeComma + "," + "<sup>" + afterCommaKeep2Char.substr(0, 2) + "</sup>";
        return valueBeforeComma + "," + afterCommaKeep2Char.substr(0, 2);
    } else {
        // Fall back to original string
        return str;
    }
}


// Determines whether a number is odd
function isOdd(num) {
    return num % 2;
}


// Escape potentially unsafe HTML content
function escapeHtml(unsafe) {
    //DOMPurify to sanitize HTML and prevents XSS attacks
    /*
    return DOMPurify.sanitize(unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"));
    */
    return unsafe;
}


function addCommas(n){
  var rx=  /(\d+)(\d{3})/;
  return String(n).replace(/^\d+/, function(w){
      while(rx.test(w)){
          w= w.replace(rx, '$1.$2');
      }
      return w;
  });
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/*********************
 *     Unit test     *
 *********************/

var homeinfo = homeinfo || {};


/*
    Evaluate a candidate against a target result
*/
homeinfo.evaluate = function(candidate, result, target) {
    var testResult = (result === target);
    var prefix = null;
    var suffix = " → " + result;

    if (testResult) {
        prefix = "[  ok  ]";
    } else {
        prefix = "[failed]";
    }

    console.log(prefix + "\t" + candidate + suffix);
    return testResult;
}


/*
    Test extensions and library functions defined here
*/
homeinfo.testUnits = function() {
    // TODO: implement fully
    var candidates = null;

    // Test number prototype extensions
    console.log("### Testing Number.prototype extensions ###");
    console.log("* Number.isOdd()");

    var oddNumbers = [
        [41, true],
        [1337, true],
        [-17, true],
        [8008, false],
        [-12134234, false],
        [0, false],
        [42.322, true],
        [8008.13, true],
        [8001.15, true],
        [13127301.222, true]
    ];

    for (var i=0; i<oddNumbers.length; i++) {
        var candidate = oddNumbers[i][0];
        var target = oddNumbers[i][1];
        homeinfo.evaluate(candidate, candidate.isOdd(), target);
    }

    // Test string prototype extensions
    console.log("### Testing String.prototype extensions ###");
    console.log("* String.capitalizeFirstLetter()");

    var capitalFirstLetters = [
        ["foo", "Foo"],
        ["Bar", "Bar"],
        ["spAmM", "SpAmM"],
        ["EGGS", "EGGS"]
    ];

    for (var i=0; i<capitalFirstLetters.length; i++) {
        var candidate = capitalFirstLetters[i][0];
        var target = capitalFirstLetters[i][1];
        homeinfo.evaluate(candidate, candidate.capitalizeFirstLetter(), target);
    }
}
