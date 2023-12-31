<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept'); #tyhle chujoviny je needed pro to aby CORS nebyl problémek

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['url'])) {
    $url = $_GET['url'];

    if (empty($url)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing URL parameter']);
        exit;
    }

    try {
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Error decoding JSON');
        }

        echo json_encode($data);
    } catch (Exception $error) {
        error_log($error);
        http_response_code(500);
        echo json_encode(['error' => 'Internal Server Error']);
    }
} else {
    http_response_code(404);
    echo 'This is used for <a href="https://github.com/ponozka153/Smash-or-Pass">Smash or Pass app</a> to get rid of CORS bullshitiery';
}
?>