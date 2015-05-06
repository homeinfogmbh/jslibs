/*
    HOMEINFO OpenImmo™ XML DOM library

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
    TODO: 
        * Implement further DOM classes

    Change log:
    
    03.05.2015: Richard Neumann <r.neumann@homeinfo.de>
    *   Implemented this library
*/


function Ausstattung(ausstattung_node) {
    this.ausstatt_kategorie = ausstattung_node.getElementValue(
        "ausstatt_kategorie");
    this.wg_geeignet = ausstattung_node.getElementValue("wg_geeignet");
    this.raeume_veraenderbar = ausstattung_node.getElementValue(
        "raeume_veraenderbar");
    this.bad = ausstattung_node.getElementValue("bad");
    this.kueche = ausstattung_node.getElementValue("kueche");
    this.boden = ausstattung_node.getElementValue("boden");
    this.kamin = ausstattung_node.getElementValue("kamin");
    this.heizungsart = ausstattung_node.getElementValue("heizungsart");
    this.klimatisiert = ausstattung_node.getElementValue("klimatisiert");
    this.fahrstuhl = ausstattung_node.getElementValue("fahrstuhl");
    this.stellplatzart = ausstattung_node.getElementValue("stellplatzart");
    this.gartennutzung = ausstattung_node.getElementValue("gartennutzung");
    this.ausricht_balkon_terrasse = ausstattung_node.getElementValue(
        "ausricht_balkon_terrasse");
    this.moebliert = ausstattung_node.getElementValue("moebliert");
    this.rollstuhlgerecht = ausstattung_node.getElementValue(
	    "rollstuhlgerecht");
    this.kabel_sat_tv = ausstattung_node.getElementValue("kabel_sat_tv");
    this.dvbt = ausstattung_node.getElementValue("dvbt");
    this.barrierefrei = ausstattung_node.getElementValue("barrierefrei");
    this.sauna = ausstattung_node.getElementValue("sauna");
    this.swimmingpool = ausstattung_node.getElementValue("swimmingpool");
    this.wasch_trockenraum = ausstattung_node.getElementValue(
        "wasch_trockenraum");
    this.wintergarten = ausstattung_node.getElementValue("wintergarten");
    this.dv_verkabelung = ausstattung_node.getElementValue("dv_verkabelung");
    this.rampe = ausstattung_node.getElementValue("rampe");
    this.hebebuehne = ausstattung_node.getElementValue("hebebuehne");
    this.kran = ausstattung_node.getElementValue("kran");
    this.gastterrasse = ausstattung_node.getElementValue("gastterrasse");
    this.stromanschlusswert = ausstattung_node.getElementValue(
        "stromanschlusswert");
    this.kantine_cafeteria = ausstattung_node.getElementValue(
        "kantine_cafeteria");
    this.teekueche = ausstattung_node.getElementValue("teekueche");
    this.hallenhoehe = ausstattung_node.getElementValue("hallenhoehe");
    this.angeschl_gastronomie = ausstattung_node.getElementValue(
        "angeschl_gastronomie");
    this.brauereibindung = ausstattung_node.getElementValue("brauereibindung");
    this.sporteinrichtungen = ausstattung_node.getElementValue(
        "sporteinrichtungen");
    this.wellnessbereich = ausstattung_node.getElementValue("wellnessbereich");
    this.serviceleistungen = ausstattung_node.getElementValue(
        "serviceleistungen");
    this.telefon_ferienimmobilie = ausstattung_node.getElementValue(
        "telefon_ferienimmobilie");
    this.breitband_zugang = ausstattung_node.getElementValue(
        "breitband_zugang");
    this.umts_empfang = ausstattung_node.getElementValue("umts_empfang");
    this.sicherheitstechnik = ausstattung_node.getElementValue(
        "sicherheitstechnik");
    this.unterkellert = ausstattung_node.getElementValue("unterkellert");
    this.abstellraum = ausstattung_node.getElementValue("abstellraum");
    this.fahrradraum = ausstattung_node.getElementValue("fahrradraum");
    this.rolladen = ausstattung_node.getElementValue("rolladen");
    this.dachform = ausstattung_node.getElementValue("dachform");
    this.bauweise = ausstattung_node.getElementValue("bauweise");
    this.ausbaustufe = ausstattung_node.getElementValue("ausbaustufe");
    this.energietyp = ausstattung_node.getElementValue("energietyp");
    this.bibliothek = ausstattung_node.getElementValue("bibliothek");
    this.dachboden = ausstattung_node.getElementValue("dachboden");
    this.gaestewc = ausstattung_node.getElementValue("gaestewc");
    this.kabelkanaele = ausstattung_node.getElementValue("kabelkanaele");
    this.seniorengerecht= ausstattung_node.getElementValue("seniorengerecht");
    return this;
}


