<?php
$koneksi = new mysqli("localhost", "root", "", "aka_db");

// Cek koneksi
if ($koneksi->connect_error) {
    die("Koneksi gagal: " . $koneksi->connect_error);
} else {
    echo "Koneksi berhasil ke database aka_db!";
}
?>
