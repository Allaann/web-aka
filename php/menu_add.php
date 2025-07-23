<?php
header('Content-Type: application/json');

// koneksi ke database
$koneksi = new mysqli("localhost", "root", "", "aka_db");

// cek koneksi
if ($koneksi->connect_error) {
    die(json_encode(["success" => false, "message" => "Koneksi gagal: " . $koneksi->connect_error]));
}

// ambil data dari POST
$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? '';
$discountPrice = $_POST['discountPrice'] ?? '';
$image = $_POST['image'] ?? '';

// validasi sederhana
if ($name == "" || $price == "" || $discountPrice == "" || $image == "") {
    echo json_encode(["success" => false, "message" => "Data tidak lengkap"]);
    exit;
}

// simpan ke database
$stmt = $koneksi->prepare("INSERT INTO menus (name, price, discount_price, image) VALUES (?, ?, ?, ?)");
$stmt->bind_param("siis", $name, $price, $discountPrice, $image);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Menu berhasil ditambahkan"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal menambahkan menu: " . $stmt->error]);
}

$stmt->close();
$koneksi->close();
?>
