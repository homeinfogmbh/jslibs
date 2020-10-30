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
function parseResponse (string) {
    try {
        return JSON.parse(string);
    } catch (error) {
        return undefined;
    }
}


class Request extends XMLHttpRequest {
    constructor (method, url, data, headers = {}, withCredentials = true) {
        super();
        this.method = method;
        this.url = url;
        this.data = data;
        this.headers = headers;
        this.withCredentials = withCredentials;
    }

    static make(method, url, data, headers = {}, withCredentials = true) {
        const request = this(method, url, data, headers, withCredentials);
        return request.execute;
    }

    onload () {
        if (this.status >= 200 && this.status < 300)
            this.resolve({
                response: xhr.response,
                json: parseResponse(xhr.response),
                status: this.status,
                statusText: xhr.statusText
            });
        else
            this.reject({
                response: xhr.response,
                json: parseResponse(xhr.response),
                status: this.status,
                statusText: xhr.statusText
            });
    }

    onerror () {
        this.reject({
            response: xhr.response,
            json: parseResponse(xhr.response),
            status: this.status,
            statusText: xhr.statusText
        });
    }

    execute (resolve, reject) {
        this.open(this.method, this.url);
        this.resolve = resolve;
        this.reject = reject;

        for (const header in this.headers)
            xhr.setRequestHeader(header, headers[header]);

        if (data == null)
            this.send();
        else
            this.send(data);
    }
}


/*
  Makes a request returning a promise.
*/
export function makeRequest (method, url, data = null, headers = {}) {
    return new Promise(Request.make(method, url, data, headers));
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
        headers['Content-Type'] = 'application/json';
        return request.post(url, JSON.stringify(data), headers);
    },

    /*
        Makes a PUT request with JSON data.
    */
    put: function (url, data, headers = {}) {
        headers['Content-Type'] = 'application/json';
        return request.put(url, JSON.stringify(data), headers);
    },

    /*
        Makes a PATCH request with JSON data.
    */
    patch: function (url, data, headers = {}) {
        headers['Content-Type'] = 'application/json';
        return request.patch(url, JSON.stringify(data), headers);
    },
    delete: request.delete
};
