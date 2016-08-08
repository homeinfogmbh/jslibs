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
immobrowse.getUrl = function(customer=null, attachment=null) {
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
immobrowse.SearchFilter = function(option, operation, value) {
    this.option = option;
    this.operation = operation;
    this.value = value;
}

immobrowse.SearchFilter.prototype = {
    /* Returns the operator */
    operator : function() {
        // TODO: Make operations some kind of enumeration
        return this.operation;
    }
}


/*
    Represents a search query
*/
immobrowse.SearchQuery = function(customer) {
    this.customer = customer;
}

immobrowse.SearchQuery.prototype = {
    filters : [],
    includes : [],
    json : true,

    /* Generates the ImmoSearch query URL */
    url : function() {
        var url = immobrowse.getUrl(this.customer);
        var args = null;
        var filters = null;
        var includes = null;

        // Convert filters to URL parameter
        for (var i=0; i < this.filters.length; i++) {
            var filter = this.filters[i];
            var filterStr = filter.option + filter.operator() + filter.value;

            if (filters === null) {
                filters = filterStr;
            } else {
                filters += "&&" + filterStr;
            }
        }

        if (filters !== null) {
            filters = "filter=" + filters;

            if (args === null) {
                args = "?" + filters;
            } else {
                args += "&" + filters;
            }
        }

        // Add includes
        for (var i=0; i < this.includes.length; i++) {
            var include = this.includes[i];

            if (includes === null) {
                includes = "include=" + include;
            } else {
                includes += "," + include;
            }
        }

        if (includes !== null) {
            if (args === null) {
                args = "?" + includes;
            } else {
                args += "&" + includes;
            }
        }

        // Add JSON flag
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
    },

    /* Sortings */
    sort : []
}
