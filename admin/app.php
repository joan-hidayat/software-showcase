<?php
/**
 * Halaman Admin Showcase, hanya untuk sesi yang sudah login (T-07).
 */
require_once __DIR__ . '/auth.php';
if (!showcase_admin_logged_in()) {
    header('Location: ./');
    exit;
}
header('Cache-Control: no-store');
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus Showcase Admin — Catalog Manager</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css?v=20261031_v1">
</head>
<body class="admin-body" data-csrf="<?php echo htmlspecialchars(showcase_admin_csrf(), ENT_QUOTES); ?>">

  <!-- MAIN ADMIN APP -->
  <div id="adminApp" class="admin-app">
    <!-- SIDEBAR -->
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">
          <span class="brand-title">NEXUS</span>
          <span class="brand-badge">ADMIN</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a href="#dashboard" class="nav-item active" data-page="dashboard">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Dashboard
        </a>
        <a href="#products" class="nav-item" data-page="products">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          Produk Katalog
        </a>
        <a href="#add-product" class="nav-item" data-page="add-product">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Tambah Produk
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="export-box">
          <button id="btnExportData" class="btn btn-secondary btn-sm btn-block">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export products.js
          </button>
          <button id="btnResetData" class="btn btn-outline-danger btn-xs btn-block mt-2">Reset ke Default</button>
        </div>
        <a href="../index.html" target="_blank" class="sidebar-public-link">
          Lihat Web Public ↗
        </a>
        <button id="btnLogout" class="btn-logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="admin-main">
      <!-- TOPBAR -->
      <header class="admin-topbar">
        <div class="topbar-title">
          <h1 id="pageTitle">Dashboard</h1>
          <p id="pageDesc">Ringkasan status portofolio software</p>
        </div>
        <div class="topbar-actions">
          <button id="btnQuickAdd" class="btn btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Produk
          </button>
        </div>
      </header>

      <!-- PAGE: DASHBOARD -->
      <section id="pageDashboard" class="admin-page active">
        <!-- STATS CARDS -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon purple">📦</div>
            <div class="stat-info">
              <span class="stat-label">Total Produk</span>
              <span id="statTotal" class="stat-value">0</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">🚀</div>
            <div class="stat-info">
              <span class="stat-label">Live Release</span>
              <span id="statLive" class="stat-value">0</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon cyan">⏳</div>
            <div class="stat-info">
              <span class="stat-label">Coming Soon</span>
              <span id="statComing" class="stat-value">0</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon yellow">⭐</div>
            <div class="stat-info">
              <span class="stat-label">Rata-rata Rating</span>
              <span id="statRating" class="stat-value">0.0</span>
            </div>
          </div>
        </div>

        <!-- RECENT PRODUCTS & QUICK ACTION -->
        <div class="dashboard-section mt-4">
          <div class="section-header">
            <h3>Daftar Produk Terbaru</h3>
            <a href="#products" class="btn-link" onclick="admin.navigate('products')">Lihat Semua →</a>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Versi</th>
                  <th>Rating</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="recentProductsTable"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- PAGE: PRODUCTS LIST -->
      <section id="pageProducts" class="admin-page">
        <div class="page-controls">
          <div class="search-box">
            <input type="text" id="productSearch" placeholder="Cari nama atau tagline...">
          </div>
          <div class="filter-group">
            <select id="filterStatus">
              <option value="all">Semua Status</option>
              <option value="released">Live Release</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
            <select id="filterCategory">
              <option value="all">Semua Kategori</option>
              <option value="Healthtech">Healthtech</option>
              <option value="SaaS & Platform">SaaS & Platform</option>
              <option value="Retail & F&B">Retail & F&B</option>
              <option value="Supply Chain & AI">Supply Chain & AI</option>
              <option value="Enterprise HR">Enterprise HR</option>
            </select>
          </div>
        </div>

        <div class="table-responsive mt-3">
          <table class="admin-table">
            <thead>
              <tr>
                <th width="80">Thumb</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Versi / Rilis</th>
                <th>Fitur</th>
                <th>Demo / Install</th>
                <th width="140">Aksi</th>
              </tr>
            </thead>
            <tbody id="productsTableBody"></tbody>
          </table>
        </div>
      </section>

      <!-- PAGE: ADD / EDIT PRODUCT -->
      <section id="pageAddProduct" class="admin-page">
        <div class="form-container">
          <form id="productForm" class="product-form">
            <input type="hidden" id="editProductId" value="">

            <div class="form-card">
              <h3>1. Informasi Dasar Produk</h3>
              <div class="form-grid-2">
                <div class="form-group">
                  <label>ID Produk (Slug unik)</label>
                  <input type="text" id="prodId" placeholder="misal: clinic-pro" required>
                  <span class="hint">Huruf kecil, tanda minus '-', tanpa spasi</span>
                </div>
                <div class="form-group">
                  <label>Nama Produk</label>
                  <input type="text" id="prodName" placeholder="misal: Nexus EMR Clinic" required>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label>Kategori</label>
                  <input type="text" id="prodCategory" placeholder="Healthtech, SaaS & Platform, dll" required>
                </div>
                <div class="form-group">
                  <label>Status</label>
                  <select id="prodStatus">
                    <option value="released">Live Release (Sudah Tersedia)</option>
                    <option value="coming_soon">Coming Soon (Tahap R&D / Beta)</option>
                  </select>
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label>Versi</label>
                  <input type="text" id="prodVersion" placeholder="v2.4.0">
                </div>
                <div class="form-group">
                  <label>Tanggal Rilis / Target</label>
                  <input type="text" id="prodReleaseDate" placeholder="Q1 2025 / Maret 2024">
                </div>
                <div class="form-group">
                  <label>Rating (1.0 - 5.0)</label>
                  <input type="number" step="0.1" min="1" max="5" id="prodRating" placeholder="4.9">
                </div>
              </div>

              <div class="form-group">
                <label>URL Gambar Thumbnail</label>
                <input type="text" id="prodThumbnail" placeholder="assets/images/thumb_...jpg atau URL online" required>
              </div>

              <div class="form-group">
                <label>Tagline Singkat</label>
                <input type="text" id="prodTagline" placeholder="Sistem Informasi Manajemen..." required>
              </div>

              <div class="form-group">
                <label>Deskripsi Lengkap</label>
                <textarea id="prodDescription" rows="4" placeholder="Jelaskan fungsionalitas dan nilai bisnis software..." required></textarea>
              </div>
            </div>

            <!-- SPESIFIKASI & TEKNOLOGI -->
            <div class="form-card mt-3">
              <h3>2. Spesifikasi & Tech Stack</h3>
              <div class="form-grid-2">
                <div class="form-group">
                  <label>Platform</label>
                  <input type="text" id="specPlatform" placeholder="Web Application, Hybrid Cloud, dll">
                </div>
                <div class="form-group">
                  <label>Arsitektur</label>
                  <input type="text" id="specArchitecture" placeholder="Modular Monolith, Microservices, dll">
                </div>
              </div>

              <div class="form-group">
                <label>Tech Stack (Pisahkan dengan koma)</label>
                <input type="text" id="specTechStack" placeholder="PHP 8.2, Laravel 11, Vue 3, MySQL 8">
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label>Min. RAM</label>
                  <input type="text" id="reqRam" placeholder="2 GB">
                </div>
                <div class="form-group">
                  <label>OS Didukung</label>
                  <input type="text" id="reqOs" placeholder="Linux, Windows Server">
                </div>
                <div class="form-group">
                  <label>Database</label>
                  <input type="text" id="reqDb" placeholder="MySQL 8.0+ / MariaDB">
                </div>
              </div>

              <div class="form-group">
                <label>Fitur Unggulan (1 baris = 1 fitur)</label>
                <textarea id="specKeyFeatures" rows="4" placeholder="POS Kasir Cepat & Resep Dokter&#10;Integrasi BPJS PCare&#10;Laporan Keuangan Otomatis"></textarea>
              </div>
            </div>

            <!-- DEMO & INSTALL -->
            <div class="form-card mt-3">
              <h3>3. Konfigurasi Demo & Instalasi</h3>
              <div class="form-grid-2">
                <div class="form-group">
                  <label>Kode Aplikasi di LMD (lmdAppCode)</label>
                  <input type="text" id="lmdAppCode" placeholder="mis. MINIPOS — kosongkan jika belum terdaftar">
                  <small style="color:#94a3b8;font-size:11px;">Harus sama dengan kode aplikasi di Central SaaS LMD. Tanpa kode ini tombol berlangganan tampil "Segera hadir".</small>
                </div>
                <div class="form-group">
                  <label>URL Live Demo</label>
                  <input type="text" id="demoUrl" placeholder="http://localhost:8080/apotek/ atau https://demo...">
                </div>
                <div class="form-group">
                  <label>Tipe Demo</label>
                  <select id="demoType">
                    <option value="direct">Direct Web / URL</option>
                    <option value="contact">Hubungi Sales / Closed Beta</option>
                  </select>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label>Tipe Paket Instalasi</label>
                  <select id="installType">
                    <option value="zip_installer">ZIP Package Installer</option>
                    <option value="git_repo">Git Repository / Composer</option>
                    <option value="cloud_saas">Cloud SaaS / On-Demand</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Ukuran File Package</label>
                  <input type="text" id="installSize" placeholder="24.5 MB / 18.2 MB">
                </div>
              </div>

              <div class="form-group">
                <label>Git Repo / Command Line</label>
                <input type="text" id="installCommand" placeholder="git clone ... atau composer install">
              </div>

              <div class="form-group">
                <label>Langkah Instalasi (1 baris = 1 langkah)</label>
                <textarea id="installSteps" rows="3" placeholder="Ekstrak arsip ZIP ke folder htdocs/&#10;Import database schema schema.sql&#10;Konfigurasi config.php"></textarea>
              </div>
            </div>

            <div class="form-actions mt-4">
              <button type="submit" class="btn btn-primary btn-lg">Simpan Produk</button>
              <button type="button" class="btn btn-secondary btn-lg" onclick="admin.navigate('products')">Batal</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div id="toast" class="toast hidden"></div>

  <!-- LOAD SCRIPTS -->
  <script src="../data/products.js"></script>
  <script src="admin.js?v=20261031_v1"></script>
</body>
</html>
