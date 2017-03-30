/*
  trias.js - JavaScript library for the Trias API

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
"use strict"

var trias = trias || {};


// Logger
trias.logger = new homeinfo.logging.Logger('trias', homeinfo.logging.DEBUG);


// Configuration
trias.config = {};


trias.xmlSerializer = new XMLSerializer();


trias.timestamp = function (datetime) {
  if (datetime == null) {
    datetime = new Date();
  }

  return datetime.getFullYear() + '-' + datetime.getMonth() + '-' + datetime.getDay() + 'T'
    + datetime.getHours() + ':' + datetime.getMinutes() + ':' + datetime.getSeconds();
}

trias.TriasClient = function (url, requestor) {
  this.url = url;
  this.requestor = requestor;

  this.trias = function (serviceRequest) {
    var xmlDoc = document.implementation.createDocument('trias', 'Trias');
    var root = xmlDoc.getElementsByTagName("Trias")[0];
    var version = xmlDoc.createAttribute('version');
    version.nodeValue = '1.0';
    root.setAttributeNode(version);

    if (serviceRequest != null) {
      root.appendChild(serviceRequest);
    }

    return xmlDoc;
  }

  this.siriElement = function (name) {
    return document.createElementNS('http://www.siri.org.uk/siri', 'siri:' + name);
  }

  this.requestTimestamp = function (datetime) {
    var requestTimestamp = this.siriElement('RequestTimestamp');
    requestTimestamp.textContent = trias.timestamp(datetime);
    return requestTimestamp;
  }

  this.requestorRef = function () {
    var requestorRef = this.siriElement('RequestorRef');
    requestorRef.textContent = this.requestor;
    return requestorRef;
  }

  this.requestPayload = function (content) {
    var requestPayload = document.createElementNS('trias', 'RequestPayload');

    if (content != null) {
      requestPayload.appendChild(content);
    }

    return requestPayload;
  }

  this.serviceRequest = function (payload) {
    var serviceRequest = document.createElementNS('trias', 'ServiceRequest');
    serviceRequest.appendChild(this.requestTimestamp());
    serviceRequest.appendChild(this.requestorRef());

    if (payload != null) {
      serviceRequest.appendChild(payload);
    }

    return serviceRequest;
  }

  this.locationName = function (name) {
    var locationName = document.createElementNS('trias', 'LocationName');
    locationName.textContent = name;
    return locationName;
  }

  this.initialInput = function (locationName) {
    var initialInput = document.createElementNS('trias', 'InitialInput');

    if (locationName != null) {
      initialInput.appendChild(this.locationName(locationName));
    }

    return initialInput;
  }

  this.type = function (name) {
    var type = document.createElementNS('trias', 'Type');

    if (name == null) {
      name = 'address';
    }

    type.textContent = name;
    return type;
  }

  this.language = function (name) {
    var language = document.createElementNS('trias', 'Language');

    if (name == null) {
      name = 'de';
    }

    language.textContent = name;
    return language;
  }

  this.numberOfResults = function (number) {
    var numberOfResults = document.createElementNS('trias', 'NumberOfResults');

    if (number == null) {
      number = 1;
    }

    numberOfResults.textContent = number;
    return numberOfResults;
  }

  this.restrictions = function (type, language, numberOfResults) {
    var restrictions = document.createElementNS('trias', 'Restrictions');
    restrictions.appendChild(this.type(type));
    restrictions.appendChild(this.language(language));
    restrictions.appendChild(this.numberOfResults(numberOfResults));
    return restrictions;
  }

  this.locationInformationRequest = function (initialInput, restrictions) {
    var locationInformationRequest = document.createElementNS('trias', 'LocationInformationRequest');

    if (initialInput != null) {
      locationInformationRequest.appendChild(initialInput);
    }

    if (restrictions != null) {
      locationInformationRequest.appendChild(restrictions);
    }

    return locationInformationRequest;
  }

  this.getLocation = function (locationName) {
    var self = this;
    var initialInput = this.initialInput(locationName);
    var restrictions = this.restrictions();
    var locationInformationRequest = this.locationInformationRequest(initialInput, restrictions);
    var requestPayload = this.requestPayload(locationInformationRequest);
    var serviceRequest = this.serviceRequest(requestPayload);
    var xmlDoc = this.trias(serviceRequest);
    var xmlText = trias.xmlSerializer.serializeToString(xmlDoc);
    console.log('Query:\n' + xmlText);

    $.ajax({
      url: self.url,
      method: 'POST',
      data: xmlText,
      success: function (xml) {
        console.log('Yay.');
        console.log('Response:\n' + trias.xmlSerializer.serializeToString(xml));
      },
      error: function(a, b, c) {
        swal({
          title: 'Fehler.',
          text: JSON.stringify(a) + '\n' + b + '\n' + c,
          type: 'error'
        });
      }
    });
  }
}