function Flaechen(flaechen_node) {
    this.wohnflaeche = flaechen_node.getElementValue("wohnflaeche");
    this.nutzflaeche = flaechen_node.getElementValue("nutzflaeche");
    this.gesamtflaeche = flaechen_node.getElementValue("gesamtflaeche");
    this.ladenflaeche = flaechen_node.getElementValue("ladenflaeche");
    this.lagerflaeche = flaechen_node.getElementValue("lagerflaeche");
    this.verkaufsflaeche = flaechen_node.getElementValue("verkaufsflaeche");
    this.freiflaeche = flaechen_node.getElementValue("freiflaeche");
    this.bueroflaeche = flaechen_node.getElementValue("bueroflaeche");
    this.bueroteilflaeche = flaechen_node.getElementValue("bueroteilflaeche");
    this.fensterfront = flaechen_node.getElementValue("fensterfront");
    this.verwaltungsflaeche = flaechen_node.getElementValue(
        "verwaltungsflaeche");
    this.gastroflaeche = flaechen_node.getElementValue("gastroflaeche");
    this.grz = flaechen_node.getElementValue("grz");
    this.gfz = flaechen_node.getElementValue("gfz");
    this.bmz = flaechen_node.getElementValue("bmz");
    this.bgf = flaechen_node.getElementValue("bgf");
    this.grundstuecksflaeche = flaechen_node.getElementValue(
        "grundstuecksflaeche");
    this.sonstflaeche = flaechen_node.getElementValue("sonstflaeche");
    this.anzahl_zimmer = flaechen_node.getElementValue("anzahl_zimmer");
    this.anzahl_schlafzimmer = flaechen_node.getElementValue(
        "anzahl_schlafzimmer");
    this.anzahl_badezimmer = flaechen_node.getElementValue("anzahl_badezimmer");
    this.anzahl_sep_wc = flaechen_node.getElementValue("anzahl_sep_wc");
    this.anzahl_balkone = flaechen_node.getElementValue("anzahl_balkone");
    this.anzahl_terrassen = flaechen_node.getElementValue("anzahl_terrassen");
    this.anzahl_logia = flaechen_node.getElementValue("anzahl_logia");
    this.balkon_terrasse_flaeche = flaechen_node.getElementValue(
        "balkon_terrasse_flaeche");
    this.anzahl_wohn_schlafzimmer = flaechen_node.getElementValue(
        "anzahl_wohn_schlafzimmer");
    this.gartenflaeche = flaechen_node.getElementValue("gartenflaeche");
    this.kellerflaeche = flaechen_node.getElementValue("kellerflaeche");
    this.fensterfront_qm = flaechen_node.getElementValue("fensterfront_qm");
    this.grundstuecksfront = flaechen_node.getElementValue("grundstuecksfront");
    this.dachbodenflaeche = flaechen_node.getElementValue("dachbodenflaeche");
    this.teilbar_ab = flaechen_node.getElementValue("teilbar_ab");
    this.beheizbare_flaeche = flaechen_node.getElementValue(
        "beheizbare_flaeche");
    this.anzahl_stellplaetze = flaechen_node.getElementValue(
        "anzahl_stellplaetze");
    this.plaetze_gastraum = flaechen_node.getElementValue("plaetze_gastraum");
    this.anzahl_betten = flaechen_node.getElementValue("anzahl_betten");
    this.anzahl_tagungsraeume = flaechen_node.getElementValue(
        "anzahl_tagungsraeume");
    this.vermietbare_flaeche = flaechen_node.getElementValue(
        "vermietbare_flaeche");
    this.anzahl_wohneinheiten = flaechen_node.getElementValue(
        "anzahl_wohneinheiten");
    this.anzahl_gewerbeeinheiten = flaechen_node.getElementValue(
        "anzahl_gewerbeeinheiten");
    this.einliegerwohnung = flaechen_node.getElementValue("einliegerwohnung");
    this.kubatur = flaechen_node.getElementValue("kubatur");
    this.ausnuetzungsziffer = flaechen_node.getElementValue(
        "ausnuetzungsziffer");
    this.flaechevon = flaechen_node.getElementValue("flaechevon");
    this.flaechebis = flaechen_node.getElementValue("flaechebis");
    return this;
}


