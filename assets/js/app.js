/**
 * Software Portfolio Showcase - Interactive Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure PRODUCTS_DATA is loaded
  const products = (typeof PRODUCTS_DATA !== 'undefined') ? PRODUCTS_DATA : [];

  // App State
  const state = {
    searchQuery: '',
    selectedStatus: 'all',
    selectedCategory: 'all',
    sortBy: 'default',
    activeModal: null
  };

  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const statusTabs = document.querySelectorAll('.status-tab-btn');
  const categoryPills = document.querySelectorAll('.category-pill');
  const sortSelect = document.getElementById('sort-select');

  // Stats Counters
  const statTotal = document.getElementById('stat-total');
  const statReleased = document.getElementById('stat-released');
  const statRoadmap = document.getElementById('stat-roadmap');
  const statRating = document.getElementById('stat-rating');

  // Modals
  const specModal = document.getElementById('spec-modal');
  const installModal = document.getElementById('install-modal');
  const demoModal = document.getElementById('demo-modal');
  const contactModal = document.getElementById('contact-modal');
  const btnOpenContact = document.getElementById('btn-open-contact');
  const toastContainer = document.getElementById('toast-container');

  // Initialize
  initStats();
  renderProducts();
  setupEventListeners();

  // Check notice from unauthorized direct access redirect
  (function handleRedirectNotice() {
    const urlParams = new URLSearchParams(window.location.search);
    const notice = urlParams.get('notice');
    if (notice === 'unauthorized_direct_access') {
      setTimeout(() => {
        showToast('🔒 Akses Langsung Ditolak: Aplikasi klien tidak dapat dibuka langsung. Silakan pilih paket dan lakukan instalasi melalui portal ini.');
      }, 500);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (notice === 'license_not_found') {
      setTimeout(() => {
        showToast('❌ Lisensi Tidak Ditemukan: Kredensial tidak terdaftar di Central SaaS. Silakan pesan lisensi baru.');
      }, 500);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (notice === 'license_not_active') {
      setTimeout(() => {
        showToast('⏳ Lisensi Belum Aktif: Menunggu verifikasi pembayaran dan persetujuan Admin Central SaaS.');
      }, 500);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  })();

  /**
   * Initialize Quick Stats Counters
   */
  function initStats() {
    const total = products.length;
    const released = products.filter(p => p.status === 'released').length;
    const roadmap = products.filter(p => p.status === 'coming_soon').length;

    let totalRating = 0;
    let countRating = 0;
    products.forEach(p => {
      const val = parseFloat(p.rating);
      if (!isNaN(val)) {
        totalRating += val;
        countRating++;
      }
    });
    const avgRating = countRating > 0 ? (totalRating / countRating).toFixed(1) : '4.9';

    if (statTotal) statTotal.textContent = total;
    if (statReleased) statReleased.textContent = released;
    if (statRoadmap) statRoadmap.textContent = roadmap;
    if (statRating) statRating.textContent = `${avgRating} ★`;
  }

  /**
   * Filter and Sort Products
   */
  function getFilteredProducts() {
    return products.filter(product => {
      // Status filter
      if (state.selectedStatus !== 'all' && product.status !== state.selectedStatus) {
        return false;
      }
      // Category filter
      if (state.selectedCategory !== 'all' && product.category !== state.selectedCategory) {
        return false;
      }
      // Search query
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchTagline = product.tagline.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchCategory = product.category.toLowerCase().includes(query);
        const matchTech = product.specs.techStack.some(t => t.toLowerCase().includes(query));
        return matchName || matchTagline || matchDesc || matchCategory || matchTech;
      }
      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (state.sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      } else if (state.sortBy === 'rating-desc') {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      // Default: Released first, then coming soon
      if (a.status === 'released' && b.status !== 'released') return -1;
      if (a.status !== 'released' && b.status === 'released') return 1;
      return 0;
    });
  }

  /**
   * Render Product Cards to Grid
   */
  function renderProducts() {
    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <h3 class="empty-title">Tidak Ada Produk yang Ditemukan</h3>
          <p class="empty-desc">Tidak ada produk yang cocok dengan kata kunci "${state.searchQuery}" atau filter yang dipilih.</p>
          <button id="btn-reset-filters" class="btn-reset-filters">Reset Semua Filter</button>
        </div>
      `;

      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
      }
      return;
    }

    productsGrid.innerHTML = filtered.map(product => {
      const isReleased = product.status === 'released';
      const badgeClass = isReleased ? 'badge-released' : 'badge-coming-soon';
      const statusIcon = isReleased ? '🟢' : '🚀';

      return `
        <article class="product-card" id="product-card-${product.id}">
          <div class="card-thumbnail-wrapper">
            <img src="${product.thumbnail}" alt="${product.name}" class="card-thumbnail" loading="lazy" />
            <div class="card-image-overlay"></div>
            <div class="card-status-badge ${badgeClass}">
              <span class="badge-dot"></span>
              ${product.statusLabel}
            </div>
            <div class="card-version-tag">${product.version.split(' ')[0]}</div>
          </div>

          <div class="card-body">
            <div class="card-meta-row">
              <span class="card-category">${product.category}</span>
              <span class="card-rating">★ ${product.rating}</span>
            </div>

            <h3 class="card-title">${product.name}</h3>
            <p class="card-tagline">${product.tagline}</p>
            <p class="card-desc">${product.description}</p>

            <div class="specs-chips-group">
              <div class="specs-chips-title">Spesifikasi & Tech Stack</div>
              <div class="tech-chips-list">
                ${product.specs.techStack.slice(0, 4).map(tech => `
                  <span class="tech-chip">${tech}</span>
                `).join('')}
              </div>
            </div>

            <button class="btn-action btn-spec-detail btn-full" id="btn-spec-${product.id}" data-id="${product.id}">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Detail Spesifikasi & Arsitektur
            </button>

            <div class="card-actions-row">
              <button class="btn-action btn-demo" id="btn-demo-${product.id}" data-id="${product.id}">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Demo
              </button>

              <button class="btn-action btn-install" id="btn-install-${product.id}" data-id="${product.id}">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Event Listeners to Card Buttons
    filtered.forEach(product => {
      const btnSpec = document.getElementById(`btn-spec-${product.id}`);
      const btnDemo = document.getElementById(`btn-demo-${product.id}`);
      const btnInstall = document.getElementById(`btn-install-${product.id}`);

      if (btnSpec) btnSpec.addEventListener('click', () => openSpecModal(product));
      if (btnDemo) btnDemo.addEventListener('click', () => openDemoModal(product));
      if (btnInstall) btnInstall.addEventListener('click', () => openInstallModal(product));
    });
  }

  /**
   * Reset All Filters
   */
  function resetFilters() {
    state.searchQuery = '';
    state.selectedStatus = 'all';
    state.selectedCategory = 'all';
    state.sortBy = 'default';

    if (searchInput) searchInput.value = '';
    if (btnClearSearch) btnClearSearch.style.display = 'none';

    statusTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.status === 'all');
    });

    categoryPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === 'all');
    });

    if (sortSelect) sortSelect.value = 'default';

    renderProducts();
    showToast('Filter telah direset ke awal');
  }

  /**
   * Open Specification Modal
   */
  function openSpecModal(product) {
    const modalContent = document.getElementById('spec-modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-hero-preview">
        <img src="${product.thumbnail}" alt="${product.name}" class="modal-hero-img" />
        <div>
          <span class="card-category">${product.category}</span>
          <h2 style="font-size: 1.35rem; font-weight: 800; margin: 4px 0 6px;">${product.name}</h2>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">${product.description}</p>
        </div>
      </div>

      <div class="modal-section-title">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        Spesifikasi Sistem & Platform
      </div>

      <div class="spec-grid-table">
        <div class="spec-cell">
          <div class="spec-cell-label">Platform & Arsitektur</div>
          <div class="spec-cell-value">${product.specs.platform}</div>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 4px;">${product.specs.architecture || 'Clean Modular Architecture'}</div>
        </div>
        <div class="spec-cell">
          <div class="spec-cell-label">Versi & Status Rilis</div>
          <div class="spec-cell-value">${product.version} (${product.releaseDate})</div>
        </div>
        <div class="spec-cell">
          <div class="spec-cell-label">Kebutuhan Memori (RAM)</div>
          <div class="spec-cell-value">${product.specs.systemRequirements.minRam}</div>
        </div>
        <div class="spec-cell">
          <div class="spec-cell-label">Sistem Operasi Didukung</div>
          <div class="spec-cell-value">${product.specs.systemRequirements.os}</div>
        </div>
        <div class="spec-cell">
          <div class="spec-cell-label">Web Server Kompatibel</div>
          <div class="spec-cell-value">${product.specs.systemRequirements.webServer}</div>
        </div>
        <div class="spec-cell">
          <div class="spec-cell-label">Database Engine</div>
          <div class="spec-cell-value">${product.specs.systemRequirements.database}</div>
        </div>
      </div>

      <div class="modal-section-title">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Fitur Unggulan & Kapabilitas Utama
      </div>

      <ul class="features-check-list">
        ${product.specs.keyFeatures.map(feat => `
          <li class="features-check-item">
            <svg class="check-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>${feat}</span>
          </li>
        `).join('')}
      </ul>

      ${product.specs.hardwareSupport ? `
        <div class="modal-section-title">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Dukungan Perangkat Keras & Integrasi
        </div>
        <div class="tech-chips-list" style="margin-bottom: 24px;">
          ${product.specs.hardwareSupport.map(hw => `
            <span class="tech-chip" style="color: #38bdf8; border-color: rgba(56, 189, 248, 0.2);">${hw}</span>
          `).join('')}
        </div>
      ` : ''}

      <div style="display: flex; gap: 12px; margin-top: 10px;">
        <button class="btn-action btn-demo" style="flex: 1;" onclick="window.triggerDemo('${product.id}')">
          Buka Demo Produk
        </button>
        <button class="btn-action btn-install" style="flex: 1;" onclick="window.triggerInstall('${product.id}')">
          Panduan Install & Download
        </button>
      </div>
    `;

    document.getElementById('spec-modal-title').textContent = product.name;
    openModal(specModal);
  }

  /**
   * Katalog paket dari Central SaaS LMD (GET /packages?app_code=...)
   */
  async function loadLmdPackages(lmdApi, appCode) {
    const resp = await fetch(`${lmdApi}/packages?app_code=${encodeURIComponent(appCode)}`);
    const json = await resp.json();
    if (!json.success) throw new Error(json.message || `HTTP ${resp.status}`);
    return json.data.map(p => ({
      code: p.code,
      name: p.name,
      description: p.description || '',
      price: parseFloat(p.base_price),
      users: parseInt(p.max_users, 10),
      billingCycle: p.billing_cycle,
      futureModules: Number(p.future_module_access) === 1,
      modules: (p.modules || []).map(m => m.name)
    }));
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function billingCycleLabel(cycle) {
    return {
      monthly: 'bulanan', quarterly: '3 bulan', semi_annual: '6 bulan', annual: 'tahunan', one_time: 'sekali bayar'
    }[cycle] || cycle;
  }

  function billingCycleSuffix(cycle) {
    return { monthly: '/ bln', quarterly: '/ 3 bln', semi_annual: '/ 6 bln', annual: '/ thn', one_time: '' }[cycle] || '';
  }

  function renderPackageCard(pkg) {
    const shownModules = pkg.modules.slice(0, 4).map(m => `<li>✓ ${escapeHtml(m)}</li>`).join('');
    const moreModules = pkg.modules.length > 4 ? `<li>✓ +${pkg.modules.length - 4} modul lainnya</li>` : '';
    const futureModules = pkg.futureModules ? '<li>✓ Modul baru otomatis didapat</li>' : '';
    return `
          <div class="pkg-card" data-code="${escapeHtml(pkg.code)}">
            <div class="pkg-badge">${escapeHtml(billingCycleLabel(pkg.billingCycle))}</div>
            <h4>${escapeHtml(pkg.name)}</h4>
            <div class="pkg-price">Rp ${pkg.price.toLocaleString('id-ID')} <span>${billingCycleSuffix(pkg.billingCycle)}</span></div>
            <ul class="pkg-features">
              <li>✓ Maksimal ${pkg.users} User</li>
              ${shownModules}${moreModules}${futureModules}
            </ul>
            <button type="button" class="btn-select-pkg">Pilih Paket</button>
          </div>`;
  }

    /**
   * Open Installation / Commercial Subscription Modal (Level 8 SaaS Lifecycle)
   */
  function openInstallModal(product) {
    const modalContent = document.getElementById('install-modal-content');
    if (!modalContent) return;

    // Detect LMD host
    const currentHost = window.location.hostname || 'localhost';
    const port = window.location.port ? ':' + window.location.port : ':8080';
    const lmdHost = `${window.location.protocol}//${currentHost}${port}`;

    // Paket, harga, dan kuota diambil dari LMD (sumber tunggal), bukan ditulis di Showcase
    const lmdApi = `${lmdHost}/License-Management-Dashboard/api/index.php`;
    const appCode = product.lmdAppCode || 'APOTEK';
    let selectedPackage = null;
    const paymentState = { method: 'QRIS' };

    modalContent.innerHTML = `
      <div class="onboarding-stepper">
        <div class="step-indicator active" id="step-tab-1">1. Pilih Paket</div>
        <div class="step-indicator" id="step-tab-2">2. Data Diri & Toko</div>
        <div class="step-indicator" id="step-tab-3">3. Pembayaran</div>
        <div class="step-indicator" id="step-tab-4">4. Aktivasi Domain</div>
      </div>

      <!-- STEP 1: PILIH PAKET -->
      <div id="wizard-step-1" class="wizard-step active">
        <h3 style="font-size: 15px; margin-bottom: 6px; color: #f8fafc;">Pilih Paket Langganan untuk ${product.name}</h3>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Tentukan kapasitas user dan fitur yang sesuai dengan kebutuhan bisnis Anda</p>

        <div class="package-cards-grid" id="pkg-cards-grid">
          <div class="pkg-loading">Memuat paket dari Central SaaS LMD...</div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
          <button id="btn-to-step-2" class="btn-action btn-install" style="padding: 10px 24px;" disabled>
            Lanjutkan ke Data Diri →
          </button>
        </div>
      </div>

      <!-- STEP 2: FORM DATA DIRI & TOKO -->
      <div id="wizard-step-2" class="wizard-step hidden">
        <h3 style="font-size: 15px; margin-bottom: 6px; color: #f8fafc;">Form Pendaftaran & Domain Pelanggan</h3>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Data ini akan didaftarkan ke Central SaaS License Management Dashboard (LMD)</p>

        <form id="client-reg-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group-modal">
              <label>Nama Lengkap Penanggung Jawab</label>
              <input type="text" id="ob-cust-name" placeholder="misal: Budi Santoso" value="Budi Santoso" required>
            </div>
            <div class="form-group-modal">
              <label>Email Bisnis</label>
              <input type="email" id="ob-cust-email" placeholder="owner@tokoberkah.com" value="budi@apoteksehat.com" required>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px;">
            <div class="form-group-modal">
              <label>Nomor WhatsApp / Telepon</label>
              <input type="tel" id="ob-cust-phone" placeholder="08123456789" value="08123456789" required>
            </div>
            <div class="form-group-modal">
              <label>Nama Toko / Apotek / Usaha</label>
              <input type="text" id="ob-store-name" placeholder="misal: Apotek Sehat Sentosa" value="Apotek Sehat Sentosa" required>
            </div>
          </div>

          <div class="form-group-modal" style="margin-top: 10px;">
            <label>Subdomain yang Diinginkan</label>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="text" id="ob-subdomain" placeholder="apoteksehat" value="apoteksehat" style="flex: 1;" required>
              <span style="font-size: 13px; color: #38bdf8; font-family: var(--font-mono);">.pos.local</span>
            </div>
            <small style="color: #64748b; font-size: 11px;">Domain instans ini akan langsung aktif begitu pembayaran disetujui</small>
          </div>

          <div class="form-note-modal">
            🔐 <strong>Akun admin aplikasi</strong> dibuat sendiri saat Anda pertama kali membuka aplikasi setelah pembayaran disetujui,
            menggunakan email di atas. Password tidak dikirim lewat halaman ini.
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 24px;">
            <button type="button" id="btn-back-to-step-1" class="btn-action" style="background: #1e293b; color: #cbd5e1; padding: 10px 20px;">
              ← Kembali
            </button>
            <button type="submit" class="btn-action btn-install" style="padding: 10px 24px;">
              Lanjut ke Pembayaran →
            </button>
          </div>
        </form>
      </div>

      <!-- STEP 3: METODE PEMBAYARAN -->
      <div id="wizard-step-3" class="wizard-step hidden">
        <h3 style="font-size: 15px; margin-bottom: 6px; color: #f8fafc;">Rincian Tagihan & Konfirmasi Pembayaran</h3>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Silakan selesaikan pembayaran sesuai nominal di bawah</p>

        <div class="billing-summary-box">
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
            <span id="bill-pkg-name">Paket Professional (15 User)</span>
            <span id="bill-pkg-price">Rp 350.000</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; color: #94a3b8;">
            <span>PPN (11%)</span>
            <span id="bill-tax">Rp 38.500</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; border-top: 1px dashed #334155; padding-top: 8px; margin-top: 8px;">
            <span>Total Tagihan:</span>
            <span id="bill-total" style="color: #34d399; font-family: var(--font-mono);">Rp 388.500</span>
          </div>
        </div>

        <div class="payment-method-options" style="margin-top: 16px;">
          <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">Pilih Metode Pembayaran:</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="pay-option selected" data-method="QRIS">
              <strong>📱 QRIS Instan</strong>
              <small style="display: block; color: #94a3b8; font-size: 11px;">BCA, GoPay, OVO, Dana</small>
            </div>
            <div class="pay-option" data-method="TRANSFER_BCA">
              <strong>🏦 Transfer Bank BCA</strong>
              <small style="display: block; color: #94a3b8; font-size: 11px;">No. Rek: 8820-1234-5678</small>
            </div>
          </div>
        </div>

        <!-- SIMULASI QRIS -->
        <div id="qris-box" style="text-align: center; background: white; padding: 14px; border-radius: 12px; margin-top: 14px; max-width: 220px; margin-left: auto; margin-right: auto;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=NEXUS-SAAS-PAYMENT" alt="QRIS" style="width: 150px; height: 150px; display: block; margin: 0 auto;" />
          <div style="color: #111827; font-weight: 800; font-size: 12px; margin-top: 6px;">QRIS RESMI CENTRAL SAAS</div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 24px;">
          <button type="button" id="btn-back-to-step-2" class="btn-action" style="background: #1e293b; color: #cbd5e1; padding: 10px 20px;">
            ← Kembali
          </button>
          <button type="button" id="btn-confirm-payment" class="btn-action btn-demo" style="padding: 10px 24px; background: linear-gradient(135deg, #10b981, #059669);">
            ✓ Saya Sudah Bayar (Kirim ke LMD)
          </button>
        </div>
      </div>

      <!-- STEP 4: MENUNGGU PERSETUJUAN (LIVE POLLING) -->
      <div id="wizard-step-4" class="wizard-step hidden">
        <div id="waiting-screen" style="text-align: center; padding: 24px 10px;">
          <div class="pulse-ring-loader">⏳</div>
          <h3 style="font-size: 18px; font-weight: 800; margin: 16px 0 6px;">Menunggu Konfirmasi Pembayaran</h3>
          <p style="font-size: 13px; color: #94a3b8; max-width: 400px; margin: 0 auto 16px;">
            Data pendaftaran dan pesanan lisensi Anda telah tercatat di <strong>Central SaaS LMD</strong>. Status saat ini: <span class="status-pill-pending">PENDING APPROVAL</span>
          </p>

          <div style="background: #0d121f; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; max-width: 440px; margin: 0 auto; text-align: left; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">No. Subskripsi:</span>
              <strong id="live-sub-no" style="font-family: var(--font-mono); color: #38bdf8;">SUB-2026-XXXX</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Nama Pemilik:</span>
              <span id="live-cust-name">-</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Paket Dipilih:</span>
              <span id="live-pkg-name">-</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Domain Klien:</span>
              <span id="live-domain">-</span>
            </div>
          </div>

          <div style="margin-top: 18px; font-size: 12px; color: #06b6d4;">
            <span class="spinner-small"></span> Menunggu Admin menekan tombol <strong>"Approve"</strong> di Central SaaS LMD...
          </div>
        </div>

        <!-- APPROVED SUCCESS SCREEN -->
        <div id="approved-screen" class="hidden" style="text-align: center; padding: 20px 10px;">
          <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
          <h3 style="font-size: 20px; font-weight: 800; color: #34d399; margin-bottom: 6px;">Pembayaran Disetujui & Lisensi Aktif!</h3>
          <p style="font-size: 13px; color: #cbd5e1; max-width: 440px; margin: 0 auto 20px;">
            Domain dan instans software Anda telah berhasil terbentuk di server. Anda dapat langsung membuka dan menggunakan aplikasi sekarang!
          </p>

          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 18px; max-width: 480px; margin: 0 auto 24px; text-align: left;">
            <div style="font-size: 13px; font-weight: 800; color: #34d399; margin-bottom: 10px; border-bottom: 1px dashed rgba(16, 185, 129, 0.3); padding-bottom: 6px;">
              🔑 Akses Aplikasi Anda:
            </div>
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 2px;">URL Akses Instans:</div>
            <div id="final-app-url" style="font-size: 13px; font-weight: 800; color: #ffffff; word-break: break-all; font-family: var(--font-mono); margin-bottom: 8px;">
              http://localhost:8080/mini-pos/?tenant=...
            </div>
            <div style="margin-bottom: 8px;">
              <div style="font-size: 11px; color: #94a3b8;">Email akun admin:</div>
              <div id="final-cred-user" style="font-size: 12px; font-weight: 700; color: #f8fafc; font-family: var(--font-mono);">-</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
                Saat pertama membuka aplikasi, Anda akan diminta membuat password admin dengan email ini.
                Setelah itu kasir di perangkat lain cukup membuka alamat toko dan login.
              </div>
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 2px;">License Key Resmi:</div>
            <div id="final-lic-key" style="font-size: 12px; color: #38bdf8; font-family: var(--font-mono); word-break: break-all;">
              LIC-APOTEK-...
            </div>
          </div>

          <a id="btn-enter-app" href="#" target="_blank" class="btn-action btn-install" style="display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 32px; font-size: 15px; font-weight: 800; text-decoration: none;">
            🚀 Buka & Masuk ke Aplikasi Saya Sekarang ↗
          </a>
        </div>
      </div>
    `;

    document.getElementById('install-modal-title').textContent = `Berlangganan & Aktivasi Domain: ${product.name}`;

    // Load & bind package cards from LMD
    const pkgGrid = document.getElementById('pkg-cards-grid');
    const btnToStep2 = document.getElementById('btn-to-step-2');

    const selectPackageCard = (card, pkg) => {
      pkgGrid.querySelectorAll('.pkg-card').forEach(c => {
        c.classList.remove('selected');
        const b = c.querySelector('.btn-select-pkg');
        if (b) { b.classList.remove('active'); b.textContent = 'Pilih Paket'; }
      });
      card.classList.add('selected');
      const btn = card.querySelector('.btn-select-pkg');
      if (btn) { btn.classList.add('active'); btn.textContent = 'Terpilih'; }
      selectedPackage = pkg;
      btnToStep2.disabled = false;
    };

    loadLmdPackages(lmdApi, appCode)
      .then(packages => {
        if (packages.length === 0) {
          pkgGrid.innerHTML = '<div class="pkg-loading">Belum ada paket publik untuk aplikasi ini di Central SaaS LMD.</div>';
          return;
        }
        pkgGrid.innerHTML = packages.map(renderPackageCard).join('');
        const cards = pkgGrid.querySelectorAll('.pkg-card');
        cards.forEach((card, idx) => card.addEventListener('click', () => selectPackageCard(card, packages[idx])));
        const defaultIdx = packages.length > 2 ? 1 : 0;
        selectPackageCard(cards[defaultIdx], packages[defaultIdx]);
      })
      .catch(err => {
        pkgGrid.innerHTML = `<div class="pkg-loading pkg-error">Gagal memuat paket dari Central SaaS LMD (${escapeHtml(err.message)}). Pastikan LMD berjalan, lalu buka ulang jendela ini.</div>`;
      });

    // Step 1 -> 2
    document.getElementById('btn-to-step-2').addEventListener('click', () => {
      document.getElementById('wizard-step-1').classList.add('hidden');
      document.getElementById('wizard-step-2').classList.remove('hidden');
      document.getElementById('step-tab-1').classList.remove('active');
      document.getElementById('step-tab-2').classList.add('active');
    });

    // Step 2 -> 1
    document.getElementById('btn-back-to-step-1').addEventListener('click', () => {
      document.getElementById('wizard-step-2').classList.add('hidden');
      document.getElementById('wizard-step-1').classList.remove('hidden');
      document.getElementById('step-tab-2').classList.remove('active');
      document.getElementById('step-tab-1').classList.add('active');
    });

    // Step 2 -> 3 (Form submit)
    document.getElementById('client-reg-form').addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('wizard-step-2').classList.add('hidden');
      document.getElementById('wizard-step-3').classList.remove('hidden');
      document.getElementById('step-tab-2').classList.remove('active');
      document.getElementById('step-tab-3').classList.add('active');

      // Update Bill details
      const tax = Math.round(selectedPackage.price * 0.11);
      const grandTotal = selectedPackage.price + tax;

      document.getElementById('bill-pkg-name').textContent = `${selectedPackage.name} (${selectedPackage.users} User, ${billingCycleLabel(selectedPackage.billingCycle)})`;
      document.getElementById('bill-pkg-price').textContent = `Rp ${selectedPackage.price.toLocaleString('id-ID')}`;
      document.getElementById('bill-tax').textContent = `Rp ${tax.toLocaleString('id-ID')}`;
      document.getElementById('bill-total').textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
    });

    // Step 3 -> 2
    document.getElementById('btn-back-to-step-2').addEventListener('click', () => {
      document.getElementById('wizard-step-3').classList.add('hidden');
      document.getElementById('wizard-step-2').classList.remove('hidden');
      document.getElementById('step-tab-3').classList.remove('active');
      document.getElementById('step-tab-2').classList.add('active');
    });

    // Payment Option selection
    modalContent.querySelectorAll('.pay-option').forEach(opt => {
      opt.addEventListener('click', () => {
        modalContent.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        paymentState.method = opt.dataset.method;
        const qrisBox = document.getElementById('qris-box');
        if (opt.dataset.method === 'QRIS') {
          qrisBox.style.display = 'block';
        } else {
          qrisBox.style.display = 'none';
        }
      });
    });

    // Step 3 -> 4: Submit Order to Central SaaS LMD
    let activePollInterval = null;
    document.getElementById('btn-confirm-payment').addEventListener('click', async () => {
      const btn = document.getElementById('btn-confirm-payment');
      btn.disabled = true;
      btn.textContent = 'Mendaftarkan ke Central SaaS LMD...';

      const custName = document.getElementById('ob-cust-name').value.trim();
      const custEmail = document.getElementById('ob-cust-email').value.trim();
      const custPhone = document.getElementById('ob-cust-phone').value.trim();
      const storeName = document.getElementById('ob-store-name').value.trim();
      const subdomain = document.getElementById('ob-subdomain').value.trim();

      const payload = {
        app_code: appCode,
        package_code: selectedPackage.code,
        customer_name: custName,
        customer_email: custEmail,
        customer_phone: custPhone,
        store_name: storeName,
        subdomain: subdomain,
        payment_method: paymentState.method
      };

      try {
        const orderApiUrl = `${lmdApi}/licenses/order`;
        const resp = await fetch(orderApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const resData = await resp.json();
        if (!resData.success || !resData.data) {
          throw new Error(resData.message || 'Gagal membuat pesanan di LMD');
        }

        const order = resData.data;

        // Transition to Step 4 (Waiting for Admin Approval)
        document.getElementById('wizard-step-3').classList.add('hidden');
        document.getElementById('wizard-step-4').classList.remove('hidden');
        document.getElementById('step-tab-3').classList.remove('active');
        document.getElementById('step-tab-4').classList.add('active');

        document.getElementById('live-sub-no').textContent = order.subscription_no;
        document.getElementById('live-cust-name').textContent = order.customer_name;
        document.getElementById('live-pkg-name').textContent = order.package_name;
        document.getElementById('live-domain').textContent = order.instance_domain;

        showToast('Pesanan berhasil dikirim ke Central SaaS! Menunggu persetujuan admin.');

        // Start Live Polling for Admin Approval
        const checkStatusUrl = `${lmdApi}/licenses/order_status?subscription_no=${encodeURIComponent(order.subscription_no)}`;

        if (activePollInterval) clearInterval(activePollInterval);

        activePollInterval = setInterval(async () => {
          try {
            const checkResp = await fetch(checkStatusUrl);
            const statusJson = await checkResp.json();

            if (statusJson.success && statusJson.data && statusJson.data.is_rejected) {
              clearInterval(activePollInterval);
              document.getElementById('waiting-screen').innerHTML = `
                <div style="font-size: 40px; margin-bottom: 10px;">⛔</div>
                <h3 style="font-size: 18px; font-weight: 800; color: #f87171; margin-bottom: 6px;">Pesanan Ditolak</h3>
                <p style="font-size: 13px; color: #94a3b8; max-width: 420px; margin: 0 auto;">
                  Pembayaran untuk <strong>${escapeHtml(order.subscription_no)}</strong> belum dapat dikonfirmasi oleh admin. Silakan hubungi tim kami dengan menyertakan nomor subskripsi ini.
                </p>`;
              return;
            }

            if (statusJson.success && statusJson.data && statusJson.data.is_approved) {
              // APPROVED!
              clearInterval(activePollInterval);
              document.getElementById('waiting-screen').classList.add('hidden');
              document.getElementById('approved-screen').classList.remove('hidden');

              const appUrl = statusJson.data.app_url
                || `${lmdHost}/mini-pos/?tenant=${encodeURIComponent(order.instance_domain)}&lic=${encodeURIComponent(statusJson.data.license_key)}`;
              document.getElementById('final-app-url').textContent = appUrl;
              document.getElementById('final-lic-key').textContent = statusJson.data.license_key;
              const credUserEl = document.getElementById('final-cred-user');
              if (credUserEl) credUserEl.textContent = order.customer_email;
              document.getElementById('btn-enter-app').href = appUrl;

              showToast('🎉 Selamat! Lisensi Anda telah di-approve dan aktif!');
            }
          } catch (pollErr) {
            console.warn('Polling error:', pollErr);
          }
        }, 2500);

      } catch (err) {
        alert('Gagal mengirim pesanan: ' + err.message);
        btn.disabled = false;
        btn.textContent = '✓ Saya Sudah Bayar (Kirim ke LMD)';
      }
    });

    openModal(installModal);
  }


  /**
   * Open Demo Modal
   */
  function openDemoModal(product) {
    const demoBody = document.getElementById('demo-modal-body');
    const demoUrlText = document.getElementById('demo-url-display');
    const demoTitle = document.getElementById('demo-modal-title');
    const btnOpenExternal = document.getElementById('btn-demo-open-external');

    if (!demoBody) return;

    demoTitle.textContent = product.demo.title;

    if (product.demo.type === 'live' && product.demo.url.startsWith('http://localhost')) {
      demoUrlText.textContent = product.demo.url;
      btnOpenExternal.href = product.demo.url;
      btnOpenExternal.style.display = 'inline-flex';

      demoBody.innerHTML = `
        <div class="demo-viewport-container">
          <iframe class="demo-iframe" src="${product.demo.url}" title="${product.name} Live Demo"></iframe>
        </div>
      `;
    } else {
      demoUrlText.textContent = `preview://${product.id}.dev`;
      btnOpenExternal.style.display = 'none';

      demoBody.innerHTML = `
        <div class="demo-simulated-view">
          <img src="${product.thumbnail}" alt="${product.name}" class="demo-preview-big-img" />
          <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">${product.name}</h3>
          <p style="color: #94a3b8; max-width: 600px; margin-bottom: 20px;">
            ${product.status === 'coming_soon' 
              ? 'Produk ini saat ini berada dalam tahap aktif roadmap rilis. Modul prototype dan interactive sandbox dapat diakses melalui early access pilot.' 
              : product.description}
          </p>
          <div style="display: flex; gap: 12px;">
            <button class="btn-action btn-install" onclick="window.triggerInstall('${product.id}')">
              Daftar Early Access & Panduan Install
            </button>
            <button class="btn-action btn-spec-detail" onclick="window.triggerSpec('${product.id}')">
              Lihat Spesifikasi Lengkap
            </button>
          </div>
        </div>
      `;
    }

    openModal(demoModal);
  }

  /**
   * Modal Open & Close Utilities
   */
  function openModal(modalElement) {
    if (!modalElement) return;
    closeAllModals();
    modalElement.classList.add('active');
    state.activeModal = modalElement;
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    state.activeModal = null;
    document.body.style.overflow = '';
  }

  // Global window helpers so modal buttons can cross-trigger
  window.triggerSpec = (id) => {
    const prod = products.find(p => p.id === id);
    if (prod) openSpecModal(prod);
  };

  window.triggerInstall = (id) => {
    const prod = products.find(p => p.id === id);
    if (prod) openInstallModal(prod);
  };

  window.triggerDemo = (id) => {
    const prod = products.find(p => p.id === id);
    if (prod) openDemoModal(prod);
  };

  window.triggerContact = (productName) => {
    openModal(contactModal);
  };

  /**
   * Setup UI Event Listeners
   */
  function setupEventListeners() {
    // Open Contact Modal from Navbar Button
    if (btnOpenContact) {
      btnOpenContact.addEventListener('click', () => openModal(contactModal));
    }

    // Search Input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (btnClearSearch) {
          btnClearSearch.style.display = state.searchQuery ? 'block' : 'none';
        }
        renderProducts();
      });
    }

    if (btnClearSearch) {
      btnClearSearch.addEventListener('click', () => {
        state.searchQuery = '';
        searchInput.value = '';
        btnClearSearch.style.display = 'none';
        renderProducts();
      });
    }

    // Status Tabs
    statusTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        statusTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.selectedStatus = tab.dataset.status;
        renderProducts();
      });
    });

    // Category Pills
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.selectedCategory = pill.dataset.category;
        renderProducts();
      });
    });

    // Sort Dropdown
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderProducts();
      });
    }

    // Modal Close Buttons
    document.querySelectorAll('.btn-modal-close').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    // Close Modal on Backdrop Click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeAllModals();
        }
      });
    });

    // Global Keybindings (Escape to close modal, / to focus search)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  }

  /**
   * Show Toast Notification
   */
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#38bdf8">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
});