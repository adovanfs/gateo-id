# GateO.ID

Landing page elegan dark minimalist untuk Shopee Affiliate.  
Dibangun dengan HTML + CSS + Vanilla JS, data disimpan di **Google Sheets**, hosting di **GitHub Pages**.

Desain terinspirasi Apple: bersih, spacing rapi, tipografi halus, animasi subtle.

---

## Fitur

- Grid produk elegan (gambar, judul, harga, deskripsi, tombol Beli di Shopee)
- Search real-time
- Filter kategori
- Sorting (Terbaru / Harga / Nama)
- **Admin Panel** tersembunyi → hanya kamu yang bisa menambah produk
- Data langsung tersimpan ke Google Sheets
- Fully responsive
- Mode demo (sample data) agar bisa langsung dicoba sebelum setup Sheets

---

## Struktur File

```
gateo-id/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js      ← konfigurasi penting
│   └── app.js
├── google-apps-script.js  ← kode untuk Google Apps Script
└── README.md
```

---

## Setup Cepat (Step-by-step)

### 1. Buat Repository di GitHub

1. Login ke [GitHub](https://github.com)
2. Klik **New repository**
3. Nama repo: `gateo-id` (atau sesuai keinginan)
4. Public
5. Jangan centang "Add a README" (karena kita sudah punya)
6. Create repository

### 2. Upload File Project

Cara termudah:

**Opsi A — Via GitHub Website**
1. Buka repo yang baru dibuat
2. Klik **Add file → Upload files**
3. Drag semua file & folder di dalam `gateo-id/`
4. Commit changes

**Opsi B — Via Terminal (jika sudah install Git)**
```bash
cd gateo-id
git init
git add .
git commit -m "Initial commit - GateO.ID"
git branch -M main
git remote add origin https://github.com/USERNAME/gateo-id.git
git push -u origin main
```

### 3. Aktifkan GitHub Pages

1. Di repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` → folder `/ (root)`
4. Save
5. Tunggu 1–2 menit
6. Situs akan tersedia di:  
   `https://USERNAME.github.io/gateo-id/`

---

## Setup Google Sheets (Data Permanen)

### Langkah 1 — Buat Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru
3. Rename tab pertama menjadi **`Products`** (penting!)
4. Di baris 1, isi header berikut (persis):

| A     | B     | C               | D          | E     | F           | G        | H      | I          |
|-------|-------|-----------------|------------|-------|-------------|----------|--------|------------|
| id    | title | affiliate_link  | image_url  | price | description | category | status | created_at |

### Langkah 2 — Pasang Apps Script

1. Di spreadsheet → menu **Extensions → Apps Script**
2. Hapus semua kode yang ada
3. Buka file `google-apps-script.js` dari project ini
4. Copy **seluruh isinya** → tempel di Apps Script editor
5. Klik **Save** (ikon disket) → beri nama project "GateO"

### Langkah 3 — Deploy sebagai Web App

1. Klik **Deploy → New deployment**
2. Pilih type: **Web app**
3. Settings:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Klik **Deploy**
5. Authorize (izinkan akses ke Spreadsheet)
6. Copy **Web App URL** (bentuknya seperti:  
   `https://script.google.com/macros/s/AKfycb.../exec`)

### Langkah 4 — Hubungkan ke Website

1. Buka file `js/config.js`
2. Ganti nilai berikut:

```js
APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycb.../exec",  // tempel URL kamu
USE_SAMPLE_DATA: false,   // matikan sample data
```

3. Pastikan `SECRET_KEY` di `config.js` **sama** dengan yang di `google-apps-script.js`
4. Commit & push perubahan ke GitHub

### Langkah 5 — Test

1. Refresh website
2. Klik ikon gear (Admin) di kanan atas
3. Password default: **`GateO2026`**
4. Isi form → Tambah Produk
5. Tunggu 2–3 detik → refresh → produk muncul

---

## Ganti Password & Secret

Di file `js/config.js`:

```js
ADMIN_PASSWORD: "PasswordBaruKamu",
SECRET_KEY: "SecretBaruYangPanjang",
```

Lalu **wajib** ganti juga di `google-apps-script.js`:

```js
const SECRET_KEY = "SecretBaruYangPanjang";
```

Deploy ulang Apps Script setelah mengubah SECRET_KEY.

---

## Cara Menambah Produk

1. Buka website
2. Klik ikon **gear** di header kanan
3. Masukkan password
4. Isi form:
   - Judul Produk *
   - Link Affiliate Shopee *
   - URL Gambar (opsional, tapi sangat disarankan)
   - Harga
   - Kategori
   - Deskripsi singkat
5. Klik **Tambah Produk**

Data langsung masuk ke Google Sheets dan akan tampil di landing page.

---

## Tips Gambar Produk

- Ambil dari Shopee (klik kanan gambar produk → Copy image address)
- Atau upload ke [ImgBB](https://imgbb.com) / [Catbox](https://catbox.moe) / Google Drive (pastikan public)
- Gunakan URL yang langsung mengarah ke file gambar (berakhiran .jpg / .png / .webp)

---

## Custom Domain (Opsional)

Jika kamu punya domain `gateo.id`:

1. Di GitHub Pages → Custom domain → masukkan `gateo.id`
2. Di DNS domain, tambah CNAME record mengarah ke `USERNAME.github.io`

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Produk tidak muncul | Pastikan `USE_SAMPLE_DATA: false` dan URL Apps Script benar |
| Gagal tambah produk | Cek SECRET_KEY sama di kedua tempat, dan deploy ulang |
| CORS / error fetch | Pastikan Web App access = **Anyone** |
| Sheet kosong | Jalankan fungsi `setupHeader()` sekali di Apps Script editor |

---

## Keamanan

- Password admin hanya dicek di frontend (untuk hobby sudah cukup)
- SECRET_KEY mencegah orang lain menambahkan data sembarangan
- Jangan share password & secret key ke publik

Untuk keamanan lebih tinggi di masa depan bisa diganti dengan Firebase Auth atau login Google.

---

## Credits

Dibuat dengan ❤️ untuk eksperimen affiliate Shopee.  
Desain dark minimalist elegan ala Apple.

**GateO.ID**
