import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("[db] DATABASE_URL belum diset. Cek file .env kamu.");
}

// Neon mewajibkan koneksi SSL.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("[db] Terjadi error tak terduga pada koneksi pool:", err);
});
