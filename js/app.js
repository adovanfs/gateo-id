/**
 * GateO.ID — Main Application
 * Dark Minimalist Elegant Landing Page + Admin Panel
 */

(function () {
  "use strict";

  // ========== STATE ==========
  let allProducts = [];
  let filteredProducts = [];
  let isAdminAuthenticated = false;

  // ========== DOM ==========
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {
    loading: $("#loading"),
    empty: $("#empty"),
    grid: $("#products-grid"),
    search: $("#search-input"),
    categoryFilter: $("#category-filter"),
    sortFilter: $("#sort-filter"),
    year: $("#year"),
    adminTrigger: $("#admin-trigger"),
    modal: $("#admin-modal"),
    modalClose: $("#modal-close"),
    loginForm: $("#login-form"),
    adminPassword: $("#admin-password"),
    loginError: $("#login-error"),
    adminLogin: $("#admin-login"),
    adminFormWrap: $("#admin-form-wrap"),
    productForm: $("#product-form"),
    formStatus: $("#form-status"),
    logoutBtn: $("#logout-btn"),
    categoryList: $("#category-list"),
  };

  // ========== SAMPLE DATA (fallback) ==========
  const SAMPLE_PRODUCTS = [
    {
      id: "1",
      title: "Apple AirPods Pro (2nd generation)",
      affiliate_link: "https://shopee.co.id/",
      image_url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80",
      price: "Rp 3.499.000",
      description: "Active Noise Cancellation, Adaptive Audio, USB-C.",
      category: "Audio",
      status: "active",
      created_at: "2026-01-15T10:00:00Z"
    },
    {
      id: "2",
      title: "iPhone 16 Pro Max 256GB",
      affiliate_link: "https://shopee.co.id/",
      image_url: "https://images.unsplash.com/photo-1695048133142-1a20484428d1?w=600&q=80",
      price: "Rp 22.999.000",
      description: "Titanium design, A18 Pro chip, Camera Control.",
      category: "Smartphone",
      status: "active",
      created_at: "2026-02-01T08:00:00Z"
    },
    {
      id: "3",
      title: "MacBook Air 13-inch M3",
      affiliate_link: "https://shopee.co.id/",
      image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
      price: "Rp 18.499.000",
      description: "Super thin, silent, all-day battery life.",
      category: "Laptop",
      status: "active",
      created_at: "2026-01-20T12:00:00Z"
    },
    {
      id: "4",
      title: "Apple Watch Series 10",
      affiliate_link: "https://shopee.co.id/",
      image_url: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80",
      price: "Rp 6.999.000",
      description: "Thinner design, brighter display, health insights.",
      category: "Wearable",
      status: "active",
      created_at: "2026-02-10T09:00:00Z"
    }
  ];

  // ========== UTILS ==========
  function formatPrice(price) {
    if (!price) return "—";
    return String(price).trim();
  }

  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const num = String(priceStr).replace(/[^\d]/g, "");
    return parseInt(num, 10) || 0;
  }

  function show(el) {
    el?.classList.remove("hidden");
  }

  function hide(el) {
    el?.classList.add("hidden");
  }

  function setStatus(msg, type = "success") {
    els.formStatus.textContent = msg;
    els.formStatus.className = `status-msg ${type}`;
    show(els.formStatus);
  }

  // ========== DATA FETCH ==========
  async function fetchProducts() {
    show(els.loading);
    hide(els.empty);
    els.grid.innerHTML = "";

    // Jika masih pakai sample
    if (CONFIG.USE_SAMPLE_DATA || !CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")) {
      await new Promise((r) => setTimeout(r, 600)); // simulasi loading
      allProducts = SAMPLE_PRODUCTS.filter((p) => p.status === "active");
      applyFilters();
      hide(els.loading);
      return;
    }

    try {
      const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: "GET",
        redirect: "follow"
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.products)) {
        allProducts = data.products.filter((p) => p.status === "active" || p.status === true || p.status === "TRUE");
      } else {
        allProducts = [];
      }
    } catch (err) {
      console.error("Fetch error:", err);
      allProducts = SAMPLE_PRODUCTS; // fallback
    }

    applyFilters();
    hide(els.loading);
  }

  // ========== RENDER ==========
  function renderProducts(products) {
    els.grid.innerHTML = "";

    if (products.length === 0) {
      show(els.empty);
      return;
    }
    hide(els.empty);

    const frag = document.createDocumentFragment();

    products.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product-card";

      const imgHtml = p.image_url
        ? `<img class="product-image" src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'>No Image</div>'" />`
        : `<div class="product-image-placeholder">No Image</div>`;

      card.innerHTML = `
        <div class="product-image-wrap">
          ${imgHtml}
        </div>
        <div class="product-body">
          ${p.category ? `<span class="product-category">${escapeHtml(p.category)}</span>` : ""}
          <h3 class="product-title">${escapeHtml(p.title)}</h3>
          ${p.description ? `<p class="product-desc">${escapeHtml(p.description)}</p>` : ""}
          <div class="product-footer">
            <span class="product-price">${escapeHtml(formatPrice(p.price))}</span>
            <a href="${escapeHtml(p.affiliate_link)}" target="_blank" rel="noopener noreferrer sponsored" class="btn-buy">
              Beli di Shopee
            </a>
          </div>
        </div>
      `;
      frag.appendChild(card);
    });

    els.grid.appendChild(frag);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ========== FILTER & SORT ==========
  function applyFilters() {
    let list = [...allProducts];

    // Search
    const q = els.search.value.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    // Category
    const cat = els.categoryFilter.value;
    if (cat) {
      list = list.filter((p) => (p.category || "").toLowerCase() === cat.toLowerCase());
    }

    // Sort
    const sort = els.sortFilter.value;
    if (sort === "newest") {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sort === "price-asc") {
      list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sort === "price-desc") {
      list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sort === "name") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    filteredProducts = list;
    renderProducts(filteredProducts);
    updateCategoryOptions();
  }

  function updateCategoryOptions() {
    const cats = [...new Set(allProducts.map((p) => p.category).filter(Boolean))].sort();
    const current = els.categoryFilter.value;

    els.categoryFilter.innerHTML = `<option value="">Semua Kategori</option>`;
    cats.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      if (c === current) opt.selected = true;
      els.categoryFilter.appendChild(opt);
    });

    // Datalist for form
    if (els.categoryList) {
      els.categoryList.innerHTML = "";
      cats.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c;
        els.categoryList.appendChild(opt);
      });
    }
  }

  // ========== ADMIN ==========
  function openModal() {
    show(els.modal);
    els.modal.setAttribute("aria-hidden", "false");
    if (!isAdminAuthenticated) {
      show(els.adminLogin);
      hide(els.adminFormWrap);
      els.adminPassword.value = "";
      hide(els.loginError);
      setTimeout(() => els.adminPassword.focus(), 100);
    } else {
      show(els.adminFormWrap);
      hide(els.adminLogin);
    }
  }

  function closeModal() {
    hide(els.modal);
    els.modal.setAttribute("aria-hidden", "true");
    hide(els.formStatus);
  }

  function handleLogin(e) {
    e.preventDefault();
    const pass = els.adminPassword.value;
    if (pass === CONFIG.ADMIN_PASSWORD) {
      isAdminAuthenticated = true;
      hide(els.loginError);
      hide(els.adminLogin);
      show(els.adminFormWrap);
      els.productForm.reset();
    } else {
      show(els.loginError);
      els.adminPassword.value = "";
      els.adminPassword.focus();
    }
  }

  function handleLogout() {
    isAdminAuthenticated = false;
    hide(els.adminFormWrap);
    show(els.adminLogin);
    els.adminPassword.value = "";
    hide(els.formStatus);
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    const btn = $("#submit-product");
    btn.disabled = true;
    btn.textContent = "Menyimpan...";
    hide(els.formStatus);

    const payload = {
      secret: CONFIG.SECRET_KEY,
      title: $("#p-title").value.trim(),
      affiliate_link: $("#p-link").value.trim(),
      image_url: $("#p-image").value.trim(),
      price: $("#p-price").value.trim(),
      description: $("#p-desc").value.trim(),
      category: $("#p-category").value.trim(),
      status: "active"
    };

    // Validasi minimal
    if (!payload.title || !payload.affiliate_link) {
      setStatus("Judul dan Link Affiliate wajib diisi.", "error");
      btn.disabled = false;
      btn.textContent = "Tambah Produk";
      return;
    }

    // Jika masih sample mode
    if (CONFIG.USE_SAMPLE_DATA || CONFIG.APPS_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")) {
      // Simulasi tambah ke local
      const newProduct = {
        id: Date.now().toString(),
        ...payload,
        created_at: new Date().toISOString()
      };
      allProducts.unshift(newProduct);
      applyFilters();
      setStatus("Produk berhasil ditambahkan (mode demo). Setup Google Sheets untuk data permanen.", "success");
      els.productForm.reset();
      btn.disabled = false;
      btn.textContent = "Tambah Produk";
      return;
    }

    try {
      const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Apps Script sering butuh no-cors
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      // Karena no-cors, kita anggap sukses jika tidak error jaringan
      // (Apps Script doPost akan handle)
      setStatus("Produk berhasil dikirim! Refresh halaman beberapa detik lagi untuk melihat.", "success");
      els.productForm.reset();

      // Coba refresh data setelah delay
      setTimeout(() => {
        fetchProducts();
      }, 2500);
    } catch (err) {
      console.error(err);
      setStatus("Gagal mengirim. Periksa koneksi atau setup Apps Script.", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Tambah Produk";
    }
  }

  // ========== EVENTS ==========
  function bindEvents() {
    els.search.addEventListener("input", debounce(applyFilters, 280));
    els.categoryFilter.addEventListener("change", applyFilters);
    els.sortFilter.addEventListener("change", applyFilters);

    els.adminTrigger.addEventListener("click", openModal);
    els.modalClose.addEventListener("click", closeModal);
    els.modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);

    els.loginForm.addEventListener("submit", handleLogin);
    els.productForm.addEventListener("submit", handleAddProduct);
    els.logoutBtn.addEventListener("click", handleLogout);

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !els.modal.classList.contains("hidden")) {
        closeModal();
      }
    });

    // Year
    if (els.year) els.year.textContent = new Date().getFullYear();
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ========== INIT ==========
  function init() {
    bindEvents();
    fetchProducts();
  }

  // Start
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
