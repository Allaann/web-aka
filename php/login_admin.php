<?php
session_start();
include 'db.php';

$username = $_POST['username'];
$password = md5($_POST['password']);

$sql = "SELECT * FROM admins WHERE username='$username' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $_SESSION['isAdmin'] = true;
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Username atau password salah"]);
}

$conn->close();
?>
