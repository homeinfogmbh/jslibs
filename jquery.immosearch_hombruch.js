/*
    HOMEINFO general-purpose Javascript library

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

*/

//global vars and arrays
var empty_item_value = "---";
var immosearch_url = "https://tls.homeinfo.de/immosearch/customer/";
var sorting = "";
var include = "allatts,freitexte";
var attachments = "";
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
var selected_locations = [];//push and remove areas in the ckeckbox is checked
var build_locations_array = [];//this array should fill once
var build_locations_array_number = [];
var immosearch_array_img = [];
var immosearch_array_details_object_attachment_pdf = [];
var immosearch_array_details_object_img = [];

// Functions
function filter() {

	var result = "";

	if (zimmer_von != "") {
		if (result == "") {
			result = "zimmer>=" + zimmer_von;
		} else {
			result += " and zimmer>=" + zimmer_von;
		}
	}

	if (zimmer_bis != "") {
		if (result == "") {
			result = "zimmer<=" + zimmer_bis;
		} else {
			result += " and zimmer<=" + zimmer_bis;
		}
	}

	if (wohnflaeche_von != "") {
		if (result == "") {
			result = "wohnflaeche>=" + wohnflaeche_von;
		} else {
			result += " and wohnflaeche>=" + wohnflaeche_von;
		}
	}

	if (wohnflaeche_bis != "") {
		if (result == "") {
			result = "wohnflaeche<=" + wohnflaeche_bis;
		} else {
			result += " and wohnflaeche<=" + wohnflaeche_bis;
		}
	}

	if (grundmiete_von != "") {
		if (result == "") {
			result = "kaltmiete>=" + grundmiete_von;
		} else {
			result += " and kaltmiete>=" + grundmiete_von;
		}
	}

	if (grundmiete_bis != "") {
		if (result == "") {
			result = "kaltmiete<=" + grundmiete_bis;
		} else {
			result += " and kaltmiete<=" + grundmiete_bis;
		}
	}

	if (terrasse == true) {
		if (result == "") {
			result = "terrassen>>0";
		} else {
			result += " and terrassen>>0";
		}
	}

	if (garten == true) {
		if (result == "") {
			result = "garten>>0"
		} else {
			result += " and garten>>0"
		}
	}

	if (balkon == true) {
		if (result == "") {
			result = "balkone>>0";
		} else {
			result += " and balkone>>0";
		}
	}

	if (wanne == true) {
		if (result == "") {
			result = "wanne>>0";
		} else {
			result += " and wanne>>0";
		}
	}

	if (dusche == true) {
		if (result == "") {
			result = "dusche>>0";
		} else {
			result += " and dusche>>0";
		}
	}

	if (aufzug == true) {
		if (result == "") {
			result = "aufzug>>0";
		} else {
			result += " and aufzug>>0";
		}
	}

	var etage = etageFilter();
	if (etage != "") {
		if (result == "") {
			result = etage;
		} else {
			result += " and " + etage;
		}
	}

	var location = locationFilter();
	if (location != "") {
		if (result == "") {
			result = location;
		} else {
			result += " and " + location;
		}
	}

	return result;

}

function locationFilter() {
	var current_item = "";
	var result = "";

	for(var i = 0; i < selected_locations.length; i++) {
		current_item = selected_locations[i];

		if (result == "") {
			result = "ortsteil==" + current_item;
		} else {
			result += " or ortsteil==" + current_item;
		}

	}

	if (result == "") {
		return result;
	} else {
		return "(" + result + ")";
	}

}

function etageFilter() {
	var result = "";

	if (erdgeschoss == true) {
		if (result == "") {
			result = "etage==0";
		} else {
			result += " or etage==0";
		}
	}

	if (first_floor == true) {
		if (result == "") {
			result = "etage==1";
		} else {
			result += " or etage==1";
		}
	}

	if (second_floor == true) {
		if (result == "") {
			result = "etage>=2";
		} else {
			result += " or etage>=2";
		}
	}

	if (result == "") {
		return result;
	} else {
		return "(" + result + ")";
	}
}

