<?php
//Autor: Kehmit Uribe
//Valparaíso 13 de Abril del 2024
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'votacion_bd';
$username = 'djkehm';
$password = '1234';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos', 'details' => $e->getMessage()]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (isset($data['jsonData'])) {
        $stmt = $pdo->prepare("CALL guardarVotacion(:jsonData)");
        $stmt->bindParam(':jsonData', $data['jsonData'], PDO::PARAM_STR);
        
        try {
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                echo json_encode($result['RespuestaJSON']);
            } else {
                echo json_encode(['error' => 'No se obtuvo respuesta del procedimiento almacenado']);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error al ejecutar el procedimiento', 'details' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Datos JSON no proporcionados o inválidos']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>