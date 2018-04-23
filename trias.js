/*
  trias.js - JavaScript library for the Trias API

  (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this library.  If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>

  Requires:
      * homeinfo.js
      * jquery.js
      * sweetalert.js
      * moment.js
*/
'use strict';

var trias = trias || {};
trias.logger = new homeinfo.logging.Logger('trias', homeinfo.logging.DEBUG);
trias.config = {};
trias.xmlSerializer = new XMLSerializer();


trias.trias = function (serviceRequest) {
    var xmlDoc = document.implementation.createDocument('trias', 'Trias', null);
    var root = xmlDoc.getElementsByTagName('Trias')[0];
    root.setAttribute('version', '1.0');

    if (serviceRequest != null) {
        root.appendChild(serviceRequest);
    }

    return xmlDoc;
};


trias.siriElement = function (name) {
    return document.createElementNS('http://www.siri.org.uk/siri', 'siri:' + name);
};


trias.triasElement = function (name) {
    return document.createElementNS('trias', name);
};


trias.requestTimestamp = function (datetime) {
    var requestTimestamp = trias.siriElement('RequestTimestamp');

    if (datetime == null) {
        datetime = new Date();
    }

    requestTimestamp.textContent = datetime.toISOString();
    return requestTimestamp;
};


trias.requestorRef = function (requestor) {
    var requestorRef = trias.siriElement('RequestorRef');
    requestorRef.textContent = requestor;
    return requestorRef;
};


trias.requestPayload = function (content) {
    var requestPayload = trias.triasElement('RequestPayload');

    if (content != null) {
        requestPayload.appendChild(content);
    }

    return requestPayload;
};


trias.serviceRequest = function (requestTimestamp, requestorRef, payload) {
    var serviceRequest = trias.triasElement('ServiceRequest');
    serviceRequest.appendChild(requestTimestamp);
    serviceRequest.appendChild(requestorRef);

    if (payload != null) {
        serviceRequest.appendChild(payload);
    }

    return serviceRequest;
};


trias.text = function (value) {
    var text = trias.triasElement('Text');
    text.textContent = value;
    return text;
};


trias.locationName = function (text) {
    var locationName = trias.triasElement('LocationName');

    if (typeof(text) == 'string') {
        locationName.textContent = text;
    } else {
        locationName.appendChild(text);
    }

    return locationName;
};


trias.initialInput = function (content) {
    var initialInput = trias.triasElement('InitialInput');

    if (content != null) {
        initialInput.appendChild(content);
    }

    return initialInput;
};


trias.type = function (name) {
    var type = trias.triasElement('Type');

    if (name == null) {
        name = 'address';
    }

    type.textContent = name;
    return type;
};


trias.language = function (name) {
    var language = trias.triasElement('Language');

    if (name == null) {
        name = 'de';
    }

    language.textContent = name;
    return language;
};


trias.numberOfResults = function (number) {
    var numberOfResults = trias.triasElement('NumberOfResults');

    if (number == null) {
        number = 1;
    }

    numberOfResults.textContent = number;
    return numberOfResults;
};


trias.restrictions = function (type, language, numberOfResults) {
    var restrictions = trias.triasElement('Restrictions');
    restrictions.appendChild(type);
    restrictions.appendChild(language);
    restrictions.appendChild(numberOfResults);
    return restrictions;
};


trias.locationInformationRequest = function (initialInput, restrictions) {
    var locationInformationRequest = trias.triasElement('LocationInformationRequest');

    if (initialInput != null) {
        locationInformationRequest.appendChild(initialInput);
    }

    if (restrictions != null) {
        locationInformationRequest.appendChild(restrictions);
    }

    return locationInformationRequest;
};


trias.longitude = function (value) {
    var longitude = trias.triasElement('Longitude');
    longitude.textContent = value;
    return longitude;
};


trias.latitude = function (value) {
    var latitude = trias.triasElement('Latitude');
    latitude.textContent = value;
    return latitude;
};


trias.center = function (longitude, latitude) {
    var center = trias.triasElement('Center');
    center.appendChild(longitude);
    center.appendChild(latitude);
    return center;
};


trias.radius = function (value) {
    var radius = trias.triasElement('Radius');
    radius.textContent = value;
    return radius;
};


trias.circle = function (center, radius) {
    var circle = trias.triasElement('Circle');
    circle.appendChild(center);
    circle.appendChild(radius);
    return circle;
};


trias.geoRestriction = function (circle) {
    var geoRestriction = trias.triasElement('GeoRestriction');
    geoRestriction.appendChild(circle);
    return geoRestriction;
};


