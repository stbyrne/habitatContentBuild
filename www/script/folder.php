<?php
     
$toName = "./temp/test";

if (!is_dir(dirname($toName))) {
    mkdir(dirname($toName), 0777, true);
}

rename("test1", $toName);
     
?>