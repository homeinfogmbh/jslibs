/*
    HOMEINFO YellowMap front-end library

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


    XXX: Depends on "lib.js"

    Change log:
    
    13.05.2015: Richard Neumann <r.neumann@homeinfo.de>
    *   Implemented this library
*/


var yellowmap = {
    /* Extracts a yellow map ID from an objektnr_intern
       of an OpenImmo™ real estate */
    get_yellowmap_id: function (objektnr_intern) {
        var items = objektnr_intern.split(".");
        var ve = items[0];
        var he = items[1];
        return ve.strplz() + "-" + he.strplz()
    },


    /* Generates a URL for a yellowmap
       customer and a real estate id */
    gen_yellowmap_url: function (customer, id) {
        var base_url = "http://www.yellowmap.de/Partners/"
        var tail = "/Map.aspx?MapPartnerIds="
        return base_url + customer + tail + id
    },

    // Maps HOMEINFO CIDs to YellowMap customers
    yellowmap_customers: {"993301": "BielefelderGW"},
}
