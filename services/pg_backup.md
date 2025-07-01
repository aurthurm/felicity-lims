Here's a clean and complete **instructional note**:

* Backup from Docker and Native PostgreSQL
* Restore into Native PostgreSQL
* Safety and best practices

---

# 🐘 PostgreSQL Backup and Restore Instructions

This guide shows how to:

* Backup a PostgreSQL database (from both Docker and native installations)
* Restore the backup into a native PostgreSQL installation

---

## ✅ 1. Backup from Docker PostgreSQL

Use the command below to create a plain SQL backup file from a Dockerized PostgreSQL database:

```bash
sudo docker compose exec -T felicity-postgres pg_dump -c -U felicity felicity_lims > felicity_lims.bak
```

* `-T`: disables pseudo-TTY to ensure clean dump output
* `-c`: includes `DROP` statements to avoid duplication during restore
* `-U felicity`: database user
* `felicity_lims`: database name
* `> felicity_lims.bak`: save the dump to your host machine

---

## ✅ 2. Backup from Native PostgreSQL

If you're working with a locally installed PostgreSQL (non-Docker), use:

```bash
sudo -u postgres pg_dump -c -U postgres felicity_lims > felicity_lims.bak
```

You may omit `-U postgres` if `postgres` is the default user.

---

## 🧹 3. Clean Restore into Native PostgreSQL

To safely restore the dump into a native PostgreSQL instance:

### Step 1: Drop existing database (⚠️ destructive)

```bash
sudo -u postgres dropdb felicity_lims
```

### Step 2: Create a fresh database

```bash
sudo -u postgres createdb felicity_lims
```

### Step 3: Restore from the `.bak` file

```bash
sudo -u postgres psql -d felicity_lims -f felicity_lims.bak
```

---

## 🔎 Notes

* You can confirm tables were restored using:

  ```bash
  sudo -u postgres psql -d felicity_lims -c "\dt"
  ```

* If you face `permission denied` after `docker cp`, fix with:

  ```bash
  sudo chown $USER:$USER felicity_lims.bak
  ```

* This guide assumes a **plain SQL format** (`.bak`) created with `pg_dump`.

---

## 📦 Optional: Restore to Docker PostgreSQL

If you ever want to restore **into Docker** instead of native, use:

```bash
sudo docker cp felicity_lims.bak felicity-postgres:/tmp/felicity_lims.bak
sudo docker compose exec -T felicity-postgres psql -U felicity -d felicity_lims -f /tmp/felicity_lims.bak
```