trias.stopPointRef = function (value) {
    var stopPointRef = trias.triasElement('StopPointRef');
    stopPointRef.textContent = value;
    return stopPointRef;
};


trias.locationRef = function (stopPointRef, locationName) {
    var locationRef = trias.triasElement('LocationRef');
    locationRef.appendChild(stopPointRef);
    locationRef.appendChild(locationName);
    return locationRef;
};


trias.depArrTime = function (moment) {
    var depArrTime = trias.triasElement('DepArrTime');
    var dateTimeString = moment.format();
    trias.logger.debug('Got datetime string: ' + dateTimeString);
    depArrTime.textContent = dateTimeString;
    return depArrTime;
};


trias.location = function (locationRef, tripLocation, depArrTime, individualTransportOptions) {
    var locationContext = trias.triasElement('Location');
    var ambigErr = 'Must specify either locationRef xor tripLocation';

    if (locationRef != null && tripLocation != null) {
        throw ambigErr;
    } else if (locationRef!= null) {
        locationContext.appendChild(locationRef);
    } else if (tripLocation!= null) {
        locationContext.appendChild(tripLocation);
    } else {
        throw ambigErr;
    }

    if (depArrTime != null) {
        locationContext.appendChild(depArrTime);
    }

    if (individualTransportOptions != null) {
        for (var i = 0; i < individualTransportOptions.length; i++) {
            locationContext.appendChild(individualTransportOptions[i]);
        }
    }

    return locationContext;
};


trias.stopEventRequest = function (location, params) {
    var stopEventRequest = trias.triasElement('StopEventRequest');

    if (location != null) {
        stopEventRequest.appendChild(location);
    }

    if (params != null) {
        stopEventRequest.appendChild(params);
    }

    return stopEventRequest;
};


trias.numberOfResults = function (number) {
    var numberOfResults = trias.triasElement('NumberOfResults');
    numberOfResults.textContent = number;
    return numberOfResults;
};


trias.stopEventParam = function (stopEventDataFilterGroup, stopEventPolicyGroup, stopEventContentFilterGroup) {
    var stopEventParam = trias.triasElement('Params');
    var i;

    if (stopEventDataFilterGroup != null) {
        for (i = 0; i < stopEventDataFilterGroup.length; i++) {
            stopEventParam.appendChild(stopEventDataFilterGroup[i]);
        }
    }

    if (stopEventPolicyGroup != null) {
        for (i = 0; i < stopEventPolicyGroup.length; i++) {
            stopEventParam.appendChild(stopEventPolicyGroup[i]);
        }
    }

    if (stopEventContentFilterGroup != null) {
        for (i = 0; i < stopEventContentFilterGroup.length; i++) {
            stopEventParam.appendChild(stopEventContentFilterGroup[i]);
        }
    }

    return stopEventParam;
};


trias._apiError = function () {
    swal({
        title: 'Fehler.',
        text: 'Konnte Daten nicht von API abfragen.',
        type: 'error'
    });
};


trias.TriasClient = function (url, requestorRef) {
    this.url = url || 'https://backend.homeinfo.de/trias';
    this.requestorRef = requestorRef || 'homeinfo.de';

    this.query = function (xmlDoc) {
        var url = this.url;
        var xmlText = trias.xmlSerializer.serializeToString(xmlDoc);
        trias.logger.debug('Sending:\n' + xmlText);

        return jQuery.ajax({
            url: url,
            type: 'POST',
            data: xmlText
        });
    };

    this.locationRequest = function (locationName) {
        return trias.trias(
            trias.serviceRequest(
                trias.requestTimestamp(),
                trias.requestorRef(this.requestorRef),
                trias.requestPayload(
                    trias.locationInformationRequest(
                        trias.initialInput(trias.locationName(locationName)),
                        trias.restrictions(
                            trias.type('address'),
                            trias.language(),
                            trias.numberOfResults(1))))));
    };

    this.stopsRequest = function (longitude, latitude, radius, results) {
        return trias.trias(
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
                                        trias.latitude(latitude)),
                                    trias.radius(radius)))),
                        trias.restrictions(
                            trias.type('stop'),
                            trias.language(),
                            trias.numberOfResults(results))))));
    };

    this.stopEventsRequest = function (stopPointRef, depArrTime, results) {
        return trias.trias(
            trias.serviceRequest(
                trias.requestTimestamp(),
                trias.requestorRef(this.requestorRef),
                trias.requestPayload(
                    trias.stopEventRequest(
                        trias.location(
                            trias.locationRef(
                                trias.stopPointRef(stopPointRef),
                                trias.locationName(trias.text())),
                            null,
                            trias.depArrTime(depArrTime),
                            null),
                        trias.stopEventParam(
                            null,
                            [trias.numberOfResults(results)],
                            null)))));
    };
};


