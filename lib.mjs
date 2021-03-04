/*
  lib.mjs - HOMEINFO general-purpose JavaScript library

  (C) 2020-2021 HOMEINFO - Digitale Informationssysteme GmbH

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


export const NEW_LINE = new RegExp('\r?\n', 'g');
export const EMAIL = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
export const ENTITYMAP = {
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
    Class to start and stop loading animation.
*/
export class Loader {
    constructor (loaderId = 'loader', targetId = 'target') {
        this.loaderId = loaderId;
        this.targetId = targetId;
    }

    /*
        Wraps a promise, starting a loader and
        appending a stop job to the promise.
    */
    static wrap (promise, loaderId = 'loader', targetId = 'target') {
        const loader = new this(loaderId, targetId);

        function stop (value) {
            loader.stop();
            return value;
        }

        loader.start();
        return promise.then(stop);
    }

    get loader () {
        return document.getElementById(this.loaderId);
    }

    get target () {
        return document.getElementById(this.targetId);
    }

    start () {
        this.target.style.display = 'none';
        this.loader.style.display = 'block';
    }

    stop () {
        this.loader.style.display = 'none';
        this.target.style.display = 'block';
    }
}


/*
    Represents a range within boundaries.
*/
export class Range {
    constructor (lowerBoundary, upperBoundary = null, includeUpperBoundary = false) {
        if (upperBoundary == null) {
            this.upperBoundary = lowerBoundary;
            this.lowerBoundary = 0;
        } else {
            this.lowerBoundary = lowerBoundary;
            this.upperBoundary = upperBoundary;
        }

        this.includeUpperBoundary = includeUpperBoundary;
    }

    contains (number) {
        if (this.includeUpperBoundary)
            return number >= this.lowerBoundary && number <= this.upperBoundary;

        return number >= this.lowerBoundary && number < this.upperBoundary;
    }
}


/*
    Decorator to only run on 1st of April.
*/
export function aprilsFool (func) {
    return (...args) => {
        const now = new Date();

        if (now.getMonth() == 4 && now.getDate() == 1)
            return func(...args);
    };
}


/*
    Converts true, false and null into a string.
*/
export function boolNaToString (boolean, _true = '✓', _false = '✗', na = '?') {
    if (boolean == null)
        return na;

    if (boolean)
        return _true;

    return _false;
}


export function capitalize (string) {
    return string.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


export function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/*
    Converts German-style to American-style decimal interpunctuation.
*/
export function comma2dot (string) {
    return string.replace(',', '.');
}


/*
    Returns date like <%d.%m.%Y>.
*/
export function dateStr (date) {
    if (date == null)
        date = new Date();

    return padd(date.getDate())
        + '.' + padd(date.getMonth() + 1)
        + '.' + padd(date.getFullYear());
}


/*
    Returns a datetime string like <%d.%m.%Y %H:%M>.
*/
export function datetimeStr (date) {
    if (date == null)
        date = new Date();

    return dateStr(date) + ' ' + timeStr(date);
}


/*
    Converts American-style to German-style decimal interpunctuation.
*/
export function dot2comma (string) {
    return string.replace('.', ',');
}


/*
    Enumerates an iterable.
*/
export function *enumerate (iterable, start = 0, step = 1) {
    for (const item of iterable) {
        yield [start, item];
        start += step;
    }
}


/*
    Escapes HTML special characters.
*/
export function escapeHtml (string) {
    return string.replace(/[&<>"'\/äöüÄÖÜß]/g, function (string) {
        return ENTITYMAP[string];
    });
}


/*
  Formats the respective number as EUR currency.
*/
export function euros (price) {
    return germanDecimal(price) + ' &euro;';
}


/*
  Returns a decimal number with German (comma) interpuctuation.
*/
export function germanDecimal (number, decimals = 2) {
    return dot2comma(number.toFixed(decimals));
}


/*
    Groups an iterable and counts occurences.
*/
export function group (iterable) {
    const result = {};

    for (const item of iterable) {
        if (item in result)
            result[item] += 1;
        else
            result[item] = 1;
    }

    return result;
}


/*
    Case-insensitively returns the index of the substring.
*/
export function includesIgnoreCase (haystack, needle) {
    if (! haystack)
        return false;

    return haystack.toLowerCase().includes(needle.toLowerCase());
}


export function isEmail (string) {
    return EMAIL.test(string);
}


export function isEmpty (string) {
    return string == null || string.trim() == '';
}


export function isEven (num) {
    return ! isOdd(num);
}


export function isOdd (num) {
    return num % 2;
}


/*
    Replace line feed for HTML.
*/
export function lf2html (string) {
    return string.replace(NEW_LINE, '<br/>');
}


/*
    Returns a JSON object from localstorage.
*/
export function loadJSON (key, fallback = null) {
    const string = localStorage.getItem(key);

    if (string == null) {
        if (fallback === undefined)
            throw 'Key "' + key + '" not found in localStorage.';

        return fallback;
    }

    return JSON.parse(string);
}


export function padd (num) {
    if (num < 10)
        return '0' + num;

    return '' + num;
}


/*
    Padds a zero to a digit string if it has exactly one zero after the comma.
*/
export function padd0 (string) {
    if (string.substr(string.indexOf(',') + 1).length == 1)
        return string + '0';

    return string;
}


/*
    Sanitize value.
*/
export function sanitize (value) {
    if (typeof value == 'string')
        return escapeHtml(value);

    return value;
}


/*
  Formats the respective number as square meters.
*/
export function squareMeters (area) {
    return germanDecimal(area) + ' m&sup2;';
}


/*
    Strips leading zeros from number-like strings.
*/
export function strplz (string) {
    let index, char;

    for ([index, char] of enumerate(string)) {
        if (char != '0')
            break;
    }

    return string.substr(index);
}


/*
    Wraps a function and disables the default event.
*/
export function suppressEvent (func, ...args) {
    return event => {
        if (event != null)
            event.preventDefault();

        return func(...args);
    };
}


/*
    Removes the string after the first occurence of the specified character.
*/
export function terminate (string, character) {
    return string.substring(0, string.indexOf(character));
}


/*
    Returns time of date like <%H:%M>.
*/
export function timeStr (date) {
    if (date == null)
        date = new Date();

    return padd(date.getHours()) + ':' + padd(date.getMinutes());
}


/*
    Converts umlaut descriptions to actual umlauts.
*/
export function umlauts (string) {
    return string.replace(/Ae/g, 'Ä').replace(/Oe/g, 'Ö').replace(/Ue/g, 'Ü')
        .replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü');
}
