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
sudo docker compose exec -T beak-postgres pg_dump -c -U beak beak_lims > beak_lims.bak
```

* `-T`: disables pseudo-TTY to ensure clean dump output
* `-c`: includes `DROP` statements to avoid duplication during restore
* `-U beak`: database user
* `beak_lims`: database name
* `> beak_lims.bak`: save the dump to your host machine

---

## ✅ 2. Backup from Native PostgreSQL

If you're working with a locally installed PostgreSQL (non-Docker), use:

```bash
sudo -u postgres pg_dump -c -U postgres beak_lims > beak_lims.bak
```

You may omit `-U postgres` if `postgres` is the default user.

---

## 🧹 3. Clean Restore into Native PostgreSQL

To safely restore the dump into a native PostgreSQL instance:

### Step 1: Drop existing database (⚠️ destructive)

```bash
sudo -u postgres dropdb beak_lims
```

### Step 2: Create a fresh database

```bash
sudo -u postgres createdb beak_lims
```

### Step 3: Restore from the `.bak` file

```bash
sudo -u postgres psql -d beak_lims -f beak_lims.bak
```

---

## 🔎 Notes

* You can confirm tables were restored using:

  ```bash
  sudo -u postgres psql -d beak_lims -c "\dt"
  ```

* If you face `permission denied` after `docker cp`, fix with:

  ```bash
  sudo chown $USER:$USER beak_lims.bak
  ```

* This guide assumes a **plain SQL format** (`.bak`) created with `pg_dump`.

---

## 📦 Optional: Restore to Docker PostgreSQL

If you ever want to restore **into Docker** instead of native, use:

```bash
sudo docker cp beak_lims.bak beak-postgres:/tmp/beak_lims.bak
sudo docker compose exec -T beak-postgres psql -U beak -d beak_lims -f /tmp/beak_lims.bak
```
