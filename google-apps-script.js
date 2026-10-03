/**
 * ============================================
 * GateO.ID — Google Apps Script
 * ============================================
 * Cara pakai:
 * 1. Buka Google Sheet kamu
 * 2. Extensions → Apps Script
 * 3. Hapus semua kode default, tempel seluruh isi file ini
 * 4. Simpan (Ctrl+S)
 * 5. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL Web App, tempel ke js/config.js (APPS_SCRIPT_URL)
 * 7. Pastikan SECRET_KEY di sini sama dengan di config.js
 */

const SHEET_NAME = "Products"; // Nama sheet tab
const SECRET_KEY = "GateO_Secret_2026_X9kL"; // HARUS SAMA dengan config.js

/**
 * Header kolom yang diharapkan di baris 1:
 * id | title | affiliate_link | image_url | price | description | category | status | created_at
 */

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ success: false, error: "Sheet 'Products' tidak ditemukan" });
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return jsonResponse({ success: true, products: [] });
    }

    const headers = data[0].map(h => String(h).toLowerCase().trim());
    const products = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });

      // Normalisasi
      obj.id = String(obj.id || i);
      obj.status = String(obj.status || "active").toLowerCase();
      products.push(obj);
    }

    return jsonResponse({ success: true, products: products });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // Verifikasi secret
    if (body.secret !== SECRET_KEY) {
      return jsonResponse({ success: false, error: "Unauthorized" });
    }

    if (!body.title || !body.affiliate_link) {
      return jsonResponse({ success: false, error: "title dan affiliate_link wajib" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ success: false, error: "Sheet 'Products' tidak ditemukan" });
    }

    const id = Utilities.getUuid();
    const created_at = new Date().toISOString();

    // Urutan kolom harus sesuai header:
    // id | title | affiliate_link | image_url | price | description | category | status | created_at
    sheet.appendRow([
      id,
      body.title || "",
      body.affiliate_link || "",
      body.image_url || "",
      body.price || "",
      body.description || "",
      body.category || "",
      body.status || "active",
      created_at
    ]);

    return jsonResponse({ success: true, id: id });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: Jalankan fungsi ini sekali untuk membuat header otomatis
 */
function setupHeader() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  sheet.clear();
  sheet.appendRow([
    "id",
    "title",
    "affiliate_link",
    "image_url",
    "price",
    "description",
    "category",
    "status",
    "created_at"
  ]);
  sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
  sheet.setFrozenRows(1);
}
