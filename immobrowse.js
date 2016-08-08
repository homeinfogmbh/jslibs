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


// Variables //

/*
    Base URL for ImmoSearch
*/
immobrowse.BASE_URL = "https://tls.homeinfo.de/immosearch";


// Functions //

/*
    Returns an ImmoSearch URL for either a customer or an attachment
*/
immobrowse.genUrl = function(customer=null, attachment=null) {
    if ((customer !== null) && (attachment !== null)) {
        throw "Can only generate URL for either customer or attachment";
    } else if (customer !== null) {
        return immobrowse.BASE_URL + "/customer/" + customer;
    } else if (attachment !== null) {
        return immobrowse.BASE_URL + "/attachment/" + attachment;
    } else {
        throw "Must specify either customer or attachment";
    }
}


/*
    Join filter rules
*/
immobrowse.joinFilters = function() {
    var statement = null;
    // First argument is the operator
    var operator = arguments[0];

    // Other arguments are the filters
    for (var i = 1; i < arguments.length; i++) {
        var filter = arguments[i];

        if (statement === null) {
            statement = filter;
        } else {
            statement += operator + filter;
        }
    }

    return statement;
}


/*
    Embrace a (filtering) statement
*/
immobrowse.embrace = function(statement) {
    return "(" + statement + ")";
}


// Classes //

/*
    Search filter
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
    Sorting option
*/
immobrowse.SortOption = function(option, desc=false) {
    this.option = option;
    this.desc = desc;
}


/*
    Represents a search query
*/
immobrowse.SearchQuery = function(customer) {
    this.customer = customer;
}


immobrowse.SearchQuery.prototype = {
    // List of to-be AND-joined filters
    filters : [],
    // List of data to be included
    includes : [],
    // Flag to render result in JSON (default) or XML otherwise
    json : true,

    /* Generates the ImmoSearch query URL */
    url : function() {
        var url = immobrowse.genUrl(this.customer);
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

    // Sorting options
    sort : []
}
