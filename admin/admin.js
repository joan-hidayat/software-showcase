// NEXUS SHOWCASE ADMIN JS
const ADMIN_STORAGE_KEY = 'nexus_admin_products';

const admin = {
  products: [],

  init() {
    this.checkAuth();
    this.bindEvents();
  },

  // Login diperiksa server (admin/app.php hanya dikirim ke sesi yang sudah login, T-07)
  checkAuth() {
    this.loadData();
    this.renderDashboard();
  },

  logout() {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = 'index.php?action=logout';
    const csrf = document.createElement('input');
    csrf.type = 'hidden';
    csrf.name = 'csrf_token';
    csrf.value = document.body.dataset.csrf;
    form.appendChild(csrf);
    document.body.appendChild(form);
    form.submit();
  },

  loadData() {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) {
      try {
        this.products = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse localStorage data', e);
        this.products = (typeof PRODUCTS_DATA !== 'undefined') ? [...PRODUCTS_DATA] : [];
      }
    } else {
      this.products = (typeof PRODUCTS_DATA !== 'undefined') ? [...PRODUCTS_DATA] : [];
      this.saveData();
    }
  },

  saveData() {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(this.products));
  },

  resetDefault() {
    if (confirm('Yakin ingin mereset seluruh data ke data bawaan produk.js?')) {
      if (typeof PRODUCTS_DATA !== 'undefined') {
        this.products = JSON.parse(JSON.stringify(PRODUCTS_DATA));
        this.saveData();
        this.renderDashboard();
        this.renderProductsTable();
        this.toast('Data telah direset ke bawaan.');
      }
    }
  },

  navigate(pageId) {
    document.querySelectorAll('.admin-page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const targetPage = document.getElementById('page' + pageId.charAt(0).toUpperCase() + pageId.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase()));
    if (targetPage) targetPage.classList.add('active');

    const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update Title
    const titleEl = document.getElementById('pageTitle');
    const descEl = document.getElementById('pageDesc');
    if (pageId === 'dashboard') {
      titleEl.textContent = 'Dashboard';
      descEl.textContent = 'Ringkasan status portofolio software';
      this.renderDashboard();
    } else if (pageId === 'products') {
      titleEl.textContent = 'Produk Katalog';
      descEl.textContent = 'Kelola daftar produk, ubah status, dan detail spesifikasi';
      this.renderProductsTable();
    } else if (pageId === 'add-product') {
      const isEdit = document.getElementById('editProductId').value !== '';
      titleEl.textContent = isEdit ? 'Edit Produk' : 'Tambah Produk Baru';
      descEl.textContent = isEdit ? 'Perbarui informasi spesifikasi produk' : 'Input produk software baru ke katalog showcase';
    }
  },

  renderDashboard() {
    const total = this.products.length;
    const live = this.products.filter(p => p.status === 'released').length;
    const coming = this.products.filter(p => p.status === 'coming_soon').length;
    const avgRating = total > 0 ? (this.products.reduce((acc, p) => acc + (parseFloat(p.rating) || 0), 0) / total).toFixed(1) : '0.0';

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statLive').textContent = live;
    document.getElementById('statComing').textContent = coming;
    document.getElementById('statRating').textContent = avgRating;

    // Recent 4 products
    const tbody = document.getElementById('recentProductsTable');
    tbody.innerHTML = '';
    const recents = this.products.slice(0, 5);

    recents.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="../${p.thumbnail}" class="table-thumb" onerror="this.src='https://placehold.co/100x70/1e293b/fff?text=App'">
            <div>
              <span class="table-prod-name">${p.name}</span>
              <span class="table-prod-id">${p.id}</span>
            </div>
          </div>
        </td>
        <td><span class="badge" style="background:#1e293b; color:#cbd5e1; padding:3px 8px; border-radius:4px; font-size:11px;">${p.category}</span></td>
        <td><span class="status-badge ${p.status}">${p.statusLabel || (p.status === 'released' ? 'LIVE RELEASE' : 'COMING SOON')}</span></td>
        <td><code>${p.version || '-'}</code></td>
        <td>⭐ ${p.rating || '0.0'}</td>
        <td>
          <div class="action-btns">
            <button class="btn-icon" title="Edit" onclick="admin.editProduct('${p.id}')">✏️</button>
            <button class="btn-icon delete" title="Hapus" onclick="admin.deleteProduct('${p.id}')">🗑️</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    const query = (document.getElementById('productSearch').value || '').toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const catFilter = document.getElementById('filterCategory').value;

    const filtered = this.products.filter(p => {
      const matchQuery = !query || p.name.toLowerCase().includes(query) || (p.tagline && p.tagline.toLowerCase().includes(query));
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCat = catFilter === 'all' || p.category === catFilter;
      return matchQuery && matchStatus && matchCat;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#64748b;">Tidak ada produk yang cocok dengan filter.</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <img src="../${p.thumbnail}" class="table-thumb" onerror="this.src='https://placehold.co/100x70/1e293b/fff?text=App'">
        </td>
        <td>
          <span class="table-prod-name">${p.name}</span>
          <span class="table-prod-id">${p.id}</span>
          <span style="display:block; font-size:11px; color:#94a3b8; max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.tagline || ''}</span>
        </td>
        <td><span style="font-size:12px;">${p.category}</span></td>
        <td><span class="status-badge ${p.status}">${p.statusLabel || (p.status === 'released' ? 'LIVE RELEASE' : 'COMING SOON')}</span></td>
        <td>
          <div style="font-size:12px;"><strong>${p.version || '-'}</strong></div>
          <div style="font-size:11px; color:#64748b;">${p.releaseDate || '-'}</div>
        </td>
        <td><span style="font-size:12px; color:#94a3b8;">${(p.specs && p.specs.keyFeatures) ? p.specs.keyFeatures.length : 0} fitur</span></td>
        <td>
          <span style="font-size:11px; display:block;">Demo: <code>${p.demo && p.demo.type ? p.demo.type : 'none'}</code></span>
          <span style="font-size:11px; color:#64748b;">Tipe: ${p.install && p.install.type ? p.install.type : '-'}</span>
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-icon" title="Edit Produk" onclick="admin.editProduct('${p.id}')">✏️ Edit</button>
            <button class="btn-icon delete" title="Hapus Produk" onclick="admin.deleteProduct('${p.id}')">🗑️</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  editProduct(id) {
    const p = this.products.find(item => item.id === id);
    if (!p) return;

    document.getElementById('editProductId').value = p.id;
    document.getElementById('prodId').value = p.id;
    document.getElementById('prodId').disabled = true; // don't change slug in edit
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodStatus').value = p.status;
    document.getElementById('prodVersion').value = p.version || '';
    document.getElementById('prodReleaseDate').value = p.releaseDate || '';
    document.getElementById('prodRating').value = p.rating || 5.0;
    document.getElementById('prodThumbnail').value = p.thumbnail || '';
    document.getElementById('prodTagline').value = p.tagline || '';
    document.getElementById('prodDescription').value = p.description || '';

    // Specs
    document.getElementById('specPlatform').value = (p.specs && p.specs.platform) || '';
    document.getElementById('specArchitecture').value = (p.specs && p.specs.architecture) || '';
    document.getElementById('specTechStack').value = (p.specs && p.specs.techStack) ? p.specs.techStack.join(', ') : '';
    document.getElementById('reqRam').value = (p.specs && p.specs.systemRequirements && p.specs.systemRequirements.minRam) || '';
    document.getElementById('reqOs').value = (p.specs && p.specs.systemRequirements && p.specs.systemRequirements.os) || '';
    document.getElementById('reqDb').value = (p.specs && p.specs.systemRequirements && p.specs.systemRequirements.database) || '';
    document.getElementById('specKeyFeatures').value = (p.specs && p.specs.keyFeatures) ? p.specs.keyFeatures.join('\n') : '';

    // Demo & Install
    document.getElementById('lmdAppCode').value = p.lmdAppCode || '';
    document.getElementById('demoUrl').value = (p.demo && p.demo.url) || '';
    document.getElementById('demoType').value = (p.demo && p.demo.type) || 'direct';
    document.getElementById('installType').value = (p.install && p.install.type) || 'zip_installer';
    document.getElementById('installSize').value = (p.install && p.install.fileSize) || '';
    document.getElementById('installCommand').value = (p.install && (p.install.gitRepo || p.install.commandLine)) || '';
    document.getElementById('installSteps').value = (p.install && p.install.steps) ? p.install.steps.join('\n') : '';

    this.navigate('add-product');
  },

  deleteProduct(id) {
    const p = this.products.find(item => item.id === id);
    if (!p) return;

    if (confirm(`Hapus produk "${p.name}" (${p.id}) dari katalog?`)) {
      this.products = this.products.filter(item => item.id !== id);
      this.saveData();
      this.renderDashboard();
      this.renderProductsTable();
      this.toast(`Produk "${p.name}" telah dihapus.`);
    }
  },

  saveProductForm(e) {
    e.preventDefault();
    const editId = document.getElementById('editProductId').value;
    const isEdit = editId !== '';

    const id = isEdit ? editId : document.getElementById('prodId').value.trim();
    if (!id) {
      alert('ID produk wajib diisi!');
      return;
    }

    if (!isEdit && this.products.some(p => p.id === id)) {
      alert('ID produk ini sudah ada! Gunakan slug unik lainnya.');
      return;
    }

    const techStackRaw = document.getElementById('specTechStack').value;
    const featuresRaw = document.getElementById('specKeyFeatures').value;
    const stepsRaw = document.getElementById('installSteps').value;

    const statusVal = document.getElementById('prodStatus').value;

    const productObj = {
      id: id,
      name: document.getElementById('prodName').value.trim(),
      category: document.getElementById('prodCategory').value.trim(),
      status: statusVal,
      statusLabel: statusVal === 'released' ? 'LIVE RELEASE' : 'COMING SOON',
      badgeColor: statusVal === 'released' ? '#10b981' : '#06b6d4',
      rating: parseFloat(document.getElementById('prodRating').value) || 5.0,
      reviewsCount: 15,
      thumbnail: document.getElementById('prodThumbnail').value.trim(),
      lmdAppCode: document.getElementById('lmdAppCode').value.trim().toUpperCase() || undefined,
      tagline: document.getElementById('prodTagline').value.trim(),
      description: document.getElementById('prodDescription').value.trim(),
      version: document.getElementById('prodVersion').value.trim(),
      releaseDate: document.getElementById('prodReleaseDate').value.trim(),
      specs: {
        platform: document.getElementById('specPlatform').value.trim(),
        architecture: document.getElementById('specArchitecture').value.trim(),
        techStack: techStackRaw ? techStackRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
        systemRequirements: {
          minRam: document.getElementById('reqRam').value.trim(),
          os: document.getElementById('reqOs').value.trim(),
          database: document.getElementById('reqDb').value.trim()
        },
        hardwareSupport: [],
        keyFeatures: featuresRaw ? featuresRaw.split('\n').map(s => s.trim()).filter(Boolean) : []
      },
      demo: {
        available: true,
        url: document.getElementById('demoUrl').value.trim(),
        title: 'Live Demo ' + document.getElementById('prodName').value.trim(),
        type: document.getElementById('demoType').value
      },
      install: {
        type: document.getElementById('installType').value,
        downloadPackage: id + '-installer-v' + (document.getElementById('prodVersion').value.trim().replace(/^v/, '') || '1.0.0') + '.zip',
        fileSize: document.getElementById('installSize').value.trim(),
        gitRepo: document.getElementById('installCommand').value.trim(),
        commandLine: document.getElementById('installCommand').value.trim(),
        envConfig: [],
        steps: stepsRaw ? stepsRaw.split('\n').map(s => s.trim()).filter(Boolean) : []
      }
    };

    if (isEdit) {
      const idx = this.products.findIndex(p => p.id === editId);
      if (idx !== -1) {
        this.products[idx] = productObj;
      }
      this.toast(`Produk "${productObj.name}" berhasil diperbarui!`);
    } else {
      this.products.unshift(productObj);
      this.toast(`Produk "${productObj.name}" berhasil ditambahkan!`);
    }

    this.saveData();
    this.resetForm();
    this.navigate('products');
  },

  resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('prodId').disabled = false;
  },

  exportProductsJs() {
    const jsonStr = JSON.stringify(this.products, null, 2);
    const fileContent = `/**\n * NEXUS PORTFOLIO SOFTWARE CATALOG DATA\n * Auto-generated by Admin Showcase Panel\n */\nconst PRODUCTS_DATA = ${jsonStr};\n\n// Support commonjs if needed\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = PRODUCTS_DATA;\n}\n`;
    
    const blob = new Blob([fileContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.toast('File products.js berhasil diekspor! Salin ke folder data/products.js');
  },

  toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      el.classList.add('hidden');
    }, 3000);
  },

  bindEvents() {
    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => this.logout());

    // Navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        if (page === 'add-product') {
          this.resetForm();
        }
        this.navigate(page);
      });
    });

    document.getElementById('btnQuickAdd').addEventListener('click', () => {
      this.resetForm();
      this.navigate('add-product');
    });

    // Search and filters
    document.getElementById('productSearch').addEventListener('input', () => this.renderProductsTable());
    document.getElementById('filterStatus').addEventListener('change', () => this.renderProductsTable());
    document.getElementById('filterCategory').addEventListener('change', () => this.renderProductsTable());

    // Form submit
    document.getElementById('productForm').addEventListener('submit', (e) => this.saveProductForm(e));

    // Export & Reset
    document.getElementById('btnExportData').addEventListener('click', () => this.exportProductsJs());
    document.getElementById('btnResetData').addEventListener('click', () => this.resetDefault());
  }
};

document.addEventListener('DOMContentLoaded', () => {
  admin.init();
});
