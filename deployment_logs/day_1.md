# DEPLOYMENT LUNATIC - DAY 1

## Tujuan

Mendeploy aplikasi Lunatic (backend + frontend + PostgreSQL) ke dalam VPS tanpa koneksi internet keluar.

---

## Flow Deployment

1. **Persiapan VPS**

   - OS: Ubuntu 22.04 (di GCP, koneksi outbound diblokir)
   - Tidak diperbolehkan install package baru dari internet.

2. **Install Docker secara Offline**

   - Download file `.deb` yang diperlukan dari laptop client.
   - Transfer file ke VPS menggunakan `scp`.
   - Install Docker manual dari file `.deb`.

3. **Persiapan File Proyek**

   - Backend (`lunatic-be`) dan Frontend (`lunatic-fe`) sudah disiapkan di laptop.
   - `docker-compose.yml` disiapkan.
   - `.env` untuk backend dan frontend dibuat manual di VPS.

4. **Transfer Proyek ke VPS**

   - Semua folder dan file dikirim via `scp` ke VPS.
   - File `.zip` digunakan untuk mempercepat pengiriman.
   - Folder `node_modules` dikompresi di laptop karena tidak bisa `npm install` di VPS.

5. **Unzip dan Penataan File**

   - Karena tidak bisa install `unzip`, digunakan tools bawaan BusyBox untuk ekstraksi.
   - Folder `node_modules` sempat berada di dalam subfolder (`node_modules/node_modules`). Harus dipindahkan.

6. **Menjalankan Docker Compose**

   - Image `postgres:16-alpine` ditarik dari laptop (yang bisa akses internet) dan dikirim ke VPS.
   - Docker compose dijalankan.

7. **Error dan Solusi**

---

## Kendala & Solusi

### ❌ VPS tidak memiliki akses internet keluar

**Solusi:** Semua paket, image docker, dan dependensi diunduh dari client (laptop) dan dikirim ke VPS via `scp`.

### ❌ `npm install` tidak bisa dijalankan di VPS

**Solusi:**

- Jalankan `npm install` di laptop.
- Kompres folder `node_modules` menjadi `.zip`.
- Kirim file ke VPS dan ekstrak manual.
- Gunakan BusyBox atau `bsdtar` untuk unzip karena `unzip` tidak bisa diinstall.

### ❌ Struktur `node_modules` salah (terjadi nested folder `node_modules/node_modules`)

**Solusi:**

```bash
cd node_modules/node_modules
mv * ../
cd ..
rmdir node_modules
```

### ❌ Error: `Permission denied` saat menjalankan `sequelize-cli`

**Log:**

```
sh: ./node_modules/sequelize-cli: Permission denied
```

**Solusi:**

```bash
chmod -R +x node_modules
```

Namun error tetap muncul karena file `sequelize-cli` kemungkinan bukan binary atau tidak compatible di lingkungan container.

### ❌ Error `EAI_AGAIN` saat build container backend

**Log:**

```
npm error request to https://registry.npmjs.org/sequelize-cli failed, reason: getaddrinfo EAI_AGAIN
```

**Penyebab:** Docker mencoba mengakses registry.npmjs.org karena perintah `npx sequelize-cli db:migrate` dijalankan di `CMD` Dockerfile.

**Solusi:**

- Semua CLI migration dan seeding dijalankan manual dari luar container.
- Revisi Dockerfile agar tidak melakukan perintah online saat build/run.

### ❌ Docker Desktop gagal jalan di laptop client

**Solusi:**

- Install ulang Docker Desktop.
- Install WSL & Ubuntu.
- Restart laptop.
- Pastikan `docker pull` bisa dijalankan setelah semua service aktif.

---

## Catatan Akhir

Deployment `Lunatic` di lingkungan offline membutuhkan pendekatan manual:

- Transfer semua dependency dari komputer client.
- Modifikasi Dockerfile agar tidak membutuhkan internet saat build dan run.
- Semua proses `migrate` dan `seed` dijalankan manual di container.

Deployment berhasil dijalankan sebagian (database & backend running), namun masih pending di tahap `sequelize-cli`.

---

## To-Do Hari Berikutnya

- Pastikan perintah `sequelize-cli` berjalan di container.
- Jalankan migration & seeding dari VPS.
- Lanjutkan setup frontend dan nginx routing.
