/*
  logging.js - HOMEINFO logging facility.

  (C) 2015-2020 HOMEINFO - Digitale Informationssysteme GmbH

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
*/
'use strict';

// Log levels.
export const ERROR = 0;
export const WARNING = 10;
export const INFO = 20;
export const SUCCESS = 30;
export const DEBUG = 40;


/*
    A logger to conditionally log formatted messages to the console.
*/
export class Logger {
    constructor (name = 'Logger', level = WARNING) {
        this.name = name;
        this.level = level;
    }

    log (prefix, msg) {
        /* eslint-disable no-console */
        console.log(prefix + ' ' + this.name + ': ' + msg);
        /* eslint-enable no-console */
    }

    error (msg) {
        if (this.level >= ERROR)
            this.log('[ fail ]', msg);
    }

    warning (msg) {
        if (this.level >= WARNING)
            this.log('[ warn ]', msg);
    }

    info (msg) {
        if (this.level >= INFO)
            this.log('[ info ]', msg);
    }

    success (msg) {
        if (this.level >= SUCCESS)
            this.log('[  ok  ]', msg);
    }

    debug (msg) {
        if (this.level >= DEBUG)
            this.log('[debug!]', msg);
    }
}