function Preise(preise_node) {
    this.kaufpreis = preise_node.getElementValue("kaufpreis");
    this.kaufpreisnetto = preise_node.getElementValue("kaufpreisnetto");
    this.kaufpreisbrutto = preise_node.getElementValue("kaufpreisbrutto");
    this.nettokaltmiete = preise_node.getElementValue("nettokaltmiete");
    this.kaltmiete = preise_node.getElementValue("kaltmiete");
    this.warmmiete = preise_node.getElementValue("warmmiete");
    this.nebenkosten = preise_node.getElementValue("nebenkosten");
    this.heizkosten_enthalten = preise_node.getElementValue(
        "heizkosten_enthalten");
    this.heizkosten = preise_node.getElementValue("heizkosten");
    this.zzg_mehrwertsteuer = preise_node.getElementValue("zzg_mehrwertsteuer");
    this.mietzuschlaege = preise_node.getElementValue("mietzuschlaege");
    this.hauptmietzinsnetto = preise_node.getElementValue("hauptmietzinsnetto");
    this.pauschalmiete = preise_node.getElementValue("pauschalmiete");
    this.betriebskostennetto = preise_node.getElementValue(
        "betriebskostennetto");
    this.evbnetto = preise_node.getElementValue("evbnetto");
    this.gesamtmietenetto = preise_node.getElementValue("gesamtmietenetto");
    this.gesamtmietebrutto = preise_node.getElementValue("gesamtmietebrutto");
    this.gesamtbelastungnetto = preise_node.getElementValue(
        "gesamtbelastungnetto");
    this.gesamtbelastungbrutto = preise_node.getElementValue(
        "gesamtbelastungbrutto");
    this.gesamtkostenprom2von = preise_node.getElementValue(
        "gesamtkostenprom2von");
    this.heizkostennetto = preise_node.getElementValue("heizkostennetto");
    this.monatlichekostennetto = preise_node.getElementValue(
        "monatlichekostennetto");
    this.monatlichekostenbrutto = preise_node.getElementValue(
        "monatlichekostenbrutto");
    this.nebenkostenprom2von = preise_node.getElementValue(
        "nebenkostenprom2von");
    this.ruecklagenetto = preise_node.getElementValue("ruecklagenetto");
    this.sonstigekostennetto = preise_node.getElementValue(
        "sonstigekostennetto");
    this.sonstigemietenetto = preise_node.getElementValue("sonstigemietenetto");
    this.nettomieteprom2von = preise_node.getElementValue(
        "nettomieteprom2von");
    this.pacht = preise_node.getElementValue("pacht");
    this.erbpacht = preise_node.getElementValue("erbpacht");
    this.hausgeld = preise_node.getElementValue("hausgeld");
    this.abstand = preise_node.getElementValue("abstand");
    this.preis_zeitraum_von = preise_node.getElementValue("preis_zeitraum_von");
    this.preis_zeitraum_bis = preise_node.getElementValue("preis_zeitraum_bis");
    this.preis_zeiteinheit = preise_node.getElementValue("preis_zeiteinheit");
    this.mietpreis_pro_qm = preise_node.getElementValue("mietpreis_pro_qm");
    this.kaufpreis_pro_qm = preise_node.getElementValue("kaufpreis_pro_qm");
    this.provisionspflichtig = preise_node.getElementValue(
        "provisionspflichtig");
    this.provision_teilen = preise_node.getElementValue("provision_teilen");
    this.innen_courtage = preise_node.getElementValue("innen_courtage");
    this.aussen_courtage = preise_node.getElementValue("aussen_courtage");
    this.courtage_hinweis = preise_node.getElementValue("courtage_hinweis");
    this.provisionnetto = preise_node.getElementValue("provisionnetto");
    this.provisionbrutto = preise_node.getElementValue("provisionbrutto");
    this.waehrung = preise_node.getElementValue("waehrung");
    this.mwst_satz = preise_node.getElementValue("mwst_satz");
    this.mwst_gesamt = preise_node.getElementValue("mwst_gesamt");
    this.freitext_preis = preise_node.getElementValue("freitext_preis");
    this.x_fache = preise_node.getElementValue("x_fache");
    this.nettorendite = preise_node.getElementValue("nettorendite");
    this.nettorendite_soll = preise_node.getElementValue("nettorendite_soll");
    this.nettorendite_ist = preise_node.getElementValue("nettorendite_ist");
    this.mieteinnahmen_ist = preise_node.getElementValue("mieteinnahmen_ist");
    this.mieteinnahmen_soll = preise_node.getElementValue("mieteinnahmen_soll");
    this.erschliessungskosten = preise_node.getElementValue(
        "erschliessungskosten");
    this.kaution = preise_node.getElementValue("kaution");
    this.kaution_text = preise_node.getElementValue("kaution_text");
    this.geschaeftsguthaben = preise_node.getElementValue("geschaeftsguthaben");
    this.stp_carport = preise_node.getElementValue("stp_carport");
    this.stp_duplex = preise_node.getElementValue("stp_duplex");
    this.stp_freiplatz = preise_node.getElementValue("stp_freiplatz");
    this.stp_garage = preise_node.getElementValue("stp_garage");
    this.stp_parkhaus = preise_node.getElementValue("stp_parkhaus");
    this.stp_tiefgarage = preise_node.getElementValue("stp_tiefgarage");
    this.stp_sonstige = preise_node.getElementValue("stp_sonstige");
    this.richtpreis = preise_node.getElementValue("richtpreis");
    this.richtpreisprom2 = preise_node.getElementValue("richtpreisprom2");
    return this;
}


