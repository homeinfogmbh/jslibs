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


    Change log:
    
    03.05.2015: Richard Neumann <r.neumann@homeinfo.de>
    *   Implemented this library
*/


/****************************
 *  General-purpose methods *
 ****************************/
 
// Gets text content of an object, preferring the
// textContent attribute over innerText attribute
function getText(obj) {
    return obj.textContent ? obj.textContent : obj.innerText;
}


// Groups an iterable and counts occurances
function group(iterable) {
    var result = {};

    for (var i = 0; i < iterable.length; i++) {
        var match = false;
        for (var key in result) {
            if (key == iterable[i]) {
                result[key] = result[key] + 1;
                match = true;
                break;
            }
        }
        if (match == false) {
            result[iterable[i]] = 1;
        }
    }
    return result;
}


// Strips leading zeros from number-like strings
function strplz(str) {
 var i = 0;
 for (i; i < str.length; i++) {
     if (str[i] != "0") {
         break;
     }
 }
 return str.substr(i);
}


/****************************
 *  Prototype extensions    *
 ****************************/
 
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
        if (elements[0] != null) {
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
    if (element != null) {
        if (element.firstChild != null) {
            return element.firstChild.nodeValue;
        } else {
            return null;
        }
    } else {
        return null;
    }
};


// Removes an item from an array
Array.prototype["remove"] = function(item) {
    var index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
};


// Fix for American-style -> German-style float interpunctuation
String.prototype["dot2comma"] = function () {
    return this.replace(".", ",");
};


// Padds a zero to a digit string iff it has exactly one zero after the comma
String.prototype["padd0"] = function () {
    var afterComma = this.substr(this.indexOf(",") + 1);
    var char_length = afterComma.length;
    if (char_length == 1) {
        return this + "0";
    } else {
        return this;
    }
};


// Capitalizes a string
String.prototype["capitalize"] = function () {
    if (this != "" || this != 'undefined') {
        return this.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase()
                       + txt.substr(1).toLowerCase();
            });
    } else {
        return this;
    }
};

/*
// Escape some special HTML characters
String.prototype["escapeHtml"] = function () {
    // DOMPurify to sanitize HTML and prevents XSS attacks
    return this.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}*/


// Remove evrything after the specified character
String.prototype["terminate"] = function (character) {
    return this.substring(0, this.indexOf(character));
};


// Convert umlaut descriptions to actual umlauts
String.prototype["umlauts"] = function () {
    var res = "";
    var current = null;
    var current_uc = null;
    var last = null;
    for (var i = 0; i < this.length; i++) {
        current = this.charAt(i);
        current_uc = current.toUpperCase();
        if (last == null) {
            if (current_uc == "A" || current_uc == "O" || current_uc == "U") {
                res = res.concat(last);
            	last = current;
            } else {
                res = res.concat(current);
            }
        } else if (current_uc == "E") {            
        	last = current;
            if (last.toUpperCase == last) {
                if (last == "A") {
                    res = res.concat("Ä");
                } else if (last == "O") {
                    res = res.concat("Ö");                    
                } else if (last == "U") {
                	res = res.concat("Ü");
                }
            } else {
				if (last == "a") {
				    res = res.concat("ä");
				} else if (last == "o") {
				    res = res.concat("ö");				    
				} else if (last == "u") {
					res = res.concat("ü");
				}
			}
        } else {
            res = res.concat(last);
            last = null;
        }
    }
    return res;
}


// Determines whether a number is odd
Number.prototype["isOdd"] = function () {
    return false ? this % 2 == 0 : true;
}

