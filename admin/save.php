<?php
/**
 * Menyimpan katalog dari Admin Showcase ke server (T-31): data/products.local.json.
 *   POST admin/save.php  (JSON {"products": [...]}, header X-CSRF-Token)   → simpan
 *   POST admin/save.php?action=reset                                       → kembali ke data/products.js bawaan
 * Wajib login admin. Sebelumnya katalog admin hanya ada di localStorage browser admin.
 */
require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');

function respond($status, array $body) {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (!showcase_admin_logged_in()) {
    respond(401, ['ok' => false, 'message' => 'Sesi admin berakhir. Silakan login kembali.']);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !hash_equals(showcase_admin_csrf(), (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''))) {
    respond(403, ['ok' => false, 'message' => 'Permintaan tidak sah. Muat ulang halaman admin.']);
}

$file = __DIR__ . '/../data/products.local.json';

if (($_GET['action'] ?? '') === 'reset') {
    if (is_file($file) && !unlink($file)) {
        respond(500, ['ok' => false, 'message' => 'Gagal menghapus katalog admin.']);
    }
    respond(200, ['ok' => true]);
}

$body = json_decode(file_get_contents('php://input'), true);
$products = $body['products'] ?? null;
if (!is_array($products) || array_keys($products) !== range(0, count($products) - 1)) {
    respond(400, ['ok' => false, 'message' => 'Format katalog tidak valid.']);
}
$ids = [];
foreach ($products as $i => $product) {
    $id = $product['id'] ?? '';
    if (!is_string($id) || !preg_match('/^[a-z0-9][a-z0-9-]{1,79}$/', $id) || empty($product['name']) || !is_string($product['name'])) {
        respond(400, ['ok' => false, 'message' => 'Produk ke-' . ($i + 1) . ': id (huruf kecil, angka, tanda minus) dan nama wajib diisi.']);
    }
    if (isset($ids[$id])) {
        respond(400, ['ok' => false, 'message' => "ID produk '{$id}' dipakai dua kali."]);
    }
    if (isset($product['lmdAppCode']) && !preg_match('/^[A-Z0-9_]{2,50}$/', (string) $product['lmdAppCode'])) {
        respond(400, ['ok' => false, 'message' => "lmdAppCode produk '{$id}' tidak valid (huruf besar, angka, garis bawah)."]);
    }
    $ids[$id] = true;
}

// Tulis ke file sementara lalu rename: halaman publik tidak pernah membaca file setengah jadi
$tmp = $file . '.tmp';
$json = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, $file)) {
    @unlink($tmp);
    respond(500, ['ok' => false, 'message' => 'Gagal menulis data/products.local.json. Pastikan folder data/ bisa ditulis oleh web server.']);
}
respond(200, ['ok' => true, 'count' => count($products)]);
