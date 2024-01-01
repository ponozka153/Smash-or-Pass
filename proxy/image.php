<?php

$url = isset($_GET['url']) ? $_GET['url'] : '';

$imageContent = file_get_contents($url);

if ($imageContent === false) {
    die('Failed to fetch image');
}


header('Content-Type: ' . getimagesizefromstring($imageContent)['mime']);
header('Content-Length: ' . strlen($imageContent));

echo $imageContent;
?>