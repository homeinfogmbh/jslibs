/*
  evergiven.mjs - Ever Given easter egg.

  (C) 2021 HOMEINFO - Digitale Informationssysteme GmbH

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


import { aprilsFool } from './lib.mjs';


const MESSAGE = 'Aufgrund der Havarie des Frachters "Ever Given" im Sueskanal, kann es aktuell zu Verzögerungem beim Aufrufen dieser Seite kommen.';


/*
    Displays a warning message.
*/
export function evergiven (event) {
    const message = document.getElementById('message');

    if (message == null)
        alert(MESSAGE);
    else
        message.innerHTML = MESSAGE;
}

/*
    Initializes the Ever Given Code easter egg.
*/
export function init () {
    document.addEventListener('DOMContentLoaded', aprilsFool(evergiven));
}
