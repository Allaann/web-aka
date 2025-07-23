<?php
header('Content-Type: application/json');
include 'db.php';

$id = $_POST['id'];

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID tidak ditemukan"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM menus WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Menu berhasil dihapus"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal menghapus menu"]);
}

$stmt->close();
$conn->close();
?>
