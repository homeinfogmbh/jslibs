<?
    $script = $_GET['script'];

    if (! empty($script)) {
        $path = '/srv/http/de/homeinfo/jslibs/' . $script;

        if (file_exists(path)) {
            exec('/usr/bin/uglifyjs ' . $path . ' -m');
        } else {
            print('Invalid script: ' . $script . '.');
        }
    } else {
        print('No script specified.');
    }
?>
