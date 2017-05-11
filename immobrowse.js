/*
  immobrowse.js - ImmoBrowse JavaScript library

  (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

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

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>

  Requires:
    * homeinfo.js
    * jquery.js
    * sweetalert.js
*/
"use strict";

var immobrowse = immobrowse || {};

// Logger
immobrowse.logger = new homeinfo.logging.Logger('immobrowse', homeinfo.logging.WARNING);

// Configuration
immobrowse.config = {};


/*** Miscellaneous functions ***/

/*
  Compares two nullable values so that
  null values always come out last.
*/
immobrowse.compare = function (alice, bob, descending) {
  if (alice == null) {
    if (bob == null) {
      return 0;
    } else {
      return Infinity;
    }
  } else {
    if (bob == null) {
      return -Infinity;
    } else {
      var val = 0;

      if (alice < bob) {
        val = -1;
      } else {
        if (bob < alice) {
          val = 1;
        }
      }

      if (descending) {
        val =  val * -1;
      }

      return val;
    }
  }
}


/*
  Returns an appropriate sorting function
*/
immobrowse.getSorter = function (property, order) {
  var descending = false;

  if (order == 'descending') {
    descending = true;
  }

  switch(property) {
    case 'rooms':
      return this.sortByRooms(descending);
    case 'area':
      return this.sortByArea(descending);
    case 'rent':
      return this.sortByRent(descending);
    case 'street':
      return this.sortByStreet(descending);
    default:
      throw 'Invalid sorting property: ' + property;
  }
}


/*
  Returns comparison for rooms
*/
immobrowse.sortByRooms = function (descending) {
  return function (immobilie1, immobilie2) {
    return immobrowse.compare(immobilie1.rooms(), immobilie2.rooms(), descending);
  }
}


/*
  Returns comparison for area
*/
immobrowse.sortByArea = function (descending) {
  return function (immobilie1, immobilie2) {
    return immobrowse.compare(immobilie1.area(), immobilie2.area(), descending);
  }
}


/*
  Returns comparison for rent
*/
immobrowse.sortByRent = function (descending) {
  return function (immobilie1, immobilie2) {
    return immobrowse.compare(immobilie1.rent(), immobilie2.rent(), descending);
  }
}


/*
  Returns comparison for streets
*/
immobrowse.sortByStreet = function (descending) {
  return function (immobilie1, immobilie2) {
    return immobrowse.compare(immobilie1.street(), immobilie2.street(), descending);
  }
}


immobrowse.germanDecimal = function (number, decimals) {
  if (number != null) {
    if (decimals == null) {
      decimals = 2;
    }

    return number.toFixed(decimals).replace('.',',');
  }

  return null;
}


immobrowse.euro = function (price) {
  if (price != null) {
    return immobrowse.germanDecimal(price) + ' &euro;';
  }

  return null;
}


immobrowse.squareMeters = function (area) {
  if (area != null) {
    return immobrowse.germanDecimal(area) + ' m&sup2;';
  }

  return null;
}


immobrowse.yesNo = function (boolean) {
  if (boolean == null) {
    return null;
  } else if (boolean == true) {
    return 'Ja';
  } else {
    return 'Nein';
  }
}


/*
  Queries real estate data from the API and runs callback function.
*/
immobrowse.getRealEstate = function (cid, objectId, callback) {
  $.ajax({
    url: 'https://tls.homeinfo.de/immobrowse/real_estate/' + objectId + '?customer=' + cid,
    success: function (json) {
      callback(new immobrowse.RealEstate(cid, json));
    },
    error: function() {
      swal({
        title: 'Immobilie konnten nicht geladen werden.',
        text: 'Bitte versuchen Sie es später noch ein Mal.',
        type: 'error'
      });
    }
  });
}


/*
  Queries API for real estate list and runs callback function.
*/
immobrowse.getRealEstates = function (cid, callback) {
  $.ajax({
    url: 'https://tls.homeinfo.de/immobrowse/list/' + cid,
    success: function (json) {
      var realEstates = [];

      for (var i = 0; i < json.length; i++) {
        realEstates.push(new immobrowse.RealEstate(cid, json[i]));
      }

      callback(realEstates)
    },
    error: function() {
      swal({
        title: 'Immobilien konnten nicht geladen werden.',
        text: 'Bitte versuchen Sie es später noch ein Mal.',
        type: 'error'
      });
    }
  });
}


/*
  Opens the respective URL
*/
immobrowse.open = function (url) {
  window.open(url, '_self');
}


immobrowse.mkContactMail = function (
    objectTitle, objectAddress, salutation, forename, surname, phone,
    street, houseNumber, zipCode, city, message) {
  var html = '<!DOCTYPE HTML>\n';
  html += '<h1>Anfrage zu Objekt</h1>';
  html += '<h2>' + objectTitle + '</h2>';
  html += '<h3>' + objectAddress + '</h4>';
  html += [salutation, '<span style="font-variant:small-caps;">' + forename, surname + '</span>'].join(' ');

  var inquirerInfo = ''

  if (street) {
    inquirerInfo += street;

    if (houseNumber) {
      inquirerInfo += ' ' + houseNumber;
    }

    inquirerInfo += '<br>\n';
  }

  if (zipCode) {
    inquirerInfo += zipCode;
  }

  if (city) {
    if (zipCode) {
      inquirerInfo += ' ';
    }

    inquirerInfo += city;
  }

  if (zipCode || city) {
    inquirerInfo += '<br>\n';
  }

  if (phone) {
    inquirerInfo += 'Tel.: ' + phone  + '\n<br>\n';
  }

  if (inquirerInfo == '') {
    html += ' ';
  } else {
    html += '\n<br>\n' + inquirerInfo + '\n<br>\n';
  }

  html += 'hat folgende Anfrage an Sie:\n<br>\n<br>\n';
  html += '<div style="font-style:italic;">' + message.replace('\n', '\n<br>\n') + '</div>';
  return html;
}


