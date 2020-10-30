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


/*
    Parses JSON from a string and returns undefined on errors.
*/
function parseJSON (string) {
    try {
        return JSON.parse(string);
    } catch (error) {
        return undefined;
    }
}


/*
    Adds JSON content type to headers
*/
function jsonify (headers) {
    headers = headers || {};
    headers['Content-Type'] = 'application/json';
    return headers;
}


/*
  Makes a request returning a promise.
*/
export function makeRequest (method, url, data = null, headers = {}) {
    function executor (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open(method, url);

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


/*
    JSON-requests.
*/
export const json = {
    get: request.get,

    /*
        Makes a POST request with JSON data.
    */
    post: function (url, data, headers = {}) {
        return request.post(url, JSON.stringify(data), jsonify(headers));
    },

    /*
        Makes a PUT request with JSON data.
    */
    put: function (url, data, headers = {}) {
        return request.put(url, JSON.stringify(data), jsonify(headers));
    },

    /*
        Makes a PATCH request with JSON data.
    */
    patch: function (url, data, headers = {}) {
        return request.patch(url, JSON.stringify(data), jsonify(headers));
    },

    delete: request.delete
};
