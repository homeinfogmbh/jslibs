/*
  Konami Code easter egg.

  (C) 2019-2020 HOMEINFO - Digitale Informationssysteme GmbH

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

import { aprilsFool } from './lib.js';


const KEY_LOG = [];
const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA'
];
const DEFAULT_MESSAGE = 'HOMEINFO wünscht Ihnen einen schönen ersten April!';
let MESSAGE = DEFAULT_MESSAGE;


/*
    Checks whether the log has reached the maximum length.
*/
function logFull () {
    return KEY_LOG.length >= KONAMI_CODE.length;
}


/*
    Checks whether the keys logged so far match the Konami Code.
*/
function checkLog () {
    const correctSubset = KONAMI_CODE.slice(0, KEY_LOG.length);
    return JSON.stringify(KEY_LOG) === JSON.stringify(correctSubset);
}


/*
    Checks whether the Konami Code has been matched.
*/
function checkCode () {
    return JSON.stringify(KEY_LOG) === JSON.stringify(KONAMI_CODE);
}


/*
    Sets the desired message.
*/
export function setMessage (message = DEFAULT_MESSAGE) {
    MESSAGE = message;
}


/*
    Logs the current key to match against the Konami Code.
*/
export function konami (event) {
    if (logFull() || !checkLog())
        KEY_LOG.length = 0;

    KEY_LOG.push(event.code);

    if (checkCode())
        alert(MESSAGE);
}

/*
    Initializes the Konami Code easter egg.
*/
export function init () {
    document.addEventListener('keydown', aprilsFool(konami));
}
