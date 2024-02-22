<?php

require_once __DIR__ . '/../../RectPacker/RectPacker.php';
use Aslamhus\RectPacker\RectPacker;

try {

    // get post data
    $options = $_POST['options'] ?? null;
    if($options === null) {
        throw new Exception("No options provided");
    }
    $options = json_decode($options, true);
    // pack the tiles
    $packer = new RectPacker($options);
    $result = $packer->calcTileProperties();
    // return the result
    echo json_encode($result);
    http_response_code(200);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
    http_response_code(400);
    exit;
}
