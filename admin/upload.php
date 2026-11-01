<?php
/**
 * Upload gambar thumbnail produk dari Admin Showcase (T-37).
 *   POST admin/upload.php  multipart field "image", header X-CSRF-Token
 *   → {"ok": true, "path": "assets/images/uploads/<acak>.webp"}
 * Wajib login admin. Jenis file ditentukan dari isi file (bukan nama/ekstensi), nama file dibuat acak.
 */
require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');

const UPLOAD_MAX_BYTES = 2 * 1024 * 1024;
const UPLOAD_MAX_SIDE = 4000;
const UPLOAD_TYPES = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

function respond($status, array $body) {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if (!showcase_admin_logged_in()) {
    respond(401, ['ok' => false, 'message' => 'Sesi admin berakhir. Silakan login kembali.']);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !hash_equals(showcase_admin_csrf(), (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''))) {
    respond(403, ['ok' => false, 'message' => 'Permintaan tidak sah. Muat ulang halaman admin.']);
}

$file = $_FILES['image'] ?? null;
if (!$file || !is_array($file) || !isset($file['error']) || is_array($file['error'])) {
    respond(400, ['ok' => false, 'message' => 'Pilih satu file gambar.']);
}
if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE || $file['size'] > UPLOAD_MAX_BYTES) {
    respond(400, ['ok' => false, 'message' => 'Ukuran gambar maksimal 2 MB.']);
}
if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
    respond(400, ['ok' => false, 'message' => 'Upload gagal (kode ' . (int) $file['error'] . ').']);
}

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$info = @getimagesize($file['tmp_name']);
if (!isset(UPLOAD_TYPES[$mime]) || !$info || $info['mime'] !== $mime) {
    respond(400, ['ok' => false, 'message' => 'File harus gambar JPG, PNG, atau WebP.']);
}
if ($info[0] > UPLOAD_MAX_SIDE || $info[1] > UPLOAD_MAX_SIDE) {
    respond(400, ['ok' => false, 'message' => 'Dimensi gambar maksimal ' . UPLOAD_MAX_SIDE . ' piksel per sisi.']);
}

$dir = __DIR__ . '/../assets/images/uploads';
if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    respond(500, ['ok' => false, 'message' => 'Folder assets/images/uploads tidak bisa dibuat.']);
}
$name = 'thumb_' . date('Ymd') . '_' . bin2hex(random_bytes(6)) . '.' . UPLOAD_TYPES[$mime];
if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
    respond(500, ['ok' => false, 'message' => 'Gagal menyimpan gambar. Pastikan folder assets/images/uploads bisa ditulis web server.']);
}
respond(200, ['ok' => true, 'path' => 'assets/images/uploads/' . $name, 'width' => $info[0], 'height' => $info[1]]);
