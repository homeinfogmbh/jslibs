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
    
    * 03.05.2015: Richard Neumann <r.neumann@homeinfo.de>:
        Implemented this library
    
    * 13.05.2015: Richard Neumann <r.neumann@homeinfo.de>:
        Updated some classes
*/


var openimmo = {
    ausstattung: function(ausstattung) {
        this.ausstatt_kategorie = ausstattung.getElementValue(
            "ausstatt_kategorie");
        this.wg_geeignet = ausstattung.getElementValue("wg_geeignet");
        this.raeume_veraenderbar = ausstattung.getElementValue(
            "raeume_veraenderbar");
        this.bad = ausstattung.getElementValue("bad");
        this.kueche = ausstattung.getElementValue("kueche");
        this.boden = ausstattung.getElementValue("boden");
        this.kamin = ausstattung.getElementValue("kamin");
        this.heizungsart = ausstattung.getElementValue("heizungsart");
        this.klimatisiert = ausstattung.getElementValue("klimatisiert");
        this.fahrstuhl = ausstattung.getElementValue("fahrstuhl");
        this.stellplatzart = ausstattung.getElementValue("stellplatzart");
        this.gartennutzung = ausstattung.getElementValue("gartennutzung");
        this.ausricht_balkon_terrasse = ausstattung.getElementValue(
            "ausricht_balkon_terrasse");
        this.moebliert = ausstattung.getElementValue("moebliert");
        this.rollstuhlgerecht = ausstattung.getElementValue(
            "rollstuhlgerecht");
        this.kabel_sat_tv = ausstattung.getElementValue("kabel_sat_tv");
        this.dvbt = ausstattung.getElementValue("dvbt");
        this.barrierefrei = ausstattung.getElementValue("barrierefrei");
        this.sauna = ausstattung.getElementValue("sauna");
        this.swimmingpool = ausstattung.getElementValue("swimmingpool");
        this.wasch_trockenraum = ausstattung.getElementValue(
            "wasch_trockenraum");
        this.wintergarten = ausstattung.getElementValue("wintergarten");
        this.dv_verkabelung = ausstattung.getElementValue(
            "dv_verkabelung");
        this.rampe = ausstattung.getElementValue("rampe");
        this.hebebuehne = ausstattung.getElementValue("hebebuehne");
        this.kran = ausstattung.getElementValue("kran");
        this.gastterrasse = ausstattung.getElementValue("gastterrasse");
        this.stromanschlusswert = ausstattung.getElementValue(
            "stromanschlusswert");
        this.kantine_cafeteria = ausstattung.getElementValue(
            "kantine_cafeteria");
        this.teekueche = ausstattung.getElementValue("teekueche");
        this.hallenhoehe = ausstattung.getElementValue("hallenhoehe");
        this.angeschl_gastronomie = ausstattung.getElementValue(
            "angeschl_gastronomie");
        this.brauereibindung = ausstattung.getElementValue(
            "brauereibindung");
        this.sporteinrichtungen = ausstattung.getElementValue(
            "sporteinrichtungen");
        this.wellnessbereich = ausstattung.getElementValue(
            "wellnessbereich");
        this.serviceleistungen = ausstattung.getElementValue(
            "serviceleistungen");
        this.telefon_ferienimmobilie = ausstattung.getElementValue(
            "telefon_ferienimmobilie");
        this.breitband_zugang = ausstattung.getElementValue(
            "breitband_zugang");
        this.umts_empfang = ausstattung.getElementValue("umts_empfang");
        this.sicherheitstechnik = ausstattung.getElementValue(
            "sicherheitstechnik");
        this.unterkellert = ausstattung.getElementValue("unterkellert");
        this.abstellraum = ausstattung.getElementValue("abstellraum");
        this.fahrradraum = ausstattung.getElementValue("fahrradraum");
        this.rolladen = ausstattung.getElementValue("rolladen");
        this.dachform = ausstattung.getElementValue("dachform");
        this.bauweise = ausstattung.getElementValue("bauweise");
        this.ausbaustufe = ausstattung.getElementValue("ausbaustufe");
        this.energietyp = ausstattung.getElementValue("energietyp");
        this.bibliothek = ausstattung.getElementValue("bibliothek");
        this.dachboden = ausstattung.getElementValue("dachboden");
        this.gaestewc = ausstattung.getElementValue("gaestewc");
        this.kabelkanaele = ausstattung.getElementValue("kabelkanaele");
        this.seniorengerecht= ausstattung.getElementValue(
            "seniorengerecht");
        return this;
    },
    
    
    flaechen: function(flaechen) {
        this.wohnflaeche = flaechen.getElementValue("wohnflaeche");
        this.nutzflaeche = flaechen.getElementValue("nutzflaeche");
        this.gesamtflaeche = flaechen.getElementValue("gesamtflaeche");
        this.ladenflaeche = flaechen.getElementValue("ladenflaeche");
        this.lagerflaeche = flaechen.getElementValue("lagerflaeche");
        this.verkaufsflaeche = flaechen.getElementValue(
            "verkaufsflaeche");
        this.freiflaeche = flaechen.getElementValue("freiflaeche");
        this.bueroflaeche = flaechen.getElementValue("bueroflaeche");
        this.bueroteilflaeche = flaechen.getElementValue(
            "bueroteilflaeche");
        this.fensterfront = flaechen.getElementValue("fensterfront");
        this.verwaltungsflaeche = flaechen.getElementValue(
            "verwaltungsflaeche");
        this.gastroflaeche = flaechen.getElementValue("gastroflaeche");
        this.grz = flaechen.getElementValue("grz");
        this.gfz = flaechen.getElementValue("gfz");
        this.bmz = flaechen.getElementValue("bmz");
        this.bgf = flaechen.getElementValue("bgf");
        this.grundstuecksflaeche = flaechen.getElementValue(
            "grundstuecksflaeche");
        this.sonstflaeche = flaechen.getElementValue("sonstflaeche");
        this.anzahl_zimmer = flaechen.getElementValue("anzahl_zimmer");
        this.anzahl_schlafzimmer = flaechen.getElementValue(
            "anzahl_schlafzimmer");
        this.anzahl_badezimmer = flaechen.getElementValue(
            "anzahl_badezimmer");
        this.anzahl_sep_wc = flaechen.getElementValue("anzahl_sep_wc");
        this.anzahl_balkone = flaechen.getElementValue("anzahl_balkone");
        this.anzahl_terrassen = flaechen.getElementValue(
            "anzahl_terrassen");
        this.anzahl_logia = flaechen.getElementValue("anzahl_logia");
        this.balkon_terrasse_flaeche = flaechen.getElementValue(
            "balkon_terrasse_flaeche");
        this.anzahl_wohn_schlafzimmer = flaechen.getElementValue(
            "anzahl_wohn_schlafzimmer");
        this.gartenflaeche = flaechen.getElementValue("gartenflaeche");
        this.kellerflaeche = flaechen.getElementValue("kellerflaeche");
        this.fensterfront_qm = flaechen.getElementValue(
            "fensterfront_qm");
        this.grundstuecksfront = flaechen.getElementValue(
            "grundstuecksfront");
        this.dachbodenflaeche = flaechen.getElementValue(
            "dachbodenflaeche");
        this.teilbar_ab = flaechen.getElementValue("teilbar_ab");
        this.beheizbare_flaeche = flaechen.getElementValue(
            "beheizbare_flaeche");
        this.anzahl_stellplaetze = flaechen.getElementValue(
            "anzahl_stellplaetze");
        this.plaetze_gastraum = flaechen.getElementValue(
            "plaetze_gastraum");
        this.anzahl_betten = flaechen.getElementValue("anzahl_betten");
        this.anzahl_tagungsraeume = flaechen.getElementValue(
            "anzahl_tagungsraeume");
        this.vermietbare_flaeche = flaechen.getElementValue(
            "vermietbare_flaeche");
        this.anzahl_wohneinheiten = flaechen.getElementValue(
            "anzahl_wohneinheiten");
        this.anzahl_gewerbeeinheiten = flaechen.getElementValue(
            "anzahl_gewerbeeinheiten");
        this.einliegerwohnung = flaechen.getElementValue(
            "einliegerwohnung");
        this.kubatur = flaechen.getElementValue("kubatur");
        this.ausnuetzungsziffer = flaechen.getElementValue(
            "ausnuetzungsziffer");
        this.flaechevon = flaechen.getElementValue("flaechevon");
        this.flaechebis = flaechen.getElementValue("flaechebis");
        return this;
    },
    
    
    preise: function(preise) {
        this.kaufpreis = preise.getElementValue("kaufpreis");
        this.kaufpreisnetto = preise.getElementValue("kaufpreisnetto");
        this.kaufpreisbrutto = preise.getElementValue("kaufpreisbrutto");
        this.nettokaltmiete = preise.getElementValue("nettokaltmiete");
        this.kaltmiete = preise.getElementValue("kaltmiete");
        this.warmmiete = preise.getElementValue("warmmiete");
        this.nebenkosten = preise.getElementValue("nebenkosten");
        this.heizkosten_enthalten = preise.getElementValue(
            "heizkosten_enthalten");
        this.heizkosten = preise.getElementValue("heizkosten");
        this.zzg_mehrwertsteuer = preise.getElementValue(
            "zzg_mehrwertsteuer");
        this.mietzuschlaege = preise.getElementValue("mietzuschlaege");
        this.hauptmietzinsnetto = preise.getElementValue(
            "hauptmietzinsnetto");
        this.pauschalmiete = preise.getElementValue("pauschalmiete");
        this.betriebskostennetto = preise.getElementValue(
            "betriebskostennetto");
        this.evbnetto = preise.getElementValue("evbnetto");
        this.gesamtmietenetto = preise.getElementValue(
            "gesamtmietenetto");
        this.gesamtmietebrutto = preise.getElementValue(
            "gesamtmietebrutto");
        this.gesamtbelastungnetto = preise.getElementValue(
            "gesamtbelastungnetto");
        this.gesamtbelastungbrutto = preise.getElementValue(
            "gesamtbelastungbrutto");
        this.gesamtkostenprom2von = preise.getElementValue(
            "gesamtkostenprom2von");
        this.heizkostennetto = preise.getElementValue("heizkostennetto");
        this.monatlichekostennetto = preise.getElementValue(
            "monatlichekostennetto");
        this.monatlichekostenbrutto = preise.getElementValue(
            "monatlichekostenbrutto");
        this.nebenkostenprom2von = preise.getElementValue(
            "nebenkostenprom2von");
        this.ruecklagenetto = preise.getElementValue("ruecklagenetto");
        this.sonstigekostennetto = preise.getElementValue(
            "sonstigekostennetto");
        this.sonstigemietenetto = preise.getElementValue(
            "sonstigemietenetto");
        this.nettomieteprom2von = preise.getElementValue(
            "nettomieteprom2von");
        this.pacht = preise.getElementValue("pacht");
        this.erbpacht = preise.getElementValue("erbpacht");
        this.hausgeld = preise.getElementValue("hausgeld");
        this.abstand = preise.getElementValue("abstand");
        this.preis_zeitraum_von = preise.getElementValue(
            "preis_zeitraum_von");
        this.preis_zeitraum_bis = preise.getElementValue(
            "preis_zeitraum_bis");
        this.preis_zeiteinheit = preise.getElementValue(
            "preis_zeiteinheit");
        this.mietpreis_pro_qm = preise.getElementValue(
            "mietpreis_pro_qm");
        this.kaufpreis_pro_qm = preise.getElementValue(
            "kaufpreis_pro_qm");
        this.provisionspflichtig = preise.getElementValue(
            "provisionspflichtig");
        this.provision_teilen = preise.getElementValue("provision_teilen");
        this.innen_courtage = preise.getElementValue("innen_courtage");
        this.aussen_courtage = preise.getElementValue("aussen_courtage");
        this.courtage_hinweis = preise.getElementValue(
            "courtage_hinweis");
        this.provisionnetto = preise.getElementValue("provisionnetto");
        this.provisionbrutto = preise.getElementValue("provisionbrutto");
        this.waehrung = preise.getElementValue("waehrung");
        this.mwst_satz = preise.getElementValue("mwst_satz");
        this.mwst_gesamt = preise.getElementValue("mwst_gesamt");
        this.freitext_preis = preise.getElementValue("freitext_preis");
        this.x_fache = preise.getElementValue("x_fache");
        this.nettorendite = preise.getElementValue("nettorendite");
        this.nettorendite_soll = preise.getElementValue(
            "nettorendite_soll");
        this.nettorendite_ist = preise.getElementValue(
            "nettorendite_ist");
        this.mieteinnahmen_ist = preise.getElementValue(
            "mieteinnahmen_ist");
        this.mieteinnahmen_soll = preise.getElementValue(
            "mieteinnahmen_soll");
        this.erschliessungskosten = preise.getElementValue(
            "erschliessungskosten");
        this.kaution = preise.getElementValue("kaution");
        this.kaution_text = preise.getElementValue("kaution_text");
        this.geschaeftsguthaben = preise.getElementValue(
            "geschaeftsguthaben");
        this.stp_carport = preise.getElementValue("stp_carport");
        this.stp_duplex = preise.getElementValue("stp_duplex");
        this.stp_freiplatz = preise.getElementValue("stp_freiplatz");
        this.stp_garage = preise.getElementValue("stp_garage");
        this.stp_parkhaus = preise.getElementValue("stp_parkhaus");
        this.stp_tiefgarage = preise.getElementValue("stp_tiefgarage");
        this.stp_sonstige = preise.getElementValue("stp_sonstige");
        this.richtpreis = preise.getElementValue("richtpreis");
        this.richtpreisprom2 = preise.getElementValue("richtpreisprom2");
        return this;
    },
    
    
    kontaktperson: function(kontaktperson) {
        this.email_zentrale = kontaktperson.getElementValue(
            "email_zentrale");
        this.email_direkt = kontaktperson.getElementValue("email_direkt");
        this.tel_zentrale = kontaktperson.getElementValue("tel_zentrale");
        this.tel_durchw = kontaktperson.getElementValue("tel_durchw");
        this.tel_fax = kontaktperson.getElementValue("tel_fax");
        this.tel_handy = kontaktperson.getElementValue("tel_handy");
        this.name = kontaktperson.getElementValue("name");
        this.vorname = kontaktperson.getElementValue("vorname");
        this.titel = kontaktperson.getElementValue("titel");
        this.anrede = kontaktperson.getElementValue("anrede");
        this.position = kontaktperson.getElementValue("position");
        this.anrede_brief = kontaktperson.getElementValue("anrede_brief");
        this.firma = kontaktperson.getElementValue("firma");
        this.zusatzfeld = kontaktperson.getElementValue("zusatzfeld");
        this.strasse = kontaktperson.getElementValue("strasse");
        this.hausnummer = kontaktperson.getElementValue("hausnummer");
        this.plz = kontaktperson.getElementValue("plz");
        this.ort = kontaktperson.getElementValue("ort");
        this.postfach = kontaktperson.getElementValue("postfach");
        this.postf_plz = kontaktperson.getElementValue("postf_plz");
        this.postf_ort = kontaktperson.getElementValue("postf_ort");
        this.land = kontaktperson.getElementValue("land");
        this.email_privat = kontaktperson.getElementValue("email_privat");
        this.email_sonstige = kontaktperson.getElementValue(
            "email_sonstige");
        this.email_feedback = kontaktperson.getElementValue(
            "email_feedback");
        this.tel_privat = kontaktperson.getElementValue("tel_privat");
        this.tel_sonstige = kontaktperson.getElementValue("tel_sonstige");
        this.url = kontaktperson.getElementValue("url");
        this.adressfreigabe = kontaktperson.getElementValue(
            "adressfreigabe");
        this.personennummer = kontaktperson.getElementValue(
            "personennummer");
        this.immobilientreuhaenderid = kontaktperson.getElementValue(
            "immobilientreuhaenderid");
        this.foto = kontaktperson.getElementValue("foto");
        this.freitextfeld = kontaktperson.getElementValue("freitextfeld");
        return this;
    },
    
    
    geo: function(geo) {
        this.strasse = geo.getElementValue("strasse");
        this.hausnummer = geo.getElementValue("hausnummer");
        this.bundesland = geo.getElementValue("bundesland");
        this.land = geo.getElementValue("land");
        this.gemeindecode = geo.getElementValue("gemeindecode");
        this.flur = geo.getElementValue("flur");
        this.flurstueck = geo.getElementValue("flurstueck");
        this.gemarkung = geo.getElementValue("gemarkung");
        this.etage = geo.getElementValue("etage");
        this.anzahl_etagen = geo.getElementValue("anzahl_etagen");
        this.lage_im_bau = geo.getElementValue("lage_im_bau");
        this.wohnungsnr = geo.getElementValue("wohnungsnr");
        this.lage_gebiet = geo.getElementValue("lage_gebiet");
        this.regionaler_zusatz = geo.getElementValue("regionaler_zusatz");
        this.karten_makro = geo.getElementValue("karten_makro");
        this.karten_mikro = geo.getElementValue("karten_mikro");
        this.virtuelletour = geo.getElementValue("virtuelletour");
        this.luftbildern = geo.getElementValue("luftbildern");
        return this;
    },
    
    
    nutzungsart: function(nutzungsart) {
        this.WOHNEN = nutzungsart.getElementValue("WOHNEN");
        this.GEWERBE = nutzungsart.getElementValue("GEWERBE");
        this.ANLAGE = nutzungsart.getElementValue("ANLAGE");
        this.WAZ = nutzungsart.getElementValue("WAZ");
        return this;
    },
    
    
    vermarktungsart: function(vermarktungsart) {
        this.KAUF = vermarktungsart.getElementValue("KAUF");
        this.MIETE_PACHT = vermarktungsart.getElementValue("MIETE_PACHT");
        this.ERBPACHT = vermarktungsart.getElementValue("ERBPACHT");
        this.LEASING = vermarktungsart.getElementValue("LEASING");
        return this;
    },
    
    
    objektart: function(objektart) {
        // TODO: Implement object types...
        return this;
    },
    
    
    objektkategorie: function(objektkategorie) {
        var nutzungsart = objektkategorie.getElement("nutzungsart");
        if (nutzungsart) {
            this.nutzungsart = openimmo.nutzungsart(nutzungsart);
        } else {
            this.nutzungsart = null;
        }
        var vermarktungsart = objektkategorie.getElement(
            "vermarktungsart");
        if (vermarktungsart) {
            this.vermarktungsart = openimmo.vermarktungsart(vermarktungsart);
        } else {
            this.vermarktungsart = null;
        }
        var objektart = objektkategorie.getElement("objektart");
        if (objektart) {
            this.objektart = openimmo.objektart(objektart);
        } else {
            this.objektart = null;
        }
        return this;
    },
    
    
    energiepass: function(energiepass) {
        this.epart = energiepass.getElementValue("epart");
        this.gueltig_bis = energiepass.getElementValue("gueltig_bis");
        this.energieverbrauchkennwert = energiepass.getElementValue(
            "energieverbrauchkennwert");
        this.mitwarmwasser = energiepass.getElementValue("mitwarmwasser");
        this.endenergiebedarf = energiepass.getElementValue(
            "endenergiebedarf");
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
    },
    
    
    zustand_angaben: function(zustand_angaben) {
        function _energiepass() {
            var energiepass_ = zustand_angaben.getElements("energiepass");
            var result = [];
            for (var i = 0; i < energiepass_.length; i++) {
                result.push(openimmo.Energiepass(energiepass_[i]));
            }
            return result;
        }
        
        this.baujahr = zustand_angaben.getElementValue("baujahr");
        this.letztemodernisierung = zustand_angaben.getElementValue(
            "letztemodernisierung");
        var zustand = zustand_angaben.getElement("zustand");
        if (zustand) {
            this.zustand = zustand.getAttribute("zustand_art");
        } else{
            this.zustand = null; 
        }
        
        this.alter = zustand_angaben.getElementValue("alter");
        var bebaubar_nach = zustand_angaben.getElement("bebaubar_nach");
        if (bebaubar_nach) {
            this.bebaubar_nach = bebaubar_nach.getAttribute("bebaubar_attr");
        } else {
            this.bebaubar_nach = null;
        }
        var erschliessung = zustand_angaben.getElement("erschliessung");
        if (erschliessung) {
            this.erschliessung = erschliessung.getAttribute("erschl_attr");
        } else {
            this.erschliessung = null;
        }    
        var erschliessung_umfang = zustand_angaben.getElement(
            "erschliessung_umfang");
        if (erschliessung_umfang) {
            this.erschliessung_umfang = erschliessung_umfang.getAttribute(
                "erschl_attr");
        } else {
            this.erschliessung_umfang = null;
        }    
        this.bauzone = zustand_angaben.getElementValue("bauzone");
        this.altlasten = zustand_angaben.getElementValue("altlasten");
        this.energiepass = _energiepass();
        var verkaufstatus = zustand_angaben.getElementValue("verkaufstatus");
        if (verkaufstatus) {
            this.verkaufstatus = verkaufstatus.getAttribute("stand");
        } else {
            this.verkaufstatus = null;
        }
        return this;
    },
    
    
    freitexte: function(freitexte) {
        this.objekttitel = freitexte.getElementValue("objekttitel");
        this.dreizeiler = freitexte.getElementValue("dreizeiler");
        this.lage = freitexte.getElementValue("lage");
        this.ausstatt_beschr = freitexte.getElementValue("ausstatt_beschr");
        this.objektbeschreibung = freitexte.getElementValue(
            "objektbeschreibung");
        this.sonstige_angaben = freitexte.getElementValue("sonstige_angaben");
        this.objekt_text = freitexte.getElementValue("objekt_text");
        return this;
    },
    
    
    verwaltung_objekt: function(verwaltung_objekt) {
        this.objektadresse_freigeben = verwaltung_objekt.getElementValue(
            "objektadresse_freigeben");
        this.verfuegbar_ab = verwaltung_objekt.getElementValue(
            "verfuegbar_ab");
        this.abdatum = verwaltung_objekt.getElementValue("abdatum");
        this.bisdatum = verwaltung_objekt.getElementValue("bisdatum");
        this.min_mietdauer = verwaltung_objekt.getElementValue(
            "min_mietdauer");
        this.max_mietdauer = verwaltung_objekt.getElementValue(
            "max_mietdauer");
        this.versteigerungstermin = verwaltung_objekt.getElementValue(
            "versteigerungstermin");
        this.wbs_sozialwohnung = verwaltung_objekt.getElementValue(
            "wbs_sozialwohnung");
        this.vermietet = verwaltung_objekt.getElementValue("vermietet");
        this.gruppennummer = verwaltung_objekt.getElementValue(
            "gruppennummer");
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
    },
    
    
    daten: function(daten) {
        this.pfad = daten.getElementValue("pfad");
        this.anhanginhalt = daten.getElementValue("anhanginhalt");
        return this;
    },
    
    
    
    anhang: function(anhang) {
        this.anhangtitel = anhang.getElementValue("anhangtitel");
        this.format = anhang.getElementValue("format");
        this.check = anhang.getElementValue("check");
        var daten = anhang.getElement("daten");
        if (daten) {
            this.daten = openimmo.daten(daten);
        } else {
            this.daten = null;
        }
        this.location = anhang.getElementValue("location");
        this.gruppe = anhang.getElementValue("gruppe");
        return this;
    },
    
    
    verwaltung_techn: function(verwaltung_techn){
        this.objektnr_intern = verwaltung_techn.getElementValue(
            "objektnr_intern");
        this.objektnr_extern = verwaltung_techn.getElementValue(
            "objektnr_extern");
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
        this.gruppen_kennung = verwaltung_techn.getElementValue(
            "gruppen_kennung");
        this.master = verwaltung_techn.getElementValue("master");
        this.sprache = verwaltung_techn.getElementValue("sprache");
        return this;
    },
    
    
    immobilie: function(immobilie) {
        function _anhaenge() {
            var result = [];
            var anhaenge = immobilie.getElement("anhaenge");
            if (anhaenge != null) {
                var anhang = anhaenge.getElements("anhang");
                for (var i = 0; i < anhang.length; i++) {
                    result.push(openimmo.Anhang(anhang[i]));
                }
            }
            return result;
        }
        var objektkategorie = immobilie.getElement("objektkategorie");
        if (objektkategorie) {
            this.objektkategorie = openimmo.objektkategorie(objektkategorie);
        } else {
            this.objektkategorie = null;
        }   
        var geo = immobilie.getElement("geo");
        if (geo) {
            this.geo = openimmo.geo(geo);
        } else {
            this.geo = null;
        }
        var kontaktperson = immobilie.getElement("kontaktperson");
        if (kontaktperson) {
            this.kontaktperson = openimmo.kontaktperson(kontaktperson);
        } else {
            this.kontaktperson = null;
        }
        var preise = immobilie.getElement("preise");
        if (preise) {
            this.preise = openimmo.preise(preise);
        } else {
            this.preise = null;
        }
        var flaechen = immobilie.getElement("flaechen");
        if (flaechen) {
            this.flaechen = openimmo.flaechen(flaechen);
        } else {
            this.flaechen = null;
        }
        var ausstattung = immobilie.getElement("ausstattung");
        if (ausstattung) {
            this.ausstattung = openimmo.ausstattung(ausstattung);
        } else {
            this.ausstattung = null;
        }
        var zustand_angaben = immobilie.getElement("zustand_angaben");
        if (zustand_angaben) {
            this.zustand_angaben = openimmo.zustand_angaben(zustand_angaben);
        } else {
            this.zustand_angaben = null;
        }
        var freitexte = immobilie.getElement("freitexte");
        if (freitexte) {
            this.freitexte = openimmo.freitexte(freitexte);
        } else {
            this.freitexte = null;
        }
        this.anhaenge = _anhaenge();
        var verwaltung_objekt = immobilie.getElement("verwaltung_objekt");
        if (verwaltung_objekt) {
            this.verwaltung_objekt = openimmo.verwaltung_objekt(
                verwaltung_objekt);
        } else {
            this.verwaltung_objekt = null;
        }
        var verwaltung_techn = immobilie.getElement("verwaltung_techn");
        if (verwaltung_techn) {
            this.verwaltung_techn = openimmo.verwaltung_techn(verwaltung_techn);
        } else {
            this.verwaltung_techn = null;
        }
        return this;
    },
    
    
    anbieter: function(anbieter) {
        function _immobilie() {
            var result = [];
            var immobilie_ = anbieter.getElementsByTagName("immobilie");
            for (var i = 0; i < immobilie_.length; i++) {
                result.push(openimmo.immobilie(immobilie_[i]));
            }
            return result;
        }
    
        this.anbieternr = anbieter.getElementValue("anbieternr");
        this.firma = anbieter.getElementValue("firma");
        this.openimmo_anid = anbieter.getElementValue("openimmo_anid");
        this.immobilie = _immobilie();
        return this;
    },
    

    uebertragung: function(uebertragung) {
        this.art = verwaltung_techn.getElementValue("art");
        this.umfang = verwaltung_techn.getElementValue("umfang");
        this.modus = verwaltung_techn.getElementValue("modus");
        this.version = verwaltung_techn.getElementValue("version");
        this.sendersoftware = verwaltung_techn.getElementValue("sendersoftware");
        this.senderversion = verwaltung_techn.getElementValue("senderversion");
        this.techn_email = verwaltung_techn.getElementValue("techn_email");
        this.regi_id = verwaltung_techn.getElementValue("regi_id");
        this.timestamp = verwaltung_techn.getElementValue("timestamp");
        return this;
    },
    
    
    openimmo: function(openimmo) {
        function _anbieter() {
            var result = [];
            var anbieter_ = openimmo.getElementsByTagName("anbieter");
            for (var i = 0; i < anbieter_.length; i++) {
                result.push(openimmo.anbieter(anbieter_[i]));
            }
            return result;
        }

        this.uebertragung = openimmo.getElement("uebertragung");
        this.anbieter = _anbieter();
        return this;
    }    
}