/*
    Stop event data wrapper.
*/
trias.StopEvent = function (xml, timeZone) {
    if (timeZone == null) {
        this.timeZone = '+02:00';
    } else {
        this.timeZone = timeZone;
    }

    this.timetabledTime = new Date(xml.getElementsByTagName('TimetabledTime')[0].textContent + this.timeZone);
    var estimatedTimes = xml.getElementsByTagName('EstimatedTime');

    if (estimatedTimes.length > 0) {
        this.estimatedTime = new Date(estimatedTimes[0].textContent + this.timeZone);
    }

    this.line = xml.getElementsByTagName('PublishedLineName')[0].getElementsByTagName('Text')[0].textContent;
    this.destination = xml.getElementsByTagName('DestinationText')[0].getElementsByTagName('Text')[0].textContent;

    this.delay = function () {
        if (this.estimatedTime != null) {
            return (this.estimatedTime.getTime() - this.timetabledTime.getTime()) / 60000;
        } else {
            return 0;
        }
    };

    this.departure = function () {
        var departure = homeinfo.date.time(this.timetabledTime);
        var delay = this.delay();

        if (delay > 0) {
            var strike = document.createElement('s');
            strike.textContent = departure;
            departure = trias.xmlSerializer.serializeToString(strike);
            departure += ' ' + homeinfo.date.time(this.estimatedTime) + ' (+' + delay + ' min.)';
        }

        return departure;
    };

    this.lineInfo = function () {
        return 'Linie ' + this.line + ' nach ' + this.destination;
    };
};


trias.StopPoint = function (name) {
    this.name = name;
    this.stopEvents = [];
};


