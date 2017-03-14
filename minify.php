<?
    $script = $_GET['script'];
    $LICENSE = '/*
  @licstart  The following is the entire license notice for the JavaScript code in this page.
  The JavaScript code in this page is free software: you can
  redistribute it and/or modify it under the terms of the GNU
  General Public License (GNU GPL) as published by the Free Software
  Foundation, either version 3 of the License, or (at your option)
  any later version.  The code is distributed WITHOUT ANY WARRANTY;
  without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

  As additional permission under GNU GPL version 3 section 7, you
  may distribute non-source (e.g., minimized or compacted) forms of
  that code without the copy of the GNU GPL normally required by
  section 4, provided you include this license notice and a URL
  through which recipients can access the Corresponding Source.
  @licend  The above is the entire license notice

  The original script can be found at:
    %url%
*/
';
    $BASE_URL = 'https://tls.homeinfo.de/jslibs/';

    if (! empty($script)) {
        $path = '/srv/http/de/homeinfo/jslibs/' . $script;

        if (file_exists($path)) {
            print(str_replace('%url%', $BASE_URL . $script, $LICENSE));
            header('Content-Type: application/javascript');
            system('/usr/bin/uglifyjs ' . $path . ' -m');
        } else {
            print('Invalid script: ' . $script . '.');
        }
    } else {
        print('No script specified.');
    }
?>
