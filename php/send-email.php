<?php
// send-email.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración
$to_email = "nightrunners.club2025@gmail.com";
$subject = "Nueva solicitud de membresía - Night Runners Club";

// Obtener datos del formulario
$data = json_decode(file_get_contents('php://input'), true);

// Validar que tenemos todos los datos requeridos
$required_fields = ['name', 'phone', 'email', 'age', 'vehicle'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "El campo $field es requerido"]);
        exit;
    }
}

// Sanitizar datos
$name = htmlspecialchars(trim($data['name']));
$phone = htmlspecialchars(trim($data['phone']));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$age = htmlspecialchars(trim($data['age']));
$vehicle = htmlspecialchars(trim($data['vehicle']));
$comments = isset($data['comments']) ? htmlspecialchars(trim($data['comments'])) : 'No especificado';

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// Crear el mensaje HTML
$message = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc143c; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #dc143c; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Nueva Solicitud de Membresía</h1>
            <p>Night Runners Club Madrid</p>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Nombre:</span> $name
            </div>
            <div class='field'>
                <span class='label'>Teléfono:</span> +34 $phone
            </div>
            <div class='field'>
                <span class='label'>Email:</span> $email
            </div>
            <div class='field'>
                <span class='label'>Mayor de edad:</span> " . ($age === 'si' ? 'Sí' : 'No') . "
            </div>
            <div class='field'>
                <span class='label'>Tiene vehículo propio:</span> " . ($vehicle === 'si' ? 'Sí' : 'No') . "
            </div>
            <div class='field'>
                <span class='label'>Comentarios:</span><br>$comments
            </div>
        </div>
        <div class='footer'>
            <p>Este email fue enviado desde el formulario de membresía del sitio web de Night Runners Club.</p>
            <p>Fecha: " . date('d/m/Y H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Encabezados para email HTML
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Night Runners Club <no-reply@nightrunnersclub.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Intentar enviar el correo
if (mail($to_email, $subject, $message, $headers)) {
    // También guardar en un archivo de log por seguridad
    $log_data = [
        'date' => date('Y-m-d H:i:s'),
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'age' => $age,
        'vehicle' => $vehicle
    ];
    
    file_put_contents('membership_log.txt', json_encode($log_data) . PHP_EOL, FILE_APPEND);
    
    echo json_encode([
        'success' => true, 
        'message' => '¡Solicitud enviada con éxito! Te contactaremos en breve.'
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Error al enviar el formulario. Por favor, inténtalo de nuevo.'
    ]);
}
?>