/*
  trias.mjs - JavaScript library for the Trias API

  (C) 2017-2021 HOMEINFO - Digitale Informationssysteme GmbH

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


import { Logger } from './logging.mjs';


const LOGGER = new Logger('trias', homeinfo.logging.DEBUG);
const XML_SERIALIZER = new XMLSerializer();


function trias (serviceRequest) {
    const xmlDoc = document.implementation.createDocument('trias', 'Trias', null);
    const root = xmlDoc.getElementsByTagName('Trias')[0];
    root.setAttribute('version', '1.0');

    if (serviceRequest != null)
        root.appendChild(serviceRequest);

    return xmlDoc;
}


function siriElement (name) {
    return document.createElementNS('http://www.siri.org.uk/siri', 'siri:' + name);
}


function triasElement (name) {
    return document.createElementNS('trias', name);
}


function requestTimestamp (datetime) {
    const requestTimestamp = siriElement('RequestTimestamp');

    if (datetime == null)
        datetime = new Date();

    requestTimestamp.textContent = datetime.toISOString();
    return requestTimestamp;
}


function requestorRef (requestor) {
    const requestorRef = siriElement('RequestorRef');
    requestorRef.textContent = requestor;
    return requestorRef;
}


function requestPayload (content) {
    const requestPayload = triasElement('RequestPayload');

    if (content != null)
        requestPayload.appendChild(content);

    return requestPayload;
}


function serviceRequest (requestTimestamp, requestorRef, payload) {
    const serviceRequest = triasElement('ServiceRequest');
    serviceRequest.appendChild(requestTimestamp);
    serviceRequest.appendChild(requestorRef);

    if (payload != null)
        serviceRequest.appendChild(payload);

    return serviceRequest;
}


function text (value) {
    const text = triasElement('Text');
    text.textContent = value;
    return text;
}


function locationName (text) {
    const locationName = triasElement('LocationName');

    if (typeof text === 'string' || text instanceof String)
        locationName.textContent = text;
    else
        locationName.appendChild(text);

    return locationName;
}


function initialInput (content) {
    const initialInput = triasElement('InitialInput');

    if (content != null)
        initialInput.appendChild(content);

    return initialInput;
}


function type (name = 'address') {
    const type = triasElement('Type');
    type.textContent = name;
    return type;
}


function language (name = 'de') {
    const language = triasElement('Language');
    language.textContent = name;
    return language;
}


function numberOfResults (number = 1) {
    const numberOfResults = triasElement('NumberOfResults');
    numberOfResults.textContent = number;
    return numberOfResults;
}


function restrictions (type, language, numberOfResults) {
    const restrictions = triasElement('Restrictions');
    restrictions.appendChild(type);
    restrictions.appendChild(language);
    restrictions.appendChild(numberOfResults);
    return restrictions;
}


function locationInformationRequest (initialInput, restrictions) {
    const locationInformationRequest = triasElement('LocationInformationRequest');

    if (initialInput != null)
        locationInformationRequest.appendChild(initialInput);

    if (restrictions != null)
        locationInformationRequest.appendChild(restrictions);

    return locationInformationRequest;
}


function longitude (value) {
    const longitude = triasElement('Longitude');
    longitude.textContent = value;
    return longitude;
}


function latitude (value) {
    const latitude = triasElement('Latitude');
    latitude.textContent = value;
    return latitude;
}


function center (longitude, latitude) {
    const center = triasElement('Center');
    center.appendChild(longitude);
    center.appendChild(latitude);
    return center;
}


function radius (value) {
    const radius = triasElement('Radius');
    radius.textContent = value;
    return radius;
}


function circle (center, radius) {
    const circle = triasElement('Circle');
    circle.appendChild(center);
    circle.appendChild(radius);
    return circle;
}


function geoRestriction (circle) {
    const geoRestriction = triasElement('GeoRestriction');
    geoRestriction.appendChild(circle);
    return geoRestriction;
}


function stopPointRef (value) {
    const stopPointRef = triasElement('StopPointRef');
    stopPointRef.textContent = value;
    return stopPointRef;
}


function locationRef (stopPointRef, locationName) {
    const locationRef = triasElement('LocationRef');
    locationRef.appendChild(stopPointRef);
    locationRef.appendChild(locationName);
    return locationRef;
}


function depArrTime (moment) {
    const depArrTime = triasElement('DepArrTime');
    const dateTimeString = moment.format();
    LOGGER.debug('Got datetime string: ' + dateTimeString);
    depArrTime.textContent = dateTimeString;
    return depArrTime;
}


function location (locationRef, tripLocation, depArrTime, individualTransportOptions) {
    const locationContext = triasElement('Location');
    const ambigErr = 'Must specify either locationRef xor tripLocation';

    if (locationRef != null && tripLocation != null)
        throw ambigErr;
    else if (locationRef!= null)
        locationContext.appendChild(locationRef);
    else if (tripLocation!= null)
        locationContext.appendChild(tripLocation);
    else
        throw ambigErr;

    if (depArrTime != null)
        locationContext.appendChild(depArrTime);

    if (individualTransportOptions != null)
        for (let individualTransportOption of individualTransportOptions)
            locationContext.appendChild(individualTransportOption);

    return locationContext;
}


function stopEventRequest (location, params) {
    const stopEventRequest = triasElement('StopEventRequest');

    if (location != null)
        stopEventRequest.appendChild(location);

    if (params != null)
        stopEventRequest.appendChild(params);

    return stopEventRequest;
}


function numberOfResults (number) {
    const numberOfResults = triasElement('NumberOfResults');
    numberOfResults.textContent = number;
    return numberOfResults;
}


function stopEventParam (stopEventDataFilterGroup, stopEventPolicyGroup, stopEventContentFilterGroup) {
    const stopEventParam = triasElement('Params');

    if (stopEventDataFilterGroup != null)
        for (let stopEventDataFilter of stopEventDataFilterGroup)
            stopEventParam.appendChild(stopEventDataFilter);

    if (stopEventPolicyGroup != null)
        for (let stopEventPolicy of stopEventPolicyGroup)
            stopEventParam.appendChild(stopEventPolicy);

    if (stopEventContentFilterGroup != null)
        for (let stopEventContentFilter of stopEventContentFilterGroup)
            stopEventParam.appendChild(stopEventContentFilter);

    return stopEventParam;
}


function apiError () {
    swal({
        title: 'Fehler.',
        text: 'Konnte Daten nicht von API abfragen.',
        type: 'error'
    });
}


export class TriasClient {
    constructor (url, requestorRef) {
        this.url = url || 'https://backend.homeinfo.de/trias';
        this.requestorRef = requestorRef || 'homeinfo.de';
    }

    query (xmlDoc) {
        const url = this.url;
        const xmlText = XML_SERIALIZER.serializeToString(xmlDoc);
        LOGGER.debug('Sending:\n' + xmlText);

        return jQuery.ajax({
            url: url,
            type: 'POST',
            data: xmlText
        });
    }

    locationRequest (locationName) {
        return trias(
            serviceRequest(
                requestTimestamp(),
                requestorRef(this.requestorRef),
                requestPayload(
                    locationInformationRequest(
                        initialInput(locationName(locationName)),
                        restrictions(
                            type('address'),
                            language(),
                            numberOfResults(1)
                        )
                    )
                )
            )
        );
    }

    stopsRequest (longitude, latitude, radius, results) {
        return trias(
            serviceRequest(
                requestTimestamp(),
                requestorRef(this.requestorRef),
                requestPayload(
                    locationInformationRequest(
                        initialInput(
                            geoRestriction(
                                circle(
                                    center(
                                        longitude(longitude),
                                        latitude(latitude)
                                    ),
                                    radius(radius)
                                )
                            )
                        ),
                        restrictions(
                            type('stop'),
                            language(),
                            numberOfResults(results)
                        )
                    )
                )
            )
        );
    }

    stopEventsRequest (stopPointRef, depArrTime, results) {
        return trias(
            serviceRequest(
                requestTimestamp(),
                requestorRef(this.requestorRef),
                requestPayload(
                    stopEventRequest(
                        location(
                            locationRef(
                                stopPointRef(stopPointRef),
                                locationName(text())
                            ),
                            null,
                            depArrTime(depArrTime),
                            null
                        ),
                        stopEventParam(
                            null,
                            [numberOfResults(results)],
                            null
                        )
                    )
                )
            )
        );
    }
}


/*
    Stop event data wrapper.
*/
class StopEvent = class {
    constructor (xml, timeZone = '+02:00') {
        this.timeZone = timeZone;
        this.timetabledTime = new Date(xml.getElementsByTagName('TimetabledTime')[0].textContent + this.timeZone);
        const estimatedTimes = xml.getElementsByTagName('EstimatedTime');

        if (estimatedTimes.length > 0)
            this.estimatedTime = new Date(estimatedTimes[0].textContent + this.timeZone);

        this.line = xml.getElementsByTagName('PublishedLineName')[0].getElementsByTagName('Text')[0].textContent;
        this.destination = xml.getElementsByTagName('DestinationText')[0].getElementsByTagName('Text')[0].textContent;
    }

