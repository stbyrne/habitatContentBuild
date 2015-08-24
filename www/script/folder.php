<?php
     
$toName = "./temp";

if (!is_dir(dirname($toName))) {
    mkdir(dirname($toName), 0777, true);
}

echo 'Directory created';

rename("test1", $toName);
     
?>