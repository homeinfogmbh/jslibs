/*
  immobrowse.js - ImmoBrowse object oriented JavaScript library

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
    * immobrowse.js
*/

var immobrowse = immobrowse || {};


/*
  Real estate wrapper pseudo-class
*/
immobrowse.RealEstate = function (cid, realEstate) {
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
        return this.flaechen.anzahl_zimmer.toString().replace(".", ",");;
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

    if (this.ausstattung != null) {
      if (this.ausstattung.kueche != null || this.ausstattung.bad != null ||
          this.ausstattung.kabel_sat_tv || this.ausstattung.stellplatzart != null ||
          this.ausstattung.barrierefrei || this.ausstattung.fahrstuhl != null ||
          this.flaechen.anzahl_balkone > 0 || this.ausstattung.bad != null ||
          this.ausstattung.unterkellert || this.ausstattung.rollstuhlgerecht) {

        if (this.flaechen.anzahl_balkone > 0) {
          html += '<div class="ib-preview-oval"><div class="oval">Balkon</div></div>';
        }

        if (this.ausstattung.barrierefrei) {
          html += '<div class="ib-preview-oval"><div class="oval">Barrierefrei</div></div>';
        }

        if (this.ausstattung.kabel_sat_tv) {
          html += '<div class="ib-preview-oval"><div class="oval">Kabel/Sat/TV</div></div>';
        }

        if (this.ausstattung.unterkellert) {
          html += '<div class="ib-preview-oval"><div class="oval">Keller</div></div>';
        }

        if (this.ausstattung.rollstuhlgerecht) {
          html += '<div class="ib-preview-oval"><div class="oval">Rollstuhlgerecht</div></div>';
        }

        if (this.ausstattung.bad != null) {
          if (this.ausstattung.bad.FENSTER) {
            html += '<div class="ib-preview-oval"><div class="oval">Fenster im Bad</div></div>';
          }

          if (this.ausstattung.bad.WANNE) {
            html += '<div class="ib-preview-oval"><div class="oval">Badewanne</div></div>';
          }

          if (this.ausstattung.bad.DUSCHE) {
            html += '<div class="ib-preview-oval"><div class="oval">Dusche</div></div>';
          }
        }

        if (this.ausstattung.kueche != null) {
          if (this.ausstattung.kueche.EBK) {
            html += '<div class="ib-preview-oval"><div class="oval">EBK</div></div>';
          }
        }

        if (this.ausstattung.stellplatzart != null) {
          if (this.ausstattung.stellplatzart.FREIPLATZ) {
            html += '<div class="ib-preview-oval"><div class="oval">Stellplatz</div></div>';
          }
        }

        if (this.ausstattung.fahrstuhl != null) {
          if (this.ausstattung.fahrstuhl.PERSONEN) {
            html += '<div class="ib-preview-oval"><div class="oval">Fahrstuhl</div></div>';
          }
        }
      }
    }

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
            + '" class="ib-detail-image"' + ((floorplans != '') ?'style="display: none;")' :'') + ' />';
          floorplansCounter++;
        } else if (this.anhaenge.anhang[i].gruppe == "DOKUMENTE") {
          documents += '<a href="' + this.attachmentURL(this.anhaenge.anhang[i])
            + '" target="_blank"><img src="img/pdf_icon.png" id="document' + i + '" alt="Dokument' + (i+1) + '" /> '
            + this.titleImage().anhangtitel + '</a>';
        } else {
          imagesLeft += '<img src="' + this.attachmentURL(this.anhaenge.anhang[i])
            + '" id="image' + imagesLeftCounter + '" alt="Bild' + (imagesLeftCounter+1) + '" class="ib-detail-image"'
            + ((imagesLeft != '') ?'style="display: none;")' :'') + ' />';
          imagesLeftCounter++;
        }
      }

      body += '<div class="ib-detail-images">';
      body += imagesLeft;
      body += '</div>';
      body += '<div class="ib-detail-floorplans">';
      body += floorplans;
      body += '</div>';

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

    body += '<div class="ib-detail-row"></div><br><br>';
    body += '<div class="ib-detail-prices">';
    body += '<h3>PREISE & KOSTEN</h3>';
    body += '<table width="420px">';

    if (this.preise.nettokaltmiete != null) {
      body += '<tr>';
      body += '<td><strong>Nettokaltmiete</strong></td>';
      body += '<td align="right">' + immobrowse.euroHtml(this.preise.nettokaltmiete) + '</td>';
      body += '</tr>';
    }

    if (this.preise.nebenkosten != null) {
      body += '<tr>';
      body += '<td>Nebenkosten</td>';
      body += '<td align="right">' + immobrowse.euroHtml(this.preise.nebenkosten) + '</td>';
      body += '</tr>';
    }

    if (this.preise.heizkosten != null) {
      body += '<tr>';
      body += '<td>Heizkosten</td>';
      body += '<td align="right">' + immobrowse.euroHtml(this.preise.heizkosten) + '</td>';
      body += '</tr>';
    }

    if (this.preise.heizkosten_enthalten != null) {
      body += '<tr>';
      body += '<td>Heizkosten in Nebenkosten enthalten</td>';
      body += '<td align="right">';

      if (this.preise.heizkosten_enthalten == true) {
        html += "Ja";
      } else {
        html += "Nein";
      }

      body += '</td></tr>';
    }

    if (this.preise.kaution != null) {
      body += '<tr>';
      body += '<td>Kaution oder Genossenschaftsanteile</td>';
      body += '<td align="right">' + immobrowse.euroHtml(this.preise.kaution) + '</td>';
      body += '</tr>';
    }

    if (this.preise.provisionspflichtig != null) {
      body += '<tr>';
      body += '<td><strong>Provisionsfrei</strong></td>';
      if (this.preise.provisionspflichtig == true)
      body += '<td align="right">Nein</td>';
      else if (this.preise.provisionspflichtig == false)
      body += '<td align="right">Ja</td>';
      body += '</tr>';
    }

    body += '</table><br></div>';
    body += '<div class="ib-detail-properties">';
    body += '<h3>GRÖSSE & ZUSTAND</h3>';
    body += '<table width="420px" cellspacing="0">';

    if (this.flaechen.wohnflaeche != null) {
      body += '<tr><td><strong>Wohnfläche in m²</strong></td>';
      body += '<td align="right">' + this.flaechen.wohnflaeche + '</td></tr>';
    }

    if (this.flaechen.anzahl_zimmer != null) {
      body += '<tr><td><strong>Zimmer</strong></td>';
      body += '<td align="right">' + this.flaechen.anzahl_zimmer.toString().replace(".", ","); + '</td></tr>';
    }

    if (this.geo.etage != null) {
      body += '<tr><td>Etage</td>';
      body += '<td align="right">' + this.geo.etage + '</td></tr>';
    }

    if (this.verwaltung_objekt.verfuegbar_ab != undefined) {
      body += '<tr><td>Verfügbar ab</td>';
      body += '<td align="right">' + this.verwaltung_objekt.verfuegbar_ab + '</td></tr>';
    }

    if (this.zustand_angaben != null) {
      if (this.zustand_angaben.baujahr != null) {
        body += '<tr><td>Baujahr</td>';
        body += '<td align="right">' + this.zustand_angaben.baujahr + '</td></tr>';
      }

      if (this.zustand_angaben.zustand != null) {
        body += '<tr><td>Zustand</td>';
        body += '<td align="right">' + this.zustand() + '</td></tr>';
      }
    }

    if (this.verwaltung_objekt.wbs_sozialwohnung == true) {
      body += '<tr><td>WBS</td>';
      body += '<td align="right">Erforderlich</td></tr>';
    }

    body += '</table><br></div>';
    body += '<div class="ib-detail-row"></div>';
    body += '<div class="ib-detail-enev">';
    body += '<h3>ENERGIEANGABEN</h3>';
    body += '<table width="420px" cellspacing="0">';
    body += '<tr>';
    body += '<td>Energieausweistyp</td>';

    if (this.zustand_angaben != null) {
      if (this.zustand_angaben.energiepass != null) {
        if (this.zustand_angaben.energiepass.length > 0) {
          body += '<td align="right">';

          if (this.zustand_angaben.energiepass[0].epart == null) {
            body += 'Nicht angegeben';
          } else if (this.zustand_angaben.energiepass[0].epart == 'VERBRAUCH') {
            body += 'Verbrauchsausweis';
          } else {
            body += 'Bedarfsausweis';
          }

          body += '</td></tr>';

          if (this.zustand_angaben.energiepass[0].energieverbrauchkennwert != "") {
            body += '<tr>';
            body += '<td>Endenergieverbrauch</td>';
            body += '<td align="right">' + this.zustand_angaben.energiepass[0].energieverbrauchkennwert + ' kWh/(m²*a)</td>';
            body += '</tr>';
          }

          if (this.zustand_angaben.energiepass[0].primaerenergietraeger != null) {
            body += '<tr>';
            body += '<td>Wesentlicher Energieträger</td>';
            body += '<td align="right">' + this.primaerenergietraeger() + '</td>';
            body += '</tr>';
          }

          if (this.zustand_angaben.energiepass[0].wertklasse != null) {
            body += '<tr>';
            body += '<td>Effizienzklasse</td>';
            body += '<td align="right">' + this.zustand_angaben.energiepass[0].wertklasse + '</td>';
            body += '</tr>';
          }
        }

        if (this.zustand_angaben.letztemodernisierung != null) {
          body += '<tr>';
          body += '<td>Letzte Modernisierung</td>';
          body += '<td align="right">' + this.zustand_angaben.letztemodernisierung + '</td>';
          body += '</tr>';
        }
      }
    } else {
      body += '<td align="right">Nicht angegeben</td>';
    }

    body += '</tr>';
    body += '</table><br></div>';

    if (this.ausstattung != null) {
      if (this.ausstattung.kueche != null || this.ausstattung.bad != null ||
          this.ausstattung.kabel_sat_tv || this.ausstattung.stellplatzart != null ||
          this.ausstattung.barrierefrei || this.ausstattung.fahrstuhl != null ||
          this.flaechen.anzahl_balkone > 0 || this.ausstattung.bad != null ||
          this.ausstattung.unterkellert || this.ausstattung.rollstuhlgerecht) {
        body += '<div class="ib-detail-amenities">';
        body += '<h3>AUSSTATTUNG</h3>';
        body += '<table width="420px" cellspacing="0">';
        body += (this.flaechen.anzahl_balkone > 0) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Balkon</td></tr>' :'';
        body += (this.ausstattung.barrierefrei) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Barrierefrei</td></tr>' :'';
        body += (this.ausstattung.kabel_sat_tv) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Kabel/Sat/TV</td></tr>' :'';
        body += (this.ausstattung.unterkellert) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Keller</td></tr>' :'';
        body += (this.ausstattung.rollstuhlgerecht) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Rollstuhlgerecht</td></tr>' :'';

        if (this.ausstattung.bad != null) {
          body += (this.ausstattung.bad.FENSTER) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Fenster im Bad</td></tr>' :'';
          body += (this.ausstattung.bad.WANNE) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Badewanne</td></tr>' :'';
          body += (this.ausstattung.bad.DUSCHE) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Dusche</td></tr>' :'';
        }

        if (this.ausstattung.kueche != null) {
          body += (this.ausstattung.kueche.EBK) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> EBK</td></tr>' :'';
        }

        if (this.ausstattung.bad != null) {
          body += (this.ausstattung.bad.WANNE) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Badewanne</td></tr>' :'';
        }

        if (this.ausstattung.stellplatzart != null) {
          body += (this.ausstattung.stellplatzart.FREIPLATZ) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Stellplatz</td></tr>' :'';
        }

        if (this.ausstattung.fahrstuhl != null) {
          body += (this.ausstattung.fahrstuhl.PERSONEN) ?'<tr><td class="ib-detail-datacolumn"><img src="img/ok.png" /> Fahrstuhl</td></tr>' :'';
        }

        body += '</table></div><br><br>';
      }
    }

    body += '<div class="ib-detail-row"></div><br>';

    if (this.freitexte != null) {
      if (this.freitexte.objektbeschreibung != null) {
        body += '<h3>OBJEKTBESCHREIBUNG</h3>';
        body += '<table>';
        body += '<tr><td class="ib-detail-datacolumn"> ' + this.freitexte.objektbeschreibung + '</td></tr>';
        body += '</tr>';
        body += '</table><br>';
      }
    }

    if (this.freitexte != null) {
      if (this.freitexte.lage != null) {
        body += '<h3>LAGE</h3>';
        body += '<table>';
        body += '<tr><td class="ib-detail-datacolumn"> ' + this.freitexte.lage + '</td></tr>';
        body += '</tr>';
        body += '</table><br>';
      }
    }

    if (this.freitexte != null) {
      if (this.freitexte.sonstige_angaben != null) {
        body += '<h3>SONSTIGES</h3>';
        body += '<table>';
        body += '<tr><td class="ib-detail-datacolumn"> ' + this.freitexte.sonstige_angaben + '</td></tr>';
        body += '</tr>';
        body += '</table><br>';
      }
    }

    html += '<div id="content">' + body + '</div>';

    var footer = '';
    footer += '<div class="ib-detail-row"></div>';
    footer += '<div class="ib-detail-contact">';
    footer += '<h3>IHR ANSPRECHPARTNER</h3>';
    footer += '<b>' + ((this.kontaktperson.anrede != "0") ?this.kontaktperson.anrede :'') + ' ' + this.kontaktperson.vorname + ' ' + this.kontaktperson.name + '</b></br>';
    footer += (this.kontaktperson.firma != undefined) ?this.kontaktperson.firma + '</br>' : '';
    footer += (this.kontaktperson.strasse != undefined && this.kontaktperson.hausnummer != undefined) ?this.kontaktperson.strasse + ' ' + this.kontaktperson.hausnummer + '</br>' :'';
    footer += (this.kontaktperson.plz != undefined && this.kontaktperson.ort != undefined) ?this.kontaktperson.plz + ' ' + this.kontaktperson.ort + '</br>' :'';
    footer += (this.kontaktperson.tel_durchw != undefined) ?'Tel.: ' + this.kontaktperson.tel_durchw + '</br>' :'';
    footer += (this.kontaktperson.url != undefined) ?'<a href="' + ((this.kontaktperson.url.indexOf("http") == -1) ?'http://' + this.kontaktperson.url :this.kontaktperson.url) + '" target="_blank">' + this.kontaktperson.url + '</a></br></br></br>': '</br></br></br>';
    footer += '</div>';
    footer += '<div class="ib-detail-documents">';
    footer += '<h3>DOKUMENTE</h3>';
    footer += '<table width="420px" cellspacing="0" class="ib-detail-document-table">';

    if (documents == '') {
      footer += 'Keine Dokumente vorhanden';
    } else {
      footer += documents;
    }

    footer += '</table></div>';
    footer += '<div class="ib-detail-row"></div>';
    footer += '</div>'
    html += '<div id="footer">' + footer + '<br><br><br></div>';

    return html + '</div>';
  }
}