function Kontaktperson(kontaktperson_node) {
    this.email_zentrale = kontaktperson_node.getElementValue("email_zentrale");
    this.email_direkt = kontaktperson_node.getElementValue("email_direkt");
    this.tel_zentrale = kontaktperson_node.getElementValue("tel_zentrale");
    this.tel_durchw = kontaktperson_node.getElementValue("tel_durchw");
    this.tel_fax = kontaktperson_node.getElementValue("tel_fax");
    this.tel_handy = kontaktperson_node.getElementValue("tel_handy");
    this.name = kontaktperson_node.getElementValue("name");
    this.vorname = kontaktperson_node.getElementValue("vorname");
    this.titel = kontaktperson_node.getElementValue("titel");
    this.anrede = kontaktperson_node.getElementValue("anrede");
    this.position = kontaktperson_node.getElementValue("position");
    this.anrede_brief = kontaktperson_node.getElementValue("anrede_brief");
    this.firma = kontaktperson_node.getElementValue("firma");
    this.zusatzfeld = kontaktperson_node.getElementValue("zusatzfeld");
    this.strasse = kontaktperson_node.getElementValue("strasse");
    this.hausnummer = kontaktperson_node.getElementValue("hausnummer");
    this.plz = kontaktperson_node.getElementValue("plz");
    this.ort = kontaktperson_node.getElementValue("ort");
    this.postfach = kontaktperson_node.getElementValue("postfach");
    this.postf_plz = kontaktperson_node.getElementValue("postf_plz");
    this.postf_ort = kontaktperson_node.getElementValue("postf_ort");
    this.land = kontaktperson_node.getElementValue("land");
    this.email_privat = kontaktperson_node.getElementValue("email_privat");
    this.email_sonstige = kontaktperson_node.getElementValue("email_sonstige");
    this.email_feedback = kontaktperson_node.getElementValue("email_feedback");
    this.tel_privat = kontaktperson_node.getElementValue("tel_privat");
    this.tel_sonstige = kontaktperson_node.getElementValue("tel_sonstige");
    this.url = kontaktperson_node.getElementValue("url");
    this.adressfreigabe = kontaktperson_node.getElementValue("adressfreigabe");
    this.personennummer = kontaktperson_node.getElementValue("personennummer");
    this.immobilientreuhaenderid = kontaktperson_node.getElementValue(
        "immobilientreuhaenderid");
    this.foto = kontaktperson_node.getElementValue("foto");
    this.freitextfeld = kontaktperson_node.getElementValue("freitextfeld");
    return this;
}
    


