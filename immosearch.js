/*
    HOMEINFO ImmoSearch front-end library

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


    XXX: Depends on "openimmo.js"

    Change log:
    
    03.05.2015: Richard Neumann <r.neumann@homeinfo.de>
    *   Implemented this library
*/


// Global variable CID must be specified from here on
var base_url = "https://tls.homeinfo.de/immosearch/customer/" + CID;
var img_dummy = "img/customer_dummy/" + CID + ".png";
var selected_locations = [];

var sorting = "";
var include = "freitexte,attachments";
var attachments = "scaling:133x120,limit:1";

// Filtering options
var zimmer_von = "";
var zimmer_bis = "";
var wohnflaeche_von = "";
var wohnflaeche_bis = "";
var grundmiete_von = "";
var grundmiete_bis = "";
var terrasse = false;
var garten = false;
var balkon = false;
var wanne = false;
var dusche = false;
var aufzug = false;
var erdgeschoss = false;
var first_floor = false;
var second_floor = false;


// Creates location filters
// XXX: Location filters are "or"-joined
function mkLocationFilter() {
    var current_item = "";
    var result = null;

    for (var i = 0; i < selected_locations.length; i++) {
        current_item = selected_locations[i];

        if (result == null) {
            result = "ortsteil==" + current_item;
        } else {
            result += " or ortsteil==" + current_item;
        }

    }

    if (result == null) {
        return "";
    } else {
        return "(" + result + ")";
    }
}


// Creates floor filters
// XXX: Floor filters are "or"-joined
function mkEtageFilter() {
    var result = null;

    if (erdgeschoss == true) {
        if (result == null) {
            result = "etage==0";
        } else {
            result += " or etage==0";
        }
    }

    if (first_floor == true) {
        if (result == null) {
            result = "etage==1";
        } else {
            result += " or etage==1";
        }
    }

    if (second_floor == true) {
        if (result == null) {
            result = "etage>=2";
        } else {
            result += " or etage>=2";
        }
    }

    if (result == null) {
        return "";
    } else {
        return "(" + result + ")";
    }
}


// Creates filter rules
function mkFilter() {

    var result = null;

    if (zimmer_von) {
        if (result == null) {
            result = "zimmer>=" + zimmer_von;
        } else {
            result += " and zimmer>=" + zimmer_von;
        }
    }

    if (zimmer_bis) {
        if (result == null) {
            result = "zimmer<=" + zimmer_bis;
        } else {
            result += " and zimmer<=" + zimmer_bis;
        }
    }

    if (wohnflaeche_von) {
        if (result == null) {
            result = "wohnflaeche>=" + wohnflaeche_von;
        } else {
            result += " and wohnflaeche>=" + wohnflaeche_von;
        }
    }

    if (wohnflaeche_bis) {
        if (result == null) {
            result = "wohnflaeche<=" + wohnflaeche_bis;
        } else {
            result += " and wohnflaeche<=" + wohnflaeche_bis;
        }
    }

    if (grundmiete_von) {
        if (result == null) {
            result = "kaltmiete>=" + grundmiete_von;
        } else {
            result += " and kaltmiete>=" + grundmiete_von;
        }
    }

    if (grundmiete_bis) {
        if (result == null) {
            result = "kaltmiete<=" + grundmiete_bis;
        } else {
            result += " and kaltmiete<=" + grundmiete_bis;
        }
    }

    if (terrasse) {
        if (result == null) {
            result = "terrassen>>0";
        } else {
            result += " and terrassen>>0";
        }
    }

    if (garten) {
        if (result == null) {
            result = "garten>>0"
        } else {
            result += " and garten>>0"
        }
    }

    if (balkon) {
        if (result == null) {
            result = "balkone>>0";
        } else {
            result += " and balkone>>0";
        }
    }

    if (wanne) {
        if (result == null) {
            result = "wanne>>0";
        } else {
            result += " and wanne>>0";
        }
    }

    if (dusche) {
        if (result == null) {
            result = "dusche>>0";
        } else {
            result += " and dusche>>0";
        }
    }

    if (aufzug) {
        if (result == null) {
            result = "aufzug>>0";
        } else {
            result += " and aufzug>>0";
        }
    }

    var etage = mkEtageFilter();
    if (etage) {
        if (result == null) {
            result = etage;
        } else {
            result += " and " + etage;
        }
    }

    var location = mkLocationFilter();
    if (location) {
        if (result == null) {
            result = location;
        } else {
            result += " and " + location;
        }
    }

    if (result) {
        return result;
    } else {
        return "";
    }
}