/*
  Real estate list pseudo-class
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

    if (filters.priceMin >= rent)
      return false;
    else if (filters.priceMax <= rent)
      return false;
    else if (filters.areaMin >= realEstate.flaechen.wohnflaeche)
      return false;
    else if (filters.roomsMin >= realEstate.flaechen.anzahl_zimmer)
      return false;
    else if (filters.ebk) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (realEstate.ausstattung.kueche != null)
          if (!realEstate.ausstattung.kueche.EBK)
            return false;
      }
    } else if (filters.bathtub) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (realEstate.ausstattung.bad != null)
          if (!realEstate.ausstattung.bad.WANNE)
            return false;
      }
    } else if (filters.carSpace) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (realEstate.ausstattung.stellplatzart != null)
          if (!realEstate.ausstattung.stellplatzart.TIEFGARAGE)
            return false;
      }
    } else if (filters.elevator) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (realEstate.ausstattung.fahrstuhl != null)
          if (!realEstate.ausstattung.fahrstuhl.PERSONEN)
            return false;
      }
    } else if (filters.garden) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (!realEstate.ausstattung.gartennutzung)
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
    immobrowse.logger.debug('Sorting after ' + property + ' ' + order + '.');
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
      return '<div class="ib-preview-list">' + html + '</div>';
    }
  }

  this.getRealEstates = function () {
    var xmlHttp = null;

    try {
      xmlHttp = new XMLHttpRequest();
    } catch(e) {
      immobrowse.logger.error('XMLHttp is not supported.');
      immobrowse.logger.debug(e);
    }

    if (xmlHttp) {
      xmlHttp.open('GET', 'https://tls.homeinfo.de/immobrowse/list/' + this.cid, false);
      xmlHttp.send(null);
      immobrowse.logger.debug('Got XMLHTTP response:');
      immobrowse.logger.debug(xmlHttp.responseText);
      var json = JSON.parse(xmlHttp.responseText);

      this.realEstates = [];

      for (var i = 0; i < json.length; i++) {
        this.realEstates.push(new immobrowse.RealEstate(this.cid, json[i]));
      }

      this.filteredRealEstates = this.realEstates;
    }
  }

  // Renders the respective real estates into the given HTML element
  this.render = function (listElement) {
    listElement.innerHTML = this.htmlList();
  }
}



/*
  Detailed expose peseudo-class
*/
immobrowse.Expose = function (cid, objektnr_extern, listUrl) {
  this.cid = cid;
  this.objektnr_extern = objektnr_extern;
  this.listUrl = listUrl;
  this.realEstate = null;

  this.getRealEstate = function () {
    var xmlHttp = null;

    try {
      xmlHttp = new XMLHttpRequest();
    } catch(e) {
      immobrowse.logger.error('XMLHttp is not supported.');
      immobrowse.logger.debug(e);
    }

    if (xmlHttp) {
      xmlHttp.open('GET', 'https://tls.homeinfo.de/immobrowse/real_estate/' + this.objektnr_extern + '?customer=' + this.cid, false);
      xmlHttp.send(null);
      immobrowse.logger.debug('Got XMLHTTP response:');
      immobrowse.logger.debug(xmlHttp.responseText);
      this.realEstate = new immobrowse.RealEstate(this.cid, JSON.parse(xmlHttp.responseText));
    }
  }

  this.header = function () {
    var header = '<div class="ib-header">';
    header += '<h3 class="panel-title nohover">';
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
    header += '<div class="ib-preview-back" onclick="immobrowse.open(\'' + this.listUrl.replace('{cid}', this.cid) + '\');"> << Zurück</div>';
    header += '<div></h3><br><br>';
    header += '<div id="objectNumber">';
    header += 'Objektnummer: ' + this.realEstate.objektnr_extern();
    header += '</div>'
    return header;
  }

  // Renders the respective real estate into the given HTML element
  this.render = function (headerElement, exposeElement) {
    headerElement.innerHTML = this.header();
    exposeElement.innerHTML = this.realEstate.details();
  }
}