function Geo(geo_node) {
    this.strasse = geo_node.getElementValue("strasse");
    this.hausnummer = geo_node.getElementValue("hausnummer");
    this.bundesland = geo_node.getElementValue("bundesland");
    this.land = geo_node.getElementValue("land");
    this.gemeindecode = geo_node.getElementValue("gemeindecode");
    this.flur = geo_node.getElementValue("flur");
    this.flurstueck = geo_node.getElementValue("flurstueck");
    this.gemarkung = geo_node.getElementValue("gemarkung");
    this.etage = geo_node.getElementValue("etage");
    this.anzahl_etagen = geo_node.getElementValue("anzahl_etagen");
    this.lage_im_bau = geo_node.getElementValue("lage_im_bau");
    this.wohnungsnr = geo_node.getElementValue("wohnungsnr");
    this.lage_gebiet = geo_node.getElementValue("lage_gebiet");
    this.regionaler_zusatz = geo_node.getElementValue("regionaler_zusatz");
    this.karten_makro = geo_node.getElementValue("karten_makro");
    this.karten_mikro = geo_node.getElementValue("karten_mikro");
    this.virtuelletour = geo_node.getElementValue("virtuelletour");
    this.luftbildern = geo_node.getElementValue("luftbildern");
    return this;
}


function Nutzungsart(nutzungsart) {
    this.WOHNEN = nutzungsart.getElementValue("WOHNEN");
    this.GEWERBE = nutzungsart.getElementValue("GEWERBE");
    this.ANLAGE = nutzungsart.getElementValue("ANLAGE");
    this.WAZ = nutzungsart.getElementValue("WAZ");
    return this;
}


function Vermarktungsart(vermarktungsart) {
    this.KAUF = vermarktungsart.getElementValue("KAUF");
    this.MIETE_PACHT = vermarktungsart.getElementValue("MIETE_PACHT");
    this.ERBPACHT = vermarktungsart.getElementValue("ERBPACHT");
    this.LEASING = vermarktungsart.getElementValue("LEASING");
    return this;
}


function Objektart(objektart) {
    // TODO: Implement object types...
    return this;
}



function Objektkategorie(objektkategorie_node) {
    this.nutzungsart = Nutzungsart(
        objektkategorie_node.getElement("nutzungsart"));
    this.vermarktungsart = Vermarktungsart(
        objektkategorie_node.getElement("vermarktungsart"));
    this.objektart = Objektart(
        objektkategorie_node.getElement("objektart"));
    return this;
}


function Energiepass(energiepass) {
    this.epart = energiepass.getElementValue("epart");
    this.gueltig_bis = energiepass.getElementValue("gueltig_bis");
    this.energieverbrauchkennwert = energiepass.getElementValue(
        "energieverbrauchkennwert");
    this.mitwarmwasser = energiepass.getElementValue("mitwarmwasser");
    this.endenergiebedarf = energiepass.getElementValue("endenergiebedarf");
    this.primaerenergietraeger = energiepass.getElementValue(
        "primaerenergietraeger");
    this.stromwert = energiepass.getElementValue("stromwert");
    this.waermewert = energiepass.getElementValue("waermewert");
    this.wertklasse = energiepass.getElementValue("wertklasse");
    this.baujahr = energiepass.getElementValue("baujahr");
    this.ausstelldatum = energiepass.getElementValue("ausstelldatum");
    this.jahrgang = energiepass.getElementValue("jahrgang");
    this.gebaeudeart = energiepass.getElementValue("gebaeudeart");
    this.epasstext = energiepass.getElementValue("epasstext");
    this.hwbwert = energiepass.getElementValue("hwbwert");
    this.hwbklasse = energiepass.getElementValue("hwbklasse");
    this.fgeewert = energiepass.getElementValue("fgeewert");
    this.fgeeklasse = energiepass.getElementValue("fgeeklasse");
    return this;
}


