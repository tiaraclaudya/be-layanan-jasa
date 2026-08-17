import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Hanya izinkan digit, spasi, +, -, dan tanda kurung; minimal 8 digit angka
function isValidPhone(phone) {
  if (!/^[0-9+\-()\s]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

// POST /api/contact  (publik — siapa saja boleh mengirim pesan)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Nama, email, no. WhatsApp, dan pesan wajib diisi." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Format email tidak valid." });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Format nomor WhatsApp tidak valid." });
    }
    if (message.trim().length < 5) {
      return res.status(400).json({ message: "Pesan terlalu pendek." });
    }

    const result = await pool.query(
      "INSERT INTO contacts (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, message, created_at",
      [name.trim(), email.trim(), phone.trim(), message.trim()]
    );

    res.status(201).json({ message: "Pesan berhasil dikirim. Terima kasih!", contact: result.rows[0] });
  } catch (err) {
    console.error("[contact.create]", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

// GET /api/contact  (protected — hanya user yang login/admin yang bisa melihat daftar pesan)
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, message, created_at FROM contacts ORDER BY created_at DESC"
    );
    res.json({ contacts: result.rows });
  } catch (err) {
    console.error("[contact.list]", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

export default router;