// Class to represent an internal attachment
function Attachment(anhang) {
    this.title = anhang.anhangtitel;
    this.mimetype = anhang.format;
    this.b64data = anhang.daten.anhanginhalt;
    this.group = anhang.gruppe;
    return this;
}


// Class to represent an energy certificate
function EnergyCertificate(energiepass) {
    this.type = energiepass.epart;
	this.value = energiepass.energieverbrauchkennwert ?
        this.energy_certificate_type == "VERBRAUCH" :
        energiepass.endenergiebedarf;
	this.with_warm_water= energiepass.mitwarmwasser;
	this.primary_energy_carrier = energiepass.primaerenergietraeger;
	this.class = energiepass.wertklasse;
	this.construction_year = energiepass.baujahr;
	return this;
}


// Real estate wrapper for an OpenImmo™ immobilie
// DOM node for easy attribute access
function RealEstate(immobilie) {
    function _attachments() {
        var attachments = immobilie.getElements("anhaenge");
        var result = [];
        for (var i = 0; i < attachments.length; i++) {
        	result.push(Attachment(attachments[i]));
        }
        return result;
    }
    this._immobilie = immobilie;
    if (immobilie.freitexte) {
        this.title = immobilie.freitexte.objekttitel;
	}
    if (immobilie.geo) {
	    this.street = immobilie.geo.strasse;
	    this.house_no = immobilie.geo.hausnummer;
	    this.zip_code = immobilie.geo.plz;
	    this.city = immobilie.geo.ort;
	    this.floor = immobilie.geo.etage;
	    this.floors = immobilie.geo.anzahl_etagen;
	    this.district = immobilie.geo.regionaler_zusatz;
    }
    if (immobilie.preise) {
	    this.cold_rent = immobilie.preise.nettokaltmiete ?
	        immobilie.preise.nettokaltmiete : immobilie.preise.kaltmiete;
	    this.warm_rent = immobilie.preise.warmmiete;
	    this.utilities = immobilie.preise.nebenkosten;
	    this.heating_costs = immobilie.preise.heizkosten;
	    this.heating_costs_included = immobilie.preise.heizkosten_enthalten;
	}
    if (immobilie.zustand_angaben) {
	    this.energy_certificate = EnergyCertificate(
	        immobilie.zustand_angaben.energiepass[0]) ?
	        immobilie.zustand_angaben.energiepass[0] : null;
	}
    this.attachments = _attachments

    this.fullRent = function() {
        if (this.warm_rent) {
            return Number(this.warm_rent);
        } else if (this.cold_rent) {
            if (this.utilities) {
            	if (this.heating_costs) {
	                if (this.heating_costs_included) {
	                    return Number(this.cold_rent)
	                           + Number(this.utilities);
	                } else {
	                    return Number(this.cold_rent)
                               + Number(this.utilities)
                 	           + Number(this.heating_costs);
	                }
                } else {
                    return Number(this.cold_rent)
                           + Number(this.utilities);
                }
            } else {
                if (this.heating_costs) {
	                if (this.heating_costs_included) {
	                    return Number(this.cold_rent);
	                } else {
	                    return Number(this.cold_rent)
                 	           + Number(this.heating_costs);
	                }
                } else {
                    return Number(this.cold_rent)
                           + Number(this.utilities);
                }           
            }
        }
        
    }
    
    return this;
}

// Creates a list of real estates from an OpenImmo™-anbieter XML document
function RealEstateList(xml) {
    var immobilie = xml.getElementsByTagName("anbieter")[0]
        .getElementsByTagName("immobilie");
    var result = [];
    for (var i = 0; i < immobilie.length; i++) {
        //result.push(RealEstate(Immobilie(immobilie[i])));
    }
    return [];
    return result;
}
