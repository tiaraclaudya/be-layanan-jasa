import { pool } from "./pool.js";

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(30) NOT NULL DEFAULT '',
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Untuk database yang sudah ada sebelum kolom 'phone' ditambahkan
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone VARCHAR(30) NOT NULL DEFAULT '';
`;

async function migrate() {
  try {
    console.log("[migrate] Menjalankan migrasi ke Neon...");
    await pool.query(SQL);
    console.log("[migrate] Selesai. Tabel 'users' dan 'contacts' siap dipakai.");
  } catch (err) {
    console.error("[migrate] Gagal migrasi:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
