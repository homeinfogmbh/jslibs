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


immobrowse.titleImageHtml = function (url) {
  return '<img src="' + url + '" alt="Titelbild" class="ib-preview-image img-responsive">';
}


/**TODO Mockup **/
immobrowse.titleImageDummy = 'https://tls.homeinfo.de/does/not/exist';

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
      text: 'Bitte versuchen Sie es später nochmal.',
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
  this.oval = '<div class="ib-preview-oval"><div class="oval">{}</div></div>';
  this.kwh = '<sup>kWh</sup>&frasl;<sub>m<sup>2</sup>&middot;a</sub>';

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

  this.objekttitel = function () {
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

  this.miscNotes = function () {
    if (this.freitexte != null) {
      return this.freitexte.sonstige_angaben;
    } else {
      return null;
    }
  }

  this.description = function () {
    if (this.freitexte != null) {
      return this.freitexte.objektbeschreibung;
    } else {
      return null;
    }
  }

  this.exposure = function () {
    if (this.freitexte != null) {
      return this.freitexte.lage;
    } else {
      return null;
    }
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

  this.pictures = function () {
    var attachments = this.attachments();
    var pictures = [];

    for (var i = 0; i < attachments.length; i++) {
      switch(attachment[i].gruppe) {
        case 'BILD':
          pictures.push(attachment[i]);
        case 'AUSSENANSICHTEN':
          pictures.push(attachment[i]);
        case 'INNENANSICHTEN':
          pictures.push(attachment[i]);
        default:
          continue;
      }
    }

    return pictures;
  }

  this.floorplans = function () {
    var attachments = this.attachments();
    var floorplans = [];

    for (var i = 0; i < attachments.length; i++) {
      if (attachment[i].gruppe == "GRUNDRISS") {
        floorplans.push(attachment[i]);
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

  this.renderPrices = function (priceElements) {
    if (priceElements.coldRent != null) {
      if (this.preise.nettokaltmiete != null) {
        priceElements.coldRent.html(immobrowse.euroHtml(this.preise.nettokaltmiete));
      }
    }

    if (priceElements.serviceCharge != null) {
      if (this.preise.nebenkosten != null) {
        priceElements.serviceCharge.html(immobrowse.euroHtml(this.preise.nebenkosten));
      }
    }

    if (priceElements.heatingCosts != null) {
      if (this.preise.heizkosten != null) {
        priceElements.heatingCosts.html(immobrowse.euroHtml(this.preise.heizkosten));
      }
    }

    if (priceElements.heatingCostsInServiceCharge != null) {
      if (this.preise.heizkosten_enthalten != null) {
        if (this.preise.heizkosten_enthalten == true) {
          priceElements.heatingCostsInServiceCharge.html('Ja');
        } else {
          priceElements.heatingCostsInServiceCharge.html('Nein');
        }
      }
    }

    if (priceElements.securityDeposit != null) {
      if (this.preise.kaution != null) {
        priceElements.securityDeposit.html(immobrowse.euroHtml(this.preise.kaution));
      }
    }

    if (priceElements.subjectToCommission != null) {
      if (this.preise.provisionspflichtig != null) {
        if (this.preise.provisionspflichtig) {
          priceElements.subjectToCommission.html('Ja');
        } else {
          priceElements.subjectToCommission.html('Nein');
        }
      }
    }
  }

  this.renderArea = function (areaElements) {
    if (areaElements.livingArea != null) {
      if (this.flaechen.wohnflaeche != null) {
        areaElements.livingArea.html(immobrowse.squareMetersHtml(this.flaechen.wohnflaeche));
      }
    }

    if (areaElements.rooms != null) {
      if (this.flaechen.anzahl_zimmer != null) {
        areaElements.rooms.html(this.rooms());
      }
    }
  }

  this.renderGeo = function (geoElements) {
    if (geoElements.floor != null) {
      if (this.geo.etage != null) {
        geoElements.floor.html(this.geo.etage);
      }
    }
  }

  this.renderManagement = function (managementElements) {
    if (this.verwaltung_objekt != null) {
      if (managementElements.availableFrom != null) {
        if (this.verwaltung_objekt.verfuegbar_ab != null) {
          managementElements.availableFrom.html(this.verwaltung_objekt.verfuegbar_ab);
        }
      }

      if (managementElements.councilFlat != null) {
        if (this.verwaltung_objekt.wbs_sozialwohnung == true) {
          managementElements.councilFlat.html('Ja');
        }
      }
    }
  }

  this.renderState = function (stateElements) {
    if (this.zustand_angaben != null) {
      if (stateElements.constructionYear != null) {
        if (this.zustand_angaben.baujahr != null) {
          stateElements.constructionYear.html(this.zustand_angaben.baujahr);
        }
      }

      if (stateElements.state != null) {
        if (this.zustand_angaben.zustand != null) {
          stateElements.state.html(this.zustand());
        }
      }

      if (stateElements.lastModernization != null) {
        if (this.zustand_angaben.letztemodernisierung != null) {
          stateElements.lastModernization.html(this.zustand_angaben.letztemodernisierung);
        }
      }

      if (stateElements.energyCertificate != null) {
        if (this.zustand_angaben.energiepass != null) {
          if (this.zustand_angaben.energiepass.length > 0) {
            this.renderEnergyCertificate(stateElements.energyCertificate);
          }
        }
      }
    }
  }

  this.renderEnergyCertificate = function (energyCertificateElements) {
    var energiepass = this.zustand_angaben.energiepass[0];

    if (energyCertificateElements.type != null) {
      if (energiepass.epart == null) {
        energyCertificateElements.type.html('Nicht angegeben');
      } else if (energiepass.epart == 'VERBRAUCH') {
        energyCertificateElements.type.html('Verbrauchsausweis');
      } else {
        energyCertificateElements.type.html('Bedarfsausweis');
      }
    }

    if (energyCertificateElements.consumption != null) {
      if (energiepass.energieverbrauchkennwert != '') {
        energyCertificateElements.consumption.html(energiepass.energieverbrauchkennwert + this.kwh);
      }
    }

    if (energyCertificateElements.primaryEnergyCarrier != null) {
      if (energiepass.primaerenergietraeger != null) {
        energyCertificateElements.primaryEnergyCarrier.html(this.primaerenergietraeger());
      }
    }

    if (energyCertificateElements.valueClass != null) {
      if (energiepass.wertklasse != null) {
        energyCertificateElements.valueClass.html(energiepass.wertklasse);
      }
    }
  }

  this.renderFreeTexts = function (freeTextElements) {
    if (this.freitexte != null) {
      if (freeTextElements.description != null) {
        if (this.freitexte.objektbeschreibung != null) {
          freeTextElements.description.html(this.freitexte.objektbeschreibung);
        }
      }

      if (freeTextElements.exposure != null) {
        if (this.freitexte.lage != null) {
          freeTextElements.exposure.html(this.freitexte.lage);
        }
      }

      if (freeTextElements.miscellanea != null) {
        if (this.freitexte.sonstige_angaben != null) {
          freeTextElements.miscellanea.html(this.freitexte.sonstige_angaben);
        }
      }
    }
  }

  this.renderContact = function (contactElements) {
    if (contactElements.salutation != null)
      if (this.kontaktperson.anrede != null) {
        contactElements.salutation.html(this.kontaktperson.anrede);
      }
    }

    if (contactElements.firstName != null) {
      if (this.kontaktperson.vorname != null) {
        contactElements.firstName.html(this.kontaktperson.vorname);
      }
    }

    if (contactElements.lastName != null) {
      contactElements.lastName.html(this.kontaktperson.name);
    }

    if (contactElements.company != null) {
      if (this.kontaktperson.firma != null) {
        contactElements.company.html(this.kontaktperson.firma);
      }
    }

    if (contactElements.street != null) {
      if (this.kontaktperson.strasse != null) {
        contactElements.street.html(this.kontaktperson.strasse);
      }
    }

    if (contactElements.houseNumber != null) {
      if (this.kontaktperson.hausnummer != null) {
        contactElements.houseNumber.html(this.kontaktperson.hausnummer);
      }
    }

    if (contactElements.streetAndHouseNumber != null) {
      if (this.kontaktperson.strasse != null && this.kontaktperson.hausnummer != null) {
        contactElements.streetAndHouseNumber.html(this.kontaktperson.strasse + ' ' + this.kontaktperson.hausnummer);
      }
    }

    if (contactElements.zipCode != null) {
      if (this.kontaktperson.plz != null) {
        contactElements.zipCode.html(this.kontaktperson.plz);
      }
    }

    if (contactElements.city != null) {
      if (this.kontaktperson.ort != null) {
        contactElements.city.html(this.kontaktperson.ort);
      }
    }

    if (contactElements.zipCodeAndCity != null) {
      if (this.kontaktperson.plz != null && this.kontaktperson.ort != null) {
        contactElements.zipCodeAndCity.html(this.kontaktperson.plz + ' ' + this.kontaktperson.ort);
      }
    }

    if (contactElements.phone != null) {
      if (this.kontaktperson.tel_durchw != null) {
        contactElements.phone.html(this.kontaktperson.tel_durchw);
      } else if (this.kontaktperson.tel_zentrale != null) {
        contactElements.phone.html(this.kontaktperson.tel_direkt);
      }
    }

    if (contactElements.website != null) {
      if (this.kontaktperson.url != null){
        contactElements.website.html(this.kontaktperson.url);
      }
    }
  }

  this.render = function (elements) {
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
  }

  this.preview = function (baseUrl) {
    var titleImageUrl = this.attachmentURL(this.titleImage());
    var rooms = this.rooms();
    var url = baseUrl.replace('{cid}', this.cid).replace('{objektnr_extern}', this.objektnr_extern());
    html = '<div class="ib-preview-entry" onclick="immobrowse.open(\'' + url + '\');">';

    if (titleImageUrl != null) {
      html += immobrowse.titleImageHtml(titleImageUrl);
    } else {
      html += immobrowse.titleImageHtml(immobrowse.titleImageDummy);
    }

    html += '<div class="ib-preview-data">';
    html += '<div class="ib-preview-header">';
    html += '<div class="ib-preview-header-title">';
    html += '<h3><strong>' + this.objekttitel() + '</strong></h3>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ib-preview-body">';
    html += '<div class="ib-preview-rent">';
    html += '<div class="ib-preview-rent-caption">Nettokaltmiete</div>';
    html += '<div class="ib-preview-rent-data">' + immobrowse.euroHtml(this.rent()) + '</div>';
    html += '</div>';
    html += '<div class="ib-preview-area">';
    html += '<div class="ib-preview-area-caption">Wohnfläche</div>';
    html += '<div class="ib-preview-area-data">' + this.flaechen.wohnflaeche + ' m²</div>';
    html += '</div>';
    html += '<div class="ib-preview-rooms">';
    html += '<div class="ib-preview-rooms-caption">Zimmer</div>';
    html += '<div class="ib-preview-rooms-data">' + rooms + '</div>';
    html += '</div>';
    html += '<div class="ib-preview-freefrom">';
    html += '<div class="ib-preview-freefrom-caption">Verfügbar ab</div>';
    html += '<div class="ib-preview-freefrom-data">' + this.verwaltung_objekt.verfuegbar_ab + '</div>';
    html += '</div>';
    html += '</div>';
    html += this.furnishingTags();
    html += '</div>';
    html += '</div>';
    return html;
  }

  // Render real estate's HTML details
  this.details = function () {
    var rooms = this.rooms();
    var html = '';
    var documents = ''

    var body = '';
    var header = '<div class="ib-detail-id">';
    header += 'Objektnummer: ' + this.objektnr_extern();
    header += '</div>';
    body += header;

    var maxImageCounter = 0; // Complete count of images; needed for the button to hide all images
    var i;

    if (this.anhaenge != null) {
      for (i = 0; i < this.anhaenge.anhang.length; i++) {
        if (this.anhaenge.anhang[i].gruppe != "GRUNDRISS" && this.anhaenge.anhang[i].gruppe != "DOKUMENTE") {
          maxImageCounter++;
        }
      }

      // Get anhaenge (images and documents)
      var imagesLeft = '';
      var imagesLeftCounter = 0;
      var floorplans = '';
      var floorplansCounter = 0;

      for (i = 0; i < this.anhaenge.anhang.length; i++) {
        if (this.anhaenge.anhang[i].gruppe == "GRUNDRISS") {
          floorplans += '<img src="' + this.attachmentURL(this.anhaenge.anhang[i])
            + '" id="floorplan' + floorplansCounter + '" alt="Grundriss' + (floorplansCounter+1)
            + '" class="ib-detail-image img-responsive"';

          if (floorplansCounter > 0) {
            floorplans += 'style="display: none;")';
          }

          floorplans += ' />';
          floorplansCounter++;
        } else if (this.anhaenge.anhang[i].gruppe == "DOKUMENTE") {
          documents += '<a href="' + this.attachmentURL(this.anhaenge.anhang[i])
            + '" target="_blank"><img src="img/pdf_icon.png" id="document class="img-responsive"' + i + '" alt="Dokument' + (i+1) + '" /> '
            + this.titleImage().anhangtitel + '</a>';
        } else {
          imagesLeft += '<img src="' + this.attachmentURL(this.anhaenge.anhang[i])
            + '" id="image' + imagesLeftCounter + '" alt="Bild' + (imagesLeftCounter+1)
            + '" class="ib-detail-image img-responsive"';

          if (imagesLeftCounter > 0) {
            imagesLeft += 'style="display: none;")';
          }

          imagesLeft += ' />';
          imagesLeftCounter++;
        }
      }

      // Set the button for each image
      if (imagesLeftCounter > 1) {
        body += '<div class="ib-details-row"></div><br>';
        for (i = 0; i < imagesLeftCounter; i++) {
          if (this.anhaenge.anhang[i].gruppe != "GRUNDRISS" && this.anhaenge.anhang[i].gruppe != "DOKUMENTE") {
            body += '<button class="showimage" id="button' + i + '" class="btn btn-success pull-right" type="button" data-nr="' + i + '" data-nrmax="' + maxImageCounter + '">' + (i+1) + '</button>';
          }
        }
      }
    }
  }
}


/*
  Real estate list class
*/
immobrowse.List = function (cid, sorting, exposeBaseUrl) {
  this.cid = cid;
  this.sorting = sorting;
  this.exposeBaseUrl = exposeBaseUrl;
  this.realEstates = null;
  this.filteredRealEstates = null;

  // Match filters on a real estate's JSON data
  this.match = function (realEstate, filters) {
    var rent = realEstate.rent();

    if (filters.priceMin >= rent) {
      return false;
    }

    if (filters.priceMax <= rent) {
      return false;
    }

    if (filters.areaMin >= realEstate.flaechen.wohnflaeche) {
      return false;
    }

    if (filters.roomsMin >= realEstate.flaechen.anzahl_zimmer) {
      return false;
    }

    if (filters.ebk) {
      if (! realEstate.ausstattung.kueche.EBK) {
        return false;
      }
    }

    if (filters.bathtub) {
      if (! realEstate.ausstattung.bad.WANNE) {
        return false;
      }
    }

    if (filters.carSpace) {
      if (! realEstate.ausstattung.stellplatzart.TIEFGARAGE) {
        return false;
      }
    }

    if (filters.elevator) {
      if (! realEstate.ausstattung.fahrstuhl.PERSONEN) {
        return false;
      }
    }

    if (filters.garden) {
      if (! realEstate.ausstattung.gartennutzung) {
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

  // Filters real estates
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

  // Sorts real estates
  this.sort = function (property, order) {
    immobrowse.logger.debug('Sorting by ' + property + ' ' + order + '.');
    this.filteredRealEstates.sort(this.getSorter(property, order));
  }

  this.getSorter = function (property, order) {
    var descending = false;

    if (order == 'descending') {
      descending = true;
    }

    switch(property) {
      case 'rooms':
        return this.sortByRooms(descending);
      case 'area':
        return this.sortByArea(descending);
      case 'street':
        return this.sortByStreet(descending);
      default:
        throw 'Invalid sorting property: ' + property;
    }
  }

  this.sortByRooms = function (descending) {
    return function (immobilie1, immobilie2) {
      return immobrowse.compare(immobilie1.rooms(), immobilie2.rooms(), descending);
    }
  }

  this.sortByArea = function (descending) {
    return function (immobilie1, immobilie2) {
      return immobrowse.compare(immobilie1.area(), immobilie2.area(), descending);
    }
  }

  this.sortByStreet = function (descending) {
    return function (immobilie1, immobilie2) {
      return immobrowse.compare(immobilie1.street(), immobilie2.street(), descending);
    }
  }

  // Gets the respective districts
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

  // Converts real estates to HTML
  this.htmlList = function () {
    var html = '';
    var realEstates;

    for (var i = 0; i < this.filteredRealEstates.length; i++) {
      html += this.filteredRealEstates[i].preview(this.exposeBaseUrl);
      html += '<br>';
    }

    if (html == '') {
     return 'Es konnten keine Angebote gefunden werden.';
    } else {
      return html;
    }
  }

  this.getRealEstates = function (callback) {
    self = this;

    $.ajax({
      url: 'https://tls.homeinfo.de/immobrowse/list/' + self.cid,
      success: function (json) {
        self.realEstates = [];

        for (var i = 0; i < json.length; i++) {
          self.realEstates.push(new immobrowse.RealEstate(self.cid, json[i]));
        }

        self.filteredRealEstates = self.realEstates;
        callback()
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

  // Renders the respective real estates into the given HTML element
  this.render = function (listElement) {

  }
}


/*
  Detailed expose class
*/
immobrowse.Expose = function (cid, objektnr_extern, listUrl) {
  this.cid = cid;
  this.objektnr_extern = objektnr_extern;
  this.listUrl = listUrl;
  this.realEstate = null;

  this.getRealEstate = function (callback) {
    self = this;

    $.ajax({
      url: 'https://tls.homeinfo.de/immobrowse/real_estate/' + self.objektnr_extern + '?customer=' + self.cid,
      success: function (json) {
        self.realEstate = new immobrowse.RealEstate(self.cid, json);
        callback();
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

  this.header = function () {
    var header = '<div class="ib-header">';
    header += '<h3 class="ib-detail-title">';
    header += '<strong>';

    if (this.realEstate.freitexte != null) {
      if (this.realEstate.freitexte.objekttitel != null) {
        header += this.realEstate.freitexte.objekttitel + '<br>';
      }
    }

    var rooms = this.realEstate.rooms();

    if (rooms == null) {
      header += 'Wohnung | ';
    } else {
      header += rooms + ' Zimmer Wohnung | ';
    }

    header += this.realEstate.addressPreview();
    header += ' | ';
    header += this.realEstate.cityPreview();
    header += '</strong><br>'
    header += '<div></h3><br><br>';
    return header;
  }

  // Renders the respective real estate into the given HTML element
  this.render = function (headerElement, exposeElement) {
  }
}
