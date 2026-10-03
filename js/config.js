// ============================================
// GateO.ID — Konfigurasi
// Ganti nilai di bawah setelah setup Google Apps Script
// ============================================

const CONFIG = {
  // URL Web App dari Google Apps Script (setelah di-deploy)
  // Contoh: "https://script.google.com/macros/s/AKfycb.../exec"
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycby9i_UOooAdme9peisjPDwVec0niGGNdGZfs1Kp3-l80a3_eUExdC0YiPqIIHCNYv1i/exec",

  // Password Admin (ganti sesuai keinginanmu)
  // Default: GateO2026
  ADMIN_PASSWORD: "GateO2026",

  // Secret Key untuk verifikasi di Apps Script (harus sama dengan di script)
  // Jangan bagikan ke orang lain
  SECRET_KEY: "GateO_Secret_2026_X9kL",

  // Fallback sample data (digunakan jika Apps Script belum siap)
  USE_SAMPLE_DATA: false,   // matikan sample data
};
