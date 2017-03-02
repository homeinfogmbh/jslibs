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
immobrowse.RealEstate = function (cid, json) {
  this.cid = cid;
  this.json = json;

  this.addressPreview = function () {
    if (this.json.geo == null) {
      return 'N/A';
    } else {
      if (this.json.geo.strasse == null) {
        return 'N/A';
      } else {
        if (this.json.geo.hausnummer == null) {
          return this.json.geo.strasse;
        } else {
          return this.json.geo.strasse + ' ' + this.json.geo.hausnummer;
        }
      }
    }
  }

  this.cityPreview = function () {
    if (this.json.geo == null) {
      return 'N/A';
    } else {
      if (this.json.geo.ort == null) {
        return 'N/A';
      } else {
        if (this.json.geo.regionaler_zusatz == null || this.json.geo.regionaler_zusatz == this.json.geo.ort) {
          return this.json.geo.ort;
        } else {
          return this.json.geo.ort + ' ' + this.json.geo.regionaler_zusatz;
        }
      }
    }
  }

  this.objektnr_extern = function () {
    return this.json.verwaltung_techn.objektnr_extern;
  }

  this.objekttitel = function () {
    if (this.json.freitexte != null) {
      if (this.json.freitexte.objekttitel != null) {
        return this.json.freitexte.objekttitel;
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
    if (this.json.anhaenge == null) {
      return null;
    } else {
      if (this.json.anhaenge.anhang == null) {
        return null;
      } else {
        for (var i = 0; i < this.json.anhaenge.anhang.length; i++) {
          var anhang = this.json.anhaenge.anhang[i];

          if (anhang.gruppe == 'TITELBILD') {
            return anhang;
          }
        }

        for (var i = 0; i < this.json.anhaenge.anhang.length; i++) {
          var anhang = this.json.anhaenge.anhang[i];

          if (anhang.gruppe == 'AUSSENANSICHTEN') {
            return anhang;
          }
        }

        for (var i = 0; i < this.json.anhaenge.anhang.length; i++) {
          var anhang = this.json.anhaenge.anhang[i];

          if (anhang.gruppe == 'BILD') {
            return anhang;
          }
        }

        for (var i = 0; i < this.json.anhaenge.anhang.length; i++) {
          var anhang = this.json.anhaenge.anhang[i];

          if (anhang.gruppe == 'GRUNDRISS') {
            return anhang;
          }
        }
        return null;
      }
    }
  }

  this.street = function () {
    if (this.json.geo == null) {
      return null;
    } else {
      if (this.json.geo.strasse == null) {
        return null;
      } else {
        return this.json.geo.strasse;
      }
    }
  }

  this.rooms = function() {
    if (this.json.flaechen == null) {
      return null;
    } else {
      if (this.json.flaechen.anzahl_zimmer == null) {
        return null;
      } else {
        return this.json.flaechen.anzahl_zimmer.toString().replace(".", ",");;
      }
    }
  }

  this.area = function () {
    if (this.json.flaechen == null) {
      return null;
    } else {
      if (this.json.flaechen.wohnflaeche == null) {
        if (this.json.flaechen.nutzflaeche == null) {
          if (this.json.flaechen.gesamtflaeche == null) {
            return null;
          } else {
            return this.json.flaechen.gesamtflaeche;
          }
        } else {
          return this.json.flaechen.nutzflaeche;
        }
      } else {
        return this.json.flaechen.wohnflaeche;
      }
    }
  }

  this.netColdRent = function () {
    if (this.json.preise == null) {
      return null;
    } else {
      if (this.json.preise.nettokaltmiete == null) {
        return null;
      } else {
        return this.json.preise.nettokaltmiete;
      }
    }
  }

  this.coldRent = function () {
    if (this.json.preise == null) {
      return null;
    } else {
      if (this.json.preise.kaltmiete == null) {
        return null;
      } else {
        return this.json.preise.kaltmiete;
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
    if (this.json.ausstattung == null) {
      return null;
    } else {
      return this.json.ausstattung.kabel_sat_tv;
    }
  }

  this.builtInKitchen = function () {
    if (this.json.ausstattung == null) {
      return false;
    } else {
      if (this.json.ausstattung.kueche == null) {
        return false;
      } else {
        return this.json.ausstattung.kueche.EBK;
      }
    }
  }

  this.basementRoom = function () {
    if (this.json.ausstattung == null) {
      return null;
    } else {
      return this.json.ausstattung.unterkellert == 'JA';
    }
  }

  this.balconies = function () {
    if (this.json.flaechen == null) {
      return 0;
    } else {
      if (this.json.flaechen.anzahl_balkone == null) {
        return 0;
      } else {
        return this.json.flaechen.anzahl_balkone;
      }
    }
  }

  this.terraces = function () {
    if (this.json.flaechen == null) {
      return 0;
    } else {
      if (this.json.flaechen.anzahl_terrassen == null) {
        return 0;
      } else {
        return this.json.flaechen.anzahl_terrassen;
      }
    }
  }

  this.shower = function () {
    if (this.json.ausstattung == null) {
      return false;
    } else {
      if (this.json.ausstattung.bad == null) {
        return false;
      } else {
        return this.json.ausstattung.bad.DUSCHE;
      }
    }
  }

  this.bathTub = function () {
    if (this.json.ausstattung == null) {
      return false;
    } else {
      if (this.json.ausstattung.bad == null) {
        return false;
      } else {
        return this.json.ausstattung.bad.WANNE;
      }
    }
  }

  this.bathroomWindow = function () {
    if (this.json.ausstattung == null) {
      return false;
    } else {
      if (this.json.ausstattung.bad == null) {
        return false;
      } else {
        return this.json.ausstattung.bad.FENSTER;
      }
    }
  }

  this.lavatoryDryingRoom = function () {
    if (this.json.ausstattung == null) {
      return false;
    } else {
      return this.json.ausstattung.wasch_trockenraum;
    }
  }

  this.barrierFree = function () {
    if (this.json.ausstattung == null) {
      return false;
    } else {
      return this.json.ausstattung.barrierefrei;
    }
  }

  this.objectTypes = function () {
    var types = [];
    var objektart = this.json.objektkategorie.objektart;

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
    var vermarktungsart = this.json.objektkategorie.vermarktungsart;

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
    if (this.json.verwaltung_objekt == null) {
      return true;
    } else {
      if (this.json.verwaltung_objekt.objektadresse_freigeben == null) {
        return true;
      } else {
        return this.json.verwaltung_objekt.objektadresse_freigeben;
      }
    }
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
    var html = '<a class="ib-preview-entry" href="' + baseUrl.replace('{cid}', this.cid).replace('{objektnr_extern}', this.objektnr_extern) + '">';

    if (titleImageUrl != null) {
      html += immobrowse.titleImageHtml(titleImageUrl);
    } else {
      html += immobrowse.titleImageHtml(immobrowse.titleImageDummy);
    }

    html += '<div class="ib-preview-data">';
    html += '<div class="ib-preview-header">';
    html += '<div class="ib-preview-header-title">';
    html += '<a href="#"><h3><strong>' + this.objekttitel() + '</strong></h3></a>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ib-preview-body">';
    html += '<div class="ib-preview-rent">';
    html += '<div class="ib-preview-rent-caption">Nettokaltmiete</div>';
    html += '<div class="ib-preview-rent-data">' + immobrowse.euroHtml(this.rent()) + '</div>';
    html += '</div>';
    html += '<div class="ib-preview-area">';
    html += '<div class="ib-preview-area-caption">Wohnfläche</div>';
    html += '<div class="ib-preview-area-data">' + this.json.flaechen.wohnflaeche + ' m²</div>';
    html += '</div>';
    html += '<div class="ib-preview-rooms">';
    html += '<div class="ib-preview-rooms-caption">Zimmer</div>';
    html += '<div class="ib-preview-rooms-data">' + rooms + '</div>';
    html += '</div>';
    html += '<div class="ib-preview-zimmer">';
    html += '<div class="ib-preview-zimmer-caption">Verfügbar ab</div>';
    html += '<div class="ib-preview-zimmer-data">' + this.json.verwaltung_objekt.verfuegbar_ab + '</div>';
    html += '</div>';
    html += '</div>';

    if (this.json.ausstattung != null) {
      if (this.json.ausstattung.kueche != null || this.json.ausstattung.bad != null ||
          this.json.ausstattung.kabel_sat_tv || this.json.ausstattung.stellplatzart != null ||
          this.json.ausstattung.barrierefrei || this.json.ausstattung.fahrstuhl != null ||
          this.json.flaechen.anzahl_balkone > 0 || this.json.ausstattung.bad != null ||
          this.json.ausstattung.unterkellert || this.json.ausstattung.rollstuhlgerecht) {

        if (this.json.flaechen.anzahl_balkone > 0) {
          html += '<div class="ib-preview-oval"><div class="oval">Balkon</div></div>';
        }

        if (this.json.ausstattung.barrierefrei) {
          html += '<div class="ib-preview-oval"><div class="oval">Barrierefrei</div></div>';
        }

        if (this.json.ausstattung.kabel_sat_tv) {
          html += '<div class="ib-preview-oval"><div class="oval">Kabel/Sat/TV</div></div>';
        }

        if (this.json.ausstattung.unterkellert) {
          html += '<div class="ib-preview-oval"><div class="oval">Keller</div></div>';
        }

        if (this.json.ausstattung.rollstuhlgerecht) {
          html += '<div class="ib-preview-oval"><div class="oval">Rollstuhlgerecht</div></div>';
        }

        if (this.json.ausstattung.bad != null) {
          if (this.json.ausstattung.bad.FENSTER) {
            html += '<div class="ib-preview-oval"><div class="oval">Fenster im Bad</div></div>';
          }

          if (this.json.ausstattung.bad.WANNE) {
            html += '<div class="ib-preview-oval"><div class="oval">Badewanne</div></div>';
          }

          if (this.json.ausstattung.bad.DUSCHE) {
            html += '<div class="ib-preview-oval"><div class="oval">Dusche</div></div>';
          }
        }

        if (this.json.ausstattung.kueche != null) {
          if (this.json.ausstattung.kueche.EBK) {
            html += '<div class="ib-preview-oval"><div class="oval">EBK</div></div>';
          }
        }

        if (this.json.ausstattung.stellplatzart != null) {
          if (this.json.ausstattung.stellplatzart.FREIPLATZ) {
            html += '<div class="ib-preview-oval"><div class="oval">Stellplatz</div></div>';
          }
        }

        if (this.json.ausstattung.fahrstuhl != null) {
          if (this.json.ausstattung.fahrstuhl.PERSONEN) {
            html += '<div class="ib-preview-oval"><div class="oval">Fahrstuhl</div></div>';
          }
        }
      }
    }

    html += '</div>';
    html += '</a>';
    return html;
  }
}


/*
  Real estate list pseudo-class
*/
immobrowse.List = function (cid, filters, sorting, exposeBaseUrl) {
  this.cid = cid;
  this.filters = filters;
  this.sorting = sorting;
  this.exposeBaseUrl = exposeBaseUrl;
  this.realEstates = null;
  this.filteredRealEstates = null;

  // Match filters on a real estate's JSON data
  this.match = function (realEstate) {
    var json = realEstate.json;
    var rent = immobrowse.rent(json);

    if (this.filters.priceMin >= rent)
      return false;
    else if (this.filters.priceMax <= rent)
      return false;
    else if (this.filters.areaMin >= json.flaechen.wohnflaeche)
      return false;
    else if (this.filters.roomsMin >= json.flaechen.anzahl_zimmer)
      return false;
    else if (this.filters.ebk) {
      if (json.ausstattung != null) {
        if (jQuery.isEmptyObject(json.ausstattung))
          return false;
        else if (json.ausstattung.kueche != null)
          if (!json.ausstattung.kueche.EBK)
            return false;
      }
    } else if (this.filters.bathtub) {
      if (json.ausstattung != null) {
        if (jQuery.isEmptyObject(json.ausstattung))
          return false;
        else if (json.ausstattung.bad != null)
          if (!json.ausstattung.bad.WANNE)
            return false;
      }
    } else if (this.filters.carSpace) {
      if (json.ausstattung != null) {
        if (jQuery.isEmptyObject(json.ausstattung))
          return false;
        else if (json.ausstattung.stellplatzart != null)
          if (!json.ausstattung.stellplatzart.TIEFGARAGE)
            return false;
      }
    } else if (this.filters.elevator) {
      if (json.ausstattung != null) {
        if (jQuery.isEmptyObject(json.ausstattung))
          return false;
        else if (json.ausstattung.fahrstuhl != null)
          if (!json.ausstattung.fahrstuhl.PERSONEN)
            return false;
      }
    } else if (this.filters.garden) {
      if (json.ausstattung != null) {
        if (jQuery.isEmptyObject(json.ausstattung))
          return false;
        else if (!json.ausstattung.gartennutzung)
          return false;
      }
    }
    return true;
  }

  // Filters real estates
  this.filter = function () {
    this.filteredRealEstates = [];

    for (var i = 0; i < this.realEstates.length; i++) {
      if (this.match(this.realEstates[i])) {
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

  this.getRealEstates = function (htmlElement, loadAnimation) {
    var this_ = this;

    $.ajax({
      url: 'https://tls.homeinfo.de/immobrowse/list/' + this_.cid,
      dataType: "json",
      success: function (json) {
        immobrowse.logger.info('Retrieved ' + json.length + ' real estates.');
        immobrowse.logger.debug(JSON.stringify(json));
        this_.realEstates = [];

        for (var i = 0; i < json.length; i++) {
          this_.realEstates.push(new immobrowse.RealEstate(this_.cid, json[i]));
        }

        if (htmlElement != null) {
          this_.filter();
          this_.render(htmlElement, loadAnimation);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        immobrowse.logger.error(xhr.responseText);
        immobrowse.logger.debug(ajaxOptions);
        immobrowse.logger.debug(thrownError);
        // TODO: Display error message
      }
    });
  }

  // Renders real estates into the given HTML element
  this.render = function (htmlElement, loadAnimation) {
    if (this.realEstates == null) {
      this.getRealEstates(htmlElement, loadAnimation);
    } else {
      htmlElement.innerHTML = this.htmlList();

      if (loadAnimation != null) {
        loadAnimation.hide();
      }
    }
  }
}
