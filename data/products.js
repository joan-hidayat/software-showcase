/**
 * Software Portfolio Catalogue Data
 * Comprehensive data structure for released and upcoming SaaS / enterprise products
 */
const PRODUCTS_DATA = [
  {
    "id": "mini-pos-express",
    "name": "Mini POS Express (Portable Cloud/LAN)",
    "category": "Retail & F&B",
    "status": "released",
    "statusLabel": "Live Release (v1.0)",
    "badgeColor": "emerald",
    "rating": "5.0",
    "reviewsCount": 42,
    "thumbnail": "assets/images/thumb_resto_pos.jpg",
    "tagline": "Aplikasi Kasir Ringan Siap Pakai Multi-Device & Auto-License LMD",
    "description": "Solusi kasir web portable responsif yang dirancang untuk pengujian langsung dari perangkat lain (Laptop / Smartphone). Dilengkapi wizard aktivasi otomatis yang langsung terhubung ke Central SaaS LMD serta fitur transaksi kasir dan cetak nota digital.",
    "version": "v1.0.0 (Stable)",
    "releaseDate": "Oktober 2026",
    "specs": {
      "platform": "Web Application (Cross-Platform Mobile & Desktop)",
      "architecture": "Single-Page Client-Server with Real-Time Telemetry",
      "techStack": [
        "HTML5 Responsive",
        "Vanilla CSS3",
        "JavaScript ES6+",
        "REST API Client"
      ],
      "systemRequirements": {
        "minRam": "512 MB RAM",
        "os": "Android, iOS, Windows, macOS, Linux",
        "webServer": "Apache / Nginx / Browser Native",
        "database": "Local Storage & Cloud Telemetry API"
      },
      "hardwareSupport": [
        "Thermal Receipt Printer 58mm & 80mm",
        "Smartphone Touchscreen Display",
        "Bluetooth Barcode Scanner"
      ],
      "keyFeatures": [
        "Wizard Aktivasi Otomatis Terhubung ke Central SaaS LMD",
        "Antarmuka Kasir POS Cepat dengan Kalkulator PPN Otomatis",
        "Cetak Struk Digital Interaktif dengan Kode Lisensi",
        "Pengujian Heartbeat Telemetri Validasi Langsung ke Server LMD",
        "Akses Multi-Device via Wi-Fi Lokal Tanpa Perlu Instalasi di HP"
      ]
    },
    "demo": {
      "available": true,
      "url": "http://192.168.0.116:8080/mini-pos/",
      "title": "Live Interactive Demo - Mini POS Express",
      "type": "live"
    },
    "install": {
      "type": "guide",
      "downloadPackage": "mini-pos-v1.0.0-installer.zip",
      "fileSize": "18.5 KB",
      "gitRepo": "http://192.168.0.116:8080/mini-pos/",
      "commandLine": "curl -O http://192.168.0.116:8080/software-showcase/downloads/mini-pos-v1.0.0-installer.zip",
      "envConfig": [
        "LMD_HOST=http://192.168.0.116:8080",
        "APP_CODE=APOTEK",
        "PACKAGE=APO_PRO"
      ],
      "steps": [
        "Dari HP atau Laptop lain pada Wi-Fi yang sama, buka Showcase di: http://192.168.0.116:8080/software-showcase/",
        "Klik tombol 'Install' atau 'Demo' pada kartu Mini POS Express",
        "Unduh paket ZIP installer atau langsung buka aplikasi di HP Anda",
        "Isi form aktivasi awal (Nama Toko & Email)",
        "Klik tombol 'Hubungkan & Terbitkan Lisensi Otomatis'",
        "Aplikasi langsung aktif dengan license key resmi dari Central SaaS LMD!"
      ]
    }
  },
  {
    "id": "apotek-smart-pos",
    "name": "Apotek Smart POS & Pharmacy ERP",
    "category": "Healthcare",
    "status": "released",
    "statusLabel": "Live Release (v2.4)",
    "badgeColor": "emerald",
    "rating": "4.9",
    "reviewsCount": 38,
    "thumbnail": "assets/images/thumb_apotek_pos.jpg",
    "tagline": "Sistem Kasir Farmasi & Manajemen Inventori Obat Cerdas (FEFO/FIFO)",
    "description": "Solusi enterprise komprehensif untuk apotek mandiri maupun jaringan apotek berantai. Mengintegrasikan kasir POS cepat, kontrol inventori obat dengan peringatan kadaluarsa dini otomatis, integrasi resep dokter, hingga laporan laba-rugi per transaksi.",
    "version": "v2.4.0 (Stable)",
    "releaseDate": "Oktober 2026",
    "specs": {
      "platform": "Web Application (Cross-Platform Responsive)",
      "architecture": "Modular MVC Architecture with PDO Singleton Driver",
      "techStack": [
        "PHP 8.2+",
        "MySQL 8.0 / MariaDB",
        "JavaScript ES6+",
        "CSS3 Glassmorphism"
      ],
      "systemRequirements": {
        "minRam": "2 GB RAM (Rekomendasi 4 GB)",
        "os": "Windows 10/11, Ubuntu 22.04 LTS, macOS",
        "webServer": "Apache / Nginx (XAMPP & Laragon Compatible)",
        "database": "MySQL 8.0+ atau MariaDB 10.5+"
      },
      "hardwareSupport": [
        "Printer Kasir Thermal 58mm & 80mm (ESC/POS Direct Print)",
        "Barcode Scanner USB / Wireless Bluetooth (1D Code 128 / 2D QR Code)",
        "Cash Drawer RJ11 Auto-kick Trigger"
      ],
      "keyFeatures": [
        "Pelacakan Batch & Kadaluarsa Berbasis FEFO (First Expired First Out)",
        "Point of Sale (POS) Kasir Multi-Metode (Tunai, QRIS, Transfer Bank, Debit)",
        "Peringatan Stok Rendah & Rekomendasi Surat Pesanan (SP) Supplier Otomatis",
        "Pencatatan Resep Obat Racikan & Non-Racikan dengan Validasi Dosis",
        "Laporan Penjualan Harian, Omset Bulanan, Margin Laba, dan Neraca Finansial"
      ]
    },
    "demo": {
      "available": true,
      "url": "http://localhost:8080/apotek",
      "title": "Live Interactive Demo - Apotek POS",
      "type": "live"
    },
    "install": {
      "type": "guide",
      "downloadPackage": "apotek-pos-v2.4.0-installer.zip",
      "fileSize": "14.2 MB",
      "gitRepo": "https://github.com/joan-hidayat/apotek.git",
      "commandLine": "git clone http://localhost:8080/apotek.git && cd apotek",
      "envConfig": [
        "DB_HOST=127.0.0.1",
        "DB_NAME=apotek_db",
        "DB_USER=root",
        "DB_PASS="
      ],
      "steps": [
        "Unduh installer ZIP atau clone repository ke folder c:\\xampp\\htdocs\\apotek",
        "Buat database baru bernama apotek_db di phpMyAdmin",
        "Import skema tabel dari berkas database/schema.sql",
        "Sesuaikan pengaturan koneksi database pada api/config/database.php",
        "Buka browser dan kunjungi http://localhost:8080/apotek untuk mulai menggunakan"
      ]
    }
  },
  {
    "id": "license-management-dashboard",
    "name": "License Management Dashboard (LMD)",
    "category": "Cybersecurity & SaaS",
    "status": "released",
    "statusLabel": "Live Release (v1.0)",
    "badgeColor": "indigo",
    "rating": "5.0",
    "reviewsCount": 24,
    "thumbnail": "assets/images/thumb_lmd_saas.jpg",
    "tagline": "Central SaaS Licensing Hub, Domain Lockdown & Real-time Audit",
    "description": "Infrastruktur otorisasi dan kontrol lisensi software terpusat. Melindungi aplikasi komersial dari pembajakan dengan validasi kunci kriptografi, penguncian hardware fingerprint (Machine UUID/MAC), batasan domain, kuota modul, dan audit log pelacakan instans real-time.",
    "version": "v1.0.0 (Production)",
    "releaseDate": "Oktober 2026",
    "specs": {
      "platform": "Central SaaS Management Portal & RESTful API Engine",
      "architecture": "Clean REST Router with Singleton PDO Database Pattern",
      "techStack": [
        "PHP 8.2 (RESTful Backend)",
        "MySQL 8.0 InnoDB",
        "Vanilla Modern UI",
        "Crypto Hash Verification"
      ],
      "systemRequirements": {
        "minRam": "1 GB RAM (Rekomendasi 2 GB)",
        "os": "Linux Cloud VPS (Ubuntu/CentOS), Windows Server",
        "webServer": "Apache dengan mod_rewrite aktif / Nginx",
        "database": "MySQL 8.0+ dengan dukungan foreign keys"
      },
      "hardwareSupport": [
        "Client Hardware Fingerprinting (MAC Address / CPU GUID)",
        "Domain & IP Whitelisting Validation",
        "Webhook Alert Push Notification"
      ],
      "keyFeatures": [
        "Generasi License Key 32-karakter unik dengan enkripsi tingkat tinggi",
        "Validasi Klien Berkecepatan Tinggi (Sub-50ms) via REST API Endpoint",
        "Hardware Lockdown: Proteksi software agar tidak dapat disalin ke server lain",
        "Manajemen Masa Berlaku, Langganan Bulanan/Tahunan, dan Auto-Suspension",
        "Executive Dashboard: Metrik klien aktif, MRR, utilisasi modul, dan log pelanggaran"
      ]
    },
    "demo": {
      "available": true,
      "url": "http://localhost:8080/License-Management-Dashboard",
      "title": "Live Dashboard - License Management System",
      "type": "live"
    },
    "install": {
      "type": "guide",
      "downloadPackage": "lmd-saas-core-v1.0.zip",
      "fileSize": "8.6 MB",
      "gitRepo": "https://github.com/joan-hidayat/LMD.git",
      "commandLine": "git clone https://github.com/joan-hidayat/LMD.git && cd LMD",
      "envConfig": [
        "DB_HOST=127.0.0.1",
        "DB_NAME=central_saas",
        "DB_USER=root",
        "DB_PASS="
      ],
      "steps": [
        "Clone repo ke direktori xampp: git clone https://github.com/joan-hidayat/LMD.git",
        "Import skema tabel database/schema.sql dan data awal database/seed.sql",
        "Pastikan modul rewrite (mod_rewrite) pada web server Apache telah aktif",
        "Akses dashboard lisensi melalui browser di http://localhost:8080/License-Management-Dashboard/"
      ]
    }
  },
  {
    "id": "clinic-care-emr",
    "name": "ClinicCare & SatuSehat E-Medical Record (EMR)",
    "category": "Healthcare",
    "status": "coming_soon",
    "statusLabel": "Coming Soon (Q4 2026)",
    "badgeColor": "cyan",
    "rating": "4.9 (Preview)",
    "reviewsCount": 16,
    "thumbnail": "assets/images/thumb_clinic_emr.jpg",
    "tagline": "Rekam Medis Elektronik Terstandarisasi SatuSehat Kemenkes RI",
    "description": "Sistem informasi manajemen klinik pratama dan utama dengan integrasi penuh ke platform SatuSehat Kemenkes RI. Dilengkapi pencatatan medis SOAP terstruktur, bridging BPJS PCare ready, antrean poli cerdas, dan portal riwayat kesehatan pasien.",
    "version": "v1.0.0 Beta (In Development)",
    "releaseDate": "Desember 2026 (Roadmap)",
    "specs": {
      "platform": "Cloud-Ready Hybrid Web Application",
      "architecture": "HL7 FHIR Interoperability Architecture",
      "techStack": [
        "Next-Gen PHP / Node API",
        "MySQL 8.0 / PostgreSQL",
        "HL7 / FHIR Standards",
        "Encrypted Medical Vault"
      ],
      "systemRequirements": {
        "minRam": "4 GB RAM (Rekomendasi 8 GB)",
        "os": "Windows 10/11 / Linux Cloud Server",
        "webServer": "SSL Enabled (HTTPS Wajib untuk SatuSehat)",
        "database": "Relational DB dengan enkripsi data medis at-rest"
      },
      "hardwareSupport": [
        "Fingerprint Reader untuk Verifikasi Dokter & Pasien",
        "Digital Signature Pad untuk Persetujuan Tindakan Medis (Informed Consent)",
        "Display Layar Panggilan Antrean Pasien (HDMI / Smart TV)"
      ],
      "keyFeatures": [
        "Sinkronisasi Data Medis Standar HL7/FHIR ke Platform SatuSehat Kemenkes",
        "Pencatatan Anamnesis, Diagnosa ICD-10, dan Tindakan ICD-9-CM Terstandar",
        "E-Prescribing (Resep Elektronik) otomatis terkirim ke Instalasi Farmasi",
        "Dashboard Jadwal & Kuota Praktik Dokter Spesialis dengan Notifikasi Pasien",
        "Telemedicine & Pengingat Kontrol Pasien Berkala via WhatsApp Gateway"
      ]
    },
    "demo": {
      "available": true,
      "url": "#interactive-preview",
      "title": "Interactive Prototype - ClinicCare EMR",
      "type": "prototype"
    },
    "install": {
      "type": "waitlist",
      "downloadPackage": "cliniccare-emr-early-beta.zip",
      "fileSize": "22.5 MB",
      "gitRepo": "Private Repository (Early Access Pilot Program)",
      "commandLine": "npx cliniccare-cli init --early-access",
      "envConfig": [
        "SATUSEHAT_ORG_ID=YOUR_ORGANIZATION_ID",
        "SATUSEHAT_CLIENT_ID=YOUR_CLIENT_ID",
        "SATUSEHAT_CLIENT_SECRET=YOUR_CLIENT_SECRET"
      ],
      "steps": [
        "Daftarkan faskes/klinik Anda ke program Early Access Pilot Project",
        "Dapatkan kredensial Sandbox API SatuSehat Kemenkes RI",
        "Download pre-configured Docker image atau installer on-premise",
        "Ikuti onboarding panduan konfigurasi variabel lingkungan dan master data poli"
      ]
    }
  },
  {
    "id": "wms-logistics-ai",
    "name": "LogistiqueTech - AI Warehouse & Supply Chain (WMS)",
    "category": "Logistics & ERP",
    "status": "coming_soon",
    "statusLabel": "Coming Soon (Q1 2027)",
    "badgeColor": "amber",
    "rating": "4.8 (Preview)",
    "reviewsCount": 12,
    "thumbnail": "assets/images/thumb_wms_ai.jpg",
    "tagline": "Visualisasi Gudang Isometrik 3D & Prediksi Restock Berbasis AI",
    "description": "Sistem otomatisasi pergudangan modern dengan peta 3D interaktif untuk visualisasi kapasitas rak secara real-time. Memanfaatkan algoritma machine learning untuk memprediksi pola konsumsi barang, meminimalkan overstock, dan mempercepat alur picking barang.",
    "version": "v0.9.0 Alpha",
    "releaseDate": "Februari 2027 (Roadmap)",
    "specs": {
      "platform": "Web & Industrial Handheld PDA Terminal (PWA)",
      "architecture": "Event-Driven Microservices with 3D Spatial Rendering",
      "techStack": [
        "PHP 8.3",
        "Three.js / Canvas 3D Engine",
        "Python AI Engine",
        "MySQL Spatial Index"
      ],
      "systemRequirements": {
        "minRam": "4 GB RAM (8 GB untuk cluster multi-gudang)",
        "os": "Ubuntu Server 22.04 LTS / Windows Server",
        "webServer": "Nginx / Apache Reverse Proxy",
        "database": "MySQL 8.0+ / Redis Cache"
      },
      "hardwareSupport": [
        "Industrial Handheld PDA Scanner (Android Enterprise Rugged)",
        "Fixed RFID Gate Reader (EPC Gen2 UHF)",
        "Electronic Shelf Label (ESL) Wireless Gateway"
      ],
      "keyFeatures": [
        "3D Isometric Warehouse Map: Monitoring okupansi ruang dan rak secara visual",
        "AI Demand Forecasting: Prediksi kebutuhan stok berdasarkan tren musiman",
        "Putaway & Picking Path Optimization untuk efisiensi mobilitas staf gudang",
        "Stock Opname Tanpa Henti (Cycle Counting) dengan barcode genggam",
        "Integrasi Marketplace & Ekspedisi Pengiriman Otomatis"
      ]
    },
    "demo": {
      "available": true,
      "url": "#interactive-preview",
      "title": "Interactive Prototype - LogistiqueTech WMS",
      "type": "prototype"
    },
    "install": {
      "type": "waitlist",
      "downloadPackage": "logistiquetech-wms-beta.zip",
      "fileSize": "35.8 MB",
      "gitRepo": "Private Enterprise Repository",
      "commandLine": "docker compose up -d wms-core wms-ai-engine",
      "envConfig": [
        "APP_ENV=production",
        "AI_FORECAST_MODEL=v2.1",
        "REDIS_HOST=127.0.0.1"
      ],
      "steps": [
        "Persiapkan server Linux dengan Docker dan Docker Compose aktif",
        "Unduh bundle konfigurasi compose dan script migrasi spatial database",
        "Konfigurasikan layout gudang (dimensi rak, lorong, dan zona A-B-C)",
        "Daftarkan terminal scanner PDA staff via QR pairing code"
      ]
    }
  },
  {
    "id": "dineflow-resto-pos",
    "name": "DineFlow - Restaurant POS & Kitchen Display (KDS)",
    "category": "F&B & Retail",
    "status": "released",
    "statusLabel": "Live Release (v1.8)",
    "badgeColor": "rose",
    "rating": "4.9",
    "reviewsCount": 42,
    "thumbnail": "assets/images/thumb_resto_pos.jpg",
    "tagline": "Solusi Kasir Restoran, QR Meja, & Sinkronisasi Dapur Real-time",
    "description": "Sistem operasional F&B all-in-one yang menghubungkan pesanan meja tamu, kasir POS, dan layar dapur (Kitchen Display System). Dilengkapi pemesanan mandiri via scan QR code tanpa install aplikasi, split-bill fleksibel, dan manajemen stok bahan baku otomatis.",
    "version": "v1.8.2 (Stable)",
    "releaseDate": "September 2026",
    "specs": {
      "platform": "Web Application & Real-time Kitchen Display",
      "architecture": "Real-Time Event Broadcast Architecture",
      "techStack": [
        "PHP 8.2",
        "WebSocket / Server-Sent Events",
        "Vanilla CSS3 Dynamic Theme",
        "IndexedDB Offline Sync"
      ],
      "systemRequirements": {
        "minRam": "2 GB RAM",
        "os": "Windows / Android Tablet / iPad / Linux",
        "webServer": "Apache / Nginx Local LAN Server",
        "database": "MySQL 8.0"
      },
      "hardwareSupport": [
        "Printer Dapur & Bar (LAN Ethernet / Wi-Fi thermal print)",
        "Touchscreen Cashier All-in-One POS Terminal",
        "Kitchen Display Monitor (Smart TV / Android Box)"
      ],
      "keyFeatures": [
        "Interactive Floor & Table Map dengan indikator meja terisi/kosong/reserved",
        "Kitchen Display System (KDS) Real-time: Tiket pesanan terupdate tanpa kertas",
        "Self-Order QR Meja: Tamu langsung pesan dan bayar dari smartphone",
        "Split-bill per orang atau per item pesanan dalam hitungan detik",
        "Manajemen Komposisi Bahan Baku (Resep) & Pengurangan Stok Otomatis saat menu terjual"
      ]
    },
    "demo": {
      "available": true,
      "url": "#interactive-preview",
      "title": "Interactive Demo - DineFlow POS & KDS",
      "type": "live"
    },
    "install": {
      "type": "guide",
      "downloadPackage": "dineflow-pos-v1.8.2.zip",
      "fileSize": "16.8 MB",
      "gitRepo": "https://github.com/joan-hidayat/dineflow.git",
      "commandLine": "git clone http://localhost:8080/dineflow.git && cd dineflow",
      "envConfig": [
        "DB_HOST=127.0.0.1",
        "DB_NAME=dineflow_resto",
        "KDS_WEBSOCKET_PORT=8080"
      ],
      "steps": [
        "Ekstrak berkas dineflow ke dalam direktori xampp/htdocs/dineflow",
        "Jalankan migrasi database dineflow_resto dari berkas db/schema.sql",
        "Buka panel pengaturan untuk mendefinisikan layout meja dan IP printer dapur",
        "Akses http://localhost:8080/dineflow pada terminal kasir dan layar dapur"
      ]
    }
  },
  {
    "id": "talentsync-hris",
    "name": "TalentSync - HRIS & Smart Payroll Engine",
    "category": "Enterprise & HR",
    "status": "coming_soon",
    "statusLabel": "Coming Soon (Q2 2027)",
    "badgeColor": "purple",
    "rating": "4.8 (Preview)",
    "reviewsCount": 19,
    "thumbnail": "assets/images/thumb_hris_payroll.jpg",
    "tagline": "Presensi Geofencing, Pajak PPh 21 TER, & Slip Gaji WhatsApp",
    "description": "Platform Human Resource Information System (HRIS) untuk enterprise modern. Mengelola absensi anti-fake GPS dengan validasi wajah (liveness detection), perhitungan pajak penghasilan PPh 21 skema TER (Tarif Efektif Rata-rata), BPJS otomatis, dan distribusi slip gaji PDF langsung ke nomor WhatsApp karyawan.",
    "version": "v0.8.5 Alpha",
    "releaseDate": "Mei 2027 (Roadmap)",
    "specs": {
      "platform": "Enterprise Web Portal & Employee Self-Service Mobile PWA",
      "architecture": "Multi-tenant Payroll Engine with Secure Encryption",
      "techStack": [
        "PHP 8.3 Enterprise",
        "MySQL 8.0",
        "WhatsApp Business Cloud API",
        "Vanilla Modern UI"
      ],
      "systemRequirements": {
        "minRam": "4 GB RAM",
        "os": "Windows Server / Linux Cloud Instance",
        "webServer": "Nginx / Apache dengan SSL Wajib",
        "database": "MySQL 8.0 dengan partisi data gaji terenkripsi"
      },
      "hardwareSupport": [
        "Smartphone GPS & Biometric Face Authentication",
        "Integrasi Mesin Fingerprint Solution / ZKTeco via ADMS LAN",
        "WhatsApp Gateway Server untuk Otomasi Notifikasi"
      ],
      "keyFeatures": [
        "Absensi Pintar Geofencing: Anti fake-GPS dengan verifikasi wajah liveness",
        "Perhitungan Pajak PPh 21 Skema TER (Kategori A, B, C) sesuai aturan PMK terbaru",
        "Kalkulasi Otomatis Iuran BPJS Ketenagakerjaan (JKK, JKM, JHT, JP) & Kesehatan",
        "Pengiriman Slip Gaji Terenkripsi Password PDF langsung via WhatsApp & Email",
        "Manajemen Onboarding Karyawan, KPI Kinerja, dan Riwayat Kontrak Kerja"
      ]
    },
    "demo": {
      "available": true,
      "url": "#interactive-preview",
      "title": "Interactive Prototype - TalentSync HRIS",
      "type": "prototype"
    },
    "install": {
      "type": "waitlist",
      "downloadPackage": "talentsync-hris-alpha.zip",
      "fileSize": "28.4 MB",
      "gitRepo": "Private Enterprise Repository",
      "commandLine": "composer create-project talentsync/hris-enterprise",
      "envConfig": [
        "APP_NAME=TalentSync",
        "TER_TAX_COMPLIANT=true",
        "WA_GATEWAY_TOKEN=YOUR_TOKEN"
      ],
      "steps": [
        "Daftarkan domain perusahaan Anda untuk lisensi enterprise multi-tenant",
        "Setup database MySQL dan jalankan script inisialisasi master formula payroll",
        "Tentukan titik koordinat kantor/cabang (Latitude, Longitude, Radius toleransi)",
        "Import data karyawan dari template spreadsheet resmi untuk aktivasi massal"
      ]
    }
  }
];

// Support commonjs if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS_DATA;
}
