/*
  gallery.mjs - Image gallery library.

  (C) 2021 HOMEINFO - Digitale Informationssysteme GmbH

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
*/
'use strict';


function open (gallery) {
    return gallery.open();
}


function close (gallery) {
    return gallery.close();
}


function next (gallery) {
    return gallery.next();
}


function previous (gallery) {
    return gallery.previous();
}


function handleKeydown (gallery) {
    return event => {
        if (gallery.mapping.gallery.style.display == 'none')
            return;

        if (event.code == 'ArrowLeft')
            return gallery.previous();

        if (event.code == 'ArrowRight')
            return gallery.next();
    };
}


export class Gallery {
    constructor (images, mapping, urlCallback, defaultTitle = 'Bild') {
        this.images = Array.from(images);
        this.mapping = mapping;
        this.urlCallback = urlCallback;
        this.defaultTitle = defaultTitle;
        this.index = 0;
    }

    open () {
        this.mapping.expose.style.display = 'none';
        this.mapping.gallery.style.display = 'block';
    }

    close () {
        this.mapping.gallery.style.display = 'none';
        this.mapping.expose.style.display = 'block';
    }

    next () {
        this.index++;

        if (this.index >= this.images.length)
            this.index = 0;

        this.render();
    }

    previous () {
        this.index--;

        if (this.index < 0)
            this.index = this.images.length - 1;

        this.render();
    }

    bind () {
        document.addEventListener('keydown', handleKeydown(this));
        this.mapping.next.addEventListener('click', event => next(this));
        this.mapping.previous.addEventListener('click', event => previous(this));
        this.mapping.open.addEventListener('click', event => open(this));
        this.mapping.close.addEventListener('click', event => close(this));
    }

    render () {
        this.mapping.image.setAttribute('src', this.urlCallback(this.images[this.index]));
        this.mapping.title.innerHTML = this.images[this.index].anhangtitel || this.defaultTitle;
        this.mapping.index.innerHTML = this.index + 1;
        this.mapping.count.innerHTML = this.images.length;
    }
}
