# **Felicity LIMS**
**(Enterprise-Grade Laboratory Information Management System)**

*The Next Generation Open Source Laboratory Information Management System (LIMS)*

![Felicity LIMS](https://github.com/user-attachments/assets/bd6af479-e0a0-4337-9a1d-632e139741a0)

---

## **Overview**

**Felicity LIMS** is an enterprise-grade, open-source Laboratory Information Management System designed for modern clinical, medical, and research laboratory environments. Built with production-ready architecture, it provides comprehensive sample lifecycle management, multi-tenant data isolation, and HIPAA-compliant security features.

This sophisticated LIMS platform empowers laboratories to accurately manage sample lifecycles, metadata, and experimental data while ensuring regulatory compliance, operational efficiency, and seamless instrument integration. The system implements a robust multi-tenant architecture that allows multiple laboratories to operate securely within a single deployment, each with complete data isolation, customized workflows, and independent instrument configurations.

Felicity strives to promote an accurate flow of sample and associated experimental data to and through a laboratory to produce information that is used to make conclusions and critical decisions. The platform ensures comprehensive audit trails, field-level encryption for sensitive data, enterprise-grade security measures suitable for healthcare environments, and industry-standard protocol support (ASTM, HL7) for bi-directional instrument communication.

With its modular, domain-driven architecture and modern async-first technology stack, Felicity LIMS scales from small specialty labs to large hospital networks while maintaining performance, data integrity, and non-blocking I/O for 100+ concurrent instrument connections.

*Felicity is the quality of being good, pleasant, or desirable.*

### **Key Features**

- **Multi-Tenant Architecture**: Laboratory-level data isolation with tenant context management ensuring secure multi-lab operations
- **Seamless Instrument Integration**: Bi-directional communication with laboratory instruments via ASTM and HL7 protocols with 100+ concurrent connections
- **Comprehensive Workflow Management**: Track samples from receipt to dispatch with full lifecycle management, worksheets, and QC tracking
- **Real-Time Analytics**: Interactive dashboards for actionable insights, performance monitoring, and quality metrics
- **HIPAA Compliance**: Field-level encryption for sensitive patient data with comprehensive audit trails and regulatory compliance
- **Advanced Sample Management**: Complete sample lifecycle tracking, worksheets, quality control, analysis results, and storage management
- **Enterprise Security**: JWT-based authentication, role-based access control (RBAC), laboratory-scoped permissions, and data encryption
- **Document Management**: QMS document management with versioning, collaborative editing, and audit trail support
- **Microbiology Module**: Specialized workflows with antibiotic susceptibility testing, organism management, breakpoint analysis, and panel creation
- **Inventory Management**: Comprehensive stock management with transactions, adjustments, orders, requests, and automatic reordering
- **Billing & Analytics**: Automated billing for testing services with detailed financial reporting and performance analytics
- **Data Integrity**: Metadata tracking, comprehensive audit logging, version control, and trail-ability for regulatory compliance
- **Async-First Architecture**: Non-blocking I/O with asyncio for high concurrency, efficient resource usage, and responsive UI
- **GraphQL API**: Modern GraphQL API with real-time subscription support for live data updates and interactive dashboards
- **Scalability**: Domain-driven modular architecture with repository-service pattern supporting 100+ instrument connections and scaling to enterprise deployments
- **Open Source**: Fully open-source with active development and community support for customization and integration

---

## **Technology Stack**

### **Frontend**
- **Framework**: Vue 3 + Vite (modern, fast development experience)
- **Styling**: Tailwind CSS (utility-first, responsive design)
- **State Management**: Pinia (lightweight, Vue 3 native)
- **API Client**: URQL (GraphQL), Axios (REST)
- **Type Safety**: TypeScript, GraphQL Code Generation for type-safe queries

### **Backend**
- **Framework**: FastAPI (async-first, high-performance)
- **API Layer**: Strawberry GraphQL (type-safe GraphQL with Python type hints)
- **Database ORM**: SQLAlchemy 2.0+ with async support (async drivers)
- **Architecture**: Repository-Service pattern with domain-driven design
- **Async Runtime**: asyncio (Python's native async/await)

### **Databases & Storage**
- **Primary Data**: PostgreSQL with async SQLAlchemy (ACID compliance, reliability)
- **Audit Logs**: MongoDB (flexible schema for event logging)
- **Object Storage**: MinIO (S3-compatible, self-hosted file storage)
- **Caching**: DragonflyDB/Redis (session management, real-time features)
- **Migrations**: Alembic (database schema versioning)

### **Instrument Integration**
- **Protocols**: ASTM E1381, HL7 v2.5+ (industry-standard formats)
- **Communication**: Async TCP/IP sockets with non-blocking I/O
- **Concurrency**: Support for 100+ simultaneous instrument connections
- **Message Safety**: Size limits (10 MB), timeouts (60 seconds), checksum validation

### **Infrastructure & Deployment**
- **Containerization**: Docker + Docker Compose (consistent dev/prod environments)
- **Process Management**: APScheduler with AsyncIOScheduler (background job scheduling)
- **Monitoring**: OpenTelemetry integration (application performance monitoring)
- **Observability**: SigNoz (metrics, traces, logs visualization)

### **Security & Compliance**
- **Authentication**: JWT tokens with refresh mechanism (stateless, scalable)
- **Authorization**: Role-Based Access Control (RBAC) with laboratory-scoped permissions
- **Encryption**: Field-level encryption for HIPAA-sensitive data (PII)
- **Audit**: Comprehensive audit logging for all data modifications
- **Multi-tenancy**: Strict data isolation between laboratories with automated tenant context

---

## **Modules**

### **Core Laboratory Modules**
- **Patient Management**: Patient registry, demographics, search indexing, HIPAA-compliant data handling
- **Sample Management**: Complete lifecycle (receipt → analysis → dispatch), worksheets, QC tracking, result management
- **Analysis**: Test definitions, quality control parameters, result workflows, analysis scheduling
- **Worksheet Management**: Batch processing, sample grouping, result entry, batch approval workflows
- **Sample Storage**: Storeroom management, container tracking, sample location history, retention management

### **Specialized Modules**
- **Microbiology**: Organism management, antibiotic susceptibility testing (AST), panel creation, breakpoint analysis, culture workflows
- **Reflex Rules**: Automatic conditional test triggering based on initial results (reflex testing automation)

### **Business Operations**
- **Inventory Management**: Stock tracking, transactions, adjustments, purchase orders, request management, reorder automation
- **Shipments**: FHIR-ready shipment management, tracking, receiving, and dispatch workflows
- **Billing & Analytics**: Service billing, financial reporting, cost analysis, revenue tracking, performance metrics

### **System Administration**
- **User & Client Management**: User profiles, role assignment, client management, laboratory access control
- **Security & Permissions**: Role-based access control (RBAC), custom object actions, laboratory scoping
- **Document Management**: QMS document management, versioning, approval workflows, regulatory compliance
- **Admin Tools**: System configuration, audit log viewing, batch operations, data maintenance

### **Instrument Integration**
- **IOL (Instrument Output Link) Analyzer**: Bi-directional communication with lab instruments via ASTM/HL7
  - TCP/IP socket-based communication (client/server modes)
  - Protocol auto-detection and message validation
  - Message persistence and audit logging
  - 100+ concurrent instrument connection support

### **Real-Time & Analytics**
- **Dashboard**: Real-time analytics, KPI tracking, performance monitoring, at-a-glance system status
- **Notifications**: Event-based alerting, messaging, real-time updates (WebSocket integration)
- **Audit Trail**: Comprehensive audit logging, data change tracking, regulatory compliance documentation

---

## **Architecture Overview**

### **Multi-Tenant Data Isolation**
Felicity implements strict laboratory-level data isolation ensuring complete data separation between organizations:
- **Tenant Context**: User requests automatically include tenant context (laboratory, organization)
- **Automatic Filtering**: Repository and service layers filter all queries by `laboratory_uid`
- **Entity Scoping**: Base models enforce tenant boundaries at the ORM level
- **Middleware Protection**: Request middleware validates and sets tenant context from JWT tokens

### **Repository-Service Pattern**
Clean separation of concerns with consistent data flow:
```
GraphQL Layer → Service Layer → Repository Layer → Database
     ↓              ↓               ↓
 Resolvers    Business Logic   CRUD Operations
   Types      Validation        Queries
             Audit Logging    Transactions
```

### **Non-Blocking I/O Architecture**
Async-first design for high concurrency and responsive performance:
- **FastAPI**: Built on asyncio for async request handling
- **SQLAlchemy**: Async drivers for non-blocking database operations
- **Instrument Integration**: Async socket connections for 100+ concurrent instruments
- **APScheduler**: AsyncIOScheduler for non-blocking background jobs
- **No Thread Pools**: Pure coroutine-based concurrency for efficiency

---

## **Quick Start Guide**

### **Prerequisites**
- Docker and Docker Compose (recommended)
- OR: Python 3.11+, Node.js 18+, PostgreSQL 14+
- Git

### **5-Minute Setup (Docker)**
```bash
git clone https://github.com/beak-insights/felicity-lims.git
cd felicity-lims

# Configure environment
cp env.example .env

# Start all services
docker compose -f docker-compose.dev.yml up -d --build

# Initialize database
docker compose -f docker-compose.dev.yml exec felicity-api felicity-lims db upgrade

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# GraphQL Playground: http://localhost:8000/graphql
```

### **Accessing the System**
- **Web UI**: http://localhost:3000 (Vue.js frontend)
- **GraphQL API**: http://localhost:8000/graphql (Strawberry GraphQL Playground)
- **REST API**: http://localhost:8000/api (if configured)
- **Database Admin**: Access PostgreSQL via DbGate or pgAdmin

### **Default Login**
See `env.example` for default credentials. Change immediately in production!

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

## **Development Best Practices**

### **Code Organization**
- **Domain-Driven Design**: Code organized by business domain (patient, sample, analysis, etc.)
- **Repository-Service Pattern**: Consistent CRUD and business logic separation
- **Type Hints**: 100% type hint coverage for IDE support and runtime validation
- **Docstrings**: Comprehensive docstrings for public APIs
- **Code Quality**: Automated linting and formatting with Ruff

### **Async/Await Patterns**
- **Always Async**: Use async functions for I/O operations (database, files, network)
- **Non-Blocking**: Never use blocking calls in async code (use `.run_in_executor()` if necessary)
- **Proper Awaiting**: Always `await` async calls, never fire-and-forget
- **Event Loops**: Use APScheduler with AsyncIOScheduler for background jobs
- **No Thread Mixing**: Keep async contexts separate from sync code

### **Multi-Tenant Safety**
- **Automatic Filtering**: Repository methods filter by `laboratory_uid`
- **Request Context**: Tenant context is set from JWT tokens in middleware
- **Entity Scoping**: All entities inherit from `LabScopedEntity` for automatic scoping
- **Validation**: Verify laboratory access before returning any data

### **Database Operations**
- **Async SQLAlchemy**: Use async drivers (asyncpg for PostgreSQL)
- **Transactions**: Wrap related operations in transactions for consistency
- **Migrations**: Use Alembic for all schema changes
- **ORM First**: Use SQLAlchemy ORM instead of raw SQL when possible

### **Testing Strategy**
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test service interactions and data flow
- **Async Testing**: Use pytest-asyncio for async test functions
- **Test Database**: Use separate database for tests (TESTING=True env var)

### **Instrument Integration**
- **Protocol Handlers**: ASTM and HL7 protocol support with auto-detection
- **Connection Management**: Use ConnectionService for instrument initialization
- **Message Safety**: Implement size limits and timeouts for message processing
- **Audit Trail**: Log all instrument communication for compliance

### **API Development**
- **GraphQL First**: Prefer GraphQL for new APIs (type-safe, self-documenting)
- **Type Generation**: Use `pnpm webapp:codegen` to generate TypeScript types from schema
- **Resolver Pattern**: Keep resolvers thin, push business logic to services
- **Error Handling**: Use consistent error response format

---

## **Project Structure**

```
felicity-lims/
├── felicity/                    # Main application package
│   ├── main.py                 # FastAPI application entry point
│   ├── core/                   # Core utilities and middleware
│   │   ├── tenant_context.py  # Multi-tenant context management
│   │   └── events.py           # Event system integration
│   ├── apps/                   # Domain modules (see Modules section)
│   │   ├── abstract/           # Base classes for all modules
│   │   ├── patient/            # Patient management domain
│   │   ├── sample/             # Sample management domain
│   │   ├── analysis/           # Analysis domain
│   │   ├── iol/                # Instrument integration module
│   │   │   └── analyzer/       # IOL Analyzer (async socket + protocols)
│   │   └── ... (other domains)
│   ├── api/                    # GraphQL and REST APIs
│   │   └── gql/               # GraphQL schema and resolvers
│   ├── lims/                   # LIMS-specific configuration
│   └── scripts/                # Database and utility scripts
├── webapp/                      # Vue.js frontend
│   ├── src/
│   │   ├── components/        # Reusable Vue components
│   │   ├── views/             # Page components
│   │   ├── queries/           # GraphQL queries
│   │   └── stores/            # Pinia state management
│   └── vite.config.ts         # Vite configuration
├── docker-compose.yml          # Production deployment
├── docker-compose.dev.yml      # Development environment
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
└── CLAUDE.md                   # Developer guidance
```

---

## **Performance Testing**

Evaluate system performance using **Locust** or other load-testing tools. We recommend testing concurrency to simulate
real-world scenarios:

```bash
# Test API endpoints
locust -f locustfile.py --host=http://localhost:8000

# Test instrument connections (100+ concurrent)
# Use IOL Analyzer module for stress testing
```

---

## **Troubleshooting**

### **Common Issues**

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in `docker-compose.yml` or `.env` |
| Database connection failed | Verify PostgreSQL is running: `docker compose logs postgres` |
| GraphQL schema errors | Regenerate types: `pnpm webapp:codegen` |
| Frontend not loading | Clear browser cache and rebuild: `pnpm webapp:build:only` |
| Async event loop errors | Ensure all I/O operations use async/await properly |

### **Debug Logging**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Set `DEBUG=True` in `.env` for verbose logging.

---

## **Contributing**

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### **Getting Started**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with proper type hints and docstrings
4. Run linting and tests: `pnpm server:lint && pnpm server:test`
5. Submit a pull request with clear description

### **Code Standards**
- Follow the [contribution guide](CONTRIBUTING.md) in the repository
- Ensure 100% type hint coverage on new code
- Add comprehensive docstrings to public APIs
- All code must pass linting: `bash ./felicity/scripts/lint.sh`
- All tests must pass: `bash ./felicity/scripts/test.sh`
- Maintain consistency with existing code patterns
- Use async/await for all I/O operations

### **Areas We Need Help**
- Protocol handlers (Modbus, DNP3, IEC 61850)
- Advanced metrics and monitoring
- Performance optimizations
- Documentation and tutorials
- Community plugins and extensions
- Testing and QA
- Translations and localization

---

## **License**

Felicity LIMS is released under the [MIT License](LICENSE).

---

## **Resources**

### **Documentation**
- **[Architecture Guide](CLAUDE.md)**: Detailed technical architecture for developers
- **[IOL Analyzer Module](felicity/apps/iol/analyzer/EVALUATION.md)**: Instrument integration documentation
- **[GraphQL Schema](felicity/api/gql/)**: Self-documenting GraphQL API reference
- **[Database Schema](felicity/alembic/)**: Database structure and migrations

### **External Resources**
- **ASTM E1381**: Standard for Specimen Labels and Report Formats
- **HL7 v2.5**: Health Level 7 messaging standard
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/
- **Vue 3 Docs**: https://vuejs.org/
- **GraphQL Docs**: https://graphql.org/

### **Community**
- GitHub Issues: [Report bugs or request features](https://github.com/beak-insights/felicity-lims/issues)
- Discussions: [Join the community](https://github.com/beak-insights/felicity-lims/discussions)

---

## **Contact**

Have questions or want to get involved? Reach out!

- **Email**: [aurthurmusendame@gmail.com](mailto:aurthurmusendame@gmail.com)
- **LinkedIn**: [Aurthur Musendame](https://www.linkedin.com/in/aurthurmusendame)
- **WhatsApp**: [Chat with us](https://api.whatsapp.com/send?phone=263776406399)
- **Telegram**: [Join the discussion](https://www.t.me/aurthurm)

---

## **Project Status**

**Current Version**: 4.x (Active Development)
**Last Updated**: October 2025
**Stability**: Production-ready core with active feature development
**Python Support**: 3.11+
**Node.js Support**: 18+

---
