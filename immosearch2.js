/*
    A front end library for calls to the ImmoSearch API

    Copyright (C) 2016 HOMEINFO - Digitale Informationssysteme GmbH

    Maintainer: Richard Neumann <r dot neumann at homeinfo period de>

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
*/

// Initialize name space
var immobrowse = immobrowse || {};


// Base URL for ImmoSearch
immobrowse.BASE_URL = "https://tls.homeinfo.de/immosearch";


/*
    Returns an ImmoSearch URL for either a customer or an attachment
*/
immobrowse.get_url = function(customer=null, attachment=null) {
    if ((customer !== null) && (attachment !== null)) {
        // TODO: Error
    } else if (customer !== null) {
        return immobrowse.BASE_URL + "/customer/" + customer;
    } else if (attachment !== null) {
        return immobrowse.BASE_URL + "/attachment/" + attachment;
    } else {
        // TODO: Error
    }
}


/*
    Represents a search filter
*/
immobrowse.SearchFilter = class {
    constructor(option, operation, value) {
        this.option = option;
        this.operation = operation;
        this.value = value;
    }

    get operator() {
        // TODO: Make operations some kind of enumeration
        return this.operation;
    }
}


/*
    Represents a search query
*/
immobrowse.SearchQuery = class {
    constructor(customer) {
        this.customer = customer;
        this.filters = [];
        this.includes = [];
        this.json = true;
    }

    get url() {
        var url = immobrowse.get_url(this.customer);
        var args = null;
        var filters = null;
        var includes = null;

        // Convert filters to URL parameter
        for (let filter of this.filters) {
            var filter_ = filter.option + filter.operator + filter.value;

            if (filters === null) {
                filters = filter_;
            } else {
                filters += "&&" + filter_;
            }
        }

        if (filters !== null) {
            var filters_ = "filter=" + filters;

            if (args === null) {
                args = "?" + filters_;
            } else {
                args += filters_;
            }
        }

        // Add includes
        for (let include of this.includes) {
            if (includes === null) {
                includes = include;
            } else {
                includes += "," + include;
            }
        }

        if (includes !== null) {
            var includes = "include=" + includes;

            if (args === null) {
                args = "?" + includes;
            } else {
                args += "&" + includes;
            }
        }

        if (this.json === true) {
            if (args === null) {
                args = "?" + "json";
            } else {
                args += "&" + "json";
            }
        }

        // Add args to URL
        if (args !== null) {
            url += args;
        }

        return url;
    }

    sort(desc=false) {
        this.desc = desc;
    }
}
