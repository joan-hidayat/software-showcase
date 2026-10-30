<?php
/**
 * Login Admin Showcase di sisi server (T-07). Password tidak lagi berada di JavaScript.
 *
 * Hash password disimpan di admin/credentials.local.php (tidak di-commit), dibuat lewat:
 *   php admin/set-password.php
 */
const SHOWCASE_ADMIN_IDLE = 7200;
const SHOWCASE_ADMIN_MAX_ATTEMPTS = 5;
const SHOWCASE_ADMIN_LOCK_MINUTES = 15;

function showcase_admin_session() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('SHOWCASEADMINSESSID');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\') . '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function showcase_admin_credentials() {
    $file = __DIR__ . '/credentials.local.php';
    return file_exists($file) ? require $file : null;
}

function showcase_admin_logged_in() {
    showcase_admin_session();
    if (empty($_SESSION['showcase_admin']) || time() - ($_SESSION['showcase_admin_seen'] ?? 0) > SHOWCASE_ADMIN_IDLE) {
        unset($_SESSION['showcase_admin'], $_SESSION['showcase_admin_seen']);
        return false;
    }
    $_SESSION['showcase_admin_seen'] = time();
    return true;
}

function showcase_admin_csrf() {
    showcase_admin_session();
    if (empty($_SESSION['showcase_csrf'])) {
        $_SESSION['showcase_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['showcase_csrf'];
}

function showcase_admin_verify_csrf() {
    $token = $_POST['csrf_token'] ?? '';
    return is_string($token) && hash_equals(showcase_admin_csrf(), $token);
}

/**
 * Penguncian per IP setelah percobaan gagal berulang (disimpan di folder temp server).
 */
function showcase_admin_attempts_file() {
    return sys_get_temp_dir() . '/showcase_admin_attempts_' . md5(__DIR__) . '.json';
}

function showcase_admin_locked_minutes() {
    $data = json_decode(@file_get_contents(showcase_admin_attempts_file()) ?: '{}', true) ?: [];
    $entry = $data[$_SERVER['REMOTE_ADDR'] ?? '-'] ?? null;
    if ($entry && ($entry['locked_until'] ?? 0) > time()) {
        return (int) ceil(($entry['locked_until'] - time()) / 60);
    }
    return 0;
}

function showcase_admin_record_attempt($success) {
    $file = showcase_admin_attempts_file();
    $data = json_decode(@file_get_contents($file) ?: '{}', true) ?: [];
    $ip = $_SERVER['REMOTE_ADDR'] ?? '-';
    if ($success) {
        unset($data[$ip]);
    } else {
        $failures = ($data[$ip]['failures'] ?? 0) + 1;
        $data[$ip] = $failures >= SHOWCASE_ADMIN_MAX_ATTEMPTS
            ? ['failures' => 0, 'locked_until' => time() + SHOWCASE_ADMIN_LOCK_MINUTES * 60]
            : ['failures' => $failures, 'locked_until' => 0];
    }
    @file_put_contents($file, json_encode($data), LOCK_EX);
}

function showcase_admin_login($password) {
    $credentials = showcase_admin_credentials();
    $ok = $credentials && password_verify($password, $credentials['password_hash']);
    showcase_admin_record_attempt($ok);
    if ($ok) {
        session_regenerate_id(true);
        $_SESSION['showcase_admin'] = true;
        $_SESSION['showcase_admin_seen'] = time();
    }
    return $ok;
}

function showcase_admin_logout() {
    showcase_admin_session();
    $_SESSION = [];
    session_regenerate_id(true);
}
