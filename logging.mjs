/*
  logging.mjs - HOMEINFO logging facility.

  (C) 2015-2021 HOMEINFO - Digitale Informationssysteme GmbH

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

    log (msg, level = WARNING, prefix = '[ warn ] ') {
        /* eslint-disable no-console */
        if (this.level >= level)
            console.log(prefix + this.name + ': ' + msg);
        /* eslint-enable no-console */
    }

    error (msg) {
        this.log(msg, ERROR, '[ fail ] ');
    }

    warning (msg) {
        this.log(msg, WARNING, '[ warn ] ');
    }

    info (msg) {
        this.log(msg, INFO, '[ info ] ');
    }

    success (msg) {
        this.log(msg, SUCCESS, '[  ok  ] ');
    }

    debug (msg) {
        this.log(msg, DEBUG, '[debug!] ');
    }
}