// immosearch function returns XML
function immosearchList(cid, container, preloadeGif, immo_counter_or_object_nr, dummyPicsPath, container_zuruck_to_list, contact_form_object_nr) {

	// Hide/Show
	$("#" + container_zuruck_to_list + "").hide();
	$("#" + container + "").show();
	$("#" + contact_form_object_nr + "").empty();

	// Arrays
	immosearch_array_img = [];
	var immosearch_array_object_address = [];
  var immosearch_array_object_address_number = [];
  var immosearch_array_object_plz_number = [];
  var immosearch_array_object_ort = [];
	var immosearch_array_object_ortsteil = [];
  var immosearch_array_object_zimmer = [];
  var immosearch_array_object_wohnflaeche = [];
  var immosearch_array_object_gesamtmiete = [];
  var immosearch_array_object_kaltmiete = [];
  var immosearch_array_object_object_number = [];
  var immosearch_array_object_ausstattung = [];
  var immosearch_array_object_nettokaltmiete = [];
  var immosearch_array_object_heizkosten_enthalten = [];
  var immosearch_array_object_heizkosten = [];
  var immosearch_array_object_nebenkosten = [];
  var immosearch_array_object_balkon = [];
  var immosearch_array_object_objektart = [];
	var immosearch_array_object_objektkategorie_nutzungsart_anlage = [];
	var immosearch_array_object_objektkategorie_nutzungsart_gewerbe = [];
	var immosearch_array_object_objektkategorie_nutzungsart_waz = [];
	var immosearch_array_object_objektkategorie_nutzungsart_wohnen = [];
	var immosearch_array_object_objektkategorie_vermarktungsart_miete_pacht = [];
	var immosearch_array_object_objektkategorie_vermarktungsart_kauf = [];

  // Vars
  var immosearch_total_immobilien_counter = 0;
	var _filter = filter();
	var params = "";

	if (_filter != "") {
		if (params == "") {
			params = "filter=" + _filter;
		} else {
			params += "&filter=" + _filter;
		}
	}

	if (sorting != "") {
		if (params == "") {
			params = "sort=" + sorting;
		} else {
			params += "&sort=" + sorting;
		}
	}

	if (include != "") {
		if (params == "") {
			params = "include=" + include;
		} else {
			params += "&include=" + include;
		}
	}

  // Immosearch ajax call
  $.ajax({
    url: immosearch_url  + cid + "/?" + params,
    crossDomain: true,
    type: "GET",
    dataType: "xml",
    cache: false,
    beforeSend: function() {
      $("#" + container + "").empty();//empty the result container
      $("#" + container + "").append('<img src="' + preloadeGif + '" width="32" height="32" id="immosearch_preloader" />');//append preloader in container
    },
    success: function (xml) {
      if ($(xml).find("ns1\\:rsp").children().length >= 0) {//check if immobilien are more than 0

				var xml_namespace = $(xml).find("ns1\\:rsp");
				var anbieterCustomerId = escapeHtml($(xml).find("anbieternr").text());
				var anbieterFirmName = escapeHtml($(xml).find("anbieternr").next().text());

				$(xml).find("immobilie").each(function(i) {

					immosearch_total_immobilien_counter = i+1;

					immosearch_array_object_address.push(escapeHtml($(this).find("geo strasse").text()));
					immosearch_array_object_address_number.push(escapeHtml($(this).find("geo hausnummer").text()));
					immosearch_array_object_plz_number.push(escapeHtml($(this).find("geo plz").text()));
					immosearch_array_object_ort.push(escapeHtml($(this).find("geo ort").text()));
					immosearch_array_object_ortsteil.push(escapeHtml($(this).find("geo regionaler_zusatz").text()));//push in the array all areas (once for each kind and count them)
					immosearch_array_object_zimmer.push(escapeHtml($(this).find("flaechen anzahl_zimmer").text()));
					immosearch_array_object_wohnflaeche.push(escapeHtml($(this).find("flaechen wohnflaeche").text()));
					immosearch_array_object_gesamtmiete.push(escapeHtml($(this).find("preise warmmiete").text()));
					immosearch_array_object_object_number.push(escapeHtml($(this).find("verwaltung_techn objektnr_intern").text()));
					immosearch_array_object_nettokaltmiete.push(escapeHtml($(this).find("preise nettokaltmiete").text()));
					immosearch_array_object_kaltmiete.push(escapeHtml($(this).find("preise kaltmiete").text()));
					immosearch_array_object_heizkosten_enthalten.push(escapeHtml($(this).find("preise heizkosten_enthalten").text()));//boolean
					immosearch_array_object_nebenkosten.push(escapeHtml($(this).find("preise nebenkosten").text()));//decimal
					immosearch_array_object_heizkosten.push(escapeHtml($(this).find("preise heizkosten").text()));
					immosearch_array_object_balkon.push(escapeHtml($(this).find("flaechen anzahl_balkone").text()));

					if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('ANLAGE')) == true) {
						immosearch_array_object_objektkategorie_nutzungsart_anlage.push($(this).find("objektkategorie nutzungsart").attr('ANLAGE'));//element exists
					} else {
						immosearch_array_object_objektkategorie_nutzungsart_anlage.push(empty_item_value);//element not exists
					}

					if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('GEWERBE')) == true) {
						immosearch_array_object_objektkategorie_nutzungsart_gewerbe.push($(this).find("objektkategorie nutzungsart").attr('GEWERBE'));//element exists
					} else {
						immosearch_array_object_objektkategorie_nutzungsart_gewerbe.push(empty_item_value);//element not exists
					}

					if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('WAZ')) == true) {
						immosearch_array_object_objektkategorie_nutzungsart_waz.push($(this).find("objektkategorie nutzungsart").attr('WAZ'));//element exists
					} else {
						immosearch_array_object_objektkategorie_nutzungsart_waz.push(empty_item_value);//element not exists
					}

					if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('WOHNEN')) == true) {
						immosearch_array_object_objektkategorie_nutzungsart_wohnen.push($(this).find("objektkategorie nutzungsart").attr('WOHNEN'));//element exists
					} else {
						immosearch_array_object_objektkategorie_nutzungsart_wohnen.push(empty_item_value);//element not exists
					}

					if (check_if_element_exists_boolean($(this).find("objektkategorie vermarktungsart").attr('MIETE_PACHT')) == true) {
						immosearch_array_object_objektkategorie_vermarktungsart_miete_pacht.push($(this).find("objektkategorie vermarktungsart").attr('MIETE_PACHT'));//element exists
					} else {
						immosearch_array_object_objektkategorie_vermarktungsart_miete_pacht.push(empty_item_value);//element not exists
					}
          //console.log("MIETE VALUE: " + immosearch_array_object_objektkategorie_vermarktungsart_miete_pacht);

					if (check_if_element_exists_boolean($(this).find("objektkategorie vermarktungsart").attr('KAUF')) == true) {
						immosearch_array_object_objektkategorie_vermarktungsart_kauf.push($(this).find("objektkategorie vermarktungsart").attr('KAUF'));//element exists
					} else {
						immosearch_array_object_objektkategorie_vermarktungsart_kauf.push(empty_item_value);//element not exists
					}
          //console.log("KAUF VALUE: " + immosearch_array_object_objektkategorie_vermarktungsart_kauf);

          //console.log("RESULT: " + $(this).find("objektart").children()[0].tagName);
					if (check_if_element_exists_boolean($(this).find("objektart wohnung").attr('wohnungtyp')) == true) {
						//element exists
						var immosearch_objektart_wohnung = capitalise(escapeHtml($(this).find("objektart wohnung").attr('wohnungtyp')));
						if (immosearch_objektart_wohnung == "Etage") {
							immosearch_objektart_wohnung = "Etagenwohnung";
						} else if (immosearch_objektart_wohnung == "Dachgeschoss") {
							immosearch_objektart_wohnung = "Dachgeschosswohnung";
						} else if (immosearch_objektart_wohnung == "Erdgeschoss") {
							immosearch_objektart_wohnung = "Erdgeschosswohnung";
						}
						immosearch_array_object_objektart.push(immosearch_objektart_wohnung);

					} else if ($(this).find("objektart").children()[0].tagName == "wohnung" || $(this).find("objektart").children()[0].tagName == "haus" || $(this).find("objektart").children()[0].tagName == "grundstueck") {
            immosearch_array_object_objektart.push($(this).find("objektart").children()[0].tagName.capitalize());
          } else if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('GEWERBE')) == true) {
            immosearch_array_object_objektart.push("Gewerbe");
					} else {
            //element not exists
						immosearch_array_object_objektart.push(empty_item_value);
          }
				});

				var occurences_areas = immosearch_array_object_ortsteil.group();//group areas and count them
				//$("#dynamic_area_list").empty();

				//check if the array "build_locations_array" is empty, if so then push the itams of the areas in
				if (build_locations_array.length == 0) {
					for (var areas in occurences_areas) {
						build_locations_array.push(areas);
						build_locations_array_number.push(occurences_areas[areas]);
					}
				}
				occurences_areas = "";//clear the object

				$(xml).find("ausstattung").each(function(i) {
					//console.log("AUSSTATTUNG GROUP LENGTH: " + $(this).children().length);//trace

					//check the length of the <tags>
					if ($(this).children().length > 0) {
						immosearch_array_object_ausstattung.push([]);//add anonymous array in immosearch_array_object_ausstattung array (multidimensional array)
						var total_group_length = $(this).children().length;
						for(var i_inner = 0; i_inner < total_group_length; i_inner++) {
							var object_ausstattung = $(this).children()[i_inner].nodeName;
							//console.log("AUSSTATTUNG NODE NAMES: " + object_ausstattung);//trace

							//check the node names and push in database
							if (object_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("DUSCHE") == "true") {
								immosearch_array_object_ausstattung[i].push("Dusche");
							} else if (object_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("WANNE") == "true") {
								immosearch_array_object_ausstattung[i].push("Badewanne");
							} else if (object_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("FENSTER") == "true") {
								immosearch_array_object_ausstattung[i].push("Badezimmerfenster");
							} else if (object_ausstattung == "kueche" && $(this).children()[i_inner].getAttribute("EBK") == "true") {
								immosearch_array_object_ausstattung[i].push("EBK");
							} else if (object_ausstattung == "kamin" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("Kamin");
							} else if (object_ausstattung == "klimatisiert" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("Klimatisiert");
							} else if (object_ausstattung == "fahrstuhl" && $(this).children()[i_inner].getAttribute("PERSONEN") == "true" || $(this).children()[i_inner].getAttribute("LASTEN") == "true") {
								immosearch_array_object_ausstattung[i].push("Aufzug");
							} else if (object_ausstattung == "gartennutzung" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("Gartennutzung");
							} else if (object_ausstattung == "moebliert" && $(this).children()[i_inner].getAttribute("moeb") == "VOLL" || $(this).children()[i_inner].getAttribute("moeb") == "TEIL") {
								immosearch_array_object_ausstattung[i].push("Möbliert");
							} else if (object_ausstattung == "rollstuhlgerecht" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("Rollstuhlger");
							} else if (object_ausstattung == "kabel_sat_tv" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("Kabel Sat TV");
							} else if (object_ausstattung == "dvbt" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("DVBT");
							} else if (object_ausstattung == "barrierefrei" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("Barrierefrei");
							} else if (object_ausstattung == "sauna" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("Sauna");
							} else if (object_ausstattung == "wasch_trockenraum" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_object_ausstattung[i].push("Trockenraum");
							} else if (object_ausstattung == "unterkellert" && $(this).children()[i_inner].getAttribute("keller") == "JA" || $(this).children()[i_inner].getAttribute("keller") == "TEIL") {
								immosearch_array_object_ausstattung[i].push("Keller");
							}

						}
					}
				});

				$(xml).find("immobilie anhaenge").each(function(iv) {
						//console.log("TOTAL ANHAEGE: " + i);
						immosearch_array_img.push([]);
						$(this).find("anhang").each(function(i) {
              if ($(this).attr("location") == "REMOTE") {
  							if ($(this).attr("gruppe") == "TITELBILD" || $(this).attr("gruppe") == "AUSSENANSICHTEN" || $(this).attr("gruppe") == "BILD" || $(this).attr("gruppe") == "INNENANSICHTEN") {
  									if ($(this).children().find("pfad").text()) {
  										immosearch_array_img[iv].push($(this).children().find("pfad").text());//push url
  									} else {
  										immosearch_array_img[iv].push(dummyPicsPath);//dummy image
  									}

  							}
              }
						});
				});

				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				$("#" + immo_counter_or_object_nr + "").html("Alle Wohnungen: <span id='count_immobilien'>" + immosearch_total_immobilien_counter + " Angebote</span>");

				var immosearchElement = '';//define var to append the data later
				$.each(immosearch_array_object_zimmer, function(i, array_value) {

					//VARS///////////////////////////////////////////////////////////////////////////////
					var immo_object_zimmer___final = removeAfterCertainCharacter(immosearch_array_object_zimmer[i], ".") + " Zimmer " + immosearch_array_object_objektart[i] + " | ";
					var immo_object_address_nr = immosearch_array_object_address_number[i];
					if (immo_object_address_nr.charAt(0) == 0) {//check if start with 0
						immo_object_address_nr = checkIfNumberStartsFromZero(immosearch_array_object_address_number[i]);
					} else {
						immo_object_address_nr = immosearch_array_object_address_number[i];
					}

					//check if address numbers is empty or (n.a.)
					if (immo_object_address_nr == "" || immo_object_address_nr == "(n.a.)") {
						immo_object_address_nr = "";
					}

					var immo_object_address___final = immosearch_array_object_address[i] + " " + immo_object_address_nr + " | ";
					var immo_object_plz_nr = immosearch_array_object_plz_number[i];
					var immo_object_ort = immosearch_array_object_ort[i];
					var immo_object_ort_without_plz = immosearch_array_object_ort[i];//special case ort without plz
					var immo_object_ortsteil = immosearch_array_object_ortsteil[i];

					if (typeof immo_object_zimmer___final == "undefined") {
						immo_object_zimmer___final = "";
					}

					if (typeof immo_object_plz_nr == "undefined") {
						immo_object_plz_nr = "";
					}

					if (typeof immo_object_ort == "undefined") {
						list_ort = "";
					}

					if (typeof immo_object_ortsteil == "undefined") {
						immo_object_ortsteil = "";
					}

					if (typeof immo_object_address___final == "undefined") {
						immo_object_address___final = "";
					}

					if (typeof immo_object_address_nr == "undefined") {
						immo_object_address_nr = "";
					}

					if (typeof immo_object_ort_without_plz == "undefined") {
						immo_object_ort_without_plz = "";
					}
					/////////////////////////////////////////////////////////////////////////////////////
					//Miete zzgl. NK
					var immo_object_grundmiete___final = "";
					var immo_object_grundmiete = replaceDotWithComma(immosearch_array_object_nettokaltmiete[i]);
					if (typeof immo_object_grundmiete != "undefined" && immo_object_grundmiete) {
						immo_object_grundmiete = ifLastCharIsOnlyOneNull(immo_object_grundmiete);
						immo_object_grundmiete = afterCommaKeep2Char(immo_object_grundmiete);
						immo_object_grundmiete___final += immo_object_grundmiete;
					} else {
						//case that nettokaltmiete is empty
						immo_object_grundmiete = replaceDotWithComma(immosearch_array_object_kaltmiete[i]);
						if (typeof immo_object_grundmiete != "undefined" && immo_object_grundmiete) {
							immo_object_grundmiete = ifLastCharIsOnlyOneNull(immo_object_grundmiete);
							immo_object_grundmiete = afterCommaKeep2Char(immo_object_grundmiete);
							immo_object_grundmiete___final += immo_object_grundmiete;
						} else {
							//if empty K.A.
							immo_object_grundmiete___final += 'K.A.';
						}
					}
					/////////////////////////////////////////////////////////////////////////////////////
					//wohnflaeche
					var immo_object_wohnflaeche___final = "";
					var immo_object_wohnflaeche = immosearch_array_object_wohnflaeche[i];
					if (typeof immo_object_wohnflaeche != "undefined" && immo_object_wohnflaeche) {
						immo_object_wohnflaeche___final += immo_object_wohnflaeche.dot2comma();
					} else {
						immo_object_wohnflaeche___final += 'K.A.';
					}
					/////////////////////////////////////////////////////////////////////////////////////
					//wohnflaeche
					var immo_object_zimmer_val___final = "";
					var immo_object_zimmer_val = removeAfterCertainCharacter(immosearch_array_object_zimmer[i], ".");
					if (typeof immo_object_zimmer_val != "undefined" && immo_object_zimmer_val) {
						immo_object_zimmer_val___final += immo_object_zimmer_val;
					} else {
						immo_object_zimmer_val___final += 'K.A.';
					}
					/////////////////////////////////////////////////////////////////////////////////////
					//ausstattung
					var immo_object_ausstattung = "";
					if (immosearch_array_object_ausstattung.length > 0) {
						if (typeof immosearch_array_object_ausstattung[i] != 'undefined' || immosearch_array_object_ausstattung[i] != '') {
							for(var loop = 0; loop < immosearch_array_object_ausstattung[i].length; loop++) {
								//change color 1 by 1 (Yellow, Green)
								if (isOdd(loop) == false) {
									immo_object_ausstattung += '<input type="button" class="btn btn-default btn-xs" value="' + immosearch_array_object_ausstattung[i][loop] + '" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px;">';
								} else {
									immo_object_ausstattung += '<input type="button" class="btn btn-default btn-xs" value="' + immosearch_array_object_ausstattung[i][loop] + '" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px;">';
								}
							};
						}
					}
					if (immosearch_array_object_balkon[i] == "1.0") {
						immo_object_ausstattung += '<input type="button" class="btn btn-default btn-xs" value="Balkon" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px;">';
					}
					//VARS///////////////////////////////////////////////////////////////////////////////


					immosearchElement += '<a href="http://gwg-hombruch-barop.de/#wohnungssuche?obid=' + immosearch_array_object_object_number[i] + '" id="object_details___' + i + '" target="_self" style="color:#5a5a5a;">';
						immosearchElement += '<div class="panel panel-default">';
				      immosearchElement += '<div class="row panel-body">';
				        immosearchElement += '<div class="col-md-3">';

									immosearchElement += '<div class="img_mask img-responsive img-thumbnail">';
					          immosearchElement += '<img src="' + immosearch_array_img[i][0] + '" class="portrait" width="300" height="201" id="immosearch_image">';//portrait case
										//immosearchElement += '<img src="' + immosearch_array_img[i][0] + '" width="300" height="201" id="immosearch_image">';//landscape case
										immosearchElement += '<script>';
										immosearchElement += '$(document).ready(function() {';

										immosearchElement += '$("img").load(function() {';
										//immosearchElement += 'console.log("HEIGHT: " + $(this).height());';
										//immosearchElement += 'console.log("WIDTH: " + $(this).width());';
										immosearchElement += 'if ($(this).width() > $(this).height()) {';
										immosearchElement += '$(this).addClass("portrait");';
										//immosearchElement += 'console.log("Case Portrait");';
										immosearchElement += '} else if ($(this).width() < $(this).height()) {';
										immosearchElement += '$(this).removeClass("portrait");';
										//immosearchElement += 'console.log("Case Landscape");';
										immosearchElement += '} else {';
										immosearchElement += '$(this).removeClass("portrait");';
										//immosearchElement += 'console.log("Case Box");';
										immosearchElement += '}';
										//immosearchElement += 'console.log("----------------------------------");';
										immosearchElement += '});';

										immosearchElement += '});';
										immosearchElement += '<\/script>';
									immosearchElement += '</div>';

				        immosearchElement += '</div>';
				        immosearchElement += '<div class="col-md-9">';
				          immosearchElement += '<div class="col-md-12 col-sm-12 col-xs-12">';
									immosearchElement += '<h4><strong>' + immo_object_zimmer___final + immo_object_address___final + ' ' + immo_object_ort + ' ' + immo_object_ortsteil + '</strong></h4>';

	                  //fix value miete or kauf
	                  var details_miete_or_kauf = "";
	                  if (immosearch_array_object_objektkategorie_vermarktungsart_miete_pacht[i] == "true") {//miete
	                    details_miete_or_kauf = "zur Miete";
	                  } else if (immosearch_array_object_objektkategorie_vermarktungsart_kauf == "true") {//kauf
	                    details_miete_or_kauf = "zur Kauf";
	                  } else if (immosearch_array_object_objektkategorie_vermarktungsart_kauf == "---") {//empty
	                    details_miete_or_kauf = "";
	                  }

	                  if (immosearch_array_object_objektart[i] == "---") {
	                    //empty value
	                    immosearchElement += '<small>Miete</small>';
	                  } else {
	                    //array contains value
	                    immosearchElement += '<small>' + immosearch_array_object_objektart[i] + ' ' + details_miete_or_kauf + '</small>';
	                  }

				          immosearchElement += '</div>';
				          immosearchElement += '<div class="row col-md-12 col-sm-12 col-xs-12" style="margin-top:10px;">';
				            immosearchElement += '<div class="col-md-4">';
				              immosearchElement += '<h4><strong>' + immo_object_grundmiete + ' &euro;</strong></h4>';
				              immosearchElement += '<small>Miete zzgl. NK</small>';
				            immosearchElement += '</div>';
				            immosearchElement += '<div class="col-md-4">';
				              immosearchElement += '<h4><strong>' + immo_object_wohnflaeche___final + ' m&#178;</strong></h4>';
				              immosearchElement += '<small>Wohnfläche</small>';
				            immosearchElement += '</div>';
				            immosearchElement += '<div class="col-md-4">';
				              immosearchElement += '<h4><strong>' + immo_object_zimmer_val___final + '</strong></h4>';
				              immosearchElement += '<small>Zimmer</small>';
				            immosearchElement += '</div>';
				          immosearchElement += '</div>';
									immosearchElement += '<div class="col-md-12 col-sm-12 col-xs-12" style="margin-top:25px;">' + immo_object_ausstattung + '</div>';
				        immosearchElement += '</div>';
				      immosearchElement += '</div>';
				    immosearchElement += '</div>';
					immosearchElement += '</a>';

					//js und jquery
					immosearchElement += '<script>';
					immosearchElement += '$(document).ready(function() {';

					/*
					immosearchElement += '$("#object_details___' + i + '").on("contextmenu", function() {';

					immosearchElement += 'if (window.confirm("Link im neuen tab öffnen")) {';
						immosearchElement += 'window.open("http://gwg-hombruch-barop.de/#wohnungssuche?obid=' + immosearch_array_object_object_number[i] + '", "_blank");';
					immosearchElement += '};';

					    //immosearchElement += 'alert("Open Link in New Tab");';
					    immosearchElement += 'return false;';
					immosearchElement += '});';

					immosearchElement += '$("#object_details___' + i + '").click(function() {';
						//(must convert to String "object id") then ajax call for details page
						immosearchElement += 'homeinfo_immosearch_details("'+immosearch_array_object_object_number[i]+'", "'+cid+'", "'+container+'", "'+preloadeGif+'", "'+immo_counter_or_object_nr+'", "'+dummyPicsPath+'", "'+container_zuruck_to_list+'", "'+contact_form_object_nr+'");';//details page
						immosearchElement += 'return false;';
					immosearchElement += '});';
					*/

					immosearchElement += '});';
					immosearchElement += '<\/script>';

				});//end - $.each(immosearch_array_object_zimmer, function(i, array_value) {

				$("#" + container + "").append(immosearchElement);//append list
				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				$("#immosearch_preloader").remove();//remove preloader

      } else {
        $("#immosearch_preloader").remove();//remove preloader

        //no children nodes
        swal({
          title: "Achtung!",
          text: "Keine Angebote vorhanden!",
          type: "warning",
          html: true,
          confirmButtonColor: "#f8bf86",
          confirmButtonText: "Wiederholen",
          allowOutsideClick: false,
          showConfirmButton: true
        });

      }
    },
    error: function (xhr, request, status, error) {

      //console.log(request.responseText);
      //console.log(xhr.responseText);
			$("#immosearch_preloader").remove();//remove preloader

      swal({
        title: "Achtung!",
        text: "Etwas ist schief gelaufen, bitte erneut versuchen oder Service kontaktieren.",
        type: "warning",
        html: true,
        confirmButtonColor: "#f8bf86",
        confirmButtonText: "Wiederholen",
        allowOutsideClick: false,
        showConfirmButton: true
      });

    }
  });
}

