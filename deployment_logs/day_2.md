# Deployment Day 2 – `extracomp‑app`

> **Date:** 31 May 2025
> **Environment:** laptop Windows (client) ⇆ VPN office ⇆ VPS (offline, Ubuntu)

---

## 1  Overall Flow

1. **Local (online) build** on the client laptop

   - Build Docker images for **BE** and **FE** with all NPM deps baked in.
   - Pull required base images (`postgres:16-alpine`).
   - Export images to `lunatic_images.tar.gz` (initial) and `lunatic_fe_1.0.1.tar.gz` (update).

2. **Package code** (without `node_modules`) → `extracomp_code.tar.gz`.
3. **Transfer** both archives to the offline VPS via `scp`/`rsync`.
4. **Load images** on VPS: `gunzip -c … | docker load`.
5. **Start stack** with a single `docker-compose.yml`.
6. **Run one‑off migration/seed job**.
7. (Later) Add **HTTPS reverse‑proxy** service.

---

## 2  Local‑side Steps (Windows Laptop)

```powershell
# build backend
cd extracom-app
docker build -t lunatic-be:1.0.0 ./lunatic-be-main

# build frontend (initial)
docker build -t lunatic-fe:1.0.0 ./lunatic-fe-main

# build frontend (update with new .env)
docker build -t lunatic-fe:1.0.1 ./lunatic-fe-main

# pull postgres
docker pull postgres:16-alpine

# bundle all images (first delivery)
docker save lunatic-be:1.0.0 lunatic-fe:1.0.0 postgres:16-alpine | gzip > lunatic_images.tar.gz

# bundle FE‑only update
docker save lunatic-fe:1.0.1 | gzip > lunatic_fe_1.0.1.tar.gz

# package source code (no node_modules)
tar --exclude='node_modules' -czf extracomp_code.tar.gz \
    lunatic-be-main lunatic-fe-main docker-compose.yml
```

### Transfer

```bash
# images (large, resumeable)
rsync -avzP lunatic_images.tar.gz  plnp2b@VPS:/home/plnp2b/
rsync -avzP lunatic_fe_1.0.1.tar.gz  plnp2b@VPS:/home/plnp2b/

# code (small)
rsync -avzP --exclude node_modules ./  plnp2b@VPS:/home/plnp2b/extracomp-app/
```

> **Issue:** initial `scp -r .` broke after \~1 h – connection reset.
> **Fix:** used `rsync -avzP` to enable resume & progress.

---

## 3  VPS‑side Steps

```bash
cd /home/plnp2b

# load images
gunzip -c lunatic_images.tar.gz   | docker load
# (later) gunzip -c lunatic_fe_1.0.1.tar.gz | docker load

# extract code
tar -xzf extracomp_code.tar.gz -C extracomp-app
cd extracomp-app

# first run – start stack without rebuilding
docker compose up -d

# run migrations + seeds once
docker compose --profile tools run --rm migrate-seed
```

### Common Errors & Fixes

| Error                                                                | Cause                                   | Solution                                                              |
| -------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| `failed to set up container networking: port 5432 already allocated` | Another Postgres running on host        | Stop/remove old container **or** change port mapping to `15432:5432`. |
| `Dial tcp registry-1.docker.io …` on VPS                             | Compose tried to rebuild images offline | **Do not** use `--build`; remove `build:` blocks or retag images.     |
| `env file … not found`                                               | `.env` missing in BE path               | Copy correct `.env`, update `env_file:` path.                         |
| VS Code cannot save `docker-compose.yml` (`EACCES`)                  | File owned by root                      | `sudo chown -R plnp2b:plnp2b extracomp-app`                           |
| rsync / scp disconnect                                               | VPN unstable                            | Use `rsync -P` for resume or split large tar.                         |

---

## 4  Final `docker-compose.yml` (production)

```yaml
version: '3.9'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: lunatic
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      retries: 5

  be:
    image: lunatic-be:1.0.0
    env_file: [./lunatic-be-main/.env]
    ports: ['4000:4000']
    depends_on:
      db:
        condition: service_healthy

  fe:
    image: lunatic-fe:1.0.1 # updated tag
    ports: ['8080:80']
    depends_on: [be]

  migrate-seed:
    image: lunatic-be:1.0.0
    env_file: [./lunatic-be-main/.env]
    command: >
      sh -c "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all"
    profiles: ['tools']
    depends_on:
      db:
        condition: service_healthy

  proxy: # HTTPS reverse‑proxy layer (optional)
    image: nginx:1.27-alpine
    volumes:
      - ./nginx-proxy/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx-proxy/certs:/etc/nginx/certs:ro
    ports:
      - '80:80'
      - '443:443'
    depends_on: [fe, be]

volumes:
  db-data:
```

---

## 5  HTTPS Enablement

1. **Generated Nginx config** (`nginx-proxy/nginx.conf`) with routes `/`→FE and `/api` & `/socket.io`→BE.
2. **Cert options**

   - Let’s Encrypt via standalone Certbot (have domain).
   - Self‑signed for raw‑IP (created via `openssl req -x509`).

3. Added `proxy` service mapping 80/443.
4. Updated FE build variables to use `https://`.

---

## 6  Update Procedure (FE env change)

1. Modify `.env` in `lunatic-fe-main` **on laptop**.
2. `docker build -t lunatic-fe:<new> lunatic-fe-main`.
3. `docker save | gzip > lunatic_fe_<new>.tar.gz` → copy to VPS.
4. `docker load`, adjust tag in compose (or retag), `docker compose up -d fe`.

BE env can be changed directly on VPS by editing `.env` & restarting container.

---

## 7  Key Takeaways

| Aspect                 | Notes                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Offline VPS**        | Always pre‑build images with all dependencies; use only `docker load` + `compose up`, never rebuild on VPS. |
| **Transfer stability** | Use `rsync -avzP` or split tar for large files; avoid long `scp -r` sessions.                               |
| **One‑off jobs**       | Profile‑based services (`migrate`, `migrate-seed`) keep main stack clean.                                   |
| **Port conflicts**     | Change mapping or free ports before starting stack.                                                         |
| **Permissions**        | Ensure project folder owned by non‑root user to edit via VS Code Remote.                                    |
| **HTTPS**              | Introduce reverse‑proxy container; Let’s Encrypt if domain exists, else self‑signed.                        |

> **Deployment Day 2 completed** – `extracomp-app` running on VPS with BE, FE, Postgres and optional HTTPS layer.