/*
  Mailer class
*/
immobrowse.Mailer = function (config, html, successMsg, errorMsg) {
  this.baseUrl = 'https://tls.homeinfo.de/hisecon';
  this.config = config;

  if (html == null) {
    this.html = true;
  } else {
    this.html = html;
  }

  if (successMsg == null) {
    this.successMsg = {
      title: 'Anfrage versendet!',
      type: 'success'
    };
  } else {
    this.successMsg = successMsg;
  }

  if (errorMsg == null) {
    this.errorMsg = {
      title: 'Fehler beim Versenden!',
      text: 'Bitte versuchen Sie es später noch ein Mal.',
      type: 'error'
    };
  } else {
    this.errorMsg = errorMsg;
  }

  this.getUrl = function (response, subject, recipient, reply_to) {
    var url = this.baseUrl + '?config=' + this.config;

    if (response) {
      url += '&response=' + response;
    } else {
      immobrowse.logger.warning('No reCAPTCHA response provided.');
    }

    if (subject) {
      url += '&subject=' + subject;
    } else {
      immobrowse.logger.warning('No subject provided.');
    }

    if (recipient) {
      url += '&recipient=' + recipient;
    } else {
      immobrowse.logger.warning('No recipient specified.');
    }

    if (reply_to) {
      url += '&reply_to=' + reply_to;
    }

    if (this.html) {
      url += '&html=true';
    }

    return url;
  };

  this.getAjax = function (url, body) {
    var successMsg = this.successMsg;
    var errorMsg = this.errorMsg;

    return {
      url: url,
      type: 'POST',
      data: body,
      cache: false,
      success: function (html) {
        swal(successMsg);
      },
      error: function (html) {
        swal(errorMsg);
      }
    }
  };

  this.send = function (response, subject, body, recipient, reply_to) {
    $.ajax(this.getAjax(this.getUrl(response, subject, recipient, reply_to), body));
  };
}


