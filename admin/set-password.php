<?php
/**
 * Membuat / mengganti password Admin Showcase (T-07). Hash disimpan di admin/credentials.local.php (tidak di-commit).
 *   php admin/set-password.php
 * Untuk skrip otomatis: SHOWCASE_ADMIN_PASSWORD=... php admin/set-password.php
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("Jalankan dari command line.\n");
}

$password = getenv('SHOWCASE_ADMIN_PASSWORD');
if ($password === false || $password === '') {
    echo 'Password baru (min. 10 karakter): ';
    $password = rtrim((string) fgets(STDIN), "\r\n");
    echo 'Ulangi password: ';
    if ($password !== rtrim((string) fgets(STDIN), "\r\n")) {
        exit("Password tidak sama. Tidak ada yang diubah.\n");
    }
}
if (strlen($password) < 10) {
    exit("Gagal: password minimal 10 karakter.\n");
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$content = "<?php\n// Dibuat oleh admin/set-password.php pada " . date('Y-m-d H:i:s') . ". Jangan di-commit.\n"
    . "return ['password_hash' => " . var_export($hash, true) . "];\n";
file_put_contents(__DIR__ . '/credentials.local.php', $content, LOCK_EX);
echo "Password Admin Showcase disimpan. Login di /software-showcase/admin/\n";
