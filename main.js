////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL VARS & FUNCTIONS///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var immosearch_customer_id = "993301";//993301 BGW - Bielefeld
var immosearch_url = "https://tls.homeinfo.de/immosearch/customer/" + immosearch_customer_id + "/?";
var customer_img_dummy = "img/customer_dummy/" + immosearch_customer_id + ".png";
var selected_locations = [];//push and remove areas in the ckeckbox is checked
var build_locations_array = [];//this array should fill once
var build_locations_array_number = [];

var sorting = "";
var include = "freitexte,attachments";
var attachments = "scaling:133x120,limit:1";

//filter options
var zimmer_von = "";
var zimmer_bis = "";
var wohnflaeche_von = "";
var wohnflaeche_bis = "";
var grundmiete_von = "";
var grundmiete_bis = "";

//checkboxes
var terrasse = false;
var garten = false;
var balkon = false;
var wanne = false;
var dusche = false;
var aufzug = false;
var erdgeschoss = false;
var first_floor = false;
var second_floor = false;

Array.prototype.remove_from_array = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

//global vars for URL
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

//browsers checking
if (window.File && window.FileReader && window.FileList && window.Blob) {
	//console.log('Great success! All the File APIs are supported.');
} else {
	console.log('The File APIs are not fully supported in this browser!');
}

