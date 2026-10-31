<?php
/**
 * Katalog produk yang dibaca halaman publik & admin (T-31).
 * - data/products.local.json : katalog hasil Admin Showcase (disimpan admin/save.php, tidak di-commit)
 * - data/products.js         : katalog bawaan repo, dipakai bila belum ada katalog admin
 * Dipisah agar `git pull` tidak bentrok dengan perubahan yang dibuat admin di server.
 */
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache');

$local = __DIR__ . '/products.local.json';
$products = is_file($local) ? json_decode((string) file_get_contents($local), true) : null;
if (!is_array($products)) {
    readfile(__DIR__ . '/products.js');
    exit;
}
echo "// Katalog dari Admin Showcase (data/products.local.json)\nconst PRODUCTS_DATA = "
    . json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG)
    . ";\n";