trias.StopEvents = function (locationName, depArrTime, radius, stops, eventsPerStop) {
    trias.logger.debug('Location name: ' + locationName);
    trias.logger.debug('Time: ' + depArrTime);
    trias.logger.debug('Radius: ' + radius);
    trias.logger.debug('Stops: ' + stops);
    trias.logger.debug('Events per stop: ' + eventsPerStop);
    this.locationName = locationName;
    this.depArrTime = depArrTime;
    this.radius = radius;
    this.stops = stops;
    this.eventsPerStop = eventsPerStop;
    this.client = new trias.TriasClient();

    this.stopTime = function (departure) {
        var stopTime = document.createElement('div');
        stopTime.setAttribute('class', 'col col-sm-4 stopTime');
        stopTime.innerHTML = departure;
        return stopTime;
    };

    this.lineInfo = function (text) {
        var lineInfo = document.createElement('div');
        lineInfo.setAttribute('class', 'col col-sm-8 lineInfo');
        lineInfo.innerHTML = text;
        return lineInfo;
    };

    this.stopEventRow = function (stopTime, lineInfo, i) {
        var stopEventRow = document.createElement('div');
        var oddEvenClass = 'stopEventRowOdd';

        if (i % 2) {    // compensate for counter starting at 0
            oddEvenClass = 'stopEventRowEven'
        }

        stopEventRow.setAttribute('class', 'row stopEventRow ' + oddEvenClass);
        stopEventRow.appendChild(stopTime);
        stopEventRow.appendChild(lineInfo);
        return stopEventRow;
    };

    this.stopEvents = function () {
        var stopEvents = document.createElement('div');
        stopEvents.setAttribute('class', 'col col-md-12 stopEvents');
        return stopEvents;
    };

    this.stopEventsRow = function (stopEvents) {
        var stopEventsRow = document.createElement('div');
        stopEventsRow.setAttribute('class', 'row stopEventsRow');
        stopEventsRow.appendChild(stopEvents);
        return stopEventsRow;
    };

    this.stopPointTitle = function (name) {
        var stopPointTitle = document.createElement('div');
        stopPointTitle.setAttribute('class', 'col col-md-12 stopPointTitle');
        stopPointTitle.innerHTML = name;
        return stopPointTitle;
    };

    this.stopPointTitleRow = function (stopPointTitle) {
        var stopPointTitleRow = document.createElement('div');
        stopPointTitleRow.setAttribute('class', 'row stopPointTitleRow');
        stopPointTitleRow.appendChild(stopPointTitle);
        return stopPointTitleRow;
    };

    this.stopPointBlock = function (id, stopPointTitleRow, stopEventsRow) {
        var stopPointBlock = document.createElement('div');
        stopPointBlock.setAttribute('id', id);
        stopPointBlock.setAttribute('class', 'col col-md-6 stopPointBlock');
        stopPointBlock.appendChild(stopPointTitleRow);
        stopPointBlock.appendChild(stopEventsRow);
        return stopPointBlock;
    };

    this._noStopsFound = function () {
        var locationName = this.locationName;
        swal({
            title: 'Achtung!',
            text: 'Keine Abfahrten ab "' + locationName + '" gefunden.',
            type: 'warning'
        });
    };

    this._renderStopPoint = function (stopPoint, target, counter) {
        var stopEvents = this.stopEvents();
        var stopPointBlock = this.stopPointBlock(
            stopPoint.name,
            this.stopPointTitleRow(this.stopPointTitle(stopPoint.name)),
            this.stopEventsRow(stopEvents)
        );

        for (var i = 0; i < stopPoint.stopEvents.length; i++) {
            var stopEvent = stopPoint.stopEvents[i];
            stopEvents.appendChild(
                this.stopEventRow(
                    this.stopTime(stopEvent.departure()),
                    this.lineInfo(stopEvent.lineInfo()),
                    i
                )
            );
        }

        target.append(stopPointBlock);  // jQuery!

        // Add a clearfix after each two stop point blocks
        if (counter % 2 == 0) {
            var clearfix = document.createElement('div');
            clearfix.setAttribute('class', 'clearfix');
            target.append(clearfix);    // jQuery!
        }
    };

    this._renderStopPoints = function (xml, target, counter) {
        var name = xml.getElementsByTagName('StopPointName')[0].getElementsByTagName('Text')[0].textContent;
        var stopPoint = new trias.StopPoint(name);
        var stopEventResults = xml.getElementsByTagName('StopEventResult');

        for (var i = 0; i < stopEventResults.length; i++) {
            stopPoint.stopEvents.push(new trias.StopEvent(stopEventResults[i]));
        }

        this._renderStopPoint(stopPoint, target, counter);
    };

    this._renderStopPointsFactory = function (target, counter) {
        var self = this;

        return function (xml) {
            return self._renderStopPoints(xml, target, counter);
        };
    };

    this._renderStop = function (xml, target) {
        var stopPointRefNodes = xml.getElementsByTagName('StopPointRef');
        var stopPoints = stopPointRefNodes.length;
        var promises = [];
        var stopPointRef;
        var stopEventsRequest;
        var promise;

        if (stopPoints > 0) {
            for (var i = 0; i < stopPoints; i++) {
                stopPointRef = stopPointRefNodes[i].textContent;
                trias.logger.debug('Got StopPointRef: ' + stopPointRef);
                stopEventsRequest = this.client.stopEventsRequest(stopPointRef, this.depArrTime, this.eventsPerStop);
                promise = this.client.query(stopEventsRequest).then(this._renderStopPointsFactory(target, i));
                promises.push(promise);
            }
        } else {
            return Promise.reject('No stops found.').then(null, this._noStopsFound);
        }

        trias.logger.debug('Pending promises: ' + promises);
        return Promise.all(promises).then(null, this._noStopsFound);
    };

    this._renderStopFactory = function (target) {
        var self = this;
        return function (xml) {
            return self._renderStop(xml, target);
        };
    };

    this._renderLocation = function (xml, target) {
        var longitudes = xml.getElementsByTagName('Longitude');
        var latitudes = xml.getElementsByTagName('Latitude');

        if (longitudes.length == 0 || latitudes.length == 0) {
            return Promise.reject('No stops found.').then(null, this._noStopsFound);
        } else {
            var longitude = longitudes[0].textContent;
            trias.logger.debug('Longitude: ' + longitude);
            var latitude = latitudes[0].textContent;
            trias.logger.debug('Latitude: ' + latitude);
            var stopsRequest = this.client.stopsRequest(longitude, latitude, this.radius, this.stops);
            return this.client.query(stopsRequest).then(this._renderStopFactory(target));
        }
    };

    this._renderLocationFactory = function (target) {
        var self = this;
        return function (xml) {
            return self._renderLocation(xml, target);
        };
    };

    this.render = function (target) {
        var locationRequest = this.client.locationRequest(this.locationName);
        return this.client.query(locationRequest).then(this._renderLocationFactory(target), trias._apiError);
    };
};