function ZustandAngaben(zustand_angaben) {
    console.log("ZA: " + zustand_angaben);
    function _energiepass() {
        var energiepass_ = zustand_angaben.getElements("energiepass");
        var result = [];
        for (var i = 0; i < energiepass_.length; i++) {
        	result.push(Energiepass(energiepass_[i]));
        }
        return result;
    }
    
    this.baujahr = zustand_angaben.getElementValue("baujahr");
    this.letztemodernisierung = zustand_angaben.getElementValue(
        "letztemodernisierung");
    this.zustand = zustand_angaben.getElement(
        "zustand").getAttribute("zustand_art");
    this.alter = zustand_angaben.getElementValue("alter");
    this.bebaubar_nach = zustand_angaben.getElement(
        "bebaubar_nach").getAttribute("bebaubar_attr");
    this.erschliessung = zustand_angaben.getElement(
        "erschliessung").getAttribute("erschl_attr");
    this.erschliessung_umfang = zustand_angaben.getElement(
        "erschliessung_umfang").getAttribute("erschl_attr");
    this.bauzone = zustand_angaben.getElementValue("bauzone");
    this.altlasten = zustand_angaben.getElementValue("altlasten");
    this.energiepass = _energiepass();
    this.verkaufstatus = zustand_angaben.getElementValue(
        "verkaufstatus").getAttribute("stand");
    return this;
}


function Freitexte(freitexte) {
    this.objekttitel = freitexte.getElementValue("objekttitel");
    this.dreizeiler = freitexte.getElementValue("dreizeiler");
    this.lage = freitexte.getElementValue("lage");
    this.ausstatt_beschr = freitexte.getElementValue("ausstatt_beschr");
    this.objektbeschreibung = freitexte.getElementValue("objektbeschreibung");
    this.sonstige_angaben = freitexte.getElementValue("sonstige_angaben");
    this.objekt_text = freitexte.getElementValue("objekt_text");
    return this;
}


function VerwaltungObjekt(verwaltung_objekt) {
    this.objektadresse_freigeben = verwaltung_objekt.getElementValue(
        "objektadresse_freigeben");
    this.verfuegbar_ab = verwaltung_objekt.getElementValue("verfuegbar_ab");
    this.abdatum = verwaltung_objekt.getElementValue("abdatum");
    this.bisdatum = verwaltung_objekt.getElementValue("bisdatum");
    this.min_mietdauer = verwaltung_objekt.getElementValue("min_mietdauer");
    this.max_mietdauer = verwaltung_objekt.getElementValue("max_mietdauer");
    this.versteigerungstermin = verwaltung_objekt.getElementValue(
        "versteigerungstermin");
    this.wbs_sozialwohnung = verwaltung_objekt.getElementValue(
        "wbs_sozialwohnung");
    this.vermietet = verwaltung_objekt.getElementValue("vermietet");
    this.gruppennummer = verwaltung_objekt.getElementValue("gruppennummer");
    this.zugang = verwaltung_objekt.getElementValue("zugang");
    this.laufzeit = verwaltung_objekt.getElementValue("laufzeit");
    this.max_personen = verwaltung_objekt.getElementValue("max_personen");
    this.nichtraucher = verwaltung_objekt.getElementValue("nichtraucher");
    this.haustiere = verwaltung_objekt.getElementValue("haustiere");
    this.geschlecht = verwaltung_objekt.getElementValue("geschlecht");
    this.denkmalgeschuetzt = verwaltung_objekt.getElementValue(
        "denkmalgeschuetzt");
    this.als_ferien = verwaltung_objekt.getElementValue("als_ferien");
    this.gewerbliche_nutzung = verwaltung_objekt.getElementValue(
        "gewerbliche_nutzung");
    this.branchen = verwaltung_objekt.getElementValue("branchen");
    this.hochhaus = verwaltung_objekt.getElementValue("hochhaus");
    return this;
}


