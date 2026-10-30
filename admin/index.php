<?php
/**
 * Pintu masuk Admin Showcase: form login & logout (T-07). Halaman admin ada di app.php dan hanya
 * dikirim ke sesi yang sudah login.
 */
require_once __DIR__ . '/auth.php';
showcase_admin_session();

$error = null;
$setupNeeded = showcase_admin_credentials() === null;

if (($_GET['action'] ?? '') === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (showcase_admin_verify_csrf()) {
        showcase_admin_logout();
    }
    header('Location: ./');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$setupNeeded) {
    $locked = showcase_admin_locked_minutes();
    if (!showcase_admin_verify_csrf()) {
        $error = 'Formulir kedaluwarsa. Muat ulang halaman lalu coba lagi.';
    } elseif ($locked) {
        $error = "Terlalu banyak percobaan gagal. Coba lagi dalam {$locked} menit.";
    } elseif (showcase_admin_login((string) ($_POST['password'] ?? ''))) {
        header('Location: app.php');
        exit;
    } else {
        $error = 'Password salah.';
    }
}

if (showcase_admin_logged_in()) {
    header('Location: app.php');
    exit;
}
$csrf = showcase_admin_csrf();
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Masuk — Showcase Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css?v=20261031_v1">
</head>
<body class="admin-body">
  <div class="login-overlay">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-box">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <h2>Showcase Portal Admin</h2>
        <p>Akses manajemen katalog portofolio produk software</p>
      </div>
      <?php if ($setupNeeded): ?>
        <div class="login-error">
          Password admin belum dibuat. Jalankan di server:<br><code>php admin/set-password.php</code>
        </div>
      <?php else: ?>
        <form method="post" class="login-form">
          <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf, ENT_QUOTES); ?>">
          <div class="form-group">
            <label for="adminPassword">Password Admin</label>
            <input type="password" id="adminPassword" name="password" placeholder="Masukkan password..." required autofocus autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Masuk Dashboard</button>
          <?php if ($error): ?><div class="login-error"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>
        </form>
        <p class="hint" style="margin-top:12px;">Lupa password? Jalankan <code>php admin/set-password.php</code> di server.</p>
      <?php endif; ?>
      <div class="login-footer">
        <a href="../index.html" class="back-link">← Kembali ke Halaman Public Showcase</a>
      </div>
    </div>
  </div>
</body>
</html>