/*
  Real estate wrapper class
*/
immobrowse.RealEstate = function (cid, realEstate) {
  this.oval = '<div class="oval-outer"><div class="oval-inner">{}</div></div>';
  this.kwh = '<span class="fraction"><span class="numerator">kWh</span><span class="denominator">m<sup>2</sup>&middot;a</span></span>';
  this.na = 'k. A.';

  for (var prop in realEstate) {
    if (realEstate.hasOwnProperty(prop)) {
        this[prop] = realEstate[prop];
    }
  }

  this.cid = cid;

  this.addressPreview = function () {
    if (this.geo == null) {
      return 'N/A';
    } else {
      if (this.geo.strasse == null) {
        return 'N/A';
      } else {
        if (this.geo.hausnummer == null) {
          return this.geo.strasse;
        } else {
          return this.geo.strasse + ' ' + this.geo.hausnummer;
        }
      }
    }
  }

  this.cityPreview = function () {
    if (this.geo == null) {
      return 'N/A';
    } else {
      if (this.geo.ort == null) {
        return 'N/A';
      } else {
        if (this.geo.regionaler_zusatz == null || this.geo.regionaler_zusatz == this.geo.ort) {
          return this.geo.ort;
        } else {
          return this.geo.ort + ' ' + this.geo.regionaler_zusatz;
        }
      }
    }
  }

  this.objectTitle = function () {
    if (this.freitexte != null) {
      if (this.freitexte.objekttitel != null) {
        return this.freitexte.objekttitel;
      }
    }

    var html = '';
    var rooms = this.rooms();

    if (rooms == null) {
      html += 'Wohnung | ';
    } else {
      html += rooms + ' Zimmer Wohnung | ';
    }

    if (this.showAddress()) {
      html += this.addressPreview();
      html += ' | ';
    }

    html += this.cityPreview();
    return html;
  }

  /*
    Extracts a potential title image from a
    real estate or null if none was found.
  */
  this.titleImage = function () {
    if (this.anhaenge == null) {
      return null;
    } else {
      if (this.anhaenge.anhang == null) {
        return null;
      } else {
        for (var i = 0; i < this.anhaenge.anhang.length; i++) {
          var anhang = this.anhaenge.anhang[i];

          if (anhang.gruppe == 'TITELBILD') {
            return anhang;
          }
        }

        for (var i = 0; i < this.anhaenge.anhang.length; i++) {
          var anhang = this.anhaenge.anhang[i];

          if (anhang.gruppe == 'AUSSENANSICHTEN') {
            return anhang;
          }
        }

        for (var i = 0; i < this.anhaenge.anhang.length; i++) {
          var anhang = this.anhaenge.anhang[i];

          if (anhang.gruppe == 'BILD') {
            return anhang;
          }
        }

        for (var i = 0; i < this.anhaenge.anhang.length; i++) {
          var anhang = this.anhaenge.anhang[i];

          if (anhang.gruppe == 'GRUNDRISS') {
            return anhang;
          }
        }
        return null;
      }
    }
  }

  this.street = function () {
    if (this.geo == null) {
      return null;
    } else {
      if (this.geo.strasse == null) {
        return null;
      } else {
        return this.geo.strasse;
      }
    }
  }

  this.rooms = function() {
    if (this.flaechen != null) {
      return immobrowse.germanDecimal(this.flaechen.anzahl_zimmer);
    }

    return null;
  }

  this.area = function () {
    if (this.flaechen == null) {
      return null;
    } else {
      if (this.flaechen.wohnflaeche == null) {
        if (this.flaechen.nutzflaeche == null) {
          if (this.flaechen.gesamtflaeche == null) {
            return null;
          } else {
            return this.flaechen.gesamtflaeche;
          }
        } else {
          return this.flaechen.nutzflaeche;
        }
      } else {
        return this.flaechen.wohnflaeche;
      }
    }
  }

  this.netColdRent = function () {
    if (this.preise == null) {
      return null;
    } else {
      if (this.preise.nettokaltmiete == null) {
        return null;
      } else {
        return this.preise.nettokaltmiete;
      }
    }
  }

  this.coldRent = function () {
    if (this.preise == null) {
      return null;
    } else {
      if (this.preise.kaltmiete == null) {
        return null;
      } else {
        return this.preise.kaltmiete;
      }
    }
  }

  this.rent = function () {
    var netColdRent = this.netColdRent();
    var coldRent = this.coldRent();

    if (netColdRent != null && netColdRent != '') {
      return netColdRent;
    } else if (coldRent != null && coldRent != '') {
      return coldRent;
    }

    return null;
  }

  this.cableSatTv = function () {
    if (this.ausstattung == null) {
      return null;
    } else {
      return this.ausstattung.kabel_sat_tv;
    }
  }

  this.builtInKitchen = function () {
    if (this.ausstattung == null) {
      return false;
    } else {
      if (this.ausstattung.kueche == null) {
        return false;
      } else {
        return this.ausstattung.kueche.EBK;
      }
    }
  }

  this.basementRoom = function () {
    if (this.ausstattung == null) {
      return null;
    } else {
      return this.ausstattung.unterkellert == 'JA';
    }
  }

  this.balconies = function () {
    if (this.flaechen == null) {
      return 0;
    } else {
      if (this.flaechen.anzahl_balkone == null) {
        return 0;
      } else {
        return this.flaechen.anzahl_balkone;
      }
    }
  }

  this.terraces = function () {
    if (this.flaechen == null) {
      return 0;
    } else {
      if (this.flaechen.anzahl_terrassen == null) {
        return 0;
      } else {
        return this.flaechen.anzahl_terrassen;
      }
    }
  }

  this.shower = function () {
    if (this.ausstattung == null) {
      return false;
    } else {
      if (this.ausstattung.bad == null) {
        return false;
      } else {
        return this.ausstattung.bad.DUSCHE;
      }
    }
  }

  this.bathTub = function () {
    if (this.ausstattung == null) {
      return false;
    } else {
      if (this.ausstattung.bad == null) {
        return false;
      } else {
        return this.ausstattung.bad.WANNE;
      }
    }
  }

  this.bathroomWindow = function () {
    if (this.ausstattung == null) {
      return false;
    } else {
      if (this.ausstattung.bad == null) {
        return false;
      } else {
        return this.ausstattung.bad.FENSTER;
      }
    }
  }

  this.lavatoryDryingRoom = function () {
    if (this.ausstattung == null) {
      return false;
    } else {
      return this.ausstattung.wasch_trockenraum;
    }
  }

  this.barrierFree = function () {
    if (this.ausstattung == null) {
      return false;
    } else {
      return this.ausstattung.barrierefrei;
    }
  }

  this.objectTypes = function () {
    var types = [];
    var objektart = this.objektkategorie.objektart;

    if (objektart.zimmer != null) {
      types.push('ZIMMER');
    }

    if (objektart.wohnung != null) {
      types.push('WOHNUNG');
      types.concat(objektart.wohnung);
    }

    return types;
  }

  this.marketingTypes = function () {
    var types = [];
    var vermarktungsart = this.objektkategorie.vermarktungsart;

    if (vermarktungsart.KAUF) {
      types.push('KAUF');
    }

    if (vermarktungsart.MIETE_PACHT) {
      types.push('MIETE_PACHT');
    }

    if (vermarktungsart.ERBPACHT) {
      types.push('ERBPACHT');
    }

    if (vermarktungsart.LEASING) {
      types.push('LEASING');
    }

    return types;
  }

  this.showAddress = function () {
    if (this.verwaltung_objekt == null) {
      return true;
    } else {
      if (this.verwaltung_objekt.objektadresse_freigeben == null) {
        return true;
      } else {
        return this.verwaltung_objekt.objektadresse_freigeben;
      }
    }
  }

  this.translatePrimaerenergietraeger = function (primaerenergietraeger) {
    switch (primaerenergietraeger) {
      case 'OEL':
        return 'Öl';
      case 'GAS':
        return 'Gas';
      case 'ELEKTRO':
        return 'Elektisch';
      case 'ALTERNATIV':
        return 'Alternativ';
      case 'SOLAR':
        return 'Solar';
      case 'ERDWAERME':
        return 'Erdwärme';
      case 'LUFTWP':
        return 'Wärmepumpe Luft-Wasser';
      case 'FERN':
        return 'Fernwärme';
      case 'BLOCK':
        return 'Blockheizkraftwerk';
      case 'WASSER-ELEKTRO':
        return 'Ergänzendes dezentrales Warmwasser';
      case 'PELLET':
        return 'Pellet';
      case 'KOHLE':
        return 'Kohle';
      case 'HOLZ':
        return 'Holz';
      case 'FLUESSIGGAS':
        return 'Flüssiggas';
    }

    return primaerenergietraeger;
  }

  this.district = function () {
    return this.geo.regionaler_zusatz;
  }

  this.matchTypes = function (types) {
    if (types == null) {
      return true;
    } else {
      var myTypes = this.objectTypes();

      for (var i = 0; i < myTypes.length; i++) {
        if (types.indexOf(myTypes[i]) >= 0) {
          return true;
        }
      }

      return false;
    }
  }

  this.matchMarketing = function (types) {
    if (types == null) {
      return true;
    } else {
      var myTypes = this.marketingTypes();

      for (var i = 0; i < myTypes.length; i++) {
        if (types.indexOf(myTypes[i]) >= 0) {
          return true;
        }
      }

      return false;
    }
  }

  this.objectId = function () {
    return this.verwaltung_techn.objektnr_extern;
  }

  this.attachmentURL = function (anhang) {
    if (anhang == null) {
      return null;
    } else {
      return 'https://tls.homeinfo.de/immobrowse/attachment/' + anhang.id
        + '?customer=' + this.cid + '&objektnr_extern=' + this.objectId();
    }
  }

  this.detailsURL = function (baseUrl) {
    if (baseUrl == null) {
      return null;
    } else {
      return baseUrl + '?customer=' + this.cid + '&objektnr_extern=' + this.objectId();
    }
  }

  this.miscellanea = function () {
    if (this.freitexte != null) {
      if (! homeinfo.str.isEmpty(this.freitexte.sonstige_angaben)) {
        return this.freitexte.sonstige_angaben;
      }
    }

    return null;
  }

  this.description = function () {
    if (this.freitexte != null) {
      if (! homeinfo.str.isEmpty(this.freitexte.objektbeschreibung)) {
        return this.freitexte.objektbeschreibung;
      }
    }

    return null;
  }

  this.exposure = function () {
    if (this.freitexte != null) {
      if (! homeinfo.str.isEmpty(this.freitexte.lage)) {
        return this.freitexte.lage;
      }
    }

    return null;
  }

  this.attachments = function () {
    var attachments = [];

    if (this.anhaenge != null) {
      if (this.anhaenge.anhang != null) {
        for (var i = 0; i < this.anhaenge.anhang.length; i++) {
          attachments.push(this.anhaenge.anhang[i]);
        }
      }
    }

    return attachments;
  }

  this.images = function () {
    var attachments = this.attachments();
    var imageGroups = ['TITELBILD', 'BILD', 'AUSSENANSICHTEN', 'INNENANSICHTEN'];
    var images = [];

    for (var i = 0; i < attachments.length; i++) {
      if (imageGroups.indexOf(attachments[i].gruppe) >= 0) {
        images.push(attachments[i]);
      }
    }

    return images;
  }

  this.floorplans = function () {
    var attachments = this.attachments();
    var floorplans = [];

    for (var i = 0; i < attachments.length; i++) {
      if (attachments[i].gruppe == 'GRUNDRISS') {
        floorplans.push(attachments[i]);
      }
    }

    return floorplans;
  }

  this.floorplan = function () {
    return this.floorplans()[0];
  }

  this.amenitiesTags = function () {
    var amenities = this.amenities();
    var html = '';

    for (var i = 0; i < amenities.length; i++) {
      html += this.oval.replace('{}', amenities[i]);
    }

    return html;
  }

  this.amenitiesList = function () {
    var amenities = this.amenities();
    var html = '<ul class="ib-amenities-list">';

    for (var i = 0; i < amenities.length; i++) {
      html += '<li>' + amenities[i] + '</li>';
    }

    return html + '</ul>';
  }

  this.floor = function () {
    var ordinal = '. ';
    var dg = 'Dachgeschoss';
    var og = 'Obergeschoss';
    var eg = 'Erdgeschoss';
    var ug = 'Untergeschoss';

    if (immobrowse.config.shortFloorNames) {
      dg = 'DG';
      og = 'OG';
      eg = 'EG';
      ug = 'UG';
    }

    if (this.geo != null) {
      if (this.geo.etage != null) {
        if (this.geo.anzahl_etagen != null) {
          if (this.geo.etage == this.geo.anzahl_etagen) {
            return dg;
          }
        }

        if (this.geo.etage < 0) {
          return -this.geo.etage + ordinal + ug;
        } else if (this.geo.etage > 0) {
          return this.geo.etage + ordinal + og;
        } else {
          return eg;
        }
      }
    }
  }

  this.amenities = function () {
    var amenities = [];

    if (this.ausstattung != null) {
      if (this.ausstattung.barrierefrei) {
        amenities.push('Barrierefrei');
      }

      if (this.ausstattung.kabel_sat_tv) {
        amenities.push('Kabel / Sat. / TV');
      }

      if (this.ausstattung.unterkellert) {
        amenities.push('Keller');
      }

      if (this.ausstattung.rollstuhlgerecht) {
        amenities.push('Rollstuhlgerecht');
      }

      if (this.ausstattung.bad != null) {
        if (this.ausstattung.bad.FENSTER) {
          amenities.push('Fenster im Bad');
        }

        if (this.ausstattung.bad.WANNE) {
          amenities.push('Badewanne');
        }

        if (this.ausstattung.bad.DUSCHE) {
          amenities.push('Dusche');
        }
      }

      if (this.ausstattung.kueche != null) {
        if (this.ausstattung.kueche.EBK) {
          amenities.push('Einbauk&uuml;che');
        }
      }

      if (this.ausstattung.stellplatzart != null) {
        if (this.ausstattung.stellplatzart.FREIPLATZ) {
          amenities.push('Stellplatz');
        }
      }

      if (this.ausstattung.fahrstuhl != null) {
        if (this.ausstattung.fahrstuhl.PERSONEN) {
          amenities.push('Personenaufzug');
        }
      }

      if (this.ausstattung.wasch_trockenraum) {
        amenities.push('Wasch- / Trockenraum');
      }

      if (this.ausstattung.gaestewc) {
        amenities.push('Gäste WC');
      }
    }

    if (this.flaechen != null) {
      if (this.flaechen.anzahl_balkone > 0) {
        amenities.push('Balkon');
      }

      if (this.flaechen.anzahl_terrassen > 0) {
        amenities.push('Terrasse');
      }

      if (this.flaechen.einliegerwohnung) {
        amenities.push('Einliegerwohnung');
      }
    }

    return amenities;
  }

  this.serviceCharge = function () {
    if (this.preise != null) {
      if (this.preise.nebenkosten != null && this.preise.nebenkosten != '') {
        return this.preise.nebenkosten;
      }
    }

    return null;
  }

  this.operationalCosts = function () {
    if (this.preise != null) {
      if (this.preise.betriebskostennetto != null && this.preise.betriebskostennetto != '') {
        return this.preise.betriebskostennetto;
      }
    }

    return null;
  }

  this.heatingCosts = function () {
    if (this.preise != null) {
      return this.preise.heizkosten;
    }

    return null;
  }

  this.heatingCostsInServiceCharge = function () {
    if (this.preise != null) {
      return this.preise.heizkosten_enthalten;
    }

    return null;
  }

  this.securityDeposit = function () {
    if (this.preise != null) {
      return this.preise.kaution;
    }

    return null;
  }

  this.provision = function () {
    if (this.preise != null) {
      return this.preise.provisionnetto;
    }

    return null;
  }

  this.subjectToCommission = function () {
    if (this.preise != null) {
      return this.preise.provisionspflichtig;
    }

    return null;
  }

  this.livingArea = function () {
    if (this.flaechen != null) {
      return this.flaechen.wohnflaeche;
    }

    return null;
  }

  this.availableFrom = function () {
    if (this.verwaltung_objekt != null) {
      return this.verwaltung_objekt.verfuegbar_ab;
    }

    return null;
  }

  this.councilFlat = function () {
    if (this.verwaltung_objekt != null) {
      return this.verwaltung_objekt.wbs_sozialwohnung;
    }
  }

  this.constructionYear = function () {
    if (this.zustand_angaben != null) {
      return this.zustand_angaben.baujahr;
    }

    return null;
  }

  this.state = function () {
    if (this.zustand_angaben != null) {
      switch (this.zustand_angaben.zustand) {
        case 'ERSTBEZUG':
          return 'Erstbezug';
        case 'TEIL_VOLLRENOVIERUNGSBED':
          return 'Teil-/Vollrenovierungsbedürftig';
        case 'NEUWERTIG':
          return 'Neuwertig';
        case 'TEIL_VOLLRENOVIERT':
          return 'Teil-/Vollrenoviert';
        case 'TEIL_SANIERT':
          return 'Teilsaniert';
        case 'VOLL_SANIERT':
          return 'Vollsaniert';
        case 'SANIERUNGSBEDUERFTIG':
          return 'Sanierungsbedürftig';
        case 'BAUFAELLIG':
          return 'Baufällig';
        case 'NACH_VEREINBARUNG':
          return 'Nach Vereinbarung';
        case 'MODERNISIERT':
          return 'Modernisiert';
        case 'GEPFLEGT':
          return 'Gepflegt';
        case 'ROHBAU':
          return 'Rohbau';
        case 'ENTKERNT':
          return 'Entkernt';
        case 'ABRISSOBJEKT':
          return 'Abrissobjekt';
        case 'PROJEKTIERT':
          return 'Projektiert';
      }
    }

    return null;
  }

  this.lastModernization = function () {
    if (this.zustand_angaben != null) {
      return this.zustand_angaben.letztemodernisierung;
    }

    return null;
  }

  this.heatingTypes = function () {
    var heatingTypes = [];

    if (this.ausstattung != null) {
      if (this.ausstattung.heizungsart != null) {
        if (this.ausstattung.heizungsart.OFEN) {
          heatingTypes.push('Ofen');
        }

        if (this.ausstattung.heizungsart.ETAGE) {
          heatingTypes.push('Etagenheizung');
        }

        if (this.ausstattung.heizungsart.ZENTRAL) {
          heatingTypes.push('Zentralheizung');
        }

        if (this.ausstattung.heizungsart.FERN) {
          heatingTypes.push('Fernwärme');
        }

        if (this.ausstattung.heizungsart.FUSSBODEN) {
          heatingTypes.push('Fussbodenheizung');
        }
      }
    }

    return heatingTypes;
  }

  this.heatingType = function () {
    var heatingTypes = this.heatingTypes();

    if (heatingType.length == 0) {
      return this.na;
    } else {
      return heatingTypes.join(', ');
    }
  }

  this.energyCertificate = function () {
    try {
      var energiepass = this.zustand_angaben.energiepass[0];
    } catch(err) {
      return null;
    }

    var energyCertificate = {};

    if (energiepass.epart == null) {
      energyCertificate.type = 'Nicht angegeben';
    } else if (energiepass.epart == 'VERBRAUCH') {
      energyCertificate.type = 'Verbrauchsausweis';

      if (energiepass.energieverbrauchkennwert != null && energiepass.energieverbrauchkennwert != '') {
        energyCertificate.value = energiepass.energieverbrauchkennwert + this.kwh;
        energyCertificate.consumption = energiepass.energieverbrauchkennwert + this.kwh;
      }
    } else {
      energyCertificate.type = 'Bedarfsausweis';

      if (energiepass.endenergiebedarf != null && energiepass.endenergiebedarf != '') {
        energyCertificate.value = energiepass.endenergiebedarf + this.kwh;
        energyCertificate.demand = energiepass.endenergiebedarf + this.kwh;
      }
    }

    if (energiepass.primaerenergietraeger != null) {
      energyCertificate.primaryEnergyCarrier = this.translatePrimaerenergietraeger(energiepass.primaerenergietraeger);
    }

    if (energiepass.wertklasse != null && energiepass.wertklasse != '') {
      energyCertificate.valueClass = energiepass.wertklasse;
    }

    return energyCertificate;
  }

  this.contact = function () {
    var contact = {};
    var name = [];
    var address = [];

    if (this.kontaktperson.anrede != null) {
      contact.salutation = this.kontaktperson.anrede;
      name.push(contact.salutation);
    }

    if (this.kontaktperson.vorname != null) {
      contact.firstName = this.kontaktperson.vorname;
      name.push(contact.firstName);
    }

    contact.lastName = this.kontaktperson.name;
    name.push(contact.lastName);
    contact.name = name.join(' ');

    if (this.kontaktperson.firma != null) {
      contact.company = this.kontaktperson.firma;
    }

    if (this.kontaktperson.strasse != null) {
      contact.street = this.kontaktperson.strasse;
    }

    if (this.kontaktperson.hausnummer != null) {
      contact.houseNumber = this.kontaktperson.hausnummer;
    }

    if (this.kontaktperson.strasse != null && this.kontaktperson.hausnummer != null) {
      contact.streetAndHouseNumber = this.kontaktperson.strasse + ' ' + this.kontaktperson.hausnummer;
      address.push(contact.streetAndHouseNumber);
    }

    if (this.kontaktperson.plz != null) {
      contact.zipCode = this.kontaktperson.plz;
    }

    if (this.kontaktperson.ort != null) {
      contact.city = this.kontaktperson.ort;
    }

    if (this.kontaktperson.plz != null && this.kontaktperson.ort != null) {
      contact.zipCodeAndCity = this.kontaktperson.plz + ' ' + this.kontaktperson.ort;
      address.push(contact.zipCodeAndCity);
    }

    if (address.length > 0) {
      contact.address = address.join(', ');
    }

    if (this.kontaktperson.email_direkt != null) {
      contact.email = this.kontaktperson.email_direkt;
    } else if (this.kontaktperson.email_zentrale != null) {
      contact.email = this.kontaktperson.email_zentrale;
    }

    if (this.kontaktperson.tel_durchw != null) {
      contact.phone = this.kontaktperson.tel_durchw;
    } else if (this.kontaktperson.tel_zentrale != null) {
      contact.phone = this.kontaktperson.tel_zentrale;
    }

    if (this.kontaktperson.url != null) {
      contact.website = this.kontaktperson.url;
    }

    return contact;
  }

  this.renderLink = function (linkElement) {
    var detailsURL;

    if (immobrowse.config.exposeLinkSetter != null) {
      immobrowse.config.exposeLinkSetter(linkElement, this.objectId(), this.cid);
    } else {
      if (immobrowse.config.exposeURLCallback != null) {
        detailsURL = immobrowse.config.exposeURLCallback(this.cid, this.objectId());
      } else if (immobrowse.config.detailsURL != null) {
        detailsURL = this.detailsURL(immobrowse.config.detailsURL);
      } else {
        detailsURL = this.detailsURL('expose.html');
      }

      linkElement.attr('onclick', 'immobrowse.open("' + detailsURL + '");');
    }
  }

  /*
    Sets a value onto the respective element configuration
  */
  this.setValue = function (element, value) {
    if (element != null) {
      if (value == null) {
        if (element.container == undefined) {
          element.html(this.na);
        } else {
          element.value.html(this.na);
          element.container.hide();
        }
      } else {
        if (element.value == undefined) {
          element.html(value);
        } else {
          element.value.html(value);
          element.container.show();
        }
      }
    }
  }

  this.renderEnergyCertificate = function (elements) {
    if (elements != null) {
      var energyCertificate = this.energyCertificate();

      if (energyCertificate != null) {
        this.setValue(elements.type, energyCertificate.type);
        this.setValue(elements.demand, energyCertificate.demand);
        this.setValue(elements.consumption, energyCertificate.consumption);
        this.setValue(elements.primaryEnergyCarrier, energyCertificate.primaryEnergyCarrier);
        this.setValue(elements.valueClass, energyCertificate.valueClass);
      } else {
        this.setValue(elements.type, null);
        this.setValue(elements.demand, null);
        this.setValue(elements.consumption, null);
        this.setValue(elements.primaryEnergyCarrier, null);
        this.setValue(elements.valueClass, null);
      }
    }
  }

  this.renderContact = function (elements) {
    if (elements != null) {
      var contact = this.contact();

      this.setValue(elements.salutation, contact.salutation);
      this.setValue(elements.firstName, contact.firstName);
      this.setValue(elements.lastName, contact.lastName);
      this.setValue(elements.name, contact.name);
      this.setValue(elements.company, contact.company);
      this.setValue(elements.street, contact.street);
      this.setValue(elements.houseNumber, contact.houseNumber);
      this.setValue(elements.streetAndHouseNumber, contact.streetAndHouseNumber);
      this.setValue(elements.zipCode, contact.zipCode);
      this.setValue(elements.city, contact.city);
      this.setValue(elements.zipCodeAndCity, contact.zipCodeAndCity);
      this.setValue(elements.address, contact.address);
      this.setValue(elements.phone, contact.phone);
      this.setValue(elements.website, contact.website);
    }
  }

  /*
    Renders the real estate data into the specified elements.
    All elements are optional.

    @param: elements = {
      linkElement: <linkElement>,
      objectIf: <objectIdElement>,
      objectTitle: <objectTitleElement>,
      coldRent: <coldRentElement>,
      operationalCosts: <operationalCostsElement>,
      serviceCharge: <serviceChargeElement>,
      heatingCosts: <heatingCostsElement>,
      heatingCostsInServiceCharge: <heatingCostsInServiceChargeElement>,
      securityDeposit: <securityDepositElement>,
      subjectToCommission: <subjectToCommissionElement>,
      livingArea: <livingAreaElement>,
      rooms: <roomsElement>,
      floor: <floorElement>,
      availableFrom: <availableFromElement>,
      councilFlat: <councilFlatElement>,
      constructionYear: <constructionYearElement>,
      state: <stateElement>,
      lastModernization: <lastModernizationElement>,
      energyCertificate: {
        type: <typeElement>,
        consumption: <consumptionElement>,
        primaryEnergyCarrier: <primaryEnergyCarrierElement>,
        valueClass: <valueClassElement>
      },
      description: <descriptionElement>,
      exposure: <exposureElement>,
      miscellanea: <miscellaneaElement>,
      contact: {
        salutation: <salutationElement>,
        firstName: <firstNameElement>,
        lastName: <lastNameElement>,
        company: <companyElement>,
        street: <streetElement>,
        houseNumber: <houseNumberElement>,
        streetAndHouseNumber: <streetAndHouseNumberElement>,
        zipCode: <zipCodeElement>,
        city: <cityElement>,
        zipCodeAndCity: <zipCodeAndCityElement>,
        website: <websiteElement>
      },
      amenitiesTags: <amenitiesTagsElement>,
      titleImage: <titleImageElement>
    };
  */
  this.render = function (elements) {
    if (elements.linkElement != null) {
      this.renderLink(elements.linkElement);
    }

    this.setValue(elements.objectId, this.objectId());
    this.setValue(elements.objectTitle, this.objectTitle());
    this.setValue(elements.coldRent, immobrowse.euro(this.rent()));
    this.setValue(elements.serviceCharge, immobrowse.euro(this.serviceCharge()));
    this.setValue(elements.operationalCosts, immobrowse.euro(this.operationalCosts()));
    this.setValue(elements.heatingCosts, immobrowse.euro(this.heatingCosts()));
    this.setValue(elements.heatingCostsInServiceCharge, immobrowse.yesNo(this.heatingCostsInServiceCharge()));
    this.setValue(elements.securityDeposit, immobrowse.euro(this.securityDeposit()));
    this.setValue(elements.provision, immobrowse.euro(this.provision()));
    this.setValue(elements.subjectToCommission, immobrowse.yesNo(this.subjectToCommission()));
    this.setValue(elements.livingArea, immobrowse.squareMeters(this.livingArea()));
    this.setValue(elements.rooms, this.rooms());
    this.setValue(elements.floor, this.floor());
    this.setValue(elements.availableFrom, this.availableFrom());
    this.setValue(elements.councilFlat, immobrowse.yesNo(this.councilFlat()));
    this.setValue(elements.constructionYear, this.constructionYear());
    this.setValue(elements.state, this.state());
    this.setValue(elements.lastModernization, this.lastModernization());
    this.setValue(elements.heatingType, this.heatingType());
    this.renderEnergyCertificate(elements.energyCertificate);
    this.setValue(elements.description, this.description());
    this.setValue(elements.exposure, this.exposure());
    this.setValue(elements.miscellanea, this.miscellanea());
    this.renderContact(elements.contact);
    this.setValue(elements.amenitiesTags, this.amenitiesTags());
    this.setValue(elements.amenitiesList, this.amenitiesList());

    if (elements.titleImage != null) {
      var titleImage = this.titleImage();
      if (elements.titleImage.image != null) {
        elements.titleImage.image.attr('src', this.attachmentURL(titleImage));
        elements.titleImage.caption.html(titleImage.anhangtitel);
      } else {
        elements.titleImage.attr('src', this.attachmentURL(titleImage));
      }
    }
  }
}


