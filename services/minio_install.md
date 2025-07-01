### ✅ Step-by-Step: MinIO Single-Node Install (.deb)

#### **1. Download and Install the .deb package**

```bash
wget https://dl.min.io/server/minio/release/linux-amd64/archive/minio_20250613113347.0.0_amd64.deb -O minio.deb
sudo dpkg -i minio.deb
```

---

#### **2. Create MinIO User and Set Permissions**

```bash
sudo groupadd -r minio-user
sudo useradd -M -r -g minio-user minio-user
sudo mkdir -p /mnt/data
sudo chown minio-user:minio-user /mnt/data
```

---

#### **3. Configure MinIO Environment**

Create the file `/etc/default/minio`:

```bash
sudo nano /etc/default/minio
```

Paste this:

```ini
MINIO_ROOT_USER=myminioadmin
MINIO_ROOT_PASSWORD=minio-secret-key-change-me
MINIO_VOLUMES="/mnt/data"
MINIO_OPTS="--console-address :9001"
```

---

#### **4. Enable and Start MinIO**

```bash
sudo systemctl enable minio.service
sudo systemctl start minio.service
```

Check status:

```bash
sudo systemctl status minio.service
```

---

#### **5. Access the MinIO Console**

Go to:
[http://localhost:9001](http://localhost:9001)
Login with:

* **Username:** `myminioadmin`
* **Password:** `minio-secret-key-change-me`

---

### 📝 Notes

* Don’t use NFS or network drives. Use local drives formatted with **XFS**.
* Make sure `/mnt/data` is empty or already used by MinIO.
* For production, use the distributed setup instead.


## Test Minio
* create a test bucket and and upload file and check with `tree /mnt/data`