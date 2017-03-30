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


trias.triasElement = function (name) {
  return document.createElementNS('trias', name);
}


trias.requestTimestamp = function (datetime) {
  var requestTimestamp = trias.siriElement('RequestTimestamp');

  if (datetime == null) {
    datetime = new Date();
  }

  requestTimestamp.textContent = datetime.toISOString();
  return requestTimestamp;
}


trias.requestorRef = function (requestor) {
  var requestorRef = trias.siriElement('RequestorRef');
  requestorRef.textContent = requestor;
  return requestorRef;
}


trias.requestPayload = function (content) {
  var requestPayload = trias.triasElement('RequestPayload');

  if (content != null) {
    requestPayload.appendChild(content);
  }

  return requestPayload;
}


trias.serviceRequest = function (requestTimestamp, requestorRef, payload) {
  var serviceRequest = trias.triasElement('ServiceRequest');
  serviceRequest.appendChild(requestTimestamp);
  serviceRequest.appendChild(requestorRef);

  if (payload != null) {
    serviceRequest.appendChild(payload);
  }

  return serviceRequest;
}


trias.text = function (value) {
  var text = trias.triasElement('Text');
  text.textContent = value;
  return text;
}


trias.locationName = function (text) {
  var locationName = trias.triasElement('LocationName');

  if (typeof(text) == 'string') {
    locationName.textContent = text;
  } else {
    locationName.appendChild(text);
  }

  return locationName;
}


trias.initialInput = function (content) {
  var initialInput = trias.triasElement('InitialInput');

  if (content != null) {
    initialInput.appendChild(content);
  }

  return initialInput;
}


trias.type = function (name) {
  var type = trias.triasElement('Type');

  if (name == null) {
    name = 'address';
  }

  type.textContent = name;
  return type;
}


trias.language = function (name) {
  var language = trias.triasElement('Language');

  if (name == null) {
    name = 'de';
  }

  language.textContent = name;
  return language;
}


trias.numberOfResults = function (number) {
  var numberOfResults = trias.triasElement('NumberOfResults');

  if (number == null) {
    number = 1;
  }

  numberOfResults.textContent = number;
  return numberOfResults;
}


trias.restrictions = function (type, language, numberOfResults) {
  var restrictions = trias.triasElement('Restrictions');
  restrictions.appendChild(type);
  restrictions.appendChild(language);
  restrictions.appendChild(numberOfResults);
  return restrictions;
}


trias.locationInformationRequest = function (initialInput, restrictions) {
  var locationInformationRequest = trias.triasElement('LocationInformationRequest');

  if (initialInput != null) {
    locationInformationRequest.appendChild(initialInput);
  }

  if (restrictions != null) {
    locationInformationRequest.appendChild(restrictions);
  }

  return locationInformationRequest;
}


trias.longitude = function (value) {
  var longitude = trias.triasElement('Longitude');
  longitude.textContent = value;
  return longitude;
}


trias.latitude = function (value) {
  var latitude = trias.triasElement('Latitude');
  latitude.textContent = value;
  return latitude;
}


trias.center = function (longitude, latitude) {
  var center = trias.triasElement('Center');
  center.appendChild(longitude);
  center.appendChild(latitude);
  return center;
}


trias.radius = function (value) {
  var radius = trias.triasElement('Radius');
  radius.textContent = value;
  return radius;
}


trias.circle = function (center, radius) {
  var circle = trias.triasElement('Circle');
  circle.appendChild(center);
  circle.appendChild(radius);
  return circle;
}


trias.geoRestriction = function (circle) {
  var geoRestriction = trias.triasElement('GeoRestriction');
  geoRestriction.appendChild(circle);
  return geoRestriction;
}


trias.stopPointRef = function (value) {
  var stopPointRef = trias.triasElement('StopPointRef');
  stopPointRef.textContent = value;
  return stopPointRef;
}


trias.locationRef = function (stopPointRef, locationName) {
  var locationRef = trias.triasElement('LocationRef');
  locationRef.appendChild(stopPointRef);
  locationRef.appendChild(locationName);
  return locationRef;
}


trias.location = function (locationRef) {
  var location = trias.triasElement('Location');
  location.appendChild(locationRef);
  return location;
}


trias.stopEventRequest = function (location) {
  var stopEventRequest = trias.triasElement('StopEventRequest');
  stopEventRequest.appendChild(location);
  return stopEventRequest;
}


