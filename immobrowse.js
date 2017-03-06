/*
  immobrowse.js - ImmoBrowse main JavaScript library

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
    * sweetalert.js
*/

var immobrowse = immobrowse || {};

// Logger
immobrowse.logger = new homeinfo.logging.Logger('immobrowse', 40);


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
  return '<img src="' + url + '" alt="Titelbild" class="ib-preview-image">';
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

// Mailer class
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
