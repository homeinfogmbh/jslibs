<?
    $script = $_GET['script'];

    if (! empty($script)) {
        $path = '/srv/http/de/homeinfo/jslibs/' . $script;

        if (file_exists($path)) {
            header('Content-Type: application/javascript');
            system('/usr/bin/uglifyjs ' . $path . ' -m');
        } else {
            print('Invalid script: ' . $script . '.');
        }
    } else {
        print('No script specified.');
    }
?>