trias.TriasClient = function (url, requestorRef) {
  this.url = url || 'https://tls.homeinfo.de/trias';
  this.requestorRef = requestorRef || 'homeinfo.de';

  this.query = function (xmlDoc, callback) {
    var url = this.url;
    var xmlText = trias.xmlSerializer.serializeToString(xmlDoc);
    trias.logger.debug('Sending:\n' + xmlText);

    $.ajax({
      url: url,
      type: 'POST',
      data: xmlText,
      success: function (xml) {
        trias.logger.success('API query succeeded');
        trias.logger.debug('Received:\n' + trias.xmlSerializer.serializeToString(xml));

        if (callback != null) {
          callback(xml);
        }
      },
      error: function() {
        swal({
          title: 'Fehler.',
          text: 'Konnte Daten nicht von API abfragen.',
          type: 'error'
        });
      }
    });
  }

  this.getLocation = function (locationName, callback) {
    var xmlDoc = trias.trias(
      trias.serviceRequest(
        trias.requestTimestamp(),
        trias.requestorRef(this.requestorRef),
        trias.requestPayload(
          trias.locationInformationRequest(
            trias.initialInput(trias.locationName(locationName)),
            trias.restrictions(
              trias.type('address'),
              trias.language(),
              trias.numberOfResults(1)
            )
          )
        )
      )
    );
    this.query(xmlDoc, callback);
  }

  this.getStops = function (longitude, latitude, radius, results, callback) {
    var xmlDoc = trias.trias(
      trias.serviceRequest(
        trias.requestTimestamp(),
        trias.requestorRef(this.requestorRef),
        trias.requestPayload(
          trias.locationInformationRequest(
            trias.initialInput(
              trias.geoRestriction(
                trias.circle(
                  trias.center(
                    trias.longitude(longitude),
                    trias.latitude(latitude)
                  ),
                  trias.radius(radius)
                )
              )
            ),
            trias.restrictions(
              trias.type('stop'),
              trias.language(),
              trias.numberOfResults(results)
            )
          )
        )
      )
    );
    this.query(xmlDoc, callback);
  }

  this.getStopEvents = function (stopPointRef, callback) {
    var xmlDoc = trias.trias(
      trias.serviceRequest(
        trias.requestTimestamp(),
        trias.requestorRef(this.requestorRef),
        trias.requestPayload(
          trias.stopEventRequest(
            trias.location(
              trias.locationRef(
                trias.stopPointRef(stopPointRef),
                trias.locationName(trias.text())
              )
            )
          )
        )
      )
    );
    this.query(xmlDoc, callback);
  }
}


trias.StopEvents = function (locationName, radius, results) {
  this.locationName = locationName;
  this.radius = radius;
  this.results = results;
  this.client = new trias.TriasClient();

  this.render = function (elements) {
    var this_ = this;
    var stops = {};

    function renderCallback() {
      var text = '';

      for (var stopPointName in stops) {
        if (stops.hasOwnProperty(stopPointName)) {
          var stopEvents = stops[stopPointName];
          var stopDesc = '<h1>' + stopPointName + '</h1>';

          for (var i = 0; i < stopEvents.length; i++) {
            var stopEvent = stopEvents[i];
            var stopEventText = '  <li>Linie ' + stopEvent.line
              + ' nach ' + stopEvent.destination
              + ' um ' + stopEvent.timetabledTime;

            if (stopEvent.estimatedTime != null) {
              stopEventText += ' heute voraussichtlich um ' + stopEvent.estimatedTime + '.';
            } else {
              stopEventText += '.';
            }

            stopEventText += '\n  </li>';
            stopDesc += '\n<ul>\n' + stopEventText + '\n</ul>\n';
          }

          text += stopDesc + '\n\n';
        }
      }

      $('#result').html(text);
    }

    function stopEventCallback(xml) {
      var stopEventResults = xml.getElementsByTagName("StopEventResult");

      for (var i = 0; i < stopEventResults.length; i++) {
        var stopEventResult = stopEventResults[i];
        var stopPointName = stopEventResult.getElementsByTagName('StopPointName')[0]
          .getElementsByTagName('Text')[0].textContent;
        trias.logger.debug('Got stop point: ' + stopPointName);
        var estimatedTimes = stopEventResult.getElementsByTagName('EstimatedTime');
        var stop = {
          timetabledTime: stopEventResult.getElementsByTagName('TimetabledTime')[0].textContent,
          estimatedTime: estimatedTimes.length > 0 ? estimatedTimes[0].textContent : null,
          line: stopEventResult.getElementsByTagName('PublishedLineName')[0]
            .getElementsByTagName('Text')[0].textContent,
          destination: stopEventResult.getElementsByTagName('DestinationText')[0]
            .getElementsByTagName('Text')[0].textContent
        };

        if (stopPointName in stops) {
          stops[stopPointName].push(stop);
        } else {
          stops[stopPointName] = [stop];
        }
      }

      renderCallback();
    }

    function stopsCallback(xml) {
      var stopPointRefs = [];
      var stopPointRefNodes = xml.getElementsByTagName("StopPointRef");

      for (var i = 0; i < stopPointRefNodes.length; i++) {
        var stopPointRef = stopPointRefNodes[i].textContent
        trias.logger.debug('Got StopPointRef: ' + stopPointRef);
        this_.client.getStopEvents(stopPointRef, stopEventCallback);
      }
    }

    function locationCallback(xml) {
      var longitude = xml.getElementsByTagName("Longitude")[0].textContent;
      trias.logger.debug('Longitude: ' + longitude);
      var latitude = xml.getElementsByTagName("Latitude")[0].textContent;
      trias.logger.debug('Latitude: ' + latitude);
      this_.client.getStops(longitude, latitude, this_.radius, this_.results, stopsCallback);
    }

    this.client.getLocation(this.locationName, locationCallback);
  }
}