    delay () {
        if (this.estimatedTime != null)
            return (this.estimatedTime.getTime() - this.timetabledTime.getTime()) / 60000;

        return 0;
    }

    departure () {
        let departure = homeinfo.date.time(this.timetabledTime);
        const delay = this.delay();

        if (delay > 0) {
            const strike = document.createElement('s');
            strike.textContent = departure;
            departure = XML_SERIALIZER.serializeToString(strike);
            departure += ' ' + homeinfo.date.time(this.estimatedTime) + ' (+' + delay + ' min.)';
        }

        return departure;
    }

    lineInfo () {
        return 'Linie ' + this.line + ' nach ' + this.destination;
    }
}


function StopPoint (name) {
    this.name = name;
    this.stopEvents = [];
}


class StopEvents {
    constructor (locationName, depArrTime, radius, stops, eventsPerStop) {
        LOGGER.debug('Location name: ' + locationName);
        LOGGER.debug('Time: ' + depArrTime);
        LOGGER.debug('Radius: ' + radius);
        LOGGER.debug('Stops: ' + stops);
        LOGGER.debug('Events per stop: ' + eventsPerStop);
        this.locationName = locationName;
        this.depArrTime = depArrTime;
        this.radius = radius;
        this.stops = stops;
        this.eventsPerStop = eventsPerStop;
        this.client = new TriasClient();
    }

