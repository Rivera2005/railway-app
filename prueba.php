<?php
// La contraseña a hashear
$password = '12345';

// Generar el hash
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Mostrar el hash
echo $hashedPassword;
?>
