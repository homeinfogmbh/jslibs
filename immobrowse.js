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

var immobrowse = immobrowse || {};

// Logger
immobrowse.logger = new homeinfo.logging.Logger('immobrowse', homeinfo.logging.DEBUG);


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


/*** HTML formatting ***/

immobrowse.escapeHtml = function (string) {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;',
    "ä": '&auml;',
    "ö": '&#ouml;',
    "ü": '&#uuml;',
    "Ä": '&#Auml;',
    "Ö": '&#Ouml;',
    "Ü": '&#Uuml;',
    "ß": '&#szlig;'
  };
  return String(string).replace(/[&<>"'\/äöüÄÖÜß]/g, function (s) {
    return entityMap[s];
  });
}


immobrowse.euroHtml = function (price) {
  if (price == null) {
    return 'N/A';
  } else {
    return (price.toFixed(2) + ' &euro;').replace('.',',');
  }
}


immobrowse.squareMetersHtml = function (area) {
  if (area == null) {
    return 'N/A';
  } else {
    return (area.toFixed(2) + ' m&sup2;').replace('.', ',');
  }
}


/*
  Queries real estate data from the API and runs callback function.
*/
immobrowse.getRealEstate = function (cid, objektnr_extern, callback) {
  $.ajax({
    url: 'https://tls.homeinfo.de/immobrowse/real_estate/' + objektnr_extern + '?customer=' + cid,
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


// Opens the respective URL
immobrowse.open = function (url) {
  window.open(url, '_self');
}


immobrowse.mkContactMail = function (
    objektnr_extern, salutation, forename, surname, phone,
    street, house_number, zip_code, city, message) {
  html = '<!DOCTYPE HTML>\n';
  html += '<h1>Anfrage zu Objekt Nr. <strong>' + objektnr_extern + '</strong></h1>\n<br>\n';
  html += salutation + ' ' + forename + ' ' + surname + '\n<br>\n';

  if (street) {
    html += street;
  }

  if (house_number) {
    html += house_number;
  }

  if (street || house_number) {
    html += '<br>\n';
  }

  if (zip_code) {
    html += zip_code;
  }

  if (city) {
    if (zip_code) {
      html += ' ';
    }

    html += ' ' + city;
  }

  if (zip_code || city) {
    html += '<br>\n';
  }

  if (phone) {
    html += 'Tel.: ' + phone  + '\n<br>\n';
  }

  html += 'hat folgende Anfrage an Sie:\n<br>\n<br>\n';
  html += '<p>' + message.replace('\n', '\n<br>\n') + '</p>';
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

  this.objektnr_extern = function () {
    return this.verwaltung_techn.objektnr_extern;
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
    if (this.flaechen == null) {
      return null;
    } else {
      if (this.flaechen.anzahl_zimmer == null) {
        return null;
      } else {
        return homeinfo.str.dot2comma(this.flaechen.anzahl_zimmer.toString());
      }
    }
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

    if (netColdRent == null) {
      return this.coldRent();
    } else {
      return netColdRent;
    }
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

  this.primaerenergietraeger = function () {
    var pet = this.zustand_angaben.energiepass[0].primaerenergietraeger;

    switch (pet) {
      case 'OEL':
        return "Öl";
      case 'GAS':
        return "Gas";
      case 'ELEKTRO':
        return "Elektisch";
      case 'ALTERNATIV':
        return "Alternativ";
      case 'SOLAR':
        return "Solar";
      case 'ERDWAERME':
        return "Erdwärme";
      case 'LUFTWP':
        return "Wärmepumpe Luft-Wasser";
      case 'FERN':
        return "Fernwärme";
      case 'BLOCK':
        return "Blockheizkraftwerk";
      case 'WASSER-ELEKTRO':
        return "Ergänzendes dezentrales Warmwasser";
      case 'PELLET':
        return "Pellet";
      case 'KOHLE':
        return "Kohle";
      case 'HOLZ':
        return "Holz";
      case 'FLUESSIGGAS':
        return "Flüssiggas";
    }

    return pet;
  }

  this.zustand = function () {
    var zustand = this.zustand_angaben.zustand;

    switch (zustand) {
      case 'ERSTBEZUG':
        return "Erstbezug";
      case 'TEIL_VOLLRENOVIERUNGSBED':
        return "Teil-/Vollrenovierungsbedürftig";
      case 'NEUWERTIG':
        return "Neuwertig";
      case 'TEIL_VOLLRENOVIERT':
        return "Teil-/Vollrenoviert";
      case 'TEIL_SANIERT':
        return "Teilsaniert";
      case 'VOLL_SANIERT':
        return "Vollsaniert";
      case 'SANIERUNGSBEDUERFTIG':
        return "Sanierungsbedürftig";
      case 'BAUFAELLIG':
        return "Baufällig";
      case 'NACH_VEREINBARUNG':
        return "Nach Vereinbarung";
      case 'MODERNISIERT':
        return "Modernisiert";
      case 'GEPFLEGT':
        return "Gepflegt";
      case 'ROHBAU':
        return "Rohbau";
      case 'ENTKERNT':
        return "Entkernt";
      case 'ABRISSOBJEKT':
        return "Abrissobjekt";
      case 'PROJEKTIERT':
        return "Projektiert";
    }

    return zustand;
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

  this.attachmentURL = function (anhang) {
    if (anhang == null) {
      return null;
    } else {
      return 'https://tls.homeinfo.de/immobrowse/attachment/' + anhang.id
        + '?customer=' + this.cid + '&objektnr_extern=' + this.objektnr_extern();
    }
  }

  this.detailsURL = function (baseUrl) {
    if (baseUrl == null) {
      return null;
    } else {
      return baseUrl + '?customer=' + this.cid + '&objektnr_extern=' + this.objektnr_extern();
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
        immobrowse.logger.debug('Lage: ' + this.freitexte.lage);
        return this.freitexte.lage;
      }
    }

    return null;
  }

  this.attachments = function () {
    var attachments = [];

    if (this.anhaenge != null) {
      if (this.anhaenge.anhang != null) {
        for (i = 0; i < this.anhaenge.anhang.length; i++) {
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
      if (attachments[i].gruppe == "GRUNDRISS") {
        floorplans.push(attachments[i]);
      }
    }

    return floorplans;
  }

  this.floorplan = function () {
    return this.floorplans()[0];
  }

  this.furnishingTags = function () {
    var html = '';

    if (this.ausstattung != null) {
      if (this.flaechen != null) {
        if (this.flaechen.anzahl_balkone > 0) {
          html += this.oval.replace('{}', 'Balkon');
        }
      }

      if (this.ausstattung.barrierefrei) {
        html += this.oval.replace('{}', 'Barrierefrei');
      }

      if (this.ausstattung.kabel_sat_tv) {
        html += this.oval.replace('{}', 'Kabel / Sat. / TV');
      }

      if (this.ausstattung.unterkellert) {
        html += this.oval.replace('{}', 'Keller');
      }

      if (this.ausstattung.rollstuhlgerecht) {
        html += this.oval.replace('{}', 'Rollstuhlgerecht');
      }

      if (this.ausstattung.bad != null) {
        if (this.ausstattung.bad.FENSTER) {
          html += this.oval.replace('{}', 'Fenster im Bad');
        }

        if (this.ausstattung.bad.WANNE) {
          html += this.oval.replace('{}', 'Badewanne');
        }

        if (this.ausstattung.bad.DUSCHE) {
          html += this.oval.replace('{}', 'Dusche');
        }
      }

      if (this.ausstattung.kueche != null) {
        if (this.ausstattung.kueche.EBK) {
          html += this.oval.replace('{}', 'Einbauk&uuml;che');
        }
      }

      if (this.ausstattung.stellplatzart != null) {
        if (this.ausstattung.stellplatzart.FREIPLATZ) {
          html += this.oval.replace('{}', 'Stellplatz');
        }
      }

      if (this.ausstattung.fahrstuhl != null) {
        if (this.ausstattung.fahrstuhl.PERSONEN) {
          html += this.oval.replace('{}', 'Personenaufzug');
        }
      }
    }

    return html;
  }

  this.floor = function (short) {
    var ordinal = '. ';
    var dg = 'Dachgeschoss';
    var og = 'Obergeschoss';
    var eg = 'Erdgeschoss';
    var ug = 'Untergeschoss';

    if (short) {
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

  /*
    Sets a value onto the respective element configuration
  */
  this.setValue = function (element, value) {
    if (value == null) {
      if (element.container != null) {
        element.container.hide();
      } else {
        element.html(this.na);
      }
    } else {
      if (element.value != null) {
        element.value.html(value);
      } else {
        element.html(value);
      }
    }
  }


  /*
    Renders prices into the respective elements.
  */
  this.renderPrices = function (elements) {
    if (elements.coldRent != null) {
      var coldRent = this.rent();

      if (coldRent != null) {
        this.setValue(elements.coldRent, immobrowse.euroHtml(this.preise.nettokaltmiete));
      } else {
        this.setValue(elements.coldRent);
      }
    }

    if (elements.serviceCharge != null) {
      if (this.preise.nebenkosten != null) {
        elements.serviceCharge.html(immobrowse.euroHtml(this.preise.nebenkosten));
      } else {
        elements.serviceCharge.html(this.na);
      }
    }

    if (elements.heatingCosts != null) {
      if (this.preise.heizkosten != null) {
        elements.heatingCosts.html(immobrowse.euroHtml(this.preise.heizkosten));
      } else {
        elements.heatingCosts.html(this.na);
      }
    }

    if (elements.heatingCostsInServiceCharge != null) {
      if (this.preise.heizkosten_enthalten != null) {
        if (this.preise.heizkosten_enthalten == true) {
          elements.heatingCostsInServiceCharge.html('Ja');
        } else {
          elements.heatingCostsInServiceCharge.html('Nein');
        }
      } else {
        elements.heatingCostsInServiceCharge.html(this.na);
      }
    }

    if (elements.securityDeposit != null) {
      if (this.preise.kaution != null) {
        elements.securityDeposit.html(immobrowse.euroHtml(this.preise.kaution));
      } else {
        elements.securityDeposit.html(this.na);
      }
    }

    if (elements.subjectToCommission != null) {
      if (this.preise.provisionspflichtig != null) {
        if (this.preise.provisionspflichtig) {
          elements.subjectToCommission.html('Ja');
        } else {
          elements.subjectToCommission.html('Nein');
        }
      }
    }
  }

  /*
    Renders area data into the respective elements.
  */
  this.renderArea = function (elements) {
    if (elements.livingArea != null) {
      if (this.flaechen.wohnflaeche != null) {
        elements.livingArea.html(immobrowse.squareMetersHtml(this.flaechen.wohnflaeche));
      } else {
        elements.livingArea.html(this.na);
      }
    }

    if (elements.rooms != null) {
      if (this.flaechen.anzahl_zimmer != null) {
        elements.rooms.html(this.rooms());
      } else {
        elements.rooms.html(this.na);
      }
    }
  }

  /*
    Renders geo data into the respective elements.
  */
  this.renderGeo = function (elements) {
    if (elements.floor != null) {
      if (this.geo.etage != null) {
        elements.floor.html(this.geo.etage);
      } else {
        elements.floor.html(this.na);
      }
    }
  }

  /*
    Renders management information into the respective elements.
  */
  this.renderManagement = function (elements) {
    if (elements.availableFrom != null) {
      if (this.verwaltung_objekt != null) {
        if (this.verwaltung_objekt.verfuegbar_ab != null) {
          elements.availableFrom.html(this.verwaltung_objekt.verfuegbar_ab);
        } else {
          elements.availableFrom.html(this.na);
        }
      } else {
        elements.availableFrom.html(this.na);
      }
    }

    if (elements.councilFlat != null) {
      if (this.verwaltung_objekt != null) {
        if (this.verwaltung_objekt.wbs_sozialwohnung == true) {
          elements.councilFlat.html('Ja');
        } else {
          elements.councilFlat.html(this.na);
        }
      } else {
        elements.councilFlat.html(this.na);
      }
    }
  }

  /*
    Renders state information into the respective elements.
  */
  this.renderState = function (elements) {
    if (elements.constructionYear != null) {
      if (this.zustand_angaben != null) {
        if (this.zustand_angaben.baujahr != null) {
          elements.constructionYear.html(this.zustand_angaben.baujahr);
        } else {
          elements.constructionYear.html(this.na);
        }
      } else {
        elements.constructionYear.html(this.na);
      }
    }

    if (elements.state != null) {
      if (this.zustand_angaben != null) {
        if (this.zustand_angaben.zustand != null) {
          elements.state.html(this.zustand());
        } else {
          elements.state.html(this.na);
        }
      } else {
        elements.state.html(this.na);
      }
    }

    if (elements.lastModernization != null) {
      if (this.zustand_angaben != null) {
        if (this.zustand_angaben.letztemodernisierung != null) {
          elements.lastModernization.html(this.zustand_angaben.letztemodernisierung);
        } else {
          elements.lastModernization.html(this.na);
        }
      } else {
        elements.lastModernization.html(this.na);
      }
    }

    if (elements.energyCertificate != null) {
      this.renderEnergyCertificate(elements.energyCertificate);
    }
  }

  /*
    Renders the energy certificate into the respective elements.
  */
  this.renderEnergyCertificate = function (elements) {
    var energiepass;

    try {
      energiepass = this.zustand_angaben.energiepass[0];
    } catch(err) {
      energiepass = {};
    }

    if (elements.type != null) {
      if (energiepass.epart == null) {
        elements.type.html('Nicht angegeben');
      } else if (energiepass.epart == 'VERBRAUCH') {
        elements.type.html('Verbrauchsausweis');
      } else {
        elements.type.html('Bedarfsausweis');
      }
    }

    if (energiepass.epart == null) {
      if (elements.demandContainer != null) {
        elements.demandContainer.hide();
      }

      if (elements.consumptionContainer != null) {
        elements.consumptionContainer.hide();
      }
    } else if (energiepass.epart == 'VERBRAUCH') {
      if (elements.consumption != null) {
        if (energiepass.energieverbrauchkennwert != null && energiepass.energieverbrauchkennwert != '') {
          elements.consumption.html(energiepass.energieverbrauchkennwert + this.kwh);
        } else {
          elements.consumption.html(this.na);
        }
      }

      if (elements.consumptionContainer != null) {
        elements.consumptionContainer.show();
      }

      if (elements.demandContainer != null) {
        elements.demandContainer.hide();
      }
    } else {
      if (elements.demand != null) {
        if (energiepass.endenergiebedarf != null && energiepass.endenergiebedarf != '') {
          elements.demand.html(energiepass.endenergiebedarf + this.kwh);
        } else {
          elements.demand.html(this.na);
        }
      }

      if (elements.demandContainer != null) {
        elements.demandContainer.show();
      }

      if (elements.consumptionContainer != null) {
        elements.consumptionContainer.hide();
      }
    }

    if (elements.primaryEnergyCarrier != null) {
      if (energiepass.primaerenergietraeger != null) {
        elements.primaryEnergyCarrier.html(this.primaerenergietraeger());
      } else {
        elements.primaryEnergyCarrier.html(this.na);
      }
    }

    if (elements.valueClass != null) {
      if (energiepass.wertklasse != null) {
        elements.valueClass.html(energiepass.wertklasse);
      } else {
        elements.valueClass.html(this.na);
      }
    }
  }

  /*
    Renders free texts into the respective elements.
  */
  this.renderFreeTexts = function (elements) {
    if (elements.description != null) {
      this.setValue(elements.description, this.description());
    }

    if (elements.exposure != null) {
      this.setValue(elements.exposure, this.exposure());
    }

    if (elements.miscellanea != null) {
      this.setValue(elements.miscellanea, this.miscellanea());
    }
  }

  /*
    Renders contact data into the respective elements.
  */
  this.renderContact = function (elements) {
    if (elements.salutation != null) {
      if (this.kontaktperson.anrede != null) {
        elements.salutation.html(this.kontaktperson.anrede);
      } else {
        elements.salutation.html(this.na);
      }
    }

    if (elements.firstName != null) {
      if (this.kontaktperson.vorname != null) {
        elements.firstName.html(this.kontaktperson.vorname);
      } else {
        elements.firstName.html(this.na);
      }
    }

    if (elements.lastName != null) {
      elements.lastName.html(this.kontaktperson.name);
    }
    if (elements.company != null) {
      if (this.kontaktperson.firma != null) {
        elements.company.html(this.kontaktperson.firma);
      } else {
        elements.company.html(this.na);
      }
    }

    if (elements.street != null) {
      if (this.kontaktperson.strasse != null) {
        elements.street.html(this.kontaktperson.strasse);
      } else {
        elements.street.html(this.na);
      }
    }

    if (elements.houseNumber != null) {
      if (this.kontaktperson.hausnummer != null) {
        elements.houseNumber.html(this.kontaktperson.hausnummer);
      } else {
        elements.houseNumber.html(this.na);
      }
    }

    if (elements.streetAndHouseNumber != null) {
      if (this.kontaktperson.strasse != null && this.kontaktperson.hausnummer != null) {
        elements.streetAndHouseNumber.html(this.kontaktperson.strasse + ' ' + this.kontaktperson.hausnummer);
      } else {
        elements.streetAndHouseNumber.html(this.na);
      }
    }

    if (elements.zipCode != null) {
      if (this.kontaktperson.plz != null) {
        elements.zipCode.html(this.kontaktperson.plz);
      } else {
        elements.zipCode.html(this.na);
      }
    }

    if (elements.city != null) {
      if (this.kontaktperson.ort != null) {
        elements.city.html(this.kontaktperson.ort);
      } else {
        elements.city.html(this.na);
      }
    }

    if (elements.zipCodeAndCity != null) {
      if (this.kontaktperson.plz != null && this.kontaktperson.ort != null) {
        elements.zipCodeAndCity.html(this.kontaktperson.plz + ' ' + this.kontaktperson.ort);
      } else {
        elements.zipCodeAndCity.html(this.na);
      }
    }

    if (elements.phone != null) {
      if (this.kontaktperson.tel_durchw != null) {
        elements.phone.html(this.kontaktperson.tel_durchw);
      } else if (this.kontaktperson.tel_zentrale != null) {
        elements.phone.html(this.kontaktperson.tel_direkt);
      } else {
        elements.phone.html(this.na);
      }
    }

    if (elements.website != null) {
      if (this.kontaktperson.url != null) {
        elements.website.html(this.kontaktperson.url);
      } else {
        elements.website.html(this.na);
      }
    }
  }

  /*
    Renders the real estate data into the specified elements.
    All elements are optional.

    @param: elements = {
      linkElement: <linkElement>,
      objectTitle: <objectTitleElement>,
      prices: {
        coldRent: <coldRentElement>,
        serviceCharge: <serviceChargeElement>,
        heatingCosts: <heatingCostsElement>,
        heatingCostsInServiceCharge: <heatingCostsInServiceChargeElement>,
        securityDeposit: <securityDepositElement>,
        subjectToCommission: <subjectToCommissionElement>
      },
      area: {
        livingArea: <livingAreaElement>,
        rooms: <roomsElement>
      },
      geo: {
        floor: <floorElement>
      },
      management: {
        availableFrom: <availableFromElement>,
        councilFlat: <councilFlatElement>
      },
      state: {
        constructionYear: <constructionYearElement>,
        state: <stateElement>,
        lastModernization: <lastModernizationElement>,
        energyCertificate: {
          type: <typeElement>,
          consumption: <consumptionElement>,
          primaryEnergyCarrier: <primaryEnergyCarrierElement>,
          valueClass: <valueClassElement>
        }
      },
      freeTexts: {
        description: <descriptionElement>,
        exposure: <exposureElement>,
        miscellanea: <miscellaneaElement>
      },
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
      furnishingTags: <furnishingTagsElement>,
      titleImage: <titleImageElement>
    };
  */
  this.render = function (elements) {
    if (elements.linkElement != null) {
      //  TODO: Make details link dynamic by reading appropriate configuration.
      elements.linkElement.attr('onclick', 'immobrowse.open("' + this.detailsURL('expose.html') + '");');
    }

    if (elements.objectTitle != null) {
      elements.objectTitle.html(this.objectTitle());
    }

    if (elements.prices != null) {
      this.renderPrices(elements.prices);
    }

    if (elements.area != null) {
      this.renderArea(elements.area);
    }

    if (elements.geo != null) {
      this.renderGeo(elements.geo);
    }

    if (elements.management != null) {
      this.renderManagement(elements.management);
    }

    if (elements.state != null) {
      this.renderState(elements.state);
    }

    if (elements.freeTexts != null) {
      this.renderFreeTexts(elements.freeTexts);
    }

    if (elements.contact != null) {
      this.renderContact(elements.contact);
    }

    if (elements.furnishingTags != null) {
      elements.furnishingTags.html(this.furnishingTags());
    }

    if (elements.titleImage != null) {
      elements.titleImage.attr('src', this.attachmentURL(this.titleImage()));
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
        immobrowse.logger.debug('Discarding: ' + this.realEstates[i].objektnr_extern());
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
    Copies the template and idexes the respective IDs.
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
  this.render = function (listElement, listItemTemplate, elements, na) {
    listElement.html('');

    for (var i = 0; i < this.filteredRealEstates.length; i++) {
      var listItem = this.copy(listItemTemplate, i);
      listElement.html(listElement.html() + listItem.html());
      this.filteredRealEstates[i].render(elements(i));
    }
  }
}