    stopTime (departure) {
        const stopTime = document.createElement('div');
        stopTime.setAttribute('class', 'col col-sm-4 stopTime');
        stopTime.innerHTML = departure;
        return stopTime;
    }

    lineInfo (text) {
        const lineInfo = document.createElement('div');
        lineInfo.setAttribute('class', 'col col-sm-8 lineInfo');
        lineInfo.innerHTML = text;
        return lineInfo;
    }

    stopEventRow (stopTime, lineInfo, i) {
        const stopEventRow = document.createElement('div');
        let oddEvenClass = 'stopEventRowOdd';

        if (i % 2)  // compensate for counter starting at 0
            oddEvenClass = 'stopEventRowEven';

        stopEventRow.setAttribute('class', 'row stopEventRow ' + oddEvenClass);
        stopEventRow.appendChild(stopTime);
        stopEventRow.appendChild(lineInfo);
        return stopEventRow;
    }

    stopEvents () {
        const stopEvents = document.createElement('div');
        stopEvents.setAttribute('class', 'col col-md-12 stopEvents');
        return stopEvents;
    }

    stopEventsRow (stopEvents) {
        const stopEventsRow = document.createElement('div');
        stopEventsRow.setAttribute('class', 'row stopEventsRow');
        stopEventsRow.appendChild(stopEvents);
        return stopEventsRow;
    }

    stopPointTitle (name) {
        const stopPointTitle = document.createElement('div');
        stopPointTitle.setAttribute('class', 'col col-md-12 stopPointTitle');
        stopPointTitle.innerHTML = name;
        return stopPointTitle;
    }