//details page function
function homeinfo_immosearch_details(object_id, cid, container, preloadeGif, immo_counter_or_object_nr, dummyPicsPath, container_zuruck_to_list, contact_form_object_nr) {

	//console.log("homeinfo_immosearch_details() OBID: " + object_id);

  $("#" + immo_counter_or_object_nr + "").empty();
	$("#" + container_zuruck_to_list + "").show();

	//////////////////////////////////////////////////////////////////////////////
	//get url parameter
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.hash)||[,""])[1].replace(/\+/g, '%20'))||null
  }

  //console.log("PAGE URL: " + window.location.href);
  var obid_param = getURLParameter('obid');//get the object number
  if (obid_param) {
    //true
    //console.log("OBJECT PARAM VALUE: " + obid_param);
  } else {
    //false
    //console.log("OBJECT PARAM VALUE IS EMPTY OR NULL: " + obid_param);

		//get url and add the object number
		history.pushState("wohnungssuche", "?obid=" + object_id, window.location.href + "?obid=" + object_id);
  }
	//////////////////////////////////////////////////////////////////////////////

	//ajax details (by object id)
	$.ajax({
		url: immosearch_url  + cid + "/?filter=objektnr_intern==" + object_id + "&include=allatts,freitexte",
    crossDomain: true,
    type: "GET",
    dataType: "xml",
    cache: false,
    beforeSend: function() {
      $("#" + container + "").empty();
			$('#btn_details_print').unbind();
      $("#" + container + "").append('<img src="' + preloadeGif + '" width="32" height="32" id="immosearch_preloader" />');//append preloader in container
    },
    success: function (xml) {
      if ($(xml).find("ns1\\:rsp").children().length >= 0) {//check if immobilien are more than 0
				var xml_namespace = $(xml).find("ns1\\:rsp");
				var anbieterCustomerId = escapeHtml($(xml).find("anbieternr").text());
				var anbieterFirmName = escapeHtml($(xml).find("anbieternr").next().text());
				var total_counter = 0;
				var immosearch_var_object_details_wbs_val = "";
				var immosearch_var_details_object_heizkostennetto = "";
				var immosearch_var_details_object_heizkosten_enthalten = "";
				var immosearch_var_details_object_heizkosten = "";
				var immosearch_var_details_object_etage = "";
				var immosearch_var_details_object_nebenkosten = "";
				var immosearch_var_details_object_kaltmiete = "";
				var immosearch_var_details_object_provisionspflichtig = "";
				var immosearch_var_details_object_primaerenergietraeger = "";
				var immosearch_var_details_object_baujahr = "";
				var immosearch_var_details_object_objnumber = "";
				var immosearch_array_object_balkon = "";
				var immosearch_array_object_ausstatt_beschr = "";
				var immosearch_array_object_objektnr_extern = "";
				var immosearch_var_details_kontakt__email_zentrale = "";
				var immosearch_var_details_kontakt__email_direkt = "";
				var immosearch_var_details_kontakt__tel_zentrale = "";
				var immosearch_var_details_kontakt__tel_durchw = ""
				var immosearch_var_details_kontakt__tel_fax = "";
				var immosearch_var_details_kontakt__andere = "";
				var immosearch_var_details_kontakt__name = "";
				var immosearch_var_details_kontakt__strasse = "";
				var immosearch_var_details_kontakt__hausnummer = "";
				var immosearch_var_details_kontakt__plz = "";
				var immosearch_var_details_kontakt__ort = "";
				var details_energiepass_epart = escapeHtml($(xml).find("energiepass epart").text());
				var details_energiepass_energieverbrauchkennwert = escapeHtml($(xml).find("energiepass energieverbrauchkennwert").text());
				var details_energiepass_endenergiebedarf = escapeHtml($(xml).find("energiepass endenergiebedarf").text());
				var details_energiepass_mitwarmwasser = escapeHtml($(xml).find("energiepass mitwarmwasser").text());
				var immosearch_var_details_object_betriebskostennetto = "";
				var immosearch_var_details_object_provisionnetto = "";
				var immosearch_var_details_object_freitexte_objekttitel = "";
				var immosearch_var_details_object_anzahl_etagen = "";
				var immosearch_var_details_object_lage_im_bau_left = "";
				var immosearch_var_details_object_lage_im_bau_right = "";
				var immosearch_var_details_object_lage_im_bau_front = "";
				var immosearch_var_details_object_lage_im_bau_back = "";
				var immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart = "";
				var immosearch_var_details_object_zustand_angaben__zustand__zustand_art = "";
				var immosearch_var_details_object_freitexte_lage = "";
				var immosearch_var_details_object_freitexte_dreizeiler = "";
				var immosearch_var_details_object_freitexte_sonstige_angaben = "";

				//arrays
				immosearch_array_details_object_attachment_pdf = [];
				immosearch_array_details_object_img = [];
				var immosearch_array_details_object_address = [];
				var immosearch_array_details_object_address_number = [];
				var immosearch_array_details_object_plz_number = [];
				var immosearch_array_details_object_ort = [];
				var immosearch_array_details_object_zimmer = [];
				var immosearch_array_details_object_wohnflaeche = [];
				var immosearch_array_details_object_gesamtmiete = [];
				var immosearch_array_details_object_nettokaltmiete = [];
				var immosearch_array_details_object_object_number = [];
				var immosearch_array_details_object_ortsteil = [];
				var immosearch_array_details_object_ausstattung = [];
				var immosearch_array_details_object_verfugbar_ab = [];
				var immosearch_array_details_object_betriebskosten = [];
				var immosearch_array_details_object_kaution = [];
				var immosearch_var_details_object_ausstattung_befeuerung = [];
				var immosearch_var_details_object_user_defined_anyfield = [];

				$(xml).find("immobilie").each(function(i) {
					//push the images (normal images and floor plans) in separate arrays
					$(xml).find("anhang").each(function(i) {
            if ($(this).attr("location") == "REMOTE") {
              if ($(this).attr("gruppe") == "DOKUMENTE") {
                //PDF
                if ($(this).children().find("pfad").text()) {
                  immosearch_array_details_object_attachment_pdf.push($(this).children().find("pfad").text());
                }
              } else {
                if ($(this).attr("gruppe") == "TITELBILD") {
  								if ($(this).children().find("pfad").text()) {
  									immosearch_array_details_object_img.push($(this).children().find("pfad").text());
  								} else {
  									immosearch_array_details_object_img.push(dummyPicsPath);
  								}
    						} else if ($(this).attr("gruppe") == "AUSSENANSICHTEN") {
                  if ($(this).children().find("pfad").text()) {
                    immosearch_array_details_object_img.push($(this).children().find("pfad").text());
                  } else {
                    immosearch_array_details_object_img.push(dummyPicsPath);
                  }
                } else if ($(this).attr("gruppe") == "BILD") {
                  if ($(this).children().find("pfad").text()) {
                    immosearch_array_details_object_img.push($(this).children().find("pfad").text());
                  } else {
                    immosearch_array_details_object_img.push(dummyPicsPath);
                  }
                } else if ($(this).attr("gruppe") == "INNENANSICHTEN") {
                  if ($(this).children().find("pfad").text()) {
                    immosearch_array_details_object_img.push($(this).children().find("pfad").text());
                  } else {
                    immosearch_array_details_object_img.push(dummyPicsPath);
                  }
                }
              }

							if ($(this).attr("gruppe") == "GRUNDRISS") {
                if ($(this).children().find("pfad").text()) {
                  immosearch_array_details_object_img.push($(this).children().find("pfad").text());
                } else {
                  immosearch_array_details_object_img.push(dummyPicsPath);
                }
              }

            }
					});

					//check the length of the array and add 1 dummy if is 0
					if (immosearch_array_details_object_img.length == 0) {
						immosearch_array_details_object_img.push(dummyPicsPath);//dummy image
					}

					//arrays to fill with data
					immosearch_array_details_object_address.push(escapeHtml($(this).find("geo strasse").text()));
					immosearch_array_details_object_address_number.push(escapeHtml($(this).find("geo hausnummer").text()));
					immosearch_array_details_object_plz_number.push(escapeHtml($(this).find("geo plz").text()));
					immosearch_array_details_object_ort.push(escapeHtml($(this).find("geo ort").text()));
					immosearch_array_details_object_zimmer.push(escapeHtml($(this).find("flaechen anzahl_zimmer").text()));
					immosearch_array_details_object_wohnflaeche.push(escapeHtml($(this).find("flaechen wohnflaeche").text()));
					immosearch_array_details_object_gesamtmiete.push(escapeHtml($(this).find("preise warmmiete").text()));
					immosearch_array_details_object_nettokaltmiete.push(escapeHtml($(this).find("preise nettokaltmiete").text()));
					immosearch_array_details_object_object_number.push(escapeHtml($(this).find("verwaltung_techn openimmo_obid").text()));
					immosearch_array_details_object_ortsteil.push(escapeHtml($(this).find("geo regionaler_zusatz").text()));
					immosearch_array_details_object_verfugbar_ab.push(escapeHtml($(this).find("verwaltung_objekt verfuegbar_ab").text()));
					immosearch_array_details_object_betriebskosten.push(escapeHtml($(this).find("preise betriebskostenust").text()));//////////////
					immosearch_array_details_object_kaution.push(escapeHtml($(this).find("preise kaution").text()));//////////////

					//vars to fill with data
					immosearch_var_details_object_kaltmiete = escapeHtml($(this).find("preise kaltmiete").text());
					immosearch_var_details_object_etage = escapeHtml($(this).find("geo etage").text());
					immosearch_var_details_object_anzahl_etagen = escapeHtml($(this).find("geo anzahl_etagen").text());
					immosearch_var_object_details_wbs_val = escapeHtml($(this).find("verwaltung_objekt wbs_sozialwohnung").text());
					immosearch_var_details_object_heizkostennetto = escapeHtml($(this).find("preise heizkostennetto").text());//decimal
					immosearch_var_details_object_heizkosten_enthalten = escapeHtml($(this).find("preise heizkosten_enthalten").text());//boolean
					immosearch_var_details_object_heizkosten = escapeHtml($(this).find("preise heizkosten").text());//decimal
					immosearch_var_details_object_nebenkosten = escapeHtml($(this).find("preise nebenkosten").text());
					immosearch_var_details_object_provisionspflichtig = escapeHtml($(this).find("preise provisionspflichtig").text());
					immosearch_var_details_object_primaerenergietraeger = escapeHtml($(this).find("energiepass primaerenergietraeger").text());

					//check if energie has also year (to not be double value)
					if ($(this).find("energiepass baujahr").text() != "") {
						immosearch_var_details_object_baujahr = escapeHtml($(this).find("energiepass baujahr").text());
					} else {
						immosearch_var_details_object_baujahr = escapeHtml($(this).find("zustand_angaben baujahr").text());
					}

					immosearch_var_details_object_objnumber = escapeHtml($(this).find("verwaltung_techn openimmo_obid").text());
					immosearch_array_object_balkon = escapeHtml($(this).find("flaechen anzahl_balkone").text());
					immosearch_array_object_objektnr_extern  = escapeHtml($(this).find("verwaltung_techn objektnr_intern").text());
          $("#" + immo_counter_or_object_nr + "").html("Wohnungsnr: <span id='count_immobilien'>" + immosearch_array_object_objektnr_extern + "</span>");//add the object nr tot title
					$("#" + contact_form_object_nr + "").html('<br><button class="btn btn-success pull-right" type="button" style="margin-right:5px; margin-bottom:5px; margin-top:5px; box-shadow:none; cursor:default;"><strong>Wohnungsnr: '  + immosearch_array_object_objektnr_extern + '</strong></button>');
					immosearch_var_details_object_betriebskostennetto = escapeHtml($(this).find("preise betriebskostennetto").text());
					immosearch_var_details_object_provisionnetto = escapeHtml($(this).find("preise provisionnetto").text());
					immosearch_var_details_object_lage_im_bau_left = escapeHtml($(this).find("geo lage_im_bau").attr("LINKS"));
					immosearch_var_details_object_lage_im_bau_right = escapeHtml($(this).find("geo lage_im_bau").attr("RECHTS"));
					immosearch_var_details_object_lage_im_bau_front = escapeHtml($(this).find("geo lage_im_bau").attr("VORNE"));
					immosearch_var_details_object_lage_im_bau_back = escapeHtml($(this).find("geo lage_im_bau").attr("HINTEN"));
					immosearch_var_details_object_zustand_angaben__zustand__zustand_art = escapeHtml($(this).find("zustand_angaben zustand").attr("zustand_art"));

					//freitexte
					immosearch_array_object_ausstatt_beschr = escapeHtml($(this).find("freitexte ausstatt_beschr").text());
					immosearch_var_details_object_freitexte_objekttitel = escapeHtml($(this).find("freitexte objekttitel").text());
					immosearch_var_details_object_freitexte_dreizeiler = escapeHtml($(this).find("freitexte dreizeiler").text());
					immosearch_var_details_object_freitexte_lage = escapeHtml($(this).find("freitexte lage").text());
					immosearch_var_details_object_freitexte_sonstige_angaben = escapeHtml($(this).find("freitexte sonstige_angaben").text());

					//kontakt details
					immosearch_var_details_kontakt__email_zentrale = escapeHtml($(this).find("kontaktperson email_zentrale").text());
					immosearch_var_details_kontakt__email_direkt = escapeHtml($(this).find("kontaktperson email_direkt").text());
					immosearch_var_details_kontakt__tel_zentrale = escapeHtml($(this).find("kontaktperson tel_zentrale").text());
					immosearch_var_details_kontakt__tel_durchw = escapeHtml($(this).find("kontaktperson tel_durchw").text());
					immosearch_var_details_kontakt__tel_fax = escapeHtml($(this).find("kontaktperson tel_fax").text());
					immosearch_var_details_kontakt__andere = escapeHtml($(this).find("kontaktperson anrede").text());
					immosearch_var_details_kontakt__name = escapeHtml($(this).find("kontaktperson name").text());
					immosearch_var_details_kontakt__strasse = escapeHtml($(this).find("kontaktperson strasse").text());
					immosearch_var_details_kontakt__hausnummer = escapeHtml($(this).find("kontaktperson hausnummer").text());
					immosearch_var_details_kontakt__plz = escapeHtml($(this).find("kontaktperson plz").text());
					immosearch_var_details_kontakt__ort = escapeHtml($(this).find("kontaktperson ort").text());

					// Wesentlicher Energieträger
					$(xml).find("ausstattung befeuerung").each(function() {
						$.each(this.attributes, function(i, attrib){
							 var name = attrib.name;
							 var value = attrib.value;
							 //console.log("NAME: " + name);
							 //console.log("VALUE: " + value);
							 if (value == "true") {
								 immosearch_var_details_object_ausstattung_befeuerung.push(name);
							 }
						});
					});

					$(xml).find("user_defined_anyfield").each(function() {
						//console.log("user_defined_anyfield: " + $(this).find('[fieldname="etage"]').text() );
						immosearch_var_details_object_user_defined_anyfield.push($(this).find('[fieldname="etage"]').text());
					});

				});//$(xml).find("immobilie").each(function(i) {

				//Ausstattung parser (needs to be outside of "immobilie" each loop)
				$(xml).find("ausstattung").each(function(i) {
					//console.log("AUSSTATTUNG GROUP LENGTH: " + $(this).children().length);//trace

					//check the length of the <tags>
					if ($(this).children().length > 0) {
						immosearch_array_details_object_ausstattung.push([]);//add anonymous array in immosearch_array_object_ausstattung array (multidimensional array)
						var total_details_group_length = $(this).children().length;
						for(var i_inner = 0; i_inner < total_details_group_length; i_inner++) {
							var object_details_ausstattung = $(this).children()[i_inner].nodeName;
							//console.log("AUSSTATTUNG NODE NAMES: " + object_details_ausstattung);//trace

							//check the node names and push in database
							if (object_details_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("DUSCHE") == "true") {
								immosearch_array_details_object_ausstattung[i].push("Dusche");
							} else if (object_details_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("WANNE") == "true") {
								immosearch_array_details_object_ausstattung[i].push("Badewanne");
							} else if (object_details_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("FENSTER") == "true") {
								immosearch_array_details_object_ausstattung[i].push("Badezimmerfenster");
							} else if (object_details_ausstattung == "kueche" && $(this).children()[i_inner].getAttribute("EBK") == "true") {
								immosearch_array_details_object_ausstattung[i].push("EBK");
							} else if (object_details_ausstattung == "kamin" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("Kamin");
							} else if (object_details_ausstattung == "klimatisiert" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("Klimatisiert");
							} else if (object_details_ausstattung == "fahrstuhl" && $(this).children()[i_inner].getAttribute("PERSONEN") == "true" || $(this).children()[i_inner].getAttribute("LASTEN") == "true") {
								immosearch_array_details_object_ausstattung[i].push("Aufzug");
							} else if (object_details_ausstattung == "gartennutzung" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("Gartennutzung");
							} else if (object_details_ausstattung == "moebliert" && $(this).children()[i_inner].getAttribute("moeb") == "VOLL" || $(this).children()[i_inner].getAttribute("moeb") == "TEIL") {
								immosearch_array_details_object_ausstattung[i].push("Möbliert");
							} else if (object_details_ausstattung == "rollstuhlgerecht" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("Rollstuhlger");
							} else if (object_details_ausstattung == "kabel_sat_tv" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("Kabel Sat TV");
							} else if (object_details_ausstattung == "dvbt" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("DVBT");
							} else if (object_details_ausstattung == "barrierefrei" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("Barrierefrei");
							} else if (object_details_ausstattung == "sauna" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("Sauna");
							} else if (object_details_ausstattung == "wasch_trockenraum" && $(this).children()[i_inner].nodeValue == "true") {
								immosearch_array_details_object_ausstattung[i].push("Trockenraum");
							} else if (object_details_ausstattung == "unterkellert" && $(this).children()[i_inner].getAttribute("keller") == "JA" || $(this).children()[i_inner].getAttribute("keller") == "TEIL") {
								immosearch_array_details_object_ausstattung[i].push("Keller");
							} else if (object_details_ausstattung == "heizungsart") {
								//var heizungsart_attribute_name = $(this).children()[i_inner].attributes.name;//to get the name in the future and do in in loop
								if ($(this).children()[i_inner].getAttribute("OFEN") == "true") {
									immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart = "";
								} else if ($(this).children()[i_inner].getAttribute("ETAGE") == "true") {
									immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart = "Etagenheizung";
								} else if ($(this).children()[i_inner].getAttribute("ZENTRAL") == "true") {
									immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart = "";
								} else if ($(this).children()[i_inner].getAttribute("FERN") == "true") {
									immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart = "";
								} else if ($(this).children()[i_inner].getAttribute("FUSSBODEN") == "true") {
									immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart = "";
								}
							}
							//console.log("------------------------------------------------------");//trace
						}
						//console.log("/////////////////////////////////////////////////////////////////////////////////////////");//trace
					}
				});

				var details_address = immosearch_array_details_object_address[0];
				var details_address_number = immosearch_array_details_object_address_number[0];
				if (details_address_number.charAt(0) == 0) {//check if start with 0
					details_address_number = checkIfNumberStartsFromZero(immosearch_array_details_object_address_number[0]);
				} else {
					details_address_number = immosearch_array_details_object_address_number[0];
				}

				var details_address_plz_number = immosearch_array_details_object_plz_number[0];
				var details_address_ort = immosearch_array_details_object_ort[0];
				var details_address_ortsteil = immosearch_array_details_object_ortsteil[0];
				var immosearch_array_object_details_zimmer_val = removeAfterCertainCharacter(immosearch_array_details_object_zimmer[0], ".");

				if (typeof details_address == "undefined") {
					details_address = "";
				}

				if (typeof details_address_number == "undefined" || details_address_number == "" || details_address_number == "(n.a.)") {
					details_address_number = "";
				}

				if (typeof details_address_plz_number == "undefined") {
					details_address_plz_number = "";
				}

				if (typeof details_address_ort == "undefined") {
					details_address_ort = "";
				}

				if (typeof details_address_ortsteil == "undefined") {
					details_address_ortsteil = "";
				}

				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				var immoDetailElement = '';

				//html
				immoDetailElement += '<div class="panel panel-default nohover">';
		      immoDetailElement += '<div class="panel-heading nohover">';
		        immoDetailElement += '<h3 class="panel-title nohover">';

							/*
							//should be this title first, else the title made from Homeinfo
							if (typeof immosearch_var_details_object_freitexte_objekttitel != "undefined" && immosearch_var_details_object_freitexte_objekttitel) {
								if (immosearch_var_details_object_freitexte_objekttitel.indexOf('bad') > -1 || immosearch_var_details_object_freitexte_objekttitel.indexOf('Bad') > -1 || immosearch_var_details_object_freitexte_objekttitel.indexOf('BAD') > -1) {
									immoDetailElement += '<strong>Anzahl Bäder</strong><span class="pull-right">1</span><br>';
								} else {
									immoDetailElement += '<strong>Anzahl Bäder</strong><span class="pull-right">K.A.</span><br>';
								}
							}
							*/

		          immoDetailElement += '<strong id="form_object_title">' + immosearch_array_object_details_zimmer_val + ' Zimmer Wohnung | ' + details_address + ' ' + details_address_number + ' | ' + details_address_plz_number + ' ' + details_address_ort + ' - ' + details_address_ortsteil + '</strong> <button class="btn btn-success pull-right" type="button" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px; margin-bottom:5px; box-shadow:none; cursor:default;"><strong>Wohnungsnr: '  + immosearch_array_object_objektnr_extern + '</strong></button>';
		        immoDetailElement += '</h3>';
		      immoDetailElement += '</div>';
		      immoDetailElement += '<div class="panel-body nohover">';

		        immoDetailElement += '<div class="col-md-12 col-sm-12 col-xs-12" style="padding-bottom:20px;">';
		          immoDetailElement += '<div class="col-md-6" style="padding-top:5px; padding-bottom:5px;">';

							//gallery, check if images are not 0
							if (immosearch_array_details_object_img.length != 0) {
								immoDetailElement += '<a href="javascript:void(0);" id="images_modal_click_event" data-toggle="modal" data-target="#imagesGalleryModal">';//link to open image gallery
								//check if images are more than 1 to use kenburns

								//check if images length is 1, if 1 then push the same at the end to have kenburns
								//console.log("IMAGES LENGTH: " + immosearch_array_details_object_img.length);
								var img_kenburns_boolean = false;
								if (immosearch_array_details_object_img.length == 1) {
									immosearch_array_details_object_img.push(immosearch_array_details_object_img[0]);
									img_kenburns_boolean = true;
								}

								if (immosearch_array_details_object_img.length != 1) {
									immoDetailElement += '<canvas id="mypic" class="kenburns img-responsive img-thumbnail" width="498" height="370"><p>Your browser doesnt support canvas!</p></canvas>';

									//img for the print (show only when is printing, then hide)
									immoDetailElement += '<img src="' + immosearch_array_details_object_img[0] + '" class="img-responsive img-thumbnail" width="100%" height="401" id="print_img" style="margin-bottom:5px; display:none;">';

									immoDetailElement += '<script>';
                  immoDetailElement += '$(document).ready(function() {';
                  immoDetailElement += '$(".kenburns").kenburns({';
          					immoDetailElement += 'images:[';
                    //array loop
                    immosearch_array_details_object_img.forEach(function(item) {
                      immoDetailElement += '"' + item + '",';
                    });
                    //array loop
          					immoDetailElement += '],';
          					immoDetailElement += 'frames_per_second: 30,';
          					immoDetailElement += 'display_time: 7000,';
          					immoDetailElement += 'fade_time: 1000,';
          					immoDetailElement += 'zoom: 2,';
          					immoDetailElement += 'background_color:"#ffffff",';
          					immoDetailElement += 'post_render_callback:function($canvas, context) {';
          						immoDetailElement += 'context.save();';
          						immoDetailElement += 'context.fillStyle = "#000";';
          						immoDetailElement += 'context.font = "bold 20px sans-serif";';
          						immoDetailElement += 'var width = $canvas.width();';
          						immoDetailElement += 'var height = $canvas.height();';
          						immoDetailElement += 'var text = "";';
          						immoDetailElement += 'var metric = context.measureText(text);';
          						immoDetailElement += 'context.fillStyle = "#fff";';
          						immoDetailElement += 'context.shadowOffsetX = 3;';
          						immoDetailElement += 'context.shadowOffsetY = 3;';
          						immoDetailElement += 'context.shadowBlur = 4;';
          						immoDetailElement += 'context.shadowColor = "rgba(0, 0, 0, 0.8)";';
          						immoDetailElement += 'context.fillText(text, width - metric.width - 8, height - 8);';
          						immoDetailElement += 'context.restore();';
          					immoDetailElement += '}';
          				immoDetailElement += '});';

									if (img_kenburns_boolean == true) {
										immosearch_array_details_object_img.pop();
									}


									var popup_images_details_title = '<strong>' + immosearch_array_object_details_zimmer_val + ' Zimmer Wohnung, ' + details_address + ' ' + details_address_number + ', ' + details_address_plz_number + ' ' + details_address_ort + ' - ' + details_address_ortsteil + '</strong>';

									immoDetailElement += '$("#myModalLabel").html("' + popup_images_details_title + '");';

                  immoDetailElement += '$("#images_modal_click_event").click(function() {';
                      immoDetailElement += '$("#image_source_gallery").attr("src", "' + immosearch_array_details_object_img[0] + '");';
                  immoDetailElement += '});';

                  immoDetailElement += '});';
                  immoDetailElement += '<\/script>';
								} else {
									//without kenburns
									immoDetailElement += '<img src="' + immosearch_array_details_object_img[0] + '" class="img-responsive img-thumbnail" width="100%" height="401" id="immosearch_detail_image" style="margin-bottom:5px;">';
								}
								immoDetailElement += '</a>';//end - anchor tag
							} else {
								//images are 0
								immoDetailElement += '<img src="' + dummyPicsPath + '" class="img-responsive img-thumbnail" width="100%" height="401" id="immosearch_detail_image" style="margin-bottom:5px;">';
							}

								//number of images
								if (immosearch_array_details_object_img.length == 0 || immosearch_array_details_object_img.length == 1) {
									immoDetailElement += '<span class="badge" id="badge_colors">' + immosearch_array_details_object_img.length + '</span> <span class="badge" id="badge_colors"><i class="fa fa-search"></i> Bild</span>';
								} else if (immosearch_array_details_object_img.length > 1) {
									immoDetailElement += '<span class="badge" id="badge_colors">' + immosearch_array_details_object_img.length + '</span> <span class="badge" id="badge_colors"><i class="fa fa-search"></i> Bilder</span>';
								} else {
									immoDetailElement += '<span class="badge">' + immosearch_array_details_object_img.length + '</span> <span class="badge"><i class="fa fa-search"></i> Bild</span>';
								}

								immoDetailElement += '<script>';
								immoDetailElement += '$(document).ready(function() {';
								//images
								//image counter for the modal/////////////////////////////////////////////////////////////////////////////////////////////
								var img_counter = 0;//img counter for the arrows to run the img array

								//console.log("IMAGE LENGTH: " + immosearch_array_details_object_img.length);

								if (immosearch_array_details_object_img.length > 1) {
								  //then disable the buttons
								  $("#previous_pic").show();
								  $("#next_pic").show();
								} else if (immosearch_array_details_object_img.length == 1) {
								  //console.log("Case length 1: " + immosearch_array_details_object_img.length);
								  $("#previous_pic").hide();
								  $("#next_pic").hide();
								} else {
								  $("#previous_pic").hide();
								  $("#next_pic").hide();
								}

								//show the counter of the picture (on popup modal)
								function show_counter_pic(img_html_counter) {
								  $("#show_img_counter").html(img_html_counter+1);
								}

								//reset the img counter
								$("#close_modal").click(function() {
								  img_counter = 0;
								  $("#show_img_counter").html(1);//reset the visual value (so when the user open the modal the number starts from 1)
								});

								//previous pic
								$("#previous_pic").click(function() {
								  if (img_counter == 0) {
								    //do nothing
								  } else if (img_counter <= immosearch_array_details_object_img.length) {
								    img_counter--;
								    if (immosearch_array_details_object_img[img_counter].substring(0, 5) == "data:") {
								      $("#image_source_gallery").attr("src", immosearch_array_details_object_img[img_counter]);
								    } else {
								      $("#image_source_gallery").attr("src", immosearch_array_details_object_img[img_counter] + "?" + $.now());
								    }
								    show_counter_pic(img_counter);
								  }
								});

								//next pic
								$("#next_pic").click(function() {
								  if (img_counter < immosearch_array_details_object_img.length -1) {
								    img_counter++;
								    if (immosearch_array_details_object_img[img_counter].substring(0, 5) == "data:") {
								      $("#image_source_gallery").attr("src", immosearch_array_details_object_img[img_counter]);
								    } else {
								      $("#image_source_gallery").attr("src", immosearch_array_details_object_img[img_counter] + "?" + $.now());
								    }
								    show_counter_pic(img_counter);
								  }
								});

								//on close modal clean content and reset counter
								$('body').on('hidden.bs.modal', '.modal', function () {
								  $(this).removeData('bs.modal');
								  $("#number_of_visible_picture").empty();
								  img_counter = 0;
								  $("#show_img_counter").html(1);//reset the visual value (so when the user open the modal the number starts from 1)
								});

								show_counter_pic(img_counter);//show the number of the picture (next - previous btn)
								$("#show_img_length").html(immosearch_array_details_object_img.length);//show in modal the length of the pictures
								//image counter for the modal/////////////////////////////////////////////////////////////////////////////////////////////
								immoDetailElement += '});';
								immoDetailElement += '<\/script>';

		          immoDetailElement += '</div>';
		          immoDetailElement += '<div class="col-md-6" style="padding-top:5px; padding-bottom:5px;">';
								immoDetailElement += '<div id="googleMapContainer" class="img-responsive img-thumbnail" style="display:block; width:498px; height:380px;"></div>';
		          immoDetailElement += '</div>';
		        immoDetailElement += '</div>';

						$.ajax({
							beforeSend: function() {
								$("#googleMapContainer").html("<img src='http://www.gwg-hombruch-barop.de/img/preloader/googleMapsIconPreloader.png'>");
					    },
							url: "http://gwg-hombruch-barop.de/seiten/map.php",
							type: "POST",
							data: "container=googleMapContainer"
								+ "&fullAddress=" + details_address + " " + details_address_number
								+ "&address=" + details_address
								+ "&addressNumber=" + details_address_number
								+ "&addressPlz=" + details_address_plz_number
								+ "&addressOrt=" + details_address_ort,
							cache: false,
							success: function (html) {
								$("#googleMapContainer").html(html);
							}
						});

		        immoDetailElement += '<div class="col-md-12 col-sm-12 col-xs-12">';
		          immoDetailElement += '<div class="col-md-6">';
		            immoDetailElement += '<h4><strong>GRÖSSE UND ZUSTAND</strong></h4>';
		            immoDetailElement += '<div class="row">';
		              immoDetailElement += '<div class="col-md-12">';
										if (typeof immosearch_array_object_details_zimmer_val != "undefined" && immosearch_array_object_details_zimmer_val) {
											immoDetailElement += '<strong>Anzahl Zimmer</strong><span class="pull-right" id="form_anzahl_zimmer">' + immosearch_array_object_details_zimmer_val + '</span><br>';
			              } else {
											immoDetailElement += '<strong>Anzahl Zimmer</strong><span class="pull-right" id="form_anzahl_zimmer">K.A.</span><br>';
			              }

										var immosearch_array_object_details_wohnflaeche_val = immosearch_array_details_object_wohnflaeche[0];
			              if (typeof immosearch_array_object_details_wohnflaeche_val != "undefined" && immosearch_array_object_details_wohnflaeche_val) {
											immoDetailElement += '<strong>Wohnfläche</strong><span class="pull-right" id="form_wohnflaeche">' + immosearch_array_object_details_wohnflaeche_val.dot2comma() + ' m&#178;</span><br>';
			              } else {
											immoDetailElement += '<strong>Wohnfläche</strong><span class="pull-right" id="form_wohnflaeche">K.A.</span><br>';
			              }

										//etage
			              if (typeof immosearch_var_details_object_etage != "undefined" && immosearch_var_details_object_etage) {
			                //check for etage value and modify
			                if (immosearch_var_details_object_etage  == 0) {
			                  //floor
			                  immosearch_details_etage_string = "EG";
			                } else if (immosearch_var_details_object_etage  < 0) {
			                  //basement
			                  immosearch_details_etage_string = "Souterrain";
			                } else if (immosearch_var_details_object_etage == immosearch_var_details_object_anzahl_etagen) {

												//check for the side of the appartment (left, right, front, back)
												if (immosearch_var_details_object_lage_im_bau_left == "true") {
													immosearch_details_etage_string = "DGL";
												} else if (immosearch_var_details_object_lage_im_bau_right == "true") {
													immosearch_details_etage_string = "DGR";
												} else if (immosearch_var_details_object_lage_im_bau_front == "true") {
													immosearch_details_etage_string = "DGE";
												} else if (immosearch_var_details_object_lage_im_bau_front == "true") {
													immosearch_details_etage_string = "DGN";
												} else {
													immosearch_details_etage_string = "DG";
												}

											} else if (immosearch_var_details_object_etage  > 0) {
			                  //floor
			                  immosearch_details_etage_string = immosearch_var_details_object_etage  + ". OG";
			                }

			                //attach the custom value
											immoDetailElement += '<strong>Etage</strong><span class="pull-right">' + immosearch_details_etage_string + '</span><br>';
			              } else {
			                var user_defined_etage = immosearch_var_details_object_user_defined_anyfield[0];
			                if (typeof user_defined_etage != "undefined" && user_defined_etage) {
												immoDetailElement += '<strong>Etage</strong><span class="pull-right">' + user_defined_etage + '</span><br>';
			                } else {
												immoDetailElement += '<strong>Etage</strong><span class="pull-right">K.A.</span><br>';
			                }
			              }


										if (typeof immosearch_var_details_object_anzahl_etagen != "undefined" && immosearch_var_details_object_anzahl_etagen) {
											immoDetailElement += '<strong>Anzahl Etagen</strong><span class="pull-right">' + immosearch_var_details_object_anzahl_etagen + '</span><br>';
										} else {
											immoDetailElement += '<strong>Anzahl Etagen</strong><span class="pull-right">K.A.</span><br>';
										}

			              //immosearch_array_details_object_wbs, check if element exists
			              if ($(xml).find('wbs_sozialwohnung').children().length == 0) {
											immoDetailElement += '<strong>WBS</strong><span class="pull-right">nicht erforderlich</span><br>';
			              } else {
											if (typeof immosearch_var_object_details_wbs_val != "undefined" && immosearch_var_object_details_wbs_val) {
				                if (immosearch_var_object_details_wbs_val == "true") {
													immoDetailElement += '<strong>WBS</strong><span class="pull-right">erforderlich</span><br>';
				                } else if (immosearch_var_object_details_wbs_val == "false") {
													immoDetailElement += '<strong>WBS</strong><span class="pull-right">nicht erforderlich</span><br>';
				                }
				              }
										}

		              immoDetailElement += '</div>';
		            immoDetailElement += '</div>';
		          immoDetailElement += '</div>';
		          immoDetailElement += '<div class="col-md-6">';
		            immoDetailElement += '<h4><strong>PREISE UND KOSTEN</strong></h4>';
		            immoDetailElement += '<div class="row">';
		              immoDetailElement += '<div class="col-md-12">';
										var immosearch_array_object_details_grundmiete_val = immosearch_array_details_object_nettokaltmiete[0];
										if (typeof immosearch_array_object_details_grundmiete_val != "undefined" && immosearch_array_object_details_grundmiete_val) {
											immosearch_array_object_details_grundmiete_val = immosearch_array_object_details_grundmiete_val.dot2comma();
											immosearch_array_object_details_grundmiete_val = ifLastCharIsOnlyOneNull(immosearch_array_object_details_grundmiete_val);
											immoDetailElement += '<strong>Grundmiete</strong><span class="pull-right" id="form_object_grundmiete">' + immosearch_array_object_details_grundmiete_val + ' &euro;</span><br>';
										} else {
											if (typeof immosearch_var_details_object_kaltmiete != "undefined" && immosearch_var_details_object_kaltmiete) {
												immosearch_var_details_object_kaltmiete = immosearch_var_details_object_kaltmiete.dot2comma();
												immoDetailElement += '<strong>Grundmiete</strong><span class="pull-right" id="form_object_grundmiete">' + ifLastCharIsOnlyOneNull(immosearch_var_details_object_kaltmiete) + ' &euro;</span><br>';
											} else {
												immoDetailElement += '<strong>Grundmiete</strong><span class="pull-right" id="form_object_grundmiete">K.A.</span><br>';
											}
										}

										if (typeof immosearch_var_details_object_provisionnetto != "undefined" && immosearch_var_details_object_provisionnetto) {
											immosearch_var_details_object_provisionnetto = immosearch_var_details_object_provisionnetto.dot2comma();
											immoDetailElement += '<strong>Kabelgebühr</strong><span class="pull-right" id="form_object_kabelgebuhr">' + immosearch_var_details_object_provisionnetto + ' &euro;</span><br>';
										} else {
											immoDetailElement += '<strong>Kabelgebühr</strong><span class="pull-right" id="form_object_kabelgebuhr">K.A.</span><br>';
										}

										if (typeof immosearch_var_details_object_nebenkosten != "undefined" && immosearch_var_details_object_nebenkosten) {
			                immosearch_var_details_object_nebenkosten = immosearch_var_details_object_nebenkosten.dot2comma();
											immoDetailElement += '<strong>Nebenkosten</strong><span class="pull-right" id="form_nebenkosten">' + ifLastCharIsOnlyOneNull(immosearch_var_details_object_nebenkosten) + ' &euro;</span><br>';
			              } else {
											immoDetailElement += '<strong>Nebenkosten</strong><span class="pull-right" id="form_nebenkosten">K.A.</span><br>';
										}

										if (typeof immosearch_var_details_object_betriebskostennetto != "undefined" && immosearch_var_details_object_betriebskostennetto) {
											immosearch_var_details_object_betriebskostennetto = immosearch_var_details_object_betriebskostennetto.dot2comma();
											immoDetailElement += '<strong>Betriebskosten</strong><span class="pull-right" id="form_betriebskosten">' + ifLastCharIsOnlyOneNull(immosearch_var_details_object_betriebskostennetto) + ' &euro;</span><br>';//netto
										} else {
											immoDetailElement += '<strong>Betriebskosten</strong><span class="pull-right" id="form_betriebskosten">K.A.</span><br>';
										}

										if (typeof immosearch_var_details_object_heizkostennetto != "undefined" && immosearch_var_details_object_heizkostennetto) {
			                immosearch_var_details_object_heizkostennetto = immosearch_var_details_object_heizkostennetto.dot2comma();
			                immosearch_var_details_object_heizkostennetto = ifLastCharIsOnlyOneNull(immosearch_var_details_object_heizkostennetto);
			                if (immosearch_var_details_object_heizkostennetto == "0,00") {
												immoDetailElement += '<strong>Heizkosten</strong><span class="pull-right" id="form_heizkosten">werden direkt mit dem Energieversorger abgerechnet</span><br>';
			                } else {
												immoDetailElement += '<strong>Heizkosten</strong><span class="pull-right" id="form_heizkosten">' + immosearch_var_details_object_heizkostennetto + ' &euro;</span><br>';
			                }
			              } else {
			                if (typeof immosearch_var_details_object_heizkosten != "undefined" && immosearch_var_details_object_heizkosten) {
			                  immosearch_var_details_object_heizkosten = immosearch_var_details_object_heizkosten.dot2comma();
			                  immosearch_var_details_object_heizkosten = ifLastCharIsOnlyOneNull(immosearch_var_details_object_heizkosten);
			                  if (immosearch_var_details_object_heizkosten == "0,00") {
													immoDetailElement += '<strong>Heizkosten</strong><span class="pull-right" id="form_heizkosten">werden direkt mit dem Energieversorger abgerechnet</span><br>';
			                  } else {
													immoDetailElement += '<strong>Heizkosten</strong><span class="pull-right" id="form_heizkosten">' + immosearch_var_details_object_heizkosten + ' &euro;</span><br>';
			                  }
			                } else {
												//immoDetailElement += '<strong>Heizkosten</strong><span class="pull-right" id="form_heizkosten">K.A.</span><br>';
			                }
			              }

										//fix the gasamtmiete value
			              var immosearch_var_details_object_gesamtmiete_mix_value = "";
			              if (immosearch_var_details_object_heizkosten_enthalten == true) {
			                immosearch_var_details_object_gesamtmiete_mix_value = parseFloat(immosearch_array_details_object_nettokaltmiete[0]) + parseFloat(immosearch_var_details_object_nebenkosten);
			              } else {
			                immosearch_var_details_object_gesamtmiete_mix_value = parseFloat(immosearch_array_details_object_nettokaltmiete[0]) + parseFloat(immosearch_var_details_object_nebenkosten) + parseFloat(immosearch_var_details_object_heizkosten);
			              }
			              immosearch_var_details_object_gesamtmiete_mix_value = JSON.stringify(immosearch_var_details_object_gesamtmiete_mix_value);//modify from object to string
			              immosearch_var_details_object_gesamtmiete_mix_value = immosearch_var_details_object_gesamtmiete_mix_value.dot2comma();//replace dot with comma
			              immosearch_var_details_object_gesamtmiete_mix_value = ifLastCharIsOnlyOneNull(immosearch_var_details_object_gesamtmiete_mix_value);
			              immosearch_var_details_object_gesamtmiete_mix_value = addCommas(immosearch_var_details_object_gesamtmiete_mix_value)

			              //append the value
			              if (typeof immosearch_var_details_object_gesamtmiete_mix_value != "undefined" && immosearch_var_details_object_gesamtmiete_mix_value && !immosearch_var_details_object_gesamtmiete_mix_value) {
											immoDetailElement += '<strong>Gesamtmiete</strong><span class="pull-right">' + afterCommaKeep2Char(immosearch_var_details_object_gesamtmiete_mix_value) + ' &euro;</span><br>';
			              } else {
											//immoDetailElement += '<strong>Gesamtmiete</strong><span class="pull-right">K.A.</span><br>';
			              }

										var immosearch_array_object_details_kaution_val = immosearch_array_details_object_kaution[0];
			              immosearch_array_object_details_kaution_val = numberWithCommas(immosearch_array_object_details_kaution_val);
			              if (typeof immosearch_array_object_details_kaution_val != "undefined" && immosearch_array_object_details_kaution_val) {
			                //immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.dot2comma();
			                //immosearch_array_object_details_kaution_val = ifLastCharIsOnlyOneNull(immosearch_array_object_details_kaution_val);
			                if (immosearch_array_details_object_kaution[0] > 999) {
			                  function numberCommaToDot(x) {
			                      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			                  }
			                  String.prototype.replaceAt=function(index, character) {
			                      return this.substr(0, index) + character + this.substr(index+character.length);
			                  }
			                  immosearch_array_object_details_kaution_val = immosearch_array_details_object_kaution[0];
			                  immosearch_array_object_details_kaution_val = numberCommaToDot(immosearch_array_object_details_kaution_val);
			                  var pos = immosearch_array_object_details_kaution_val.lastIndexOf(".");
			                  //immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.substring(0, pos);
			                  //console.log("VALUE: " + immosearch_array_object_details_kaution_val);
			                  //console.log("VALUE: " + immosearch_array_object_details_kaution_val.replaceAt(pos, ","));
			                  immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.replaceAt(pos, ",");
			                } else {
			                  function numberCommaToDot(x) {
			                      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			                  }
			                  String.prototype.replaceAt=function(index, character) {
			                      return this.substr(0, index) + character + this.substr(index+character.length);
			                  }
			                  immosearch_array_object_details_kaution_val = immosearch_array_details_object_kaution[0];
			                  immosearch_array_object_details_kaution_val = numberCommaToDot(immosearch_array_object_details_kaution_val);
			                  //console.log("KAUTION VAL: " + immosearch_array_object_details_kaution_val);
			                  var pos = immosearch_array_object_details_kaution_val.lastIndexOf(".");
			                  //immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.substring(0, pos);
			                  //console.log("VALUE: " + immosearch_array_object_details_kaution_val);
			                  //console.log("VALUE: " + immosearch_array_object_details_kaution_val.replaceAt(pos, ","));
			                  immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.replaceAt(pos, ",");
			                }
											immoDetailElement += '<strong>Genossenschaftsanteil</strong><span class="pull-right" id="form_kaution">' + ifLastCharIsOnlyOneNull(immosearch_array_object_details_kaution_val) + ' &euro;</span><br>';
			              } else {
											immoDetailElement += '<strong>Genossenschaftsanteil</strong><span class="pull-right" id="form_kaution">K.A.</span><br>';
			              }

										var immosearch_array_object_details_verfugbar_ab_val = immosearch_array_details_object_verfugbar_ab[0];
			              var d_xml = Date.parse(immosearch_array_object_details_verfugbar_ab_val);
			              var today_date = new Date();
			              var today_month = today_date.getMonth() + 1;
			              var today_day = today_date.getDate();
			              var today_date_output = (today_day<10 ? '0' : '') + today_day + '.' + (today_month<10 ? '0' : '') + today_month + '.' + today_date.getFullYear();
			              var xml_date = immosearch_array_details_object_verfugbar_ab[0]
			              if (typeof immosearch_array_object_details_verfugbar_ab_val != "undefined" && immosearch_array_object_details_verfugbar_ab_val) {
			                if (xml_date >= today_date_output) {
												//immoDetailElement += '<strong>Verfügbar ab</strong><span class="pull-right" id="form_verfugbar_ab">' + immosearch_array_object_details_verfugbar_ab_val + '</span><br>';
			                } else {
												//immoDetailElement += '<strong>Verfügbar ab</strong><span class="pull-right" id="form_verfugbar_ab">sofort</span><br>';
			                }
			              } else {
											//immoDetailElement += '<strong>Verfügbar ab</strong><span class="pull-right" id="form_verfugbar_ab">K.A.</span><br>';
			              }

										immoDetailElement += '<strong>Frei ab</strong><span class="pull-right" id="form_verfugbar_ab">' + immosearch_array_details_object_verfugbar_ab[0] + '</span><br>';

										if (typeof immosearch_var_details_object_provisionspflichtig != "undefined" && immosearch_var_details_object_provisionspflichtig) {
			                if (immosearch_var_details_object_provisionspflichtig == "false" || immosearch_var_details_object_provisionspflichtig == "") {
												//immoDetailElement += '<strong>Provisionsfrei</strong><span class="pull-right">ja</span><br>';
			                }
			              }

		              immoDetailElement += '</div>';
		            immoDetailElement += '</div>';
		          immoDetailElement += '</div>';

							immoDetailElement += '<div class="col-md-6">';
								immoDetailElement += 'test';
							immoDetailElement += '</div">';

		        immoDetailElement += '</div>';







		        immoDetailElement += '<div class="col-md-12 col-sm-12 col-xs-12">';
		          immoDetailElement += '<div class="col-md-6">';
		            immoDetailElement += '<h4><strong>ENERGIEMERKMALE</strong></h4>';
		            immoDetailElement += '<div class="row">';
		              immoDetailElement += '<div class="col-md-12">';

										if (typeof details_energiepass_epart != "undefined" && details_energiepass_epart) {
											var epassTyp;
											if (details_energiepass_epart == "VERBRAUCH") {
												//epassTyp = "Endenergieverbrauch";
												epassTyp = "Energieausweistyp";
												immoDetailElement += '<strong id="form_energie_epassTyp_Energieausweistyp_title">' + epassTyp +'</strong><span class="pull-right" id="form_energie_epassTyp_Energieausweistyp_value">Verbrauchsausweis</span><br>';
												if (typeof details_energiepass_energieverbrauchkennwert != "undefined" && details_energiepass_energieverbrauchkennwert) {
													if (isNaN(details_energiepass_energieverbrauchkennwert)) {
														//BGW-Bielefeld wants this title as "Endenergieverbrauch"
														immoDetailElement += '<strong id="form_energie_Verbrauchswert_title">Verbrauchswert</strong><span class="pull-right" id="form_energie_Verbrauchswert_value">' + details_energiepass_energieverbrauchkennwert.dot2comma() + '</span><br>';
													} else {
														immoDetailElement += '<strong id="form_energie_Verbrauchswert_title">Verbrauchswert</strong><span class="pull-right" id="form_energie_Verbrauchswert_value">' + details_energiepass_energieverbrauchkennwert.dot2comma() + ' kWh/(m&sup2;a)</span><br>';
													}
												}
											} else if (details_energiepass_epart == "BEDARF") {
												epassTyp = "Ausweistyp";
												immoDetailElement += '<strong id="form_energie_epassTyp_Energieausweistyp_title">' + epassTyp + '</strong><span class="pull-right" id="form_energie_epassTyp_Energieausweistyp_value">Bedarfsausweis</span><br>';
												if (typeof details_energiepass_endenergiebedarf != "undefined" && details_energiepass_endenergiebedarf) {
													if (isNaN(details_energiepass_endenergiebedarf)) {
														immoDetailElement += '<strong id="form_energie_Verbrauchswert_title">Endenergiebedarf</strong><span class="pull-right" id="form_energie_Verbrauchswert_value">' + details_energiepass_endenergiebedarf.dot2comma() + '</span><br>';
													} else {
														immoDetailElement += '<strong id="form_energie_Verbrauchswert_title">Endenergiebedarf</strong><span class="pull-right" id="form_energie_Verbrauchswert_value">' + details_energiepass_endenergiebedarf.dot2comma() + ' kWh/(m&sup2;a)</span><br>';
													}
												}
											}
										}

										if (immosearch_var_details_object_primaerenergietraeger != "") {
			                if (typeof immosearch_var_details_object_primaerenergietraeger != "undefined" && immosearch_var_details_object_primaerenergietraeger) {
			                  if (immosearch_var_details_object_primaerenergietraeger == "Fern") {//check the value if it's Fern to become Ferngas
			                    immosearch_var_details_object_primaerenergietraeger = "Ferngas";
			                  }

												//BGW bielefeld wants this title as "Wesentlicher Energieträger"

												immoDetailElement += '<strong id="form_energie_ferngas_title">Energieträger</strong><span class="pull-right" id="form_energie_ferngas_value">' + immosearch_var_details_object_primaerenergietraeger + '</span><br>';
			                }
			              } else {
			                for (var i_befeuerung = 0; i_befeuerung < immosearch_var_details_object_ausstattung_befeuerung.length; ++i_befeuerung) {
			                  var befeuerung_value = immosearch_var_details_object_ausstattung_befeuerung[i_befeuerung].capitalize();
			                  befeuerung_value = befeuerung_value.umlauts();
			                  if (befeuerung_value == "Fern") {//check the value if it's Fern to become Ferngas
			                    befeuerung_value = "Ferngas";
			                  }
												immoDetailElement += '<strong id="form_energie_ferngas_title">Energieträger</strong><span class="pull-right" id="form_energie_ferngas_value">' + befeuerung_value + '</span><br>';
			                }
			              }

										//this case gets value from ausstattung_heizungsart icon
										if (typeof immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart != "undefined" && immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart) {
											immoDetailElement += '<strong id="form_energie_heizungsart_title">Heizungsart</strong><span class="pull-right" id="form_energie_heizungsart_value">' + immosearch_var_details_object_element_that_gets_value_from_ausstattung_heizungsart + '</span><br>';
										} else {
											immoDetailElement += '<strong id="form_energie_heizungsart_title">Heizungsart</strong><span class="pull-right" id="form_energie_heizungsart_value">K.A.</span><br>';
										}

										if (typeof immosearch_var_details_object_zustand_angaben__zustand__zustand_art != "undefined" && immosearch_var_details_object_zustand_angaben__zustand__zustand_art) {
											immoDetailElement += '<strong id="form_energie_objektzustand_title">Objektzustand</strong><span class="pull-right" id="form_energie_objektzustand_value">' + immosearch_var_details_object_zustand_angaben__zustand__zustand_art.capitalize() + '</span><br>';
										} else {
											immoDetailElement += '<strong id="form_energie_objektzustand_title">Objektzustand</strong><span class="pull-right" id="form_energie_objektzustand_value">K.A.</span><br>';
										}

										if (typeof details_energiepass_mitwarmwasser != "undefined" && details_energiepass_mitwarmwasser) {
			                if (details_energiepass_mitwarmwasser == "true") {
												immoDetailElement += '<strong id="form_energie_warmwasser_title">Mit Warmwasser</strong><span class="pull-right" id="form_energie_warmwasser_value">ja</span><br>';
			                }
			              }

										//baujahr
			              if (typeof immosearch_var_details_object_baujahr != "undefined" && immosearch_var_details_object_baujahr) {
											immoDetailElement += '<strong>Baujahr</strong><span class="pull-right" id="form_baujahr">' + immosearch_var_details_object_baujahr + '</span><br>';
			              }

		              immoDetailElement += '</div>';
		            immoDetailElement += '</div>';
		          immoDetailElement += '</div>';
		          immoDetailElement += '<div class="col-md-6">';

							//concat 2 array to one and remove duplicates
              var immosearch_array_object_ausstatt_beschr_concat = immosearch_array_object_ausstatt_beschr.concat(immosearch_array_details_object_ausstattung[0]);

							//special case, check if there are no austattung icons and show the below details (sonstiges) else show it in the correct place (some code lines after)
							//console.log("Austattung array length: " + immosearch_array_object_ausstatt_beschr_concat.length);
							//if (cid == "1044001" && immosearch_array_object_ausstatt_beschr_concat.length == 0) {
							if (cid == "1044001" && immosearch_array_details_object_ausstattung.length > 0) {
								immoDetailElement += '<h4><strong>SONSTIGES</strong></h4>';
								immoDetailElement += '<div class="row">';
		              immoDetailElement += '<div class="col-md-12">';
									if (immosearch_array_object_ausstatt_beschr.length != 0) {
										immoDetailElement += '<strong>Ausstattung Bescheibung</strong><br>' + immosearch_array_object_ausstatt_beschr.capitalizeFirstLetter() + '<br>';
									}
									if (immosearch_var_details_object_freitexte_objekttitel.length != 0) {
										immoDetailElement += '<strong>Objecttitel</strong><br>' + immosearch_var_details_object_freitexte_objekttitel.capitalizeFirstLetter() + '<br>';
									}
									if (immosearch_var_details_object_freitexte_dreizeiler.length != 0) {
										immoDetailElement += '<strong>Dreizeiler</strong><br>' + immosearch_var_details_object_freitexte_dreizeiler.capitalizeFirstLetter() + '<br>';
									}
									if (immosearch_var_details_object_freitexte_lage.length != 0) {
										immoDetailElement += '<strong>Lage</strong><br>' + immosearch_var_details_object_freitexte_lage.capitalizeFirstLetter() + '<br>';
									}
									if (immosearch_var_details_object_freitexte_sonstige_angaben.length != 0) {
										immoDetailElement += '<strong>Sonstige Angaben</strong><br>' + immosearch_var_details_object_freitexte_sonstige_angaben.capitalizeFirstLetter() + '<br>';
									}
									immoDetailElement += '</div>';
								immoDetailElement += '</div>';
							}

              if (immosearch_array_object_ausstatt_beschr_concat.length > 0) {
                immoDetailElement += '<h4><strong>AUSSTATTUNGSMERKMALE</strong></h4>';
								immoDetailElement += '<div class="row">';
		              immoDetailElement += '<div class="col-md-12">';
		                $.each(immosearch_array_object_ausstatt_beschr_concat.split(','), function(index, value) {
		                  //check and replace some cases
		                  if (value == " BalkonAufzug" || value == "BalkonAufzug") {
												immoDetailElement += '<input type="button" class="btn btn-default btn-xs" value="Balkon" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px; margin-bottom:5px; box-shadow:none; cursor:default;">';
		                  } else if (value == " IsolierverglasungAufzug" || value == "IsolierverglasungAufzug") {
												immoDetailElement += '<input type="button" class="btn btn-default btn-xs" value="Isolierverglasung" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px; margin-bottom:5px; box-shadow:none; cursor:default;">';
		                  } else if (value == " ParkettAufzug" || value == "ParkettAufzug") {
												immoDetailElement += '<input type="button" class="btn btn-default btn-xs" value="Parkett" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px; margin-bottom:5px; box-shadow:none; cursor:default;">';
		                  } else {
												immoDetailElement += '<input type="button" class="btn btn-default btn-xs" value="' + value + '" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px; margin-bottom:5px; box-shadow:none; cursor:default;">';
		                  }
		                });
									immoDetailElement += '</div>';
								immoDetailElement += '</div>';
              }
		          immoDetailElement += '</div>';
		        immoDetailElement += '</div>';

		        immoDetailElement += '<div class="col-md-12 col-sm-12 col-xs-12">';
		          immoDetailElement += '<div class="col-md-6">';
		            immoDetailElement += '<h4><strong>IHR ANSPRECHPARTNER</strong></h4>';
		            immoDetailElement += '<div class="row">';
		              immoDetailElement += '<div class="col-md-12">';

										if (immosearch_var_details_kontakt__name.substring(0, 1) == "T") {
			                //console.log("TEAM STRING: " + immosearch_var_details_kontakt__name.replace('T', 't'));
			                immosearch_var_details_kontakt__name = immosearch_var_details_kontakt__name.replace('T', 't');
			              }

										if (typeof immosearch_var_details_kontakt__name != "undefined" && immosearch_var_details_kontakt__name) {
											immoDetailElement += '<strong>Ansprechpartner</strong><span class="pull-right">' + immosearch_var_details_kontakt__andere + ' ' + immosearch_var_details_kontakt__name + '</span><br>';
										}

										if (typeof immosearch_var_details_kontakt__strasse != "undefined" && immosearch_var_details_kontakt__strasse) {
											if (immosearch_var_details_kontakt__hausnummer == "" || immosearch_var_details_kontakt__hausnummer == "(n.a.)") {
												immoDetailElement += '<strong>Adresse</strong><span class="pull-right">' + immosearch_var_details_kontakt__strasse + '</span><br>';
											} else {
												immoDetailElement += '<strong>Adresse</strong><span class="pull-right">' + immosearch_var_details_kontakt__strasse + ' ' + immosearch_var_details_kontakt__hausnummer + '</span><br>';
											}
										}

										if (typeof immosearch_var_details_kontakt__plz != "undefined" && immosearch_var_details_kontakt__plz) {
											immoDetailElement += '<strong>PLZ</strong><span class="pull-right">' + immosearch_var_details_kontakt__plz + '</span><br>';
										}

										if (typeof immosearch_var_details_kontakt__ort != "undefined" && immosearch_var_details_kontakt__ort) {
											immoDetailElement += '<strong>Ort</strong><span class="pull-right">' + immosearch_var_details_kontakt__ort + '</span><br>';
										}

										if (typeof immosearch_var_details_kontakt__tel_zentrale != "undefined" && immosearch_var_details_kontakt__tel_zentrale) {
											immoDetailElement += '<strong>Telefon</strong><span class="pull-right">' + immosearch_var_details_kontakt__tel_zentrale + '</span><br>';
										}

										if (typeof immosearch_var_details_kontakt__tel_durchw != "undefined" && immosearch_var_details_kontakt__tel_durchw) {
											immoDetailElement += '<strong>Telefon</strong><span class="pull-right">' + immosearch_var_details_kontakt__tel_durchw + '</span><br>';
										}

										if (typeof immosearch_var_details_kontakt__tel_fax != "undefined" && immosearch_var_details_kontakt__tel_fax) {
											immoDetailElement += '<strong>Fax</strong><span class="pull-right">' + immosearch_var_details_kontakt__tel_fax + '</span><br>';
										}

										if (typeof immosearch_var_details_kontakt__email_zentrale != "undefined" && immosearch_var_details_kontakt__email_zentrale) {
											immoDetailElement += '<strong>E-mail</strong><span class="pull-right"><a href="' + immosearch_var_details_kontakt__email_zentrale + '" id="form_kontakt_email_zentrale">' + immosearch_var_details_kontakt__email_zentrale + '</a></span><br>';
										} else if (typeof immosearch_var_details_kontakt__email_direkt != "undefined" && immosearch_var_details_kontakt__email_direkt) {
											immoDetailElement += '<strong>E-mail</strong><span class="pull-right"><a href="mailto:' + immosearch_var_details_kontakt__email_direkt + '" id="form_kontakt_email_zentrale">' + immosearch_var_details_kontakt__email_direkt + '</a></span><br>';
										}

		                immoDetailElement += '<button class="btn btn-success" type="button" id="btn_contact_form" data-toggle="modal" data-target="#contactFormModal"><i class="fa fa-envelope"></i> <strong>Kontaktformular</strong></button>';

		              immoDetailElement += '</div>';
		            immoDetailElement += '</div>';
		          immoDetailElement += '</div>';
		          immoDetailElement += '<div class="col-md-6">';

              if (immosearch_array_details_object_attachment_pdf[0] !== undefined || immosearch_array_details_object_attachment_pdf != "" || immosearch_array_details_object_attachment_pdf.length != 0) {

		            immoDetailElement += '<h4><strong>DOKUMENTE</strong></h4>';
		            immoDetailElement += '<div class="row">';
		              immoDetailElement += '<div class="col-md-12">';

                  if (immosearch_array_details_object_attachment_pdf[0] !== undefined || immosearch_array_details_object_attachment_pdf != "" || immosearch_array_details_object_attachment_pdf.length != 0) {
		                immoDetailElement += '<button class="btn btn-success" type="button" id="pdf_document"><i class="fa fa-file-pdf-o"></i> <strong>Energieausweis</strong></button>';
                  }

		              immoDetailElement += '</div>';
		            immoDetailElement += '</div>';

              }
		          immoDetailElement += '</div>';
		        immoDetailElement += '</div>';

							//google maps goes here
							//immoDetailElement += '<div class="col-md-12 col-sm-12 col-xs-12">';
								//immoDetailElement += 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, ';
							//immoDetailElement += '</div>';

					//ending of panel
		      immoDetailElement += '</div>';
		    immoDetailElement += '</div>';

				//js und jquery
				immoDetailElement += '<script>';
				immoDetailElement += '$(document).ready(function() {';

				//print object
				immoDetailElement += '$("#btn_details_print").click(function() {';
						immoDetailElement += '$("canvas").hide();';//hide canvas
						immoDetailElement += '$("#print_img").show();';//show default image to print
						immoDetailElement += 'setTimeout(function() {';//set timeout half sec to get ready the image
							immoDetailElement += '$.print("#' + container + '");';
							immoDetailElement += 'showCanvasAfterPrint();';
					  immoDetailElement += '}, 1000);';
				immoDetailElement += '});';

				//wait 3 sec and bring back the canvas
				immoDetailElement += 'function showCanvasAfterPrint() {';
				immoDetailElement += 'setTimeout(function() {';//set timeout half sec to get ready the image
					immoDetailElement += '$("canvas").show();';//hide canvas
					immoDetailElement += '$("#print_img").hide();';//show default image to print
				immoDetailElement += '}, 3000);';
				immoDetailElement += '}';

        //console.log("ARRAY PDF [item]: " + immosearch_array_details_object_attachment_pdf[0]);//trace
        //console.log("ARRAY PDF: " + immosearch_array_details_object_attachment_pdf);//trace
        //console.log("ARRAY PDF LENGTH: " + immosearch_array_details_object_attachment_pdf.length);//trace
				immoDetailElement += '$("#pdf_document").click(function() {';
				if (immosearch_array_details_object_attachment_pdf[0] !== undefined || immosearch_array_details_object_attachment_pdf != "" || immosearch_array_details_object_attachment_pdf.length != 0) {
					immoDetailElement += 'window.open("' + immosearch_array_details_object_attachment_pdf[0] + '", "_blank");';
				}
					immoDetailElement += 'return false;';
				immoDetailElement += '});';


				immoDetailElement += '});';
				immoDetailElement += '<\/script>';

				$("#" + container + "").append(immoDetailElement);//append details

				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				$("#immosearch_preloader").remove();//remove preloader

      } else {
        $("#immosearch_preloader").remove();//remove preloader

        //no children nodes
        swal({
          title: "Achtung!",
          text: "Keine Angebote vorhanden!",
          type: "warning",
          html: true,
          confirmButtonColor: "#f8bf86",
          confirmButtonText: "Wiederholen",
          allowOutsideClick: false,
          showConfirmButton: true
        });

      }
    },
    error: function (xhr, request, status, error) {

      //console.log(request.responseText);
      //console.log(xhr.responseText);
			$("#immosearch_preloader").remove();//remove preloader

      swal({
        title: "Achtung!",
        text: "Etwas ist schief gelaufen, bitte erneut versuchen oder Service kontaktieren.",
        type: "warning",
        html: true,
        confirmButtonColor: "#f8bf86",
        confirmButtonText: "Wiederholen",
        allowOutsideClick: false,
        showConfirmButton: true
      });

    }
  });
}
