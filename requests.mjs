/*
  requests.js - HOMEINFO async requests library.

  (C) 2015-2020 HOMEINFO - Digitale Informationssysteme GmbH

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


import { Logger } from './logging.mjs';


const LOGGER = new Logger('requests');


/*
    Parses JSON from a string and returns undefined on errors.
*/
function parseJSON (string) {
    try {
        return JSON.parse(string);
    } catch (error) {
        LOGGER.warning('Could not parse JSON from string: ' + string);
        return undefined;
    }
}


/*
    URL encodes form data.
*/
function urlencode (formData) {
    const keyValuePairs = [];
    let key, value;

    for (key in formData) {
        key = encodeURIComponent(key);
        value = encodeURIComponent(formData[key]);
        keyValuePairs.push([key, value].join('='));
    }

    return keyValuePairs.join('&').replace(/%20/g, '+');
}


/*
    Adds JSON content type to headers
*/
function setContentType (headers, contentType) {
    console.log('Headers A: ' + JSON.stringify(headers));
    headers = headers || {};

    if (contentType == null)
        return headers;

    console.log('Headers B: ' + JSON.stringify(headers));
    headers['Content-Type'] = contentType;
    console.log('Headers C: ' + JSON.stringify(headers));
    return headers;
}


/*
    Determines the content type from the given data.
    Returns the properly encoded data and the respective content type.
*/
function detectContentType (data) {
    if (data == null)
        return [data, null];

    if (data instanceof FormData)
        return [urlencode(data), 'multipart/form-data'];

    if (data instanceof File)
        return [data, 'multipart/form-data'];

    if (data instanceof Blob)
        return [data, 'application/octet-stream'];

    if (typeof data === 'string' || data instanceof String)
        return [data, 'text/plain'];

    if (data instanceof Element)
        return [data, 'text/html'];

    if (data instanceof Object)
        return [JSON.stringify(data), 'application/json'];

    LOGGER.warning('Could not detemine content type for: ' + typeof data);
    return [data, null];
}


/*
    Detects the content type of the sent data and sets it in the headers.
    Returns the properly encoded data and the respective content type.
*/
function updateContentType (data, headers) {
    console.log('Headers 1: ' + JSON.stringify(headers));
    if (headers != null && headers['Content-Type'] != null)
        return [data, headers];

    let contentType;
    [data, contentType] = detectContentType(data);
    headers = setContentType(headers, contentType);
    console.log('Data: ' + data + ', headers: ' + headers);
    console.log('Headers 2: ' + JSON.stringify(headers));
    return [data, headers];
}


/*
  Makes a request returning a promise.
*/
export function makeRequest (method, url, data = null, headers = {}) {
    console.log('Headers 0: ' + JSON.stringify(headers));
    [data, headers] = updateContentType(data, headers);
    console.log('Headers 3: ' + JSON.stringify(headers));

    function executor (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open(method, url);
        console.log('Headers 4: ' + JSON.stringify(headers));

        for (const header in headers)
            xhr.setRequestHeader(header, headers[header]);

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300)
                resolve({
                    response: xhr.response,
                    json: parseJSON(xhr.response),
                    status: this.status,
                    statusText: xhr.statusText
                });
            else
                reject({
                    response: xhr.response,
                    json: parseJSON(xhr.response),
                    status: this.status,
                    statusText: xhr.statusText
                });
        }

        xhr.onerror = function () {
            reject({
                response: xhr.response,
                json: parseJSON(xhr.response),
                status: this.status,
                statusText: xhr.statusText
            });
        }

        if (data == null)
            xhr.send();
        else
            xhr.send(data);
    }

    return new Promise(executor);
}


/*
    Request shorthands.
*/
export const request = {
    /*
        Makes a GET request.
    */
    get: function (url, headers = {}) {
        return makeRequest('GET', url, null, headers);
    },

    /*
        Makes a POST request.
    */
    post: function (url, data = null, headers = {}) {
        return makeRequest('POST', url, data, headers);
    },

    /*
        Makes a PUT request.
    */
    put: function (url, data = null, headers = {}) {
        return makeRequest('PUT', url, data, headers);
    },

    /*
        Makes a PATCH request.
    */
    patch: function (url, data = null, headers = {}) {
        return makeRequest('PATCH', url, data, headers);
    },

    /*
        Makes a DELETE request.
    */
    delete: function (url, headers = {}) {
        return makeRequest('DELETE', url, null, headers);
    }
};
