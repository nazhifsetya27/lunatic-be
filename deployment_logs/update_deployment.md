
# Tutorial — Update Deployment to v1.0.6

> **Tujuan:** membangun ulang *backend* (**BE**) & *frontend* (**FE**), lalu mendistribusikannya ke VPS secara _offline_.  
> Contoh versi : **1.0.6** — ganti angka ini setiap rilis berikutnya (1.0.4, 1.0.6, …).

---

## 🖥️  A. Di Laptop Klien (Windows / PowerShell)

```powershell
# 0 pindah ke folder proyek
cd C:\Users\PLN\Downloads\extracomp-app

# 1 BUILD image FE & BE
docker build -t lunatic-fe:1.0.6 .\lunatic-fe
docker build -t lunatic-be:1.0.6 .\lunatic-be

# 2 BUNDLE jadi satu file .tar
docker save -o lunatic_images_1.0.6.tar lunatic-fe:1.0.6 lunatic-be:1.0.6

# 3 TRANSFER ke VPS
scp lunatic_images_1.0.6.tar plnp2b@10.6.97.8:/home/plnp2b/extracomp-app
```

---

## 🖥️  B. Di VPS (SSH sebagai `ubuntu`)

```bash
cd /home/plnp2b/extracomp-app

# 4 LOAD bundle
docker load -i lunatic_images_1.0.6.tar
```

### 5 _Edit_ `docker-compose.yml` (tag → **1.0.6**)

```bash
cd /home/plnp2b/extracomp-app
nano docker-compose.yml      # atau vim

# ganti semua baris image:
#   image: lunatic-fe:1.0.2   →   image: lunatic-fe:1.0.6
#   image: lunatic-be:1.0.2   →   image: lunatic-be:1.0.6
#   (service migrate-seed juga)

# simpan & keluar
```

*(Jika Anda memilih **tidak** mengubah file YAML, Anda bisa re‑tag image ke `latest` seperti rilis sebelumnya: `docker tag lunatic-fe:1.0.6 lunatic-fe:latest` dan `docker tag lunatic-be:1.0.6 lunatic-be:latest`.)*

```bash
# 6 RECREATE container
docker compose up -d --force-recreate

# 7 (Opsi) jalankan migrasi database
docker compose --profile tools run --rm migrate-seed

# 8 BERSIHKAN image lama
docker image rm lunatic-fe:1.0.2 lunatic-be:1.0.2 || true
docker image prune -f
```

---

## Ringkasan perintah satu blok

```powershell
# Laptop
docker build -t lunatic-fe:1.0.6 .\lunatic-fe
docker build -t lunatic-be:1.0.6 .\lunatic-be
docker save -o lunatic_images_1.0.6.tar lunatic-fe:1.0.6 lunatic-be:1.0.6
scp lunatic_images_1.0.6.tar ubuntu@203.0.113.10:/home/ubuntu/
```

```bash
# VPS
docker load -i /home/ubuntu/lunatic_images_1.0.6.tar
cd /home/plnp2b/extracomp-app
nano docker-compose.yml   # ganti tag → 1.0.6
docker compose up -d --force-recreate
docker compose --profile tools run --rm migrate-seed        # jika perlu
docker image prune -f
```

---

**Selesai 🎉** Rilis v1.0.6 live di VPS tanpa perlu akses internet.
