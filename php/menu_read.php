<?php
header('Content-Type: application/json');
include 'db.php';

$menus = [];
$sql = "SELECT * FROM menus";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $menus[] = [
            'id' => (int)$row['id'], // tambahkan baris ini
            'name' => $row['name'],
            'price' => (int)$row['price'],
            'discountPrice' => (int)$row['discount_price'],
            'image' => $row['image']
        ];
    }
    echo json_encode($menus);
} else {
    echo json_encode([]);
}

$conn->close();
?>