/*
  Real estate list class
*/
immobrowse.List = function (cid, realEstates) {
  this.cid = cid;
  this.realEstates = realEstates;
  this.filteredRealEstates = realEstates;

  /*
    Match filters on a real estate's JSON data.
  */
  this.match = function (realEstate, filters) {
    var rent = realEstate.rent();

    if (filters.priceMin > rent) {
      return false;
    }

    if (filters.priceMax < rent) {
      return false;
    }

    if (filters.areaMin != null) {
      if (realEstate.flaechen == null) {
        return false;
      } else if (filters.areaMin > realEstate.flaechen.wohnflaeche) {
        return false;
      }
    }

    if (filters.roomsMin != null) {
      if (realEstate.flaechen == null) {
        return false;
      } else if (filters.roomsMin > realEstate.flaechen.anzahl_zimmer) {
        return false;
      }
    }

    if (filters.ebk) {
      if (realEstate.ausstattung == null) {
        return false;
      } else if (realEstate.ausstattung.kueche == null) {
        return false;
      } else if (! realEstate.ausstattung.kueche.EBK) {
        return false;
      }
    }

    if (filters.bathtub) {
      if (realEstate.ausstattung == null) {
        return false;
      } else if (realEstate.ausstattung.bad == null) {
        return false;
      } else if (! realEstate.ausstattung.bad.WANNE) {
        return false;
      }
    }

    if (filters.window) {
      if (realEstate.ausstattung == null) {
        return false;
      } else if (realEstate.ausstattung.bad == null) {
        return false;
      } else if (! realEstate.ausstattung.bad.FENSTER) {
        return false;
      }
    }

    if (filters.guestwc) {
      if (realEstate.ausstattung == null) {
        return false;
      } else if (! realEstate.ausstattung.gaestewc) {
        return false;
      }
    }

    if (filters.carSpace) {
      if (realEstate.ausstattung == null) {
        return false;
      } else if (realEstate.ausstattung.stellplatzart == null) {
        return false;
      } else if (! realEstate.ausstattung.stellplatzart.TIEFGARAGE) {
        return false;
      }
    }

    if (filters.elevator) {
      if (realEstate.ausstattung == null) {
        return false;
      } else if (realEstate.ausstattung.fahrstuhl == null) {
        return false;
      } else if (! realEstate.ausstattung.fahrstuhl.PERSONEN) {
        return false;
      }
    }

    if (filters.garden) {
      if (realEstate.ausstattung == null) {
        return false;
      } else if (! realEstate.ausstattung.gartennutzung) {
        return false;
      }
    }

    if (filters.balcony) {
      if (realEstate.flaechen == null) {
        return false;
      } else if (realEstate.flaechen.anzahl_balkone == null || realEstate.flaechen.anzahl_balkone == 0) {
        return false;
      }
    }

    if (filters.districts.length > 0) {
      if (filters.districts.indexOf(realEstate.district()) < 0) {
        return false;
      }
    }

    return true;
  }

  /*
    Filters real estates.
  */
  this.filter = function (filters) {
    this.filteredRealEstates = [];

    for (var i = 0; i < this.realEstates.length; i++) {
      if (this.match(this.realEstates[i], filters)) {
        this.filteredRealEstates.push(this.realEstates[i]);
      } else {
        immobrowse.logger.debug('Discarding: ' + this.realEstates[i].objectId());
      }
    }

    if (! this.filteredRealEstates) {
      immobrowse.logger.warning('No real estates available after filtering.');
    }
  }

  /*
    Sorts real estates.
  */
  this.sort = function (property, order) {
    immobrowse.logger.debug('Sorting by ' + property + ' ' + order + '.');
    this.filteredRealEstates.sort(immobrowse.getSorter(property, order));
  }

  /*
    Returns the respective districts.
  */
  this.districts = function () {
    var districts = [];

    for (var i = 0; i < this.realEstates.length; i++) {
      var district = this.realEstates[i].district();

      if (district != null) {
        if (districts[district] != undefined) {
          districts[district] += 1;
        } else {
          districts[district] = 1;
        }
      }
    }

    return districts;
  }

  /*
    Copies the template and idices the respective IDs.
  */
  this.copy = function (template, index) {
    var clone = template.clone();
    clone.find('*').map(function() {
      if (this.id != '') {
        this.id += '_' + index;
      }
    });
    return clone;
  }

  /*
    Renders the respective real estates into the given HTML element.
  */
  this.render = function (listElement, listItemTemplate, elements) {
    listElement.html('');

    for (var i = 0; i < this.filteredRealEstates.length; i++) {
      var listItem = this.copy(listItemTemplate, i);
      listElement.html(listElement.html() + listItem.html());
      this.filteredRealEstates[i].render(elements(i));
    }
  }
}
