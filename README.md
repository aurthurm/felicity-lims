# **Felicity LIMS**

*The Next Generation Open Source Laboratory Information Management System (LIMS)*

![Felicity LIMS](https://github.com/user-attachments/assets/bd6af479-e0a0-4337-9a1d-632e139741a0)

---

## **Overview**

**Felicity LIMS** is an open-source Laboratory Information Management System designed to streamline laboratory workflows
in clinical and medical environments. It empowers laboratories to accurately manage sample lifecycles, metadata, and
experimental data while ensuring compliance and efficiency.

Felicity strives to promote an accurate flow of sample and associated experimental data to and through a laboratory to
produce information that is used to make conclusions and critical decisions.

Felicity LIMS will ensure that sufficient metadata is captured and clinical laboratory personnel can track the lifecycle
of a bio-specimen in the laboratory from receipt to dispatch.

Felicity is the quality of being good, pleasant, or desirable.

### **Key Features**

- **Comprehensive Workflow Management**: Track samples from receipt to dispatch.
- **Real-Time Analytics**: Interactive dashboards for actionable insights.
- **Data Integrity**: Metadata tracking to ensure reliability in decision-making.
- **User Management**: Role-based access control (RBAC) and user profiles.
- **Scalability**: Modular architecture supporting integration with emerging technologies.

---

## **Technology Stack**

### **Frontend**

- **Framework**: Vite, Vue.js
- **Styling**: Tailwind CSS
- **API, State Management**: URQL, Axios, Pinia

### **Backend**

- **Framework**: FastAPI, Strawberry GraphQL, SQLAlchemy
- **Database**: PostgreSQL (main DB), MongoDB (audit logs, etc)
- **S3 Storage**: MinIO (object storage for reports, etc)
- **Caching**: Dragonfly Redis (locks, WebSocket subscriptions)

---

## **Modules**

- **Dashboard**: Analytics and performance tracking.
- **Patient Management**: Listings, details, audit logs, and search capabilities.
- **Sample Management**: Lifecycle tracking, worksheets, reports, and audit trails.
- **Inventory**: Transactions, adjustments, orders, and requests.
- **Shipments**: FHIR-ready functionality, listing, and details.
- **Sample Storage**: Management of storerooms, containers, and templates.
- **User & Client Management**: Listings, profiles, and contact details.
- **Admin Tools**: Advanced administrative controls.
- **Reflex Rules**: Automatic management of sample reflexes.
- **Security**: Role Based access control, allows custom object actions management.
- **Billing** *(in development)*: Allows billing testing services.
- **Schemes**: Create and Manage projects using Khanban boards, handle discussions and assignments.
- **Documents**: Familiar document management for your QMS, etc.
- **Microbiology**: Powerful microbiology sample management - antibiotics, organisms, panels, and breakpoints.

---

## **Development setup (docker)**

```bash
git clone https://github.com/beak-insights/felicity-lims.git
cd felicity-lims
cp env.example .env
# build and run
docker compose -f docker-compose.dev.yml up -d --build
# database setup 
docker compose -f docker-compose.dev.yml exec felicity-api felicity-lims db upgrade
```

## **Production Installation**

### **Using Docker**

Felicity LIMS can be quickly deployed using Docker Compose.

#### **Step 1**: Clone the Repository

```bash
git clone https://github.com/beak-insights/felicity-lims.git
cd felicity-lims
cp env.example .env
```

#### **Step 2**: Deploy

```bash
docker compose up -d
docker compose exec bash -c "felicity-lims upgrade"
docker compose logs -f -n100
```

### **Manual Installation** *(Alternative)*

For environments where Docker is not an option:

1. **Install OS Requirements**:
    ```bash
    sudo apt update && apt install libcairo2-dev pkg-config python3-dev gcc g++
    ```
2. **Setup Python Virtual Environment**:
    ```bash
    conda create -n felicity python=3.11
    conda activate felicity
    ```
3. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4. **Build the Frontend**:
    ```bash
    pnpm install
    pnpm standalone:build
    ```
5. **Run the Backend**:
    ```bash
    pnpm server:gu
    ```

For production, use **Supervisor** to demonize processes as follows:

1. **Install supervisor**
    ```sudo apt install supervisor
    sudo systemctl status supervisor
   ```

3. **create supervisor config file**
    ```
    sudo nano /etc/supervisor/conf.d/felicity_lims.conf
   ```

5. **Copy and Paste the following and edit correct accordingly**
    ```[program:felicity_lims]
    command=/home/<user>/miniconda3/bin/python <full path to felicity lims root folder>
    autostart=true
    autorestart=true
    stderr_logfile=/var/log/felicity_lims.err.log
    stdout_logfile=/var/log/felicity_lims.out.log
    ```

6. **Inform supervisor of our new programs:**
    ```sudo supervisorctl reread
    sudo supervisorctl update
    sudo supervisorctl reload
    ```

7. **Tail Error logs:**
    ```sudo supervisorctl tail -f felicity_lims stderr  # or
    tail -f /var/log/felicity_lims.err.log
    ```

8. **Tail output logs:**
    ```sudo supervisorctl tail -f felicity_lims stdout  # or
    tail -f /var/log/felicity_lims.out.log
    ```

---

## **Application Monitoring**

Felicity LIMS integrates **OpenTelemetry** for application performance monitoring.

1. **Enable Tracing**:
    ```bash
    export RUN_OPEN_TRACING=True
    opentelemetry-bootstrap --action=install
    ```

2. **Deploy SigNoz** *(Recommended for Metrics)*:
    ```bash
    git clone -b main https://github.com/SigNoz/signoz.git
    cd signoz/deploy/
    docker-compose -f docker/clickhouse-setup/docker-compose.yaml up -d
    ```

Access the SigNoz dashboard at [http://localhost:3301](http://localhost:3301).

---

## **Performance Testing**

Evaluate system performance using **Locust** or other load-testing tools. We recommend testing concurrency to simulate
real-world scenarios.

---

## **Contributing**

We welcome contributions from the community!

- Follow the [contribution guide](CONTRIBUTING.md) in the repository.
- Ensure all code adheres to the project's linting and testing standards.

---

## **Contact**

- **Email**: [aurthurmusendame@gmail.com](mailto:aurthurmusendame@gmail.com)
- **LinkedIn**: [Aurthur Musendame](https://www.linkedin.com/in/aurthurmusendame)
- **WhatsApp**: [Chat with us](https://api.whatsapp.com/send?phone=263776406399)
- **Telegram**: [Join the discussion](https://www.t.me/aurthurm)

---