function Daten(daten) {
    this.pfad = daten.getElementValue("pfad");
    this.anhanginhalt = daten.getElementValue("anhanginhalt");
    return this;
}



function Anhang(anhang) {
    this.anhangtitel = anhang.getElementValue("anhangtitel");
    this.format = anhang.getElementValue("format");
    this.check = anhang.getElementValue("check");
    this.daten = Daten(anhang.getElement("daten"));
    this.location = anhang.getElementValue("location");
    this.gruppe = anhang.getElementValue("gruppe");
    return this;
}


function VerwaltungTechn(verwaltung_techn){
    this.objektnr_intern = verwaltung_techn.getElementValue("objektnr_intern");
    this.objektnr_extern = verwaltung_techn.getElementValue("objektnr_extern");
    this.aktion = verwaltung_techn.getElement(
        "aktion").getAttribute("aktionart");
    this.aktiv_von = verwaltung_techn.getElementValue("aktiv_von");
    this.aktiv_bis = verwaltung_techn.getElementValue("aktiv_bis");
    this.openimmo_obid = verwaltung_techn.getElementValue("openimmo_obid");
    this.kennung_ursprung = verwaltung_techn.getElementValue(
        "kennung_ursprung");
    this.stand_vom = verwaltung_techn.getElementValue("stand_vom");
    this.weitergabe_generell = verwaltung_techn.getElementValue(
        "weitergabe_generell");
    this.weitergabe_positiv = verwaltung_techn.getElementValue(
        "weitergabe_positiv");
    this.weitergabe_negativ = verwaltung_techn.getElementValue(
        "weitergabe_negativ");
    this.gruppen_kennung = verwaltung_techn.getElementValue("gruppen_kennung");
    this.master = verwaltung_techn.getElementValue("master");
    this.sprache = verwaltung_techn.getElementValue("sprache");
    return this;
}


function Immobilie(immobilie_node) {
    function _anhaenge() {
        var result = [];
        var anhaenge = immobilie_node.getElement("anhaenge");
        if (anhaenge != null) {
	        var anhang = anhaenge.getElements("anhaenge");
	        for (var i = 0; i < anhang.length; i++) {
	            result.push(Anhang(anhang[i]));
	        }
        }
        return result;
    }

    this.objektkategorie = Objektkategorie(
        immobilie_node.getElement("objektkategorie"));
    this.geo = Geo(immobilie_node.getElement("geo"));
    this.kontaktperson = Kontaktperson(
        immobilie_node.getElement("kontaktperson"));
    this.preise = Preise(immobilie_node.getElement("preise"));
    this.flaechen = Flaechen(immobilie_node.getElement("flaechen"));
    this.ausstattung = Ausstattung(immobilie_node.getElement("ausstattung"));
    this.zustand_angaben = ZustandAngaben(
        immobilie_node.getElement("zustand_angaben"));
    this.freitexte = Freitexte(immobilie_node.getElement("freitexte"));
    this.anhaenge = _anhaenge();
    this.verwaltung_objekt = VerwaltungObjekt(
        immobilie_node.getElement("verwaltung_objekt"));
    this.verwaltung_techn = VerwaltungTechn(
        immobilie_node.getElement("verwaltung_techn"));
    return this;
}


function Anbieter(anbieter_node) {
    function _immobilie() {
        var result = [];
        var immobilie_ = anbieter_node.getElementsByTagName("immobilie");
        for (var i = 0; i < immobilie_.length; i++) {
            result.push(Immobilie(immobilie_[i]));
        }
        return result;
    }

    this.anbieternr = anbieter_node.getElementValue("anbieternr");
    this.firma = anbieter_node.getElementValue("firma");
    this.openimmo_anid = anbieter_node.getElementValue("openimmo_anid");
    this.immobilie = _immobilie();
    return this;
}


function Openimmo(xml) {
    // TODO: Implement
	return this;
}

