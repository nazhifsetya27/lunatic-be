# Lunatic API – Back‑End Repository

A modular **Node.js + Express** REST API for asset & inventory management. Data persistence uses **PostgreSQL** via **Sequelize** ORM, with real‑time events delivered over **Socket.IO**.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Project structure](#project-structure)
3. [Environment variables](#environment-variables)
4. [Database setup](#database-setup)
5. [Running the server](#running-the-server)
6. [NPM scripts](#npm-scripts)
7. [API conventions](#api-conventions)
8. [Endpoint overview](#endpoint-overview)
9. [Troubleshooting](#troubleshooting)

---

## Quick start

```bash
# 1. Clone & install
$ git clone <repo-url> lunatic-api && cd lunatic-api
$ npm install

# 2. Create the database (PostgreSQL ≥ 14)
$ createdb lunatic

# 3. Prepare environment
$ cp .env.example .env   # then edit the values

# 4. Run migrations + seeders
$ npx sequelize-cli db:migrate
$ npx sequelize-cli db:seed:all

# 5. Start the dev server (auto‑reload)
$ npm run dev
```

By default the API listens on **[http://localhost:2500](http://localhost:2500)**.

---

## Project structure

```
├── index.js                # Express + Socket.IO bootstrap
├── src
│   ├── controller/         # Thin HTTP adapters → call repository layer
│   ├── helper/             # Response helpers, validators, file utils, etc.
│   ├── modules/            # Domain modules (one folder = one bounded‑context)
│   ├── sequelize/
│   │   ├── config/         # Database config (used by sequelize‑cli)
│   │   ├── migrations/     # Schema migration files
│   │   └── seeders/        # Initial & demo data
│   └── ...
├── public/uploads          # Static file uploads
└── package.json            # Dependencies & scripts
```

Each **module** encloses its own `*.routes.js`, middleware, and repository implementation, keeping the codebase highly cohesive.

---

## Environment variables

Create a `.env` file at the repo root (or adjust to your host’s secrets manager). Below is the minimal set; all other `process.env.*` reads inherit sane defaults.

```dotenv
PORT=2500
# ── PostgreSQL ────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=lunatic
DB_USER=postgres
DB_PASSWORD=postgres
DB_DIALECT=postgres
DB_TIMEZONE=Asia/Jakarta
# ── Auth ───────────────────────────
JWT_SECRET_KEY=OWSVdKPdQY
# ── CORS ───────────────────────────
CORS_ORIGIN=http://localhost:5173
```

> **Tip :** If you deploy to Neon, Railway, Supabase, or another managed Postgres provider that _requires SSL_, keep the host name in `DB_HOST`; Sequelize will auto‑enable `dialectOptions.ssl` (see `src/sequelize/config/config.js`).

---

## Database setup

1. **Create the DB** (already shown in _Quick start_).
2. **Run migrations** – builds the schema under `src/sequelize/migrations`.

   ```bash
   npx sequelize-cli db:migrate
   ```

3. **Seed data** – optional, but useful for local smoke tests.

   ```bash
   npx sequelize-cli db:seed:all
   ```

4. **Rollback** – step back one migration.

   ```bash
   npx sequelize-cli db:migrate:undo
   ```

---

## Running the server

| Mode        | Command                             | Notes                            |
| ----------- | ----------------------------------- | -------------------------------- |
| **Dev**     | `npm run dev`                       | Uses **nodemon** + hot reload.   |
| **Staging** | `node index.js`                     | Reads `.env`.                    |
| **Prod**    | `pm2 start index.js --name lunatic` | Or any process manager you like. |

After launch you should see:

```
Server running on PORT: 2500
A user connected: <socket‑id>
```

---

## NPM scripts

| Script        | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `npm run dev` | Run in development with **nodemon**.                                     |
| `npm run ved` | Same as above but lets you override `.env` inline via `node --env-file`. |

---

## API conventions

### Success format

```json
{
  "status": 200,
  "message": "Success",
  "data": {
    /* payload */
  }
}
```

### Error format

| Helper                        | HTTP code | Body sample                                                              |
| ----------------------------- | --------- | ------------------------------------------------------------------------ |
| `helper.request.notFound`     | 404       | `{"status":404,"message":"Not Found"}`                                   |
| `helper.request.badRequest`   | 400       | `{ "status":400, "title":"Bad Request", "message":"Validation failed" }` |
| `helper.request.unAuthorized` | 401       | `{ "status":401, "message":"Not Authorized" }`                           |
| `helper.request.error`        | 500       | `{ "status":500, "message":"Internal Server Error" }`                    |

All endpoints **always** respond with the schema above so the front‑end can branch on `status` alone.

---

## Endpoint overview

> Complete Swagger/OpenAPI docs are coming soon. Below is a condensed cheat‑sheet generated from the route files.

### Auth (`/auth`)

| Method | Path               | Purpose                                |
| ------ | ------------------ | -------------------------------------- |
| POST   | `/`                | Login (returns `accessToken`, `user`). |
| GET    | `/`                | List all users (admin only).           |
| PATCH  | `/change-password` | Change own password.                   |
| GET    | `/session`         | Validate & refresh session.            |
| PATCH  | `/update`          | Update profile fields.                 |

### User (`/user`)

| Method | Path            | Purpose              |
| ------ | --------------- | -------------------- |
| GET    | `/`             | Paginated user list. |
| POST   | `/`             | Create new user.     |
| PATCH  | `/:id`          | Edit user.           |
| DELETE | `/:id`          | Soft‑delete user.    |
| PATCH  | `/activate/:id` | Reactivate.          |

### Asset (`/asset`)

Handles _general_, _electronics_, and _furniture_ assets.

| Method | Path                 | Purpose                 |
| ------ | -------------------- | ----------------------- |
| GET    | `/`                  | List / filter assets.   |
| GET    | `/:id`               | Asset detail.           |
| POST   | `/`                  | Create asset.           |
| PATCH  | `/:id`               | Update asset.           |
| DELETE | `/:id`               | Delete asset.           |
| GET    | `/download/template` | XLSX import template.   |
| POST   | `/import`            | Bulk import from Excel. |

### Stock Adjustment (`/stock-adjustment`)

| Method | Path           | Purpose              |
| ------ | -------------- | -------------------- |
| GET    | `/`            | Get adjustment list. |
| POST   | `/`            | Create adjustment.   |
| PATCH  | `/:id/approve` | Approve request.     |
| PATCH  | `/:id/reject`  | Reject request.      |

_(Modules `settings`, `storage-management`, `option`, `dashboard`, `approval`, and `stock-adjustment-inventory` follow the same CRUD pattern; inspect the `src/modules/<name>/_.routes.js` files for definitive paths.)\*

---

## Troubleshooting

| Symptom                                              | Fix                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **`SequelizeConnectionError: no pg_hba.conf entry`** | Ensure Postgres accepts TCP on `0.0.0.0/0` or add your host in `pg_hba.conf`.        |
| **`dialect error: self‑signed certificate`**         | Set `NODE_TLS_REJECT_UNAUTHORIZED=0` _or_ use a verified SSL certificate on your DB. |
| **Uploads go to the wrong folder**                   | Check `UPLOAD_DIR` env and make sure the path exists / is writable.                  |

---
