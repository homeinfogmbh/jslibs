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
    
    // TODO: Implement
    return this;


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


function Objektkategorie(objektkategorie_node) {
    this.nutzungsart = Nutzungsart(
        objektkategorie_node.getElement("nutzungsart"));
    this.vermarktungsart = Vermarktungsart(
        objektkategorie_node.getElement("vermarktungsart"));
    this.objektart = Objektart(
        objektkategorie_node.getElement("objektart"));
    return this;
}


function Immobilie(immobilie_node) {
    function _anhaenge() {
        var result = [];
        var anhaenge_ = immobilie_node.getElementsByTagName("anhaenge");
        for (var i = 0; i < anhaenge_.length; i++) {
            result.push(Anhang(anhaenge_[i]));
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
        result = [];
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
}

