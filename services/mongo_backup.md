Instructions to back up and restore MongoDB running either **inside Docker** or **natively** on your machine:

````markdown
# MongoDB Backup and Restore Instructions (Docker & Native)

This document explains how to **backup** and **restore** MongoDB databases running either in a **Docker container** or on a **native host**.

---

## 1. Backup MongoDB

### A. Backup from MongoDB running in Docker container

Run the following command **from the host** where Docker is installed. Replace `felicity-mongo` with your MongoDB container name, and adjust username/password/database as needed.

```bash
sudo docker compose exec -T felicity-mongo mongodump \
  -u felicity -p felicity --authenticationDatabase admin \
  --archive > felicity.archive
````

* This creates a full backup of **all databases** in the MongoDB instance to the `felicity.archive` file on the host.
* To backup only a specific database, add `--db <database_name>` before `--archive`.

---

### B. Backup from Native MongoDB (non-Docker)

Run this command on the machine where MongoDB is installed:

```bash
mongodump -u felicity -p felicity --authenticationDatabase admin --archive > felicity.archive
```

* Again, add `--db <database_name>` to dump only a specific database.
* This saves the dump archive to `felicity.archive`.

---

## 2. Restore MongoDB

### A. Restore into MongoDB running in Docker container

Run this from the host (where the archive file resides):

```bash
cat felicity.archive | sudo docker compose exec -i felicity-mongo mongorestore --drop --archive
```

* The `cat` and pipe `|` is used to stream the backup file into the Docker container's `mongorestore` command.
* The `--drop` option deletes existing data before restoring.
* To restore a specific database or collection, additional options may be required.

---

### B. Restore into Native MongoDB

Run this command on the native MongoDB host:

```bash
mongorestore --drop --archive=felicity.archive
```

* This restores all databases in the archive, dropping existing data first.

---

## 3. Notes & Tips

* **Authentication**: Replace `-u felicity -p felicity --authenticationDatabase admin` with your actual MongoDB username, password, and auth DB if different.
* **Archive format**: Using `--archive` allows easy piping and single-file backup.
* **Specific database backup/restore**: Use `--db <database_name>` with `mongodump` and `mongorestore` to target one database.
* For large backups, consider compressing the archive: e.g., `mongodump ... --archive | gzip > dump.archive.gz`
* To restore a compressed backup: `gunzip -c dump.archive.gz | mongorestore --archive`

---