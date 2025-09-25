# **Felicity LIMS**
**(Under Active development - with breaking changes!)**

*The Next Generation Open Source Laboratory Information Management System (LIMS)*

![Felicity LIMS](https://github.com/user-attachments/assets/bd6af479-e0a0-4337-9a1d-632e139741a0)

---

## **Overview**

**Felicity LIMS** is a next-generation open-source Laboratory Information Management System designed for modern clinical and medical laboratory environments. Built with enterprise-grade architecture, it provides comprehensive sample lifecycle management, multi-tenant data isolation, and HIPAA-compliant security features.

This sophisticated LIMS platform empowers laboratories to accurately manage sample lifecycles, metadata, and experimental data while ensuring regulatory compliance and operational efficiency. The system implements a robust multi-tenant architecture that allows multiple laboratories to operate securely within a single deployment, each with complete data isolation and customized workflows.

Felicity strives to promote an accurate flow of sample and associated experimental data to and through a laboratory to produce information that is used to make conclusions and critical decisions. The platform ensures comprehensive audit trails, field-level encryption for sensitive data, and enterprise-grade security measures suitable for healthcare environments.

With its modular, domain-driven architecture and modern technology stack, Felicity LIMS scales from small specialty labs to large hospital networks while maintaining performance and data integrity.

*Felicity is the quality of being good, pleasant, or desirable.*

### **Key Features**

- **Multi-Tenant Architecture**: Laboratory-level data isolation with tenant context management ensuring secure multi-lab operations
- **Comprehensive Workflow Management**: Track samples from receipt to dispatch with full lifecycle management
- **Real-Time Analytics**: Interactive dashboards for actionable insights and performance monitoring
- **HIPAA Compliance**: Field-level encryption for sensitive patient data with comprehensive audit trails
- **Advanced Sample Management**: Complete sample lifecycle tracking, worksheets, quality control, and analysis results
- **Enterprise Security**: JWT-based authentication, role-based access control (RBAC), and laboratory-scoped permissions
- **Document Management**: QMS document management with versioning and collaborative editing
- **Microbiology Module**: Specialized workflows with antibiotic susceptibility testing, organism management, and breakpoint analysis
- **Inventory Management**: Comprehensive stock management with transactions, adjustments, orders, and requests
- **Billing & Analytics**: Automated billing for testing services with detailed financial reporting
- **Data Integrity**: Metadata tracking and audit logging to ensure reliability in decision-making
- **Scalability**: Domain-driven modular architecture with repository-service pattern supporting integration with emerging technologies

---

## **Technology Stack**

### **Frontend**

- **Framework**: Vite, Vue.js
- **Styling**: Tailwind CSS
- **API, State Management**: URQL, Axios, Pinia

### **Backend**

- **Framework**: FastAPI, Strawberry GraphQL, SQLAlchemy with async support
- **Architecture**: Repository-Service pattern with domain-driven design
- **Database**: PostgreSQL (primary), MongoDB (audit logs), MinIO (object storage), DragonflyDB/Redis (caching)
- **Multi-tenancy**: Laboratory-level data isolation with automated tenant context management
- **Security**: JWT authentication, HIPAA-compliant field encryption, comprehensive audit logging

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
