# Backend — Landing Page API

Backend sederhana menggunakan **Express** dan **PostgreSQL (Neon)** untuk melayani:

- Autentikasi (register, login, cek sesi) dengan JWT + password hashing (bcrypt)
- Form kontak publik (pesan tersimpan ke database)
- Daftar pesan kontak (hanya bisa diakses setelah login)

## Struktur Folder

```
backend/
├── src/
│   ├── db/
│   │   ├── pool.js        # koneksi ke Neon
│   │   └── migrate.js      # script membuat tabel
│   ├── middleware/
│   │   └── requireAuth.js  # verifikasi JWT
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── contact.routes.js
│   └── server.js           # entry point Express
├── .env.example
├── package.json
└── README.md
```

## 1. Persiapan Database Neon

1. Buat akun/project di https://neon.tech
2. Buat database baru (misalnya `neondb`)
3. Salin **Connection String** dari dashboard Neon (bagian *Connection Details*).
   Formatnya kira-kira:
   ```
   postgresql://user:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require
   ```

## 2. Konfigurasi Environment

Salin `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Lalu isi nilainya:

```
DATABASE_URL=postgresql://user:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=string-acak-yang-panjang-dan-rahasia
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

## 3. Instalasi & Migrasi

```bash
npm install
npm run migrate   # membuat tabel "users" dan "contacts" di Neon
```

## 4. Menjalankan Server

```bash
npm run dev      # mode development (auto-restart)
# atau
npm start        # mode production
```

Server berjalan di `http://localhost:4000`.

## Endpoint API

| Method | Endpoint            | Akses     | Deskripsi                              |
|--------|----------------------|-----------|-----------------------------------------|
| GET    | `/api/health`         | Publik    | Cek status server                      |
| POST   | `/api/auth/register`  | Publik    | Daftar akun baru                       |
| POST   | `/api/auth/login`     | Publik    | Login, mendapatkan token JWT           |
| GET    | `/api/auth/me`        | Login     | Ambil data akun yang sedang login      |
| POST   | `/api/contact`        | Publik    | Kirim pesan dari form kontak           |
| GET    | `/api/contact`        | Login     | Lihat semua pesan yang masuk           |

Untuk endpoint yang butuh login, sertakan header:

```
Authorization: Bearer <token>
```

## Contoh Body Request

**Register**
```json
{ "name": "Budi", "email": "budi@mail.com", "password": "rahasia123" }
```

**Login**
```json
{ "email": "budi@mail.com", "password": "rahasia123" }
```

**Kirim Pesan Kontak**
```json
{ "name": "Siti", "email": "siti@mail.com", "message": "Halo, saya ingin bertanya..." }
```

## Deploy

Backend ini bisa dideploy ke layanan seperti Railway, Render, atau Fly.io.
Pastikan environment variable (`DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`) diisi
sesuai dengan konfigurasi produksi.