function replaceCommaWithDot(str) {
	return str.replace(".", ",");
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function ifLastCharIsOnlyOneNull(str) {
	var afterComma = str.substr(str.indexOf(",") + 1);
	var char_length = afterComma.length;
	if (char_length == 1) {
		return str + "0";
	} else {
		return str;
	}
}

//Base64
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

function getText(obj) {
    return obj.textContent ? obj.textContent : obj.innerText;
}

function toTitleCase(str) {
		if (str != "" || str!= 'undefined') {
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		} else {
			return str;
		}
}

//escape HTML and return code names (because there is no build in functionj in Javascript yet)
function escapeHtml(unsafe) {
	//DOMPurify to sanitize HTML and prevents XSS attacks
  return DOMPurify.sanitize(unsafe
  	.replace(/&/g, "&amp;")
  	.replace(/</g, "&lt;")
  	.replace(/>/g, "&gt;")
  	.replace(/"/g, "&quot;")
  	.replace(/'/g, "&#039;"));
}

function group(iterable) {
	var result = {};
	var len = iterable.length;

	for (var i = 0; i < len; i++) {
		match = false;
		for (var key in result) {
			if (key == iterable[i]) {
				result[key] = result[key] + 1;
				match = true;
				break;
			}
		}
		if (match == false) {
			result[iterable[i]] = 1;
		}
	}
	return result;
}

function removeAfterCertainCharacter(string, character) {
	//remove evrything after the dynamic character parameter
	return string.substring(0, string.indexOf(character));
}

function isOdd(num) {
	return num % 2;
}

//global function details page by object id
function homeinfo_immosearch_details(object_id) {

	//document ready
	$(document).ready(function() {

    //check if the advance settings area is visible, if so hide it
    if($("#immo_erweiterte_suche_form").is(':visible')) {
      $("#immo_erweiterte_suche_form").hide();
    }

		//ajax immosearch
		$.ajax({
			url: immosearch_url + "filter=openimmo_obid==" + object_id + "&include=freitexte,attachments&attachments=scaling:400x300,limit:10",
			crossDomain: true,
			type: "GET",
			dataType: "xml",
			cache: true,
			beforeSend: function() {
				$("#immo_data").empty();
				$("#immo_data").append('<img src="img/preloader/preloader.gif" width="32" height="32" />');
			},
			success: function (xml) {
				if ($(xml).find("ns1\\:rsp").children().length >= 0) {

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//PARSE DETAILS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					var xml_namespace = $(xml).find("ns1\\:rsp");//console.log(xml_namespace);
					var anbieterCustomerId = escapeHtml($(xml).find("anbieternr").text());//console.log("CUSTOMER ID: " + anbieterCustomerId);
					var anbieterFirmName = escapeHtml($(xml).find("anbieternr").next().text());//console.log("FIRM NAME: " + anbieterFirm);
					//var findAllImmoText = escapeHtml($(xml).find("immobilie").text());
					//console.log("XML NAMESPACE: " + xml_namespace);
					//console.log("ANBIETER CUSTOMER ID: " + anbieterCustomerId);
					//console.log("ANBIETER FIRM NAME: " + anbieterFirmName);
					//console.log("ALL IMMOBILIENS TEXT: " + findAllImmoText);

					$("#immo_data").empty();//empty page

					//vars
					var total_counter = 0;
          var immosearch_array_object_details_wbs_val = "";
          var immosearch_array_details_object_heizkosten_enthalten = "";
          var immosearch_array_details_object_etage = "";

					//arrays
					var immosearch_array_details_object_img = [];
          var immosearch_array_details_object_img_floor_plan = [];
					var immosearch_array_details_object_address = [];
					var immosearch_array_details_object_address_number = [];
					var immosearch_array_details_object_plz_number = [];
					var immosearch_array_details_object_ort = [];
					var immosearch_array_details_object_zimmer = [];
					var immosearch_array_details_object_wohnflaeche = [];
					var immosearch_array_details_object_gesamtmiete = [];
					var immosearch_array_details_object_grundmiete = [];
					var immosearch_array_details_object_object_number = [];
					var immosearch_array_details_object_ortsteil = [];
					var immosearch_array_details_object_ausstattung = [];
          var immosearch_array_details_object_verfugbar_ab = [];
          var immosearch_array_details_object_betriebskosten = [];
          var immosearch_array_details_object_kaution = [];

          //energiepass
          var details_energiepass_epart = escapeHtml($(xml).find("energiepass epart").text());
          var details_energiepass_energieverbrauchkennwert = escapeHtml($(xml).find("energiepass energieverbrauchkennwert").text());
          var details_energiepass_endenergiebedarf = escapeHtml($(xml).find("energiepass endenergiebedarf").text());
          var details_energiepass_mitwarmwasser = escapeHtml($(xml).find("energiepass mitwarmwasser").text());
          var details_energiepass_primaerenergietraeger = escapeHtml($(xml).find("energiepass primaerenergietraeger").text());

					$(xml).find("immobilie").each(function(i) {

						total_counter = i;

						$(xml).find("anhang").each(function(i) {

                console.log("GET THE ATTRIBUTE: " + $(this).attr("gruppe"));//get the anhang gruppe = GRUNDRISS
                //immosearch_array_details_object_img_floor_plan

                /*
                if ($(this).attr("gruppe") == "BILD") {
                  var immosearch_details_list_img = $(this).find("anhanginhalt").attr("gruppe").text();
  								//check if node exists
  								if (immosearch_details_list_img == "") {
  									immosearch_array_details_object_img.push(customer_img_dummy);//dummy image
  								} else {
  									immosearch_array_details_object_img.push("data:image/jpeg;base64," + immosearch_details_list_img);
  								}
                } else if ($(this).attr("gruppe") == "GRUNDRISS") {
                  var immosearch_details_list_img_floor_plan = $(this).find("anhanginhalt").attr("gruppe").text();
  								//check if node exists
  								if (immosearch_details_list_img == "") {
                    immosearch_array_details_object_img_floor_plan.push(customer_img_dummy);//dummy image
  								} else {
                    immosearch_array_details_object_img_floor_plan.push("data:image/jpeg;base64," + immosearch_details_list_img_floor_plan);
  								}
                }
                */

								var immosearch_details_list_img = $(this).find("anhanginhalt").text();
								//check if node exists
								if (immosearch_details_list_img == "") {
									immosearch_array_details_object_img.push(customer_img_dummy);//dummy image
								} else {
									immosearch_array_details_object_img.push("data:image/jpeg;base64," + immosearch_details_list_img);
								}

						});

						//arrays to fill with data
						immosearch_array_details_object_address.push(escapeHtml($(this).find("geo strasse").text()));
						immosearch_array_details_object_address_number.push(escapeHtml($(this).find("geo hausnummer").text()));
						immosearch_array_details_object_plz_number.push(escapeHtml($(this).find("geo plz").text()));
						immosearch_array_details_object_ort.push(escapeHtml($(this).find("geo ort").text()));
						immosearch_array_details_object_zimmer.push(escapeHtml($(this).find("flaechen anzahl_zimmer").text()));
						immosearch_array_details_object_wohnflaeche.push(escapeHtml($(this).find("flaechen wohnflaeche").text()));
						immosearch_array_details_object_gesamtmiete.push(escapeHtml($(this).find("preise warmmiete").text()));
						immosearch_array_details_object_grundmiete.push(escapeHtml($(this).find("preise kaltmiete").text()));
						immosearch_array_details_object_object_number.push(escapeHtml($(this).find("verwaltung_techn openimmo_obid").text()));
						immosearch_array_details_object_ortsteil.push(escapeHtml($(this).find("geo regionaler_zusatz").text()));
            immosearch_array_details_object_verfugbar_ab.push(escapeHtml($(this).find("verwaltung_objekt verfuegbar_ab").text()));
            immosearch_array_details_object_betriebskosten.push(escapeHtml($(this).find("preise betriebskostenust").text()));//////////////
            immosearch_array_details_object_kaution.push(escapeHtml($(this).find("preise kaution").text()));//////////////

            //vars to fill with data
            immosearch_array_details_object_etage = escapeHtml($(this).find("geo etage").text());
            immosearch_array_object_details_wbs_val = escapeHtml($(this).find("verwaltung_objekt wbs_sozialwohnung").text());
            immosearch_array_details_object_heizkosten_enthalten = escapeHtml($(this).find("preise heizkosten_enthalten").text());

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

							}
							//console.log("/////////////////////////////////////////////////////////////////////////////////////////");//trace
						}
					});

					//trace arrays
					//console.log("IMAGES ARRAY LENGTH: " + immosearch_array_details_object_img.length);

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//PARSE DETAILS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//SHOW DETAILS DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					var	immosearch_details_element = '<div class="row">';

									immosearch_details_element += '<div class="col-md-3 col-sm-3 col-xs-6">';
									immosearch_details_element += '<p id="details_page_back_to_list" style="cursor:pointer; color:#aaa91f;"><strong>Zurück zur Liste</strong></p>';
									immosearch_details_element += '</div>';

									immosearch_details_element += '<div class="col-md-3 col-sm-3 col-xs-6">';
									immosearch_details_element += '<p id="details_page_map" style="cursor:pointer; color:#aaa91f;"><strong>Anfrage</strong></p>';
									immosearch_details_element += '</div>';

									immosearch_details_element += '<div class="col-md-3 col-sm-3 col-xs-6">';
									immosearch_details_element += '<p id="details_page_map" style="cursor:pointer; color:#aaa91f;"><strong>Empfehlen</strong></p>';
									immosearch_details_element += '</div>';

									immosearch_details_element += '<div class="col-md-3 col-sm-3 col-xs-6">';
									immosearch_details_element += '<p id="details_page_print" style="cursor:pointer; color:#aaa91f;"><strong>Drucken</strong></p>';
									immosearch_details_element += '</div>';

							immosearch_details_element += '</div>';

              immosearch_details_element += '<hr>';

					 		immosearch_details_element += '<table width="100%" style="margin-top:10px;">';//in row div (from the id "immo_data")

							immosearch_details_element += '<tr>';
							immosearch_details_element += '<td><strong>' + immosearch_array_details_object_address[0] + ' ' + immosearch_array_details_object_address_number[0] + ' , ' + immosearch_array_details_object_plz_number[0] + ' ' + immosearch_array_details_object_ort[0] + ' - ' + immosearch_array_details_object_ortsteil[0] + '</strong></td>';//object title
							immosearch_details_element += '</tr>';

							immosearch_details_element += '<tr>';
							immosearch_details_element += '<td>';
							immosearch_details_element += '<img class="img-thumbnail" id="mypic" src="' + immosearch_array_details_object_img[0] + '" width="250" height="140" style="margin-top:20px; margin-right:18px;">';
              immosearch_details_element += '<img class="img-thumbnail" id="mypic" src="' + immosearch_array_details_object_img[1] + '" width="250" height="140" style="margin-top:20px;">';
							immosearch_details_element += '</td>';
							immosearch_details_element += '</tr>';

              immosearch_details_element += '<tr>';
              immosearch_details_element += '<td>';

                  immosearch_details_element += '<table width="100%" class="table table-hover" style="margin-top:10px;">';

                  var immosearch_array_object_details_wohnflaeche_val = immosearch_array_details_object_wohnflaeche[0];
                  if (typeof immosearch_array_object_details_wohnflaeche_val != "undefined" && immosearch_array_object_details_wohnflaeche_val) {
                    immosearch_details_element += '<tr>';
      							immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Wohnfläche:</strong> ' + immosearch_array_object_details_wohnflaeche_val + ' m&#178;</p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
      							immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Wohnfläche:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  }

                  var immosearch_array_object_details_zimmer_val = removeAfterCertainCharacter(immosearch_array_details_object_zimmer[0], ".");
                  if (typeof immosearch_array_object_details_zimmer_val != "undefined" && immosearch_array_object_details_zimmer_val) {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Zimmer:</strong> ' + immosearch_array_object_details_zimmer_val + ' m&#178;</p>';
                    immosearch_details_element += '</td>';
      							immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Zimmer:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
      							immosearch_details_element += '</tr>';
                  }

                  if (typeof immosearch_array_details_object_etage != "undefined" && immosearch_array_details_object_etage) {
                    //check for etage value and modify
                    if (immosearch_array_details_object_etage  == 0) {
                      //floor
                      immosearch_details_etage_string = "EG";
                    } else if (immosearch_array_details_object_etage  < 0) {
                      //basement
                      immosearch_details_etage_string = "Souterrain";
                    } else if (immosearch_array_details_object_etage  > 0) {
                      //basement
                      immosearch_details_etage_string = immosearch_array_details_object_etage;
                    }

                    //attach the custom value
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Etage:</strong> ' + immosearch_details_etage_string + '</p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Etage:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
      							immosearch_details_element += '</tr>';
                  }

                  var immosearch_array_object_details_verfugbar_ab_val = immosearch_array_details_object_verfugbar_ab[0];
                  if (typeof immosearch_array_object_details_verfugbar_ab_val != "undefined" && immosearch_array_object_details_verfugbar_ab_val) {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Verfügbar ab:</strong> ' + immosearch_array_object_details_verfugbar_ab_val + '</p>';
                    immosearch_details_element += '</td>';
      							immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Verfügbar ab:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
      							immosearch_details_element += '</tr>';
                  }

                  var immosearch_array_object_details_grundmiete_val = immosearch_array_details_object_grundmiete[0];
                  if (typeof immosearch_array_object_details_grundmiete_val != "undefined" && immosearch_array_object_details_grundmiete_val) {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Grundmiete:</strong> ' + immosearch_array_object_details_grundmiete_val + ' &euro;</p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Grundmiete:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  }


                  var immosearch_array_object_details_betriebskosten_val = immosearch_array_details_object_betriebskosten[0];
                  if (typeof immosearch_array_object_details_betriebskosten_val != "undefined" && immosearch_array_object_details_betriebskosten_val) {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Betriebskosten:</strong> ' + immosearch_array_object_details_betriebskosten_val + ' &euro;</p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Betriebskosten:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  }

                  if (typeof immosearch_array_details_object_heizkosten_enthalten != "undefined" && immosearch_array_details_object_heizkosten_enthalten) {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Heizkosten:</strong> ' + immosearch_array_details_object_heizkosten_enthalten + ' &euro;</p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Heizkosten:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  }

                  var immosearch_array_object_details_gesamtmiete_val = immosearch_array_details_object_gesamtmiete[0];
                  if (typeof immosearch_array_object_details_gesamtmiete_val != "undefined" && immosearch_array_object_details_gesamtmiete_val) {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Gesamtmiete:</strong> ' + immosearch_array_object_details_gesamtmiete_val + ' &euro;</p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Gesamtmiete:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  }

                  var immosearch_array_object_details_kaution_val = immosearch_array_details_object_kaution[0];
                  if (typeof immosearch_array_object_details_kaution_val != "undefined" && immosearch_array_object_details_kaution_val) {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Kaution:</strong> ' + immosearch_array_object_details_kaution_val + ' &euro;</p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>Kaution:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  }

                  //immosearch_array_details_object_wbs
                  if (typeof immosearch_array_object_details_wbs_val != "undefined" && immosearch_array_object_details_wbs_val) {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';

                    if (immosearch_array_object_details_wbs_val == true) {
                      immosearch_details_element += '<p><abbr title="Wohnberechtigungsschein"><strong>WBS:</strong></abbr> erforderlich</p>';
                    } else {
                      immosearch_details_element += '<p><abbr title="Wohnberechtigungsschein"><strong>WBS:</strong></abbr> Sozialwohnung</p>';
                    }

                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td>';
                    immosearch_details_element += '<p><strong>WBS:</strong> <input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"></p>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  }

                  //check if there is energie details///////////////////////////////////////////////////////////////////////////////////////////
									if (typeof details_energiepass_epart != "undefined" && details_energiepass_epart) {

										/*
                    immosearch_details_element += '<tr class="active">';
                    immosearch_details_element += '<td><strong style="color:#FF0000;">Energie details <i class="fa fa-angle-double-down"></i></strong></td>';
                    immosearch_details_element += '</tr>';
										*/
										if (typeof details_energiepass_epart != "undefined" && details_energiepass_epart) {
											var epassTyp;
											//immosearch_details_element += '<tr class="active">';//the class="active" adds grey color to these lines (like to group them)
                      immosearch_details_element += '<tr>';
											if (details_energiepass_epart == "VERBRAUCH") {
												epassTyp = "Verbrauchsausweis";
												if (typeof details_energiepass_energieverbrauchkennwert != "undefined" && details_energiepass_energieverbrauchkennwert) {
													if (isNaN(details_energiepass_energieverbrauchkennwert)) {
                            immosearch_details_element += '<td><strong>' + epassTyp + ':</strong> ' + toTitleCase(details_energiepass_energieverbrauchkennwert) + '</td>';
													} else {
                            immosearch_details_element += '<td><strong>' + epassTyp + ':</strong> ' + toTitleCase(details_energiepass_energieverbrauchkennwert) + ' kWh/(m&sup2;a)</td>';
													}
												}
											} else {
												epassTyp = "Bedarfsausweis";
												if (typeof details_energiepass_endenergiebedarf != "undefined" && details_energiepass_endenergiebedarf) {
													if (isNaN(details_energiepass_endenergiebedarf)) {
                            immosearch_details_element += '<td><strong>' + epassTyp + ':</strong> ' + toTitleCase(details_energiepass_endenergiebedarf) + '</td>';
													} else {
                            immosearch_details_element += '<td><strong>' + epassTyp + ':</strong> ' + toTitleCase(details_energiepass_endenergiebedarf) + ' kWh/(m&sup2;a)</td>';
													}
												}
											}
                      immosearch_details_element += '</tr>';
										}

										if (typeof details_energiepass_mitwarmwasser != "undefined" && details_energiepass_mitwarmwasser) {
											//immosearch_details_element += '<tr class="active">';//the class="active" adds grey color to these lines (like to group them)
                      immosearch_details_element += '<tr>';

											if (details_energiepass_mitwarmwasser == "true") {
                        immosearch_details_element += '<td><strong>Mit Warmwasser:</strong> Ja</td>';
											}
                      immosearch_details_element += '</tr>';
										}

										if (typeof details_energiepass_primaerenergietraeger != "undefined" && details_energiepass_primaerenergietraeger) {
											//immosearch_details_element += '<tr class="active">';//the class="active" adds grey color to these lines (like to group them)
                      immosearch_details_element += '<tr>';
                      immosearch_details_element += '<td><strong>Prim&auml;renergietr&auml;ger:</strong> ' + toTitleCase(details_energiepass_primaerenergietraeger) + '</td>';
                      immosearch_details_element += '</tr>';
										}

									}
                  //check if there is energie details///////////////////////////////////////////////////////////////////////////////////////////

                  immosearch_details_element += '</table>';

              immosearch_details_element += '</td>';
              immosearch_details_element += '</tr>';

							immosearch_details_element += '</table>';
              immosearch_details_element += '<br><br><br>';

							immosearch_details_element += '<script>';
							immosearch_details_element += '$(document).ready(function() {';

							immosearch_details_element += '$("#details_page_back_to_list").click(function() {';
								immosearch_details_element += 'homeinfo_immosearch_global();';
								immosearch_details_element += 'return false;';
							immosearch_details_element += '});';

              immosearch_details_element += '$("#details_page_print").click(function() {';


                immosearch_details_element += '$("#details_page_print").live("click", function () {';
                immosearch_details_element += 'var divContents = $("#immo_data").html();';
                immosearch_details_element += 'var printWindow = window.open("", "", "height=500,width=800");';
                immosearch_details_element += 'printWindow.document.write("<html><head><title>Drucken Immobilien</title>");';
                immosearch_details_element += 'printWindow.document.write("</head><body >");';
                immosearch_details_element += 'printWindow.document.write(divContents);';
                immosearch_details_element += 'printWindow.document.write("</body></html>");';
                immosearch_details_element += 'printWindow.document.close();';
                immosearch_details_element += 'printWindow.print();';
                immosearch_details_element += '});';


								immosearch_details_element += 'return false;';
							immosearch_details_element += '});';

							immosearch_details_element += '});';
							immosearch_details_element += '<\/script>';

					$("#immo_data").append(immosearch_details_element);//add elements to HTML
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//SHOW DETAILS DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				} else {
					//no children nodes, inform user
					swal({
						title: "Achtung!",
						text: "Keine Angebote vorhanden!",
						type: "warning",
						html: true,
						confirmButtonColor: "#f8bf86",
						confirmButtonText: "Wiederholen",
						allowOutsideClick: false,
						showConfirmButton: true
					},
					function(isConfirm){
						if (isConfirm) {

						}
					});

				}//if ($(xml).find("ns1\\:rsp").children().length >= 0) {
			},
			error: function (xhr, request, status, error) {
				//inform the user
				swal({
					title: "Achtung!",
					text: "Etwas ist schief gelaufen, bitte erneut versuchen oder Service kontaktieren.",
					type: "warning",
					html: true,
					confirmButtonColor: "#f8bf86",
					confirmButtonText: "Wiederholen",
					allowOutsideClick: false,
					showConfirmButton: true
				},
				function(isConfirm){
					if (isConfirm) {

					}
				});
			}//error: function (request, status, error) {
		});

	});//$(document).ready(function() {
}//function homeinfo_immosearch_details(object_id) {

function homeinfo_immosearch_global() {

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

	if (attachments != "") {
		if (params == "") {
			params = "attachments=" + attachments;
		} else {
			params += "&attachments=" + attachments;
		}
	}

	//document ready
	$(document).ready(function() {

		//ajax immosearch
		$.ajax({
			url: immosearch_url + params,
			crossDomain: true,
			type: "GET",
			dataType: "xml",
			cache: true,
			beforeSend: function() {
				$("#immo_data").empty();
				$("#immo_data").append('<img src="img/preloader/preloader.gif" width="32" height="32" />');
			},
			success: function (xml) {
				if ($(xml).find("ns1\\:rsp").children().length >= 0) {

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//PARSE///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					var xml_namespace = $(xml).find("ns1\\:rsp");//console.log(xml_namespace);
					var anbieterCustomerId = escapeHtml($(xml).find("anbieternr").text());//console.log("CUSTOMER ID: " + anbieterCustomerId);
					var anbieterFirmName = escapeHtml($(xml).find("anbieternr").next().text());//console.log("FIRM NAME: " + anbieterFirm);
					//var findAllImmoText = escapeHtml($(xml).find("immobilie").text());
					//console.log("XML NAMESPACE: " + xml_namespace);
					//console.log("ANBIETER CUSTOMER ID: " + anbieterCustomerId);
					//console.log("ANBIETER FIRM NAME: " + anbieterFirmName);
					//console.log("ALL IMMOBILIENS TEXT: " + findAllImmoText);

					$("#immo_data").empty();//empty page

					//vars
					var total_counter = 0;

					//arrays
					var immosearch_array_img = [];
					var immosearch_array_object_address = [];
					var immosearch_array_object_address_number = [];
					var immosearch_array_object_plz_number = [];
					var immosearch_array_object_ort = [];
					var immosearch_array_object_zimmer = [];
					var immosearch_array_object_wohnflaeche = [];
					var immosearch_array_object_gesamtmiete = [];
					var immosearch_array_object_grundmiete = [];
					var immosearch_array_object_object_number = [];
					var immosearch_array_object_ausstattung = [];
					var immosearch_array_object_ortsteil = [];

					//throw an error message if the are no estates to show
					if ($(xml).find("immobilie").text() == "") {
						$("#immo_data").empty();
						var error_message = '<div class="alert alert-danger" role="alert">';
								error_message += '<i class="fa fa-exclamation-triangle"></i>';
								error_message += '<span class="sr-only">Error:</span>';
								error_message += ' Keine angebote gefunden!';
								error_message += '</div>';
						$("#immo_data").append(error_message);
					}

					$(xml).find("immobilie").each(function(i) {

						total_counter = i;

						//add in array objects images
						var immosearch_list_img = $(this).find("anhanginhalt").text();
						//check if node exists
						if (immosearch_list_img == "") {
							immosearch_array_img.push(customer_img_dummy);//dummy image
						} else {
							immosearch_array_img.push("data:image/jpeg;base64," + immosearch_list_img);//push the 64 img from the response
						}

						immosearch_array_object_address.push(escapeHtml($(this).find("geo strasse").text()));//address
						immosearch_array_object_address_number.push(escapeHtml($(this).find("geo hausnummer").text()));//address number
						immosearch_array_object_plz_number.push(escapeHtml($(this).find("geo plz").text()));
						immosearch_array_object_ort.push(escapeHtml($(this).find("geo ort").text()));
						immosearch_array_object_zimmer.push(escapeHtml($(this).find("flaechen anzahl_zimmer").text()));
						immosearch_array_object_wohnflaeche.push(escapeHtml($(this).find("flaechen wohnflaeche").text()));
						immosearch_array_object_gesamtmiete.push(escapeHtml($(this).find("preise warmmiete").text()));
						immosearch_array_object_grundmiete.push(escapeHtml($(this).find("preise kaltmiete").text()));
						immosearch_array_object_object_number.push(escapeHtml($(this).find("verwaltung_techn openimmo_obid").text()));
						immosearch_array_object_ortsteil.push(escapeHtml($(this).find("geo regionaler_zusatz").text()));//push in the array all areas (once for each kind and count them)

					});//$(xml).find("immobilie").each(function(i) {

					var occurences_areas = group(immosearch_array_object_ortsteil);//group areas and count them
					immosearch_array_object_ortsteil = [];//empty the array "immosearch_array_object_ortsteil" because the object "occurences_areas"

					$("#dynamic_area_list").empty();

          //check if the array "build_locations_array" is empty, if so then push the itams of the areas in
          if (build_locations_array.length == 0) {
  					for (var areas in occurences_areas) {
              build_locations_array.push(areas);
              build_locations_array_number.push(occurences_areas[areas]);
  					}
          }
					occurences_areas = "";//clear the object

          //build the areas checkboxes by the array "build_locations_array"
          for(var i_areas_arr = 0; i_areas_arr < build_locations_array.length; i_areas_arr++) {
            var ortsteil_element = '<div class="col-md-4 col-sm-4 col-xs-6">';
                ortsteil_element += '<div class="checkbox">';
                ortsteil_element += '<label>';
                ortsteil_element += '<input type="checkbox" value="' + build_locations_array[i_areas_arr] + '" id="checkbutton__' + build_locations_array[i_areas_arr] + '"> ' + build_locations_array[i_areas_arr] + ' <span class="badge">' + build_locations_array_number[i_areas_arr] + '</span>';
                ortsteil_element += '</label>';
                ortsteil_element += '</div>';
                ortsteil_element += '</div>';

                ortsteil_element += '<script>';
                ortsteil_element += '$(document).ready(function() {';

                //check if the checkbox value exists in the array, then checked
                ortsteil_element += 'if(selected_locations.indexOf("' + build_locations_array[i_areas_arr] + '") == -1) {';
                  ortsteil_element += '$("#checkbutton__' + build_locations_array[i_areas_arr] + '").attr("checked", false);';
                ortsteil_element += '} else {';
                  ortsteil_element += '$("#checkbutton__' + build_locations_array[i_areas_arr] + '").attr("checked", true);';
                ortsteil_element += '}';

                //on checkbox change
                ortsteil_element += '$("#checkbutton__' + build_locations_array[i_areas_arr] + '").on("change", function() {';
                ortsteil_element += 'if ($(this).is(":checked")) {';
                  ortsteil_element += 'if(selected_locations.indexOf("' + build_locations_array[i_areas_arr] + '") == -1) {';//area doesn't exist, so push it in the array
                      ortsteil_element += 'selected_locations.push($(this).val())';
                  ortsteil_element += '}';
                ortsteil_element += '} else {';
                  ortsteil_element += 'selected_locations.remove_from_array("' + build_locations_array[i_areas_arr] + '");';//if checkbox unchecked then remove the item
                ortsteil_element += '}';
                //ortsteil_element += 'console.log("ARRAY ORTSTEILE ITEMS: " + selected_locations);';//trace
                ortsteil_element += 'homeinfo_immosearch_global();';
                ortsteil_element += '});';

                ortsteil_element += '});';
                ortsteil_element += '<\/script>';

                $("#dynamic_area_list").append(ortsteil_element);//append areas
          }

					//Ausstattung parser (needs to be outside of "immobilie" each loop)
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

					//trace arrays

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//PARSE///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					//add total angebote to title
					$("#total_angebote_in_title").html(total_counter + " Angebote");

					//start append data
					$.each(immosearch_array_object_zimmer, function(i, array_value) {

						var immosearch_element = '<table class="table table-hover" width="100%" style="margin-top:10px; cursor:pointer;" id="object_details___' + i + '">';//in row div (from the id "immo_data")
									immosearch_element += '<tr>';

										immosearch_element += '<td width="140">';
											immosearch_element += '<img class="img-thumbnail" src="' + immosearch_array_img[i] + '" id="__building_pic__' + i + '" width="133" height="120">';
										immosearch_element += '</td>';

										immosearch_element += '<td>';

											//data table
											immosearch_element += '<table border="0" width="100%">';

												immosearch_element += '<tr>';

													immosearch_element += '<td width="25%">';
													var immosearch_array_object_address___display_value = immosearch_array_object_address[i];
													if (typeof immosearch_array_object_address___display_value != "undefined" && immosearch_array_object_address___display_value) {
														immosearch_element += '<p><strong>' + immosearch_array_object_address___display_value + ' ' + immosearch_array_object_address_number[i] + '</strong></p>';
													}
													immosearch_element += '</td>';

													immosearch_element += '<td>';
													immosearch_element += '<p>' + immosearch_array_object_plz_number[i] + ' ' + immosearch_array_object_ort[i]  +'</p>';
													immosearch_element += '</td>';

													immosearch_element += '<td>';
													immosearch_element += '<p></p>';
													immosearch_element += '</td>';

												immosearch_element += '</tr>';

												immosearch_element += '<tr><td colspan="3"><hr></td></tr>';

												immosearch_element += '<tr>';

													immosearch_element += '<td width="25%">';
													var immosearch_array_object_gesamtmiete___display_value = removeAfterCertainCharacter(immosearch_array_object_zimmer[i], ".");
													if (typeof immosearch_array_object_gesamtmiete___display_value != "undefined" && immosearch_array_object_gesamtmiete___display_value) {
														immosearch_element += '<p>' + immosearch_array_object_gesamtmiete___display_value + ' Zimmer</p>';
													} else {
														immosearch_element += '<p><input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"> Zimmer</p>';
													}
													immosearch_element += '</td>';

													immosearch_element += '<td>';
													var immosearch_array_object_grundmiete___display_value = replaceCommaWithDot(immosearch_array_object_grundmiete[i]);
													immosearch_array_object_grundmiete___display_value = ifLastCharIsOnlyOneNull(immosearch_array_object_grundmiete___display_value);
													if (typeof immosearch_array_object_grundmiete___display_value != "undefined" && immosearch_array_object_grundmiete___display_value) {
														immosearch_element += '<p>' + immosearch_array_object_grundmiete___display_value + ' &euro; Grundmiete</p>';
													}
													immosearch_element += '</td>';

													immosearch_element += '<td>';
													immosearch_element += '<p></p>';
													immosearch_element += '</td>';

												immosearch_element += '</tr>';

												immosearch_element += '<tr>';

													immosearch_element += '<td width="25%">';
													var immosearch_array_object_wohnflaeche___display_value = immosearch_array_object_wohnflaeche[i];
													if (typeof immosearch_array_object_wohnflaeche___display_value != "undefined" && immosearch_array_object_wohnflaeche___display_value) {
														immosearch_element += '<p>' + immosearch_array_object_wohnflaeche___display_value + ' m&#178;</p>';
													} else {
														immosearch_element += '<p><input type="button" class="btn btn-specialBtnKA btn-xs" value="K.A." style="cursor:default;"> m&#178;</p>';
													}
													immosearch_element += '</td>';

													immosearch_element += '<td>';
													var immosearch_array_object_gesamtmiete___display_value = replaceCommaWithDot(immosearch_array_object_gesamtmiete[i]);
													immosearch_array_object_gesamtmiete___display_value = ifLastCharIsOnlyOneNull(immosearch_array_object_gesamtmiete___display_value);
													if (typeof immosearch_array_object_gesamtmiete___display_value != "undefined" && immosearch_array_object_gesamtmiete___display_value) {
														immosearch_element += '<p>' + immosearch_array_object_gesamtmiete___display_value + ' &euro; Gesamtmiete </p>';
													}
													immosearch_element += '</td>';

													immosearch_element += '<td>';
													immosearch_element += '<p></p>';
													immosearch_element += '</td>';

												immosearch_element += '</tr>';

												immosearch_element += '<tr>';

													immosearch_element += '<td width="25%">';

													if (immosearch_array_object_ausstattung.length > 0) {
														if (typeof immosearch_array_object_ausstattung[i] != 'undefined' || immosearch_array_object_ausstattung[i] != '') {
															for(var loop = 0; loop < immosearch_array_object_ausstattung[i].length; loop++) {
																//change color 1 by 1 (Yellow, Green)
																if (isOdd(loop) == false) {
																	immosearch_element += '<input type="button" class="btn btn-default btn-xs" value="' + immosearch_array_object_ausstattung[i][loop] + '" id="immo_small_icons" style="border-color:#356635; color:#FFFFFF; background-color:#356635; margin-right:5px;">';
																} else {
																	immosearch_element += '<input type="button" class="btn btn-default btn-xs" value="' + immosearch_array_object_ausstattung[i][loop] + '" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px;">';
																}
															};
														}
													}
													immosearch_element += '</td>';

													immosearch_element += '<td>';
													immosearch_element += '</td>';

													immosearch_element += '<td>';

													immosearch_element += '<p><input type="button" class="btn btn-default btn-xs pull-right" value="Details" id="immo_details_btn" style="border-color:#356635; color:#FFFFFF; background-color:#356635;"></p>';

													immosearch_element += '</td>';

												immosearch_element += '</tr>';

											immosearch_element += '</table>';
											//data table

										immosearch_element += '</td>';
									immosearch_element += '</tr>';
							immosearch_element += '</table>';

							immosearch_element += '<script>';
							immosearch_element += '$(document).ready(function() {';
							immosearch_element += '$("#object_details___' + i + '").click(function() {';
								immosearch_element += 'homeinfo_immosearch_details("' + immosearch_array_object_object_number[i] + '");';//(needs to convert in String value "object id") then ajax call for details page
								immosearch_element += 'return false;';
							immosearch_element += '});';
							immosearch_element += '});';
							immosearch_element += '<\/script>';

						$("#immo_data").append(immosearch_element);//add elements to HTML
					});

					//$("#immo_data").html(immosearch_element);//add elements to HTML
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				} else {
					//no children nodes, inform user
					swal({
						title: "Achtung!",
						text: "Keine Angebote vorhanden!",
						type: "warning",
						html: true,
						confirmButtonColor: "#f8bf86",
						confirmButtonText: "Wiederholen",
						allowOutsideClick: false,
						showConfirmButton: true
					},
					function(isConfirm){
						if (isConfirm) {

						}
					});

				}//if ($(xml).find("ns1\\:rsp").children().length >= 0) {
			},
			error: function (xhr, request, status, error) {
				//general error for ajax call
				//console.log(request.responseText);
				//console.log(xhr.responseText);

				//inform the user
				swal({
					title: "Achtung!",
					text: "Etwas ist schief gelaufen, bitte erneut versuchen oder Service kontaktieren.",
					type: "warning",
					html: true,
					confirmButtonColor: "#f8bf86",
					confirmButtonText: "Wiederholen",
					allowOutsideClick: false,
					showConfirmButton: true
				},
				function(isConfirm){
					if (isConfirm) {

					}
				});

				/*
				if (xhr.status===400) {

				}//if (xhr.status===400) {
				*/
			}//error: function (request, status, error) {
		});
	});//$(document).ready(function() {
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL VARS & FUNCTIONS///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DOCUMENT LOAD & DOCUMENT READY////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//document load  (executes when complete page is fully loaded, including all frames, objects and images)
$(window).load(function() {

});

//document ready (executes when HTML-Document is loaded and DOM is ready)
$(document).ready(function() {

	//btn advance search form (hide/show the form)
	$("#immo_erweiterte_suche_btn").click(function(e) {
		$("#immo_erweiterte_suche_form").fadeToggle("slow");
		//change the button value (while hide/show the form)
		var array_btn_values = ['Schliessen', 'Erweiterte Suche'];//array to strore button values
		$(this).val($(this).val() == array_btn_values[0] ? array_btn_values[1] : array_btn_values[0]);
	});

	//on load select the default value 0 (Bitte wählen) dropdown
	$('#immo_filter option[value="0"]').attr("selected", true);

	$("#immo_filter").change(function() {

		var immodrop_down_value = $(this).val();

		if (immodrop_down_value == 0) {
			//default
			sorting = "";
			//sorting = "?include=freitexte,attachments&attachments=scaling:133x120,limit:1";//default query
		} else if (immodrop_down_value == 1) {
			//console.log("Sort by Zimmer start from small");
			sorting = "zimmer";//sort by (Zimmer aufsteigend) small
		} else if (immodrop_down_value == 2) {
			//console.log("Sort by Zimmer start from big");
			sorting = "zimmer:desc";//sort by (Zimmer absteigend) bigger
		} else if (immodrop_down_value == 3) {
			//console.log("Sort by Flaeche start from small");
			sorting = "wohnflaeche";//sort by (Fläche aufsteigend) small
		} else if (immodrop_down_value == 4) {
			//console.log("Sort by Flaeche start from big");
			sorting = "wohnflaeche:desc";//sort by (Fläche absteigend) bigger
		} else if (immodrop_down_value == 5) {
			//console.log("Sort by Kaltmiete start from small");
			sorting = "kaltmiete";//sort by (Grundmiete aufsteigend) small (kaltmiete)
		} else if (immodrop_down_value == 6) {
			//console.log("Sort by Kaltmiete start from big");
			sorting = "kaltmiete:desc";//sort by (Grundmiete absteigend) bigger (kaltmiete)
		} else if (immodrop_down_value == 7) {
			//console.log("Sort by Warmmiete start from small");
			sorting = "warmmiete";//sort by smallest (Gesamtmiete aufsteigend) small (warmmiete)
		} else if (immodrop_down_value == 8) {
			//console.log("Sort by Warmmiete start from big");
			sorting = "warmmiete:desc";//sort by smallest (Gesamtmiete absteigend) bigger (warmmiete)
		}

		homeinfo_immosearch_global();//ajax call, function homeinfo_immosearch_global()
	});

	$("#zimmer_von").val("");//empty the filed on load
	$("#zimmer_von").on('input', function() {
		//console.log("ZIMMER VON: " + $(this).val());
		zimmer_von = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#zimmer_bis").val("");//empty the filed on load
	$("#zimmer_bis").on('input', function() {
		//console.log("ZIMMER BIS: " + $(this).val());
		zimmer_bis = + $(this).val();
		homeinfo_immosearch_global();
	});

	$("#wohnflaeche_von").val("");//empty the filed on load
	$("#wohnflaeche_von").on('input', function() {
		//console.log("WOHNFLAECHE VON: " + $(this).val());
		wohnflaeche_von = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#wohnflaeche_bis").val("");//empty the filed on load
	$("#wohnflaeche_bis").on('input', function() {
		//console.log("WOHNFLAECHE BIS: " + $(this).val());
		wohnflaeche_bis = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#grundmiete_von").val("");//empty the filed on load
	$("#grundmiete_von").on('input', function() {
		//console.log("GRUNDMIETE VON: " + $(this).val());
		grundmiete_von = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#grundmiete_bis").val("");//empty the filed on load
	$("#grundmiete_bis").on('input', function() {
		console.log("GRUNDMIETE BIS: " + $(this).val());
		grundmiete_bis = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#terrasse").attr('checked', false);//uncheck the checkbox on load
	$("#terrasse").on('change', function() {
		if ($(this).attr("checked")) {
			terrasse = true;
		} else {
			terrasse = false;
		}
		homeinfo_immosearch_global();
	});

	$("#garten").attr('checked', false);//uncheck the checkbox on load
	$("#garten").on('change', function() {
		if ($(this).attr("checked")) {
			garten = true;
		} else {
			garten = false;
		}
		homeinfo_immosearch_global();
	});

	$("#balkon_loggia").attr('checked', false);//uncheck the checkbox on load
	$("#balkon_loggia").on('change', function() {
		if ($(this).is(":checked")) {
			balkon = true;
		} else {
			balkon = false;
		}
		homeinfo_immosearch_global();
	});

	$("#bad_mit_wanne").attr('checked', false);//uncheck the checkbox on load
	$("#bad_mit_wanne").on('change', function() {
		if ($(this).is(":checked")) {
			wanne = true;
		} else {
			wanne = false;
		}
		homeinfo_immosearch_global();
	});

	$("#bad_mit_dusche").attr('checked', false);//uncheck the checkbox on load
	$("#bad_mit_dusche").on('change', function() {
		if ($(this).is(":checked")) {
			dusche = true;
		} else {
			dusche = false;
		}
		homeinfo_immosearch_global();
	});

	$("#aufzug").attr('checked', false);//uncheck the checkbox on load
	$("#aufzug").on('change', function() {
		if ($(this).is(":checked")) {
			aufzug = true;
		} else {
			aufzug = false;
		}
		homeinfo_immosearch_global();
	});

	$("#eg").attr('checked', false);//uncheck the checkbox on load
	$("#eg").on('change', function() {
		if ($(this).is(":checked")) {
			erdgeschoss = true;
		} else {
			erdgeschoss = false;
		}
		homeinfo_immosearch_global();
	});

	$("#1og").attr('checked', false);//uncheck the checkbox on load
	$("#1og").on('change', function() {
		if ($(this).is(":checked")) {
			first_floor = true;
		} else {
			first_floor = false;
		}
		homeinfo_immosearch_global();
	});

	$("#2og_oder_hoher").attr('checked', false);//uncheck the checkbox on load
	$("#2og_oder_hoher").on('change', function() {
		if ($(this).is(":checked")) {
			second_floor = true;
		} else {
			second_floor = false;
		}
		homeinfo_immosearch_global();
	});

	//ajax call on page load
	homeinfo_immosearch_global();

	//clear console.log()
	//console.clear();

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DOCUMENT LOAD & DOCUMENT READY////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