    stopPointTitleRow (stopPointTitle) {
        const stopPointTitleRow = document.createElement('div');
        stopPointTitleRow.setAttribute('class', 'row stopPointTitleRow');
        stopPointTitleRow.appendChild(stopPointTitle);
        return stopPointTitleRow;
    }

    stopPointBlock (id, stopPointTitleRow, stopEventsRow) {
        const stopPointBlock = document.createElement('div');
        stopPointBlock.setAttribute('id', id);
        stopPointBlock.setAttribute('class', 'col col-md-6 stopPointBlock');
        stopPointBlock.appendChild(stopPointTitleRow);
        stopPointBlock.appendChild(stopEventsRow);
        return stopPointBlock;
    }

    _noStopsFound () {
        const locationName = this.locationName;
        swal({
            title: 'Achtung!',
            text: 'Keine Abfahrten ab "' + locationName + '" gefunden.',
            type: 'warning'
        });
    }

    _renderStopPoint (stopPoint, target, counter) {
        const stopEvents = this.stopEvents();
        const stopPointBlock = this.stopPointBlock(
            stopPoint.name,
            this.stopPointTitleRow(this.stopPointTitle(stopPoint.name)),
            this.stopEventsRow(stopEvents)
        );

        for (let i = 0; i < stopPoint.stopEvents.length; i++) {
            let stopEvent = stopPoint.stopEvents[i];
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
            const clearfix = document.createElement('div');
            clearfix.setAttribute('class', 'clearfix');
            target.append(clearfix);    // jQuery!
        }
    }

    _renderStopPoints (target, counter, xml) {
        const name = xml.getElementsByTagName('StopPointName')[0].getElementsByTagName('Text')[0].textContent;
        const stopPoint = new StopPoint(name);
        const stopEventResults = xml.getElementsByTagName('StopEventResult');

        for (let stopEventResult of stopEventResults)
            stopPoint.stopEvents.push(new StopEvent(stopEventResult));

        this._renderStopPoint(stopPoint, target, counter);
    }

    _renderStopPointsFactory (target, counter) {
        return this._renderStopPoints.bind(this, target, counter);
    }

    _renderStop (target, xml) {
        const stopPointRefNodes = xml.getElementsByTagName('StopPointRef');
        const stopPoints = stopPointRefNodes.length;
        const promises = [];

        if (stopPoints > 0) {
            for (let i = 0; i < stopPoints; i++) {
                let stopPointRef = stopPointRefNodes[i].textContent;
                LOGGER.debug('Got StopPointRef: ' + stopPointRef);
                let stopEventsRequest = this.client.stopEventsRequest(stopPointRef, this.depArrTime, this.eventsPerStop);
                let promise = this.client.query(stopEventsRequest).then(this._renderStopPointsFactory(target, i));
                promises.push(promise);
            }
        } else {
            return Promise.reject('No stops found.').then(null, this._noStopsFound);
        }

        LOGGER.debug('Pending promises: ' + promises);
        return Promise.all(promises).then(null, this._noStopsFound);
    }

    _renderStopFactory (target) {
        return this._renderStop.bind(this, target);
    }

    _renderLocation (target, xml) {
        const longitudes = xml.getElementsByTagName('Longitude');
        const latitudes = xml.getElementsByTagName('Latitude');

        if (longitudes.length == 0 || latitudes.length == 0)
            return Promise.reject('No stops found.').then(null, this._noStopsFound);

        const longitude = longitudes[0].textContent;
        LOGGER.debug('Longitude: ' + longitude);
        const latitude = latitudes[0].textContent;
        LOGGER.debug('Latitude: ' + latitude);
        const stopsRequest = this.client.stopsRequest(longitude, latitude, this.radius, this.stops);
        return this.client.query(stopsRequest).then(this._renderStopFactory(target));
    }

    _renderLocationFactory (target) {
        return this._renderLocation.bind(this, target);
    }

    render (target) {
        const locationRequest = this.client.locationRequest(this.locationName);
        return this.client.query(locationRequest).then(this._renderLocationFactory(target), apiError);
    }
}
