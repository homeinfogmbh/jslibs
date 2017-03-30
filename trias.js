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


trias.trias = function (serviceRequest) {
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

trias.siriElement = function (name) {
  return document.createElementNS('http://www.siri.org.uk/siri', 'siri:' + name);
}

trias.requestTimestamp = function (datetime) {
  var requestTimestamp = trias.siriElement('RequestTimestamp');
  requestTimestamp.textContent = trias.timestamp(datetime);
  return requestTimestamp;
}

trias.requestorRef = function (requestor) {
  var requestorRef = trias.siriElement('RequestorRef');
  requestorRef.textContent = requestor;
  return requestorRef;
}

trias.requestPayload = function (content) {
  var requestPayload = document.createElementNS('trias', 'RequestPayload');

  if (content != null) {
    requestPayload.appendChild(content);
  }

  return requestPayload;
}

trias.serviceRequest = function (requestTimestamp, requestorRef, payload) {
  var serviceRequest = document.createElementNS('trias', 'ServiceRequest');
  serviceRequest.appendChild(requestTimestamp);
  serviceRequest.appendChild(requestorRef);

  if (payload != null) {
    serviceRequest.appendChild(payload);
  }

  return serviceRequest;
}

trias.locationName = function (name) {
  var locationName = document.createElementNS('trias', 'LocationName');
  locationName.textContent = name;
  return locationName;
}

trias.initialInput = function (locationName) {
  var initialInput = document.createElementNS('trias', 'InitialInput');

  if (locationName != null) {
    initialInput.appendChild(trias.locationName(locationName));
  }

  return initialInput;
}

trias.type = function (name) {
  var type = document.createElementNS('trias', 'Type');

  if (name == null) {
    name = 'address';
  }

  type.textContent = name;
  return type;
}

trias.language = function (name) {
  var language = document.createElementNS('trias', 'Language');

  if (name == null) {
    name = 'de';
  }

  language.textContent = name;
  return language;
}

trias.numberOfResults = function (number) {
  var numberOfResults = document.createElementNS('trias', 'NumberOfResults');

  if (number == null) {
    number = 1;
  }

  numberOfResults.textContent = number;
  return numberOfResults;
}

trias.restrictions = function (type, language, numberOfResults) {
  var restrictions = document.createElementNS('trias', 'Restrictions');
  restrictions.appendChild(trias.type(type));
  restrictions.appendChild(trias.language(language));
  restrictions.appendChild(trias.numberOfResults(numberOfResults));
  return restrictions;
}

trias.locationInformationRequest = function (initialInput, restrictions) {
  var locationInformationRequest = document.createElementNS('trias', 'LocationInformationRequest');

  if (initialInput != null) {
    locationInformationRequest.appendChild(initialInput);
  }

  if (restrictions != null) {
    locationInformationRequest.appendChild(restrictions);
  }

  return locationInformationRequest;
}


trias.TriasClient = function (url, requestorRef) {
  this.url = url;
  this.requestorRef = requestorRef;

  this.getLocation = function (locationName) {
    var url = this.url;
    var initialInput = trias.initialInput(locationName);
    var restrictions = trias.restrictions();
    var locationInformationRequest = trias.locationInformationRequest(initialInput, restrictions);
    var requestPayload = trias.requestPayload(locationInformationRequest);
    var serviceRequest = trias.serviceRequest(
      trias.requestTimestamp(),
      trias.requestorRef(this.requestorRef),
      requestPayload);
    var xmlDoc = trias.trias(serviceRequest);
    var xmlText = trias.xmlSerializer.serializeToString(xmlDoc);
    console.log('Query:\n' + xmlText);

    $.ajax({
      url: url,
      type: 'POST',
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
