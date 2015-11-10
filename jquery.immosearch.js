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
var immosearch_array_details_object_img_floor_plan = [];
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
function immosearchList(cid, container, preloadeGif, immo_counter_or_object_nr, dummyPicsPath, container_zuruck_to_list) {

	// Hide/Show
	$("#" + container_zuruck_to_list + "").hide();
	$("#" + container + "").show();

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
					immosearch_array_object_object_number.push(escapeHtml($(this).find("verwaltung_techn openimmo_obid").text()));
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

					if (check_if_element_exists_boolean($(this).find("objektkategorie vermarktungsart").attr('KAUF')) == true) {
						immosearch_array_object_objektkategorie_vermarktungsart_kauf.push($(this).find("objektkategorie vermarktungsart").attr('KAUF'));//element exists
					} else {
						immosearch_array_object_objektkategorie_vermarktungsart_kauf.push(empty_item_value);//element not exists
					}

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
							if ($(this).attr("gruppe") == "BILD" || $(this).attr("gruppe") == "TITELBILD" || $(this).attr("gruppe") == "AUSSENANSICHTEN") {
								if ($(this).attr("location") == "REMOTE") {
									var immosearch_list_img_url = $(this).children().find("pfad").text();
									if (immosearch_list_img_url) {
										immosearch_array_img[iv].push(immosearch_list_img_url);//push url
									} else {
										immosearch_array_img[iv].push(dummyPicsPath + "dummy.png");//dummy image
									}
								} else if ($(this).attr("location") == "INTERN" || $(this).attr("gruppe") == "INNENANSICHTEN") {
									var immosearch_list_img = $(this).children().find("anhanginhalt").text();
									if (immosearch_list_img) {
										immosearch_array_img[iv].push(immosearch_list_img);//push url (in old days was base64 data)
									} else {
										immosearch_array_img[iv].push(dummyPicsPath + "dummy.png");//dummy image
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
					var immo_object_zimmer___final = removeAfterCertainCharacter(immosearch_array_object_zimmer[i], ".") + " Zimmer Wohnung | ";
					var immo_object_address_nr = immosearch_array_object_address_number[i];
					if (immo_object_address_nr.charAt(0) == 0) {//check if start with 0
						immo_object_address_nr = checkIfNumberStartsFromZero(immosearch_array_object_address_number[i]);
					} else {
						immo_object_address_nr = immosearch_array_object_address_number[i];
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

					//check the customer id
					if (cid == "993301") {//customer 1044001 GWG Hombruch-Barop eG

						immosearchElement += '<div class="panel panel-default" id="object_details___' + i + '">';
				      immosearchElement += '<div class="row panel-body">';
				        immosearchElement += '<div class="col-md-3">';
				          immosearchElement += '<img src="' + immosearch_array_img[i][0] + '" class="img-responsive img-thumbnail" width="300" height="201" id="immosearch_image">';
				        immosearchElement += '</div>';
				        immosearchElement += '<div class="col-md-9">';
				          immosearchElement += '<div class="col-md-12 col-sm-12 col-xs-12">';
									immosearchElement += '<h4><strong>' + immo_object_zimmer___final + immo_object_address___final + ' ' + immo_object_ort + ' ' + immo_object_ortsteil + '</strong></h4>';
				            immosearchElement += '<small>' + immosearch_array_object_objektart[i] + ' zur Miete</small>';
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
									immosearchElement += '<div class="col-md-12 col-sm-12 col-xs-12">' + immo_object_ausstattung + '</div>';
				        immosearchElement += '</div>';
				      immosearchElement += '</div>';
				    immosearchElement += '</div>';

						//js und jquery
						immosearchElement += '<script>';
						immosearchElement += '$(document).ready(function() {';
						immosearchElement += '$("#object_details___' + i + '").click(function() {';
							//(must convert to String "object id") then ajax call for details page
							immosearchElement += '$("#' + container + '").hide();';

							//details page
							immosearchElement += 'homeinfo_immosearch_details("'+immosearch_array_object_object_number[i]+'", "'+cid+'", "'+container+'", "'+preloadeGif+'", "'+immo_counter_or_object_nr+'", "'+dummyPicsPath+'", "'+container_zuruck_to_list+'");';
							immosearchElement += 'return false;';
						immosearchElement += '});';
						immosearchElement += '});';
						immosearchElement += '<\/script>';
					}

					//console.log("OBJECT NUMBER: " + immosearch_array_object_object_number[i]);

					/*
					return {
		        object__Total: immosearch_total_immobilien_counter,
		        object__Images: immosearch_array_img,
						object__Address: immosearch_array_object_address,
						object__AddressNumber: immosearch_array_object_address_number,
						object__PlzNumber: immosearch_array_object_plz_number,
						object__Ort: immosearch_array_object_ort,
						object__Ortsteil: immosearch_array_object_ortsteil,
						object__Zimmer: immosearch_array_object_zimmer,
						object__Wohnflaeche: immosearch_array_object_wohnflaeche,
						object__Gesamtmiete: immosearch_array_object_gesamtmiete,
						object__kaltmiete : immosearch_array_object_kaltmiete,
						object__ObjectNumber: immosearch_array_object_object_number,
						object__Ausstattung: immosearch_array_object_ausstattung,
						object__Nettokaltmiete: immosearch_array_object_nettokaltmiete,
						object__HeizkostenEnthalten: immosearch_array_object_heizkosten_enthalten,
						object__Heizkosten: immosearch_array_object_heizkosten,
						object__Nebenkosten: immosearch_array_object_nebenkosten,
						object__Balkon: immosearch_array_object_balkon,
						object__Objektart: immosearch_array_object_objektart,
						object__Objektkategorie_nutzungsart_anlage: immosearch_array_object_objektkategorie_nutzungsart_anlage,
						object__Objektkategorie_nutzungsart_gewerbe: immosearch_array_object_objektkategorie_nutzungsart_gewerbe,
						object__Object_objektkategorie_nutzungsart_waz: immosearch_array_object_objektkategorie_nutzungsart_waz,
						object__Objektkategorie_nutzungsart_wohnen :immosearch_array_object_objektkategorie_nutzungsart_wohnen,
						object__Objektkategorie_vermarktungsart_miete_pacht: immosearch_array_object_objektkategorie_vermarktungsart_miete_pacht,
						object__Objektkategorie_vermarktungsart_kauf: immosearch_array_object_objektkategorie_vermarktungsart_kauf
			    };
					*/

				});//end - $.each(immosearch_array_object_zimmer, function(i, array_value) {

				$("#" + container + "").append(immosearchElement);//append the data (with placeholders)
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

function homeinfo_immosearch_details(object_id, cid, container, preloadeGif, immo_counter_or_object_nr, dummyPicsPath, container_zuruck_to_list) {
	$("#" + immo_counter_or_object_nr + "").html("Wohnungsnr: <span id='count_immobilien'>" + object_id + "</span>");
	$("#" + container_zuruck_to_list + "").show();

	//ajax details (by object id)
	$.ajax({
		url: immosearch_url  + cid + "/?filter=openimmo_obid==" + object_id + "&include=allatts,freitexte",
    crossDomain: true,
    type: "GET",
    dataType: "xml",
    cache: false,
    beforeSend: function() {
			console.log("BeforeSend");
      $("#" + container + "").empty();
			//$('#btn_details_print').unbind();
      $("#" + container + "").append('<img src="' + preloadeGif + '" width="32" height="32" id="immosearch_preloader" />');//append preloader in container
    },
    success: function (xml) {
      if ($(xml).find("ns1\\:rsp").children().length >= 0) {//check if immobilien are more than 0

				var xml_namespace = $(xml).find("ns1\\:rsp");
				var anbieterCustomerId = escapeHtml($(xml).find("anbieternr").text());
				var anbieterFirmName = escapeHtml($(xml).find("anbieternr").next().text());

				//vars
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
				var immosearch_array_object_objektnr_intern = "";
				var immosearch_var_details_kontakt__email_zentrale = "";
				var immosearch_var_details_kontakt__tel_zentrale = "";
				var immosearch_var_details_kontakt__tel_fax = "";
				var immosearch_var_details_kontakt__name = "";
				var immosearch_var_details_kontakt__strasse = "";
				var immosearch_var_details_kontakt__hausnummer = "";
				var immosearch_var_details_kontakt__plz = "";
				var immosearch_var_details_kontakt__ort = "";

				//arrays
				immosearch_array_details_object_attachment_pdf = [];
				immosearch_array_details_object_img_floor_plan = [];
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

				//energiepass
				var details_energiepass_epart = escapeHtml($(xml).find("energiepass epart").text());
				var details_energiepass_energieverbrauchkennwert = escapeHtml($(xml).find("energiepass energieverbrauchkennwert").text());
				var details_energiepass_endenergiebedarf = escapeHtml($(xml).find("energiepass endenergiebedarf").text());
				var details_energiepass_mitwarmwasser = escapeHtml($(xml).find("energiepass mitwarmwasser").text());

				$(xml).find("immobilie").each(function(i) {
					//push the images (normal images and floor plans) in separate arrays
					$(xml).find("anhang").each(function(i) {
						if ($(this).attr("gruppe") == "BILD" || $(this).attr("gruppe") == "TITELBILD") {
							if ($(this).attr("location") == "REMOTE") {
								var normal_images_url = $(this).children().find("pfad").text();
								if (normal_images_url) {
									immosearch_array_details_object_img.push(normal_images_url);
								} else {
									immosearch_array_details_object_img.push(dummyPicsPath + "dummy.png");
								}
							} else if ($(this).attr("location") == "INTERN") {
								var normal_images = $(this).children().find("anhanginhalt").text();
								if (normal_images) {
									immosearch_array_details_object_img.push(normal_images);
								} else {
									immosearch_array_details_object_img.push(dummyPicsPath + "dummy.png");
								}
							}
						} else if ($(this).attr("gruppe") == "GRUNDRISS") {
							if ($(this).attr("location") == "REMOTE") {
								var floor_plan_images_url = $(this).children().find("pfad").text();
								if (floor_plan_images_url) {
									immosearch_array_details_object_img_floor_plan.push(floor_plan_images_url);
								} else {
									immosearch_array_details_object_img_floor_plan.push(dummyPicsPath + "dummy.png");
								}
							} else if ($(this).attr("location") == "INTERN") {
								var floor_plan_images = $(this).children().find("anhanginhalt").text();
								if (floor_plan_images) {
									immosearch_array_details_object_img_floor_plan.push(floor_plan_images);
								} else {
									immosearch_array_details_object_img_floor_plan.push(dummyPicsPath + "dummy.png");
								}
							}
						} else if ($(this).attr("gruppe") == "DOKUMENTE") {
							if ($(this).attr("location") == "REMOTE") {
								var document_file_pdf_url = $(this).children().find("pfad").text();
								if (document_file_pdf_url) {
									immosearch_array_details_object_attachment_pdf.push(document_file_pdf_url);
								}
							} else if ($(this).attr("location") == "INTERN") {
								var document_file_pdf = $(this).children().find("anhanginhalt").text();
								if (document_file_pdf) {
									immosearch_array_details_object_attachment_pdf.push(document_file_pdf);
								}
							}
						}
					});

					//check the length of the array and add 1 dummy if is 0
					if (immosearch_array_details_object_img.length == 0) {
						immosearch_array_details_object_img.push(dummyPicsPath + "dummy.png");//dummy image
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
					immosearch_var_object_details_wbs_val = escapeHtml($(this).find("verwaltung_objekt wbs_sozialwohnung").text());
					immosearch_var_details_object_heizkostennetto = escapeHtml($(this).find("preise heizkostennetto").text());//decimal
					immosearch_var_details_object_heizkosten_enthalten = escapeHtml($(this).find("preise heizkosten_enthalten").text());//boolean
					immosearch_var_details_object_heizkosten = escapeHtml($(this).find("preise heizkosten").text());//decimal
					immosearch_var_details_object_nebenkosten = escapeHtml($(this).find("preise nebenkosten").text());
					immosearch_var_details_object_provisionspflichtig = escapeHtml($(this).find("preise provisionspflichtig").text());
					immosearch_var_details_object_primaerenergietraeger = escapeHtml($(this).find("energiepass primaerenergietraeger").text());
					immosearch_var_details_object_baujahr = escapeHtml($(this).find("zustand_angaben baujahr").text());
					immosearch_var_details_object_objnumber = escapeHtml($(this).find("verwaltung_techn openimmo_obid").text());
					immosearch_array_object_balkon = escapeHtml($(this).find("flaechen anzahl_balkone").text());
					immosearch_array_object_ausstatt_beschr = escapeHtml($(this).find("freitexte ausstatt_beschr").text());
					immosearch_array_object_objektnr_intern  = escapeHtml($(this).find("verwaltung_techn objektnr_intern").text());

					//kontakt details
					immosearch_var_details_kontakt__email_zentrale = escapeHtml($(this).find("kontaktperson email_zentrale").text());
					immosearch_var_details_kontakt__tel_zentrale = escapeHtml($(this).find("kontaktperson tel_zentrale").text());
					immosearch_var_details_kontakt__tel_fax = escapeHtml($(this).find("kontaktperson tel_fax").text());
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
							}

							//console.log("------------------------------------------------------");//trace
						}
						//console.log("/////////////////////////////////////////////////////////////////////////////////////////");//trace
					}
				});

				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				var immosearchElement = '';







				//check the customer id
				if (cid == "993301") {//customer 1044001 GWG Hombruch-Barop eG

					//html
					immosearchElement += '';
					immosearchElement += '';
					immosearchElement += '';
					immosearchElement += '';
					immosearchElement += '';
					immosearchElement += '';

					//js und jquery
					immosearchElement += '<script>';
					immosearchElement += '$(document).ready(function() {';
					immosearchElement += '';
					immosearchElement += '';
					immosearchElement += '';
					immosearchElement += '';
					immosearchElement += '});';
					immosearchElement += '<\/script>';
				}


				$("#" + container + "").append(immosearchElement);//append the data (with placeholders)
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
