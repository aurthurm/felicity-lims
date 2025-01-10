# **Felicity LIMS**  
*The Next Generation Open Source Laboratory Information Management System (LIMS)*  

![Felicity LIMS](https://github.com/user-attachments/assets/bd6af479-e0a0-4337-9a1d-632e139741a0)

---

## **Overview**  
**Felicity LIMS** is an open-source Laboratory Information Management System designed to streamline laboratory workflows in clinical and medical environments. It empowers laboratories to accurately manage sample lifecycles, metadata, and experimental data while ensuring compliance and efficiency. 

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
- **State Management**: URQL  

### **Backend**  
- **Framework**: FastAPI, Strawberry GraphQL  
- **Database**: PostgreSQL (main DB), MongoDB (audit logs, etc)  
- **Storage**: MinIO (object storage for reports, etc)  
- **Caching**: Dragonfly Redis (locks, WebSocket subscriptions)  

---

## **Modules**  
- **Dashboard**: Analytics and performance tracking.  
- **Patient Management**: Listings, details, audit logs, and search capabilities.  
- **Sample Management**: Lifecycle tracking, worksheets, reports, and audit trails.  
- **Inventory**: Transactions, adjustments, orders, and requests.  
- **Shipments**: FHIR-ready functionality, listing, and details.  
- **Storage**: Management of storerooms, containers, and templates.  
- **User & Client Management**: Listings, profiles, and contact details.  
- **Admin Tools**: Advanced administrative controls and reflex rules.  
- **Billing** *(in development)*: Profiles and RBAC integration.  

---

## **Installation**  

### **Using Docker** *(Recommended)*  
Felicity LIMS can be quickly deployed using Docker Compose.  

#### **Step 1**: Clone the Repository  
```bash
git clone https://github.com/beak-insights/felicity-lims.git
cd felicity-lims
```

#### **Step 2**: Choose a Preset  
Choose between FastAPI serving static files or using Nginx/Caddy as a reverse proxy.  

**Preset Examples**:  
- `felicity-aio`: FastAPI for API and static files without a reverse proxy.  
- `felicity-aio-nginx`: FastAPI for API and static files and Nginx as a reverse proxy in front.
- `felicity-aio-caddy`: FastAPI for API and static files and Caddy as a reverse proxy in front.
- `felicity-static-nginx`: FastAPI for API, Nginx for static files.
- `felicity-static-caddy`: FastAPI for API, Caddy for static files.

---

#### **Step 3**: Deploy  
```bash
docker-compose -f docker-compose.prod.yml up -d <preset> --build
docker-compose -f docker-compose.prod.yml exec <preset> bash -c "felicity-lims upgrade"
docker-compose -f docker-compose.prod.yml logs <preset> -f -n100
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
    
3. create supervisor config file
    ```sudo nano /etc/supervisor/conf.d/felicity_lims.conf```
    
4. Copy and Paste the following and edit correct accordingly
    ```[program:felicity_lims]
    command=/home/<user>/miniconda3/bin/python <full path to felicity lims root folder>
    autostart=true
    autorestart=true
    stderr_logfile=/var/log/felicity_lims.err.log
    stdout_logfile=/var/log/felicity_lims.out.log
    ```

5. inform supervisor of our new programs:
    ```sudo supervisorctl reread
    sudo supervisorctl update
    sudo supervisorctl reload
    ```

6. Tail Error logs:
    ```sudo supervisorctl tail -f felicity_lims stderr  # or
    tail -f /var/log/felicity_lims.err.log
    ```
    
7. Tail output logs:
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
Evaluate system performance using **Locust** or other load-testing tools. We recommend testing concurrency to simulate real-world scenarios.  

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
