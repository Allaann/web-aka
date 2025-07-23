<?php
header('Content-Type: application/json');
include 'db.php';

$id = $_POST['id'];
$name = $_POST['name'];
$price = $_POST['price'];
$discountPrice = $_POST['discountPrice'];
$image = $_POST['image'];

if ($id == "" || $name == "" || $price == "" || $discountPrice == "" || $image == "") {
    echo json_encode(["success" => false, "message" => "Data tidak lengkap"]);
    exit;
}

$stmt = $conn->prepare("UPDATE menus SET name=?, price=?, discount_price=?, image=? WHERE id=?");
$stmt->bind_param("siisi", $name, $price, $discountPrice, $image, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Menu berhasil diupdate"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal update menu"]);
}

$stmt->close();
$conn->close();
?>
