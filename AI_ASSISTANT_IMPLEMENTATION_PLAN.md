# FELICITY LIMS AI ASSISTANT - Implementation Plan

## Executive Summary

This document outlines a comprehensive implementation plan for an AI-powered assistant integrated into the Felicity LIMS platform. The assistant will enable users to perform complex laboratory workflows through natural language conversations while maintaining strict HIPAA compliance and PII/PHI protection.

---

## Table of Contents

1. [Vision & Objectives](#vision--objectives)
2. [Architecture Overview](#architecture-overview)
3. [Use Cases & Capabilities](#use-cases--capabilities)
4. [PII/PHI Protection Strategy](#piiphi-protection-strategy)
5. [Technical Architecture](#technical-architecture)
6. [Implementation Phases](#implementation-phases)
7. [Security & Compliance](#security--compliance)
8. [Integration Points](#integration-points)
9. [UI/UX Design](#uiux-design)
10. [Testing Strategy](#testing-strategy)
11. [Deployment & Operations](#deployment--operations)

---

## 1. Vision & Objectives

### Vision
Create an intelligent conversational assistant that democratizes access to complex LIMS workflows, enabling laboratory staff to perform tasks through natural language while maintaining enterprise-grade security and compliance.

### Core Objectives
1. **Accessibility**: Reduce training time and complexity for new users
2. **Efficiency**: Streamline multi-step workflows into simple conversations
3. **Compliance**: Maintain HIPAA compliance with zero PII/PHI exposure to LLM
4. **Multi-tenancy**: Respect laboratory-level data isolation
5. **Scalability**: Support all existing and future LIMS workflows

---

## 2. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                           │
│  (Vue 3 Chat Component with Streaming Response Support)         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AI Assistant Backend                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Intent Classification & NLU Engine               │  │
│  │  (Classifies user intent, extracts parameters)           │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Context & Session Manager                        │  │
│  │  (Maintains conversation state, tenant context)          │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Tool Orchestrator & Function Calling            │  │
│  │  (Maps intents to GraphQL operations)                   │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         PII/PHI Anonymization Layer                      │  │
│  │  (Tokenizes/redacts sensitive data before LLM)          │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Response Generation & Formatting                 │  │
│  │  (Generates natural language responses)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│              Existing Felicity LIMS Backend                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         FastAPI + Strawberry GraphQL API                 │  │
│  │  - Tenant Context Middleware                             │  │
│  │  - JWT Authentication                                     │  │
│  │  - RBAC Authorization                                     │  │
│  │  - Repository-Service Pattern                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Zero PII/PHI to LLM**: All sensitive data is tokenized/anonymized before LLM processing
2. **Existing API Reuse**: Leverage all existing GraphQL mutations and queries
3. **Tenant Isolation**: All operations respect laboratory-level multi-tenancy
4. **Stateful Conversations**: Maintain context across multi-turn conversations
5. **Audit Trail**: Log all AI-assisted operations for compliance

---

## 3. Use Cases & Capabilities

### 3.1 Patient Management (17 use cases)

#### Basic Operations
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Register Patient** | Create new patient | "Register a new patient named John Doe, DOB 1990-05-15" | `createPatient` mutation |
| **Search Patient** | Find existing patient | "Find patient with ID PAT-2024-001" | `patientSearch` query with encrypted field search |
| **Search by Demographics** | Find by PII fields | "Find patients born on 1990-05-15" | `patientSearch` with searchable encryption indices |
| **Update Patient Info** | Modify patient details | "Update John Doe's phone number to +1234567890" | `updatePatient` mutation |
| **Add Patient Identification** | Add ID numbers | "Add SSN 123-45-6789 for patient PAT-2024-001" | `createPatientIdentification` mutation |
| **View Patient History** | Get patient context | "Show me all samples for patient PAT-2024-001" | `patientByUid` + related samples |

#### Advanced Workflows
| Use Case | Description | Complexity |
|----------|-------------|------------|
| **Bulk Patient Import** | Import from CSV/Excel with validation | High |
| **Patient Merge** | Combine duplicate patient records | High |
| **Patient Demographics Update** | Update province, district, client affiliation | Medium |
| **Patient Activity Timeline** | Show all interactions chronologically | Medium |
| **Patient Consent Management** | Track consent for data usage | Medium |

#### PII Protection Strategy for Patients
- **Input**: User provides patient name/DOB → System searches using encrypted indices
- **LLM Context**: Patient referenced as `PATIENT_TOKEN_001` with non-PII metadata (age_group, gender)
- **Output**: Display patient info directly from database, not through LLM

---

### 3.2 Sample & Analysis Request Management (23 use cases)

#### Sample Creation & Tracking
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create Analysis Request** | New test request | "Create a CBC test request for patient PAT-2024-001" | `createAnalysisRequest` mutation |
| **Add Samples to Request** | Sample collection | "Add 2 blood samples to request AR-2024-001" | `createSample` mutation |
| **Derive Samples** | Create child samples | "Create 3 aliquots from sample SAM-001" | Sample creation with parent relationship |
| **Pool Samples** | Combine samples | "Pool samples SAM-001 and SAM-002" | Sample creation with multiple parents |
| **Update Sample Status** | Track sample lifecycle | "Mark sample SAM-001 as received" | `receiveSample` mutation |
| **Reject Sample** | Handle QNS/unsuitable | "Reject sample SAM-001 due to hemolysis" | `cancelSamples` with rejection reason |
| **Assign Sample Priority** | Urgent processing | "Set sample SAM-001 to high priority" | `updateSample` mutation |
| **Track Sample Location** | Current whereabouts | "Where is sample SAM-001?" | Query sample + storage location |

#### Analysis & Testing
| Use Case | Description | Backend Operations |
|----------|-------------|-------------------|
| **Add Analyses to Sample** | Modify test panel | `createAnalysisRequest` or update |
| **Remove Analyses** | Cancel specific tests | `cancelAnalysisResults` mutation |
| **Clone Analysis Request** | Duplicate for another patient | Query + Create pattern |
| **Bulk Sample Creation** | Register multiple samples | Batch `createSample` calls |
| **Sample Type Validation** | Check compatibility | Query `analysesBySampleType` |
| **Search Samples** | Find by multiple criteria | `sampleSearch` with filters |
| **Sample Audit History** | Track all changes | `auditLogByObjectId` query |

#### Advanced Sample Workflows
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **Sample Barcode Generation** | Medium | Generate and print barcodes |
| **Sample Storage Assignment** | Medium | Allocate to biobank locations |
| **Sample Retrieval** | Medium | Pull from storage for testing |
| **Sample Disposal** | Medium | Track disposal with reasons |
| **Sample Transfer** | High | Between laboratories/departments |
| **Sample QC Check** | High | Pre-analytical quality validation |

---

### 3.3 Result Entry & Verification (18 use cases)

#### Result Entry
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Enter Single Result** | Manual result input | "Enter glucose result 95 mg/dL for sample SAM-001" | `submitAnalysisResults` mutation |
| **Enter Multiple Results** | Batch entry | "Enter results for worksheet WS-001: [values...]" | Batch `submitAnalysisResults` |
| **Import Instrument Results** | Auto-import | "Import results from instrument INS-001" | Instrument interface + result submission |
| **Update Result Value** | Correction | "Update glucose result to 98 mg/dL for SAM-001" | `updateAnalysisResult` mutation |
| **Add Result Note** | Technical comment | "Add note 'repeat dilution' to SAM-001 glucose" | `updateAnalysisResult` with remarks |

#### Result Verification
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Verify Single Result** | Approve test result | `approveAnalysisResults` mutation |
| **Verify Worksheet** | Batch verification | Approve all results in worksheet |
| **Reject Result** | QC failure | `retractAnalysisResults` mutation |
| **Request Retest** | Repeat analysis | `retestAnalysisResults` mutation |
| **Multi-level Verification** | Staged approval | Multiple `approveAnalysisResults` calls |

#### Result Workflows
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **Result Out-of-Range Check** | Medium | Auto-flag results against specifications |
| **Delta Check** | High | Compare with patient's historical results |
| **Critical Result Notification** | Medium | Alert clinician for panic values |
| **Result Amendment** | Medium | Track result corrections with audit |
| **Result Invalidation** | High | Void results with reasoning and audit |
| **Result Publishing** | Medium | Make results available for reporting |
| **Result Interpretation** | High | AI-assisted clinical significance |

---

### 3.4 Worksheet Management (15 use cases)

#### Worksheet Creation
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create Worksheet** | New batch | "Create a new chemistry worksheet" | `createWorksheet` mutation |
| **From Template** | Use preset | "Create worksheet from template CHEM-001" | Query template + create |
| **Assign Samples** | Add to worksheet | "Add samples SAM-001 to SAM-010 to worksheet WS-001" | `updateWorksheet` mutation |
| **Assign Instrument** | Link equipment | "Assign worksheet WS-001 to instrument INS-001" | `updateWorksheet` mutation |
| **Set Analyst** | Assign technologist | "Assign worksheet WS-001 to analyst John Doe" | `updateWorksheet` mutation |

#### Worksheet Operations
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Add QC Samples** | Include controls | Add QC samples to worksheet |
| **Rearrange Sample Order** | Optimize workflow | Update sample positions |
| **Remove Sample** | Unassign from worksheet | Update worksheet samples |
| **Clone Worksheet** | Duplicate structure | Query + Create pattern |
| **Print Worksheet** | Generate work list | Query + report generation |

#### Worksheet Lifecycle
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **Submit Worksheet** | Medium | Change state to pending verification |
| **Verify Worksheet** | Medium | Batch approve all results |
| **Worksheet QC Review** | High | Validate QC results before approval |
| **Worksheet Audit** | Medium | Track all worksheet changes |
| **Worksheet Metrics** | Medium | TAT, completion rate analysis |

---

### 3.5 Quality Control (12 use cases)

#### QC Setup
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create QC Level** | Define control type | "Create QC level 'High Normal Control'" | `createQCLevel` mutation |
| **Create QC Set** | Group controls | "Create QC set for Chemistry panel" | `createQCSet` mutation |
| **Create QC Template** | Reusable config | "Create template with levels L1, L2, L3" | `createQCTemplate` mutation |
| **Add QC Sample** | Control sample | "Add QC sample QC-001 to set QCSET-001" | QC sample creation |

#### QC Operations
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Run QC** | Execute controls | Add QC samples to worksheet + enter results |
| **QC Chart Generation** | Levey-Jennings chart | Query QC results + visualization |
| **QC Rule Evaluation** | Westgard rules | Analyze QC data for violations |
| **QC Failure Investigation** | Root cause analysis | Query audit logs + results |

#### QC Management
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **QC Expiry Tracking** | Medium | Monitor QC material shelf life |
| **QC Lot Change** | Medium | Transition to new QC material |
| **QC Trend Analysis** | High | Statistical process control |
| **QC Material Ordering** | Medium | Inventory management integration |

---

### 3.6 Shipment & Referral (11 use cases)

#### Shipment Creation
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create Shipment** | New referral | "Create shipment to RefLab-001" | `createShipment` mutation |
| **Add Samples to Shipment** | Include samples | "Add samples SAM-001 to SAM-005 to shipment SHIP-001" | `updateShipment` mutation |
| **Set Courier** | Assign transport | "Assign DHL courier to shipment SHIP-001" | `updateShipment` mutation |
| **Generate Manifest** | Shipment documentation | Query shipment + generate manifest |

#### Shipment Tracking
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Mark Ready for Dispatch** | Finalize shipment | `actionShipment` mutation (state: READY) |
| **Dispatch Shipment** | Send out | `dispatchShipment` mutation |
| **Receive Shipment** | Incoming samples | `receiveShipment` mutation |
| **Track Shipment Status** | Current state | Query shipment details |

#### Advanced Shipment
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **Chain of Custody** | High | Track all sample handlers |
| **Shipment Temperature Log** | Medium | Monitor cold chain |
| **Return Shipment** | Medium | Send results/samples back |

---

### 3.7 Inventory Management (14 use cases)

#### Stock Operations
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Add Stock Item** | New product | "Add reagent 'Glucose Reagent Kit'" | `createStockItem` mutation |
| **Receive Stock** | Incoming inventory | "Receive 10 units of item ITEM-001, lot LOT-2024-001" | `createStockReceipt` mutation |
| **Adjust Stock** | Correction | "Adjust stock for ITEM-001 to 50 units due to count discrepancy" | `createStockAdjustment` mutation |
| **Create Stock Order** | Purchase request | "Create order for 20 units of item ITEM-001 from supplier SUP-001" | `createStockOrder` mutation |
| **Check Stock Level** | Inventory query | "What's the current stock of item ITEM-001?" | `stockItemByUid` query |

#### Inventory Monitoring
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Low Stock Alerts** | Reorder notifications | Query inventory KPIs |
| **Expiry Tracking** | Monitor shelf life | Query stock lots by expiry |
| **Stock Audit** | Physical count | Create adjustments |
| **Stock Transfer** | Between locations | Create transaction records |

#### Advanced Inventory
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **Reorder Point Calculation** | High | AI-based demand forecasting |
| **Usage Analytics** | High | Consumption patterns by test volume |
| **Cost Tracking** | Medium | COGS per test analysis |
| **Supplier Performance** | Medium | Lead time and quality metrics |
| **Lot Traceability** | High | Track usage in specific tests |

---

### 3.8 Billing Operations (13 use cases)

#### Billing Creation
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Generate Bill** | Invoice creation | "Create bill for patient PAT-2024-001 for request AR-001" | `createTestBill` mutation |
| **Apply Discount** | Reduce charges | "Apply 10% discount to bill BILL-001" | `applyDiscount` mutation |
| **Apply Voucher** | Promotional code | "Apply voucher code PROMO2024 to bill BILL-001" | `applyVoucher` mutation |
| **Check Insurance** | Coverage query | "What's covered for patient PAT-001?" | Query patient + insurance info |

#### Payment Processing
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Record Payment** | Cash/card transaction | `createBillTransaction` mutation |
| **Partial Payment** | Split payments | Multiple transaction records |
| **Payment Refund** | Process return | Create negative transaction |
| **Bill Adjustment** | Correct billing error | Update bill amounts |

#### Billing Analytics
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **Outstanding Balance Report** | Medium | Query unpaid bills |
| **Revenue by Test** | Medium | Analysis-level revenue analysis |
| **Collection Rate** | Medium | Payment efficiency metrics |
| **Discount Analysis** | High | Promotion effectiveness |
| **Insurance Claims** | High | Integration with payer systems |

---

### 3.9 Document Management (10 use cases)

#### Document Operations
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create Document** | New QMS doc | "Create SOP for sample handling" | `createDocument` mutation |
| **Search Documents** | Find by criteria | "Find all SOPs related to blood collection" | `documentSearch` query |
| **Create Version** | Update document | "Create new version of document DOC-001" | `createDocumentVersion` mutation |
| **Assign Reviewers** | Review workflow | "Assign reviewers [users] to document DOC-001" | `assignDocumentReviewers` mutation |
| **Approve Document** | Publishing | "Approve document DOC-001" | `approveDocument` mutation |

#### Document Workflows
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Document Subscription** | Follow updates | Subscribe to document |
| **Review Cycle** | Formal review | Create review steps + track |
| **Archive Document** | Deprecate | Update document status |
| **Document Linking** | Relationships | Link related documents |
| **Document Templates** | Reusable structure | Create + use templates |

---

### 3.10 Microbiology Workflows (16 use cases)

#### Organism Management
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create Organism** | Add microbe | "Create organism 'E. coli O157:H7'" | `createOrganism` mutation |
| **Report Organism** | Culture result | "Report E. coli for sample SAM-001" | Create organism result |
| **Add Serotype** | Subspecies | "Add serotype O157:H7 to E. coli" | `createOrganismSerotype` mutation |

#### AST Management
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Create AST Panel** | Antibiotic grouping | `createASTPanel` mutation |
| **Run AST** | Susceptibility testing | Create AST results for organism |
| **Enter MIC/Zone** | Test values | Submit AST result values |
| **Interpret Result** | S/I/R determination | Apply breakpoints |
| **Add Breakpoint** | Reference values | `createBreakpoint` mutation |

#### Microbiology Advanced
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **WHONET Export** | High | Export for surveillance |
| **Expert Interpretation** | High | Apply resistance rules |
| **Phenotype Detection** | High | ESBL, MRSA, etc. detection |
| **Medium QC** | Medium | Culture media quality tracking |
| **AST QC** | Medium | Control strain testing |
| **Resistance Trend Analysis** | High | Antibiogram generation |
| **Outbreak Detection** | High | Pattern recognition for epidemiology |

---

### 3.11 Storage & Biobanking (8 use cases)

#### Storage Operations
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create Storage Container** | New freezer/rack | "Create storage container 'Freezer-001'" | `createStorageContainer` mutation |
| **Store Sample** | Biobank sample | "Store sample SAM-001 in container CONT-001 slot A1" | `storeSamples` mutation |
| **Retrieve Sample** | Pull from storage | "Retrieve sample SAM-001 from storage" | Update stored_by field |
| **Search Storage** | Find samples | "What samples are in container CONT-001?" | Query stored samples |

#### Storage Management
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Storage Capacity** | Monitor space | Query container + count |
| **Temperature Monitoring** | Cold chain | Log temperature readings |
| **Sample Disposition** | Long-term tracking | Update storage status |
| **Storage Audit** | Physical verification | Compare database vs. physical count |

---

### 3.12 Reflex Testing (6 use cases)

#### Reflex Setup
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create Reflex Trigger** | Define trigger | "Create reflex trigger for TSH > 10" | `createReflexTrigger` mutation |
| **Add Decision Logic** | Define rules | "Add rule: if TSH > 10, add Free T4 test" | `createReflexDecision` mutation |
| **Test Reflex Rule** | Validation | "Test reflex rule with TSH = 15" | Query + simulate |

#### Reflex Operations
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **View Reflex History** | Execution tracking | Query reflex executions |
| **Disable Reflex** | Turn off rule | Update reflex trigger status |
| **Reflex Analytics** | Usage statistics | Query execution counts + patterns |

---

### 3.13 User & Access Management (9 use cases)

#### User Operations
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Create User** | New account | "Create user account for John Doe, email john@lab.com" | `createUser` mutation |
| **Assign Roles** | Grant permissions | "Assign role 'Analyst' to user USER-001" | `updateUser` mutation |
| **Assign Laboratory** | Multi-lab access | "Give user USER-001 access to Lab-002" | User-lab assignment |
| **Reset Password** | Password recovery | "Reset password for user USER-001" | Password reset workflow |

#### Access Management
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **View User Permissions** | Check access | Query user + groups + permissions |
| **Audit User Activity** | Track actions | Query audit logs by user |
| **Block User Account** | Disable access | Update user active status |
| **Create User Group** | Role definition | Create group + assign permissions |
| **Preference Management** | User settings | Update user preferences |

---

### 3.14 Reporting & Analytics (12 use cases)

#### Report Generation
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Generate Patient Report** | Test results report | "Generate report for patient PAT-001" | Query results + impress generation |
| **Print Sample Labels** | Barcode printing | "Print labels for samples in request AR-001" | Generate barcodes + print |
| **Export to PDF** | Document export | "Export report to PDF for patient PAT-001" | Report generation + PDF conversion |
| **Send Report by Email** | Electronic delivery | "Email report to patient@example.com" | Report + messaging service |

#### Analytics & Dashboards
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **TAT Analysis** | Turnaround time metrics | Query analytics data |
| **Test Volume Report** | Workload analysis | Query sample/result counts |
| **QC Performance** | Quality metrics | QC result aggregation |
| **Revenue Dashboard** | Financial metrics | Billing analytics queries |

#### Advanced Analytics
| Use Case | Complexity | Description |
|----------|-----------|-------------|
| **Predictive Analytics** | High | Forecast test volumes, identify trends |
| **Resource Optimization** | High | Staff scheduling, instrument utilization |
| **Clinical Insights** | High | Population health analysis |
| **Compliance Reporting** | Medium | Regulatory submissions (CAP, CLIA) |

---

### 3.15 System Administration (7 use cases)

#### Configuration
| Use Case | User Intent | Example Query | Backend Operation |
|----------|-------------|---------------|-------------------|
| **Configure Laboratory** | Lab settings | "Update laboratory TAT to 24 hours" | `updateLaboratory` mutation |
| **Setup Test Method** | Method configuration | "Create test method 'Automated Chemistry'" | `createMethod` mutation |
| **Add Instrument** | Equipment setup | "Add instrument 'Cobas 6000'" | `createInstrument` mutation |
| **Configure Notifications** | Alert setup | "Enable SMS notifications for critical results" | SMS template configuration |

#### Maintenance
| Use Case | Description | Operations |
|----------|-------------|-----------|
| **Audit Log Review** | System monitoring | Query audit logs |
| **Data Export** | Backup/archival | Bulk data extraction |
| **System Health Check** | Diagnostics | Query system status endpoints |

---

## 4. PII/PHI Protection Strategy

### 4.1 Core Protection Principles

#### Zero PII/PHI to LLM
All personally identifiable information (PII) and protected health information (PHI) **MUST NEVER** be sent to external LLM providers.

#### Data Classification

| Classification | Examples | Protection Strategy |
|----------------|----------|---------------------|
| **PII (Encrypted)** | Patient name, DOB, email, phone, SSN | Tokenize before LLM, use tokens in conversation |
| **PHI (Encrypted)** | Test results, symptoms, clinical notes | Tokenize with type hints (e.g., RESULT_001: "elevated") |
| **Non-sensitive** | Sample IDs, Test names, Dates, Status | Safe to include in LLM context |
| **Aggregate** | Counts, averages, ranges | Safe when properly aggregated |

### 4.2 Tokenization Architecture

#### Token Mapping System
```python
class TokenManager:
    """Manages token generation and mapping for PII/PHI"""

    def tokenize_patient(self, patient: Patient) -> PatientToken:
        """
        Returns: {
            "token": "PATIENT_TOKEN_001",
            "metadata": {
                "age_group": "30-40",  # Binned age
                "gender": "M",
                "client": "Client A",
                "sample_count": 5
            }
        }
        """

    def tokenize_result(self, result: AnalysisResult) -> ResultToken:
        """
        Returns: {
            "token": "RESULT_001",
            "metadata": {
                "analysis": "Glucose",
                "status": "elevated",  # vs actual value
                "unit": "mg/dL",
                "in_range": False
            }
        }
        """
```

#### Example Flow
```
User: "Show me results for patient John Doe"

1. System searches database using encrypted indices
2. Finds patient PAT-2024-001
3. Creates token: PATIENT_TOKEN_001
4. LLM receives: "Show results for PATIENT_TOKEN_001 (age_group: 30-40, gender: M)"
5. System queries results
6. Tokenizes results: RESULT_001, RESULT_002, etc.
7. LLM generates response with tokens
8. System de-tokenizes for display: replaces tokens with actual values
9. User sees: "John Doe has 3 results: Glucose (elevated), CBC (normal)..."
```

### 4.3 Implementation Details

#### Pre-LLM Sanitization
```python
def sanitize_for_llm(context: dict) -> dict:
    """Remove all PII/PHI before sending to LLM"""
    sanitized = {}

    # Replace patient info with tokens
    if "patient" in context:
        sanitized["patient"] = tokenize_patient(context["patient"])

    # Replace results with status indicators
    if "results" in context:
        sanitized["results"] = [
            tokenize_result(r) for r in context["results"]
        ]

    # Keep non-sensitive metadata
    sanitized["sample_ids"] = context.get("sample_ids", [])
    sanitized["test_names"] = context.get("test_names", [])

    return sanitized
```

#### Post-LLM De-tokenization
```python
def detokenize_response(response: str, token_map: dict) -> str:
    """Replace tokens with actual values for user display"""
    for token, value in token_map.items():
        response = response.replace(token, value)
    return response
```

### 4.4 Safe LLM Use Cases

#### Approved LLM Contexts
1. **Intent Classification**: Understanding user's goal (no PII needed)
2. **Response Generation**: Templated responses with token placeholders
3. **Workflow Orchestration**: Determining which operations to execute
4. **Error Handling**: Generating helpful error messages
5. **Aggregated Analytics**: Working with counts, percentages, trends

#### Example Safe Prompt
```
User query: "Create a patient"

LLM receives:
- Intent: Create patient
- Required fields: [first_name, last_name, dob, gender, ...]
- Optional fields: [email, phone, address, ...]
- Current context: User is in laboratory LAB_001, has permission to create patients

LLM generates:
- Response template: "I'll help you register a new patient. Please provide: ..."
- Required form fields
- Validation rules

NO PII is involved in this interaction.
```

---

## 5. Technical Architecture

### 5.1 Backend Components

#### 5.1.1 AI Assistant Service Layer
```
felicity/apps/assistant/
├── __init__.py
├── entities.py              # Conversation, Message, TokenMap models
├── repository.py            # Database access for conversations
├── services.py              # Core AI assistant logic
├── intents/                 # Intent classification & handlers
│   ├── patient.py
│   ├── sample.py
│   ├── result.py
│   ├── worksheet.py
│   └── ...
├── tools/                   # LLM function calling tools
│   ├── patient_tools.py
│   ├── sample_tools.py
│   └── ...
├── tokenization.py          # PII/PHI tokenization logic
├── context_manager.py       # Conversation state management
└── llm_client.py           # LLM provider abstraction (Claude, OpenAI, etc.)
```

#### 5.1.2 GraphQL Integration
```python
# felicity/api/gql/assistant/
├── __init__.py
├── types.py                # Strawberry types for assistant
├── query.py                # Query resolvers
├── mutations.py            # Mutation resolvers
└── subscriptions.py        # Real-time message streaming
```

#### 5.1.3 Key Data Models

```python
# Conversation tracking
class Conversation(LabScopedEntity):
    """Track multi-turn conversations"""
    uid: str
    user_uid: str           # Current user
    laboratory_uid: str     # Active laboratory
    title: str              # Auto-generated from first message
    status: str             # active, archived, deleted
    context: dict           # Conversation state (JSON)
    created_at: datetime
    updated_at: datetime

class Message(BaseEntity):
    """Individual messages in conversation"""
    uid: str
    conversation_uid: str
    role: str              # user, assistant, system
    content: str           # Message text
    tokens_used: int       # LLM token count
    created_at: datetime
    metadata: dict         # Message metadata (JSON)

class TokenMap(BaseEntity):
    """PII/PHI token mappings per conversation"""
    uid: str
    conversation_uid: str
    token: str             # PATIENT_TOKEN_001
    token_type: str        # patient, result, sample
    entity_uid: str        # Actual database UID
    expires_at: datetime   # Auto-expire after conversation
```

### 5.2 Frontend Components

#### 5.2.1 Vue 3 Chat Interface
```
webapp/components/assistant/
├── AIChatInterface.vue       # Main chat component
├── MessageBubble.vue         # Individual message display
├── InputBox.vue              # Message input with suggestions
├── SuggestedActions.vue      # Quick action buttons
├── ConversationList.vue      # Conversation history sidebar
├── ContextPanel.vue          # Show current context (patient, samples)
└── TokenViewer.vue           # Debug tool to show tokenization
```

#### 5.2.2 Chat Component Features
- **Streaming responses**: Real-time message generation using GraphQL subscriptions
- **Rich formatting**: Markdown support, tables, lists
- **Action buttons**: Quick actions (e.g., "View Patient", "Print Labels")
- **File attachments**: Upload CSV for bulk operations
- **Voice input**: Speech-to-text for hands-free operation
- **Multi-modal**: Display images (charts, barcodes) in chat
- **Context awareness**: Show related entities (current patient, samples)

### 5.3 Intent Classification System

#### 5.3.1 Intent Taxonomy
```python
class IntentCategory(Enum):
    PATIENT_MANAGEMENT = "patient"
    SAMPLE_MANAGEMENT = "sample"
    RESULT_MANAGEMENT = "result"
    WORKSHEET_MANAGEMENT = "worksheet"
    QC_MANAGEMENT = "qc"
    SHIPMENT_MANAGEMENT = "shipment"
    INVENTORY_MANAGEMENT = "inventory"
    BILLING_MANAGEMENT = "billing"
    DOCUMENT_MANAGEMENT = "document"
    STORAGE_MANAGEMENT = "storage"
    REPORTING = "reporting"
    SYSTEM_ADMIN = "admin"
    HELP = "help"

class Intent(Enum):
    # Patient intents
    CREATE_PATIENT = "patient.create"
    SEARCH_PATIENT = "patient.search"
    UPDATE_PATIENT = "patient.update"

    # Sample intents
    CREATE_SAMPLE = "sample.create"
    UPDATE_SAMPLE_STATUS = "sample.update_status"
    REJECT_SAMPLE = "sample.reject"
    # ... (150+ intents total)
```

#### 5.3.2 Intent Handler Pattern
```python
class IntentHandler(ABC):
    """Base class for intent handlers"""

    @abstractmethod
    async def validate(self, params: dict) -> tuple[bool, str]:
        """Validate parameters before execution"""
        pass

    @abstractmethod
    async def execute(self, params: dict) -> dict:
        """Execute the intent"""
        pass

    @abstractmethod
    def get_confirmation_prompt(self, params: dict) -> str:
        """Generate confirmation message for user"""
        pass
```

#### 5.3.3 Example: Create Patient Intent
```python
class CreatePatientIntent(IntentHandler):
    """Handle patient creation"""

    async def validate(self, params: dict) -> tuple[bool, str]:
        """Validate required fields"""
        required = ["first_name", "last_name", "dob"]
        missing = [f for f in required if f not in params]

        if missing:
            return False, f"Missing required fields: {', '.join(missing)}"

        # Validate DOB format
        try:
            dob = datetime.fromisoformat(params["dob"])
            if dob > datetime.now():
                return False, "Date of birth cannot be in the future"
        except ValueError:
            return False, "Invalid date format for DOB"

        return True, "Valid"

    async def execute(self, params: dict) -> dict:
        """Create patient via GraphQL mutation"""
        patient_service = PatientService()

        # Create patient
        patient = await patient_service.create_patient(
            first_name=params["first_name"],
            last_name=params["last_name"],
            dob=params["dob"],
            gender=params.get("gender"),
            email=params.get("email"),
            phone=params.get("phone"),
            # ... other fields
        )

        return {
            "success": True,
            "patient_uid": patient.uid,
            "patient_id": patient.patient_id,
            "message": f"Patient {patient.patient_id} created successfully"
        }

    def get_confirmation_prompt(self, params: dict) -> str:
        """Generate confirmation message"""
        return f"""
        I'll create a patient with the following details:
        - Name: {params['first_name']} {params['last_name']}
        - DOB: {params['dob']}
        - Gender: {params.get('gender', 'Not specified')}

        Proceed? (Yes/No)
        """
```

### 5.4 LLM Integration

#### 5.4.1 LLM Provider Abstraction
```python
class LLMClient(ABC):
    """Abstract LLM client for provider flexibility"""

    @abstractmethod
    async def complete(self, messages: list[dict], tools: list[dict] = None) -> dict:
        """Generate completion"""
        pass

    @abstractmethod
    async def stream(self, messages: list[dict]) -> AsyncIterator[str]:
        """Stream completion tokens"""
        pass

class ClaudeClient(LLMClient):
    """Anthropic Claude integration"""

    async def complete(self, messages: list[dict], tools: list[dict] = None) -> dict:
        """Use Claude API with function calling"""
        response = await anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )
        return response

class OpenAIClient(LLMClient):
    """OpenAI GPT integration"""

    async def complete(self, messages: list[dict], tools: list[dict] = None) -> dict:
        """Use OpenAI API with function calling"""
        response = await openai.chat.completions.create(
            model="gpt-4-turbo",
            messages=messages,
            tools=tools
        )
        return response
```

#### 5.4.2 Function Calling Schema
```python
# Define tools for LLM function calling
PATIENT_TOOLS = [
    {
        "name": "create_patient",
        "description": "Create a new patient record",
        "input_schema": {
            "type": "object",
            "properties": {
                "first_name": {"type": "string", "description": "Patient's first name"},
                "last_name": {"type": "string", "description": "Patient's last name"},
                "dob": {"type": "string", "format": "date", "description": "Date of birth (YYYY-MM-DD)"},
                "gender": {"type": "string", "enum": ["M", "F", "O"], "description": "Gender"},
                "email": {"type": "string", "format": "email", "description": "Email address"},
                "phone": {"type": "string", "description": "Phone number"}
            },
            "required": ["first_name", "last_name", "dob"]
        }
    },
    {
        "name": "search_patient",
        "description": "Search for existing patients",
        "input_schema": {
            "type": "object",
            "properties": {
                "patient_id": {"type": "string", "description": "Patient ID"},
                "first_name": {"type": "string", "description": "First name (partial match)"},
                "last_name": {"type": "string", "description": "Last name (partial match)"},
                "dob": {"type": "string", "format": "date", "description": "Date of birth"}
            }
        }
    }
]
```

### 5.5 Context Management

#### 5.5.1 Conversation Context
```python
class ConversationContext:
    """Maintain conversation state"""

    def __init__(self, conversation_uid: str):
        self.conversation_uid = conversation_uid
        self.current_patient: Optional[str] = None  # Patient token
        self.current_samples: list[str] = []        # Sample tokens
        self.current_worksheet: Optional[str] = None
        self.pending_action: Optional[dict] = None  # Action awaiting confirmation
        self.intent_history: list[str] = []         # Track intent sequence
        self.token_map: dict[str, str] = {}         # Token to UID mapping

    def set_patient(self, patient_uid: str) -> str:
        """Set current patient and return token"""
        token = f"PATIENT_TOKEN_{len(self.token_map) + 1}"
        self.token_map[token] = patient_uid
        self.current_patient = token
        return token

    def get_context_summary(self) -> str:
        """Generate context string for LLM"""
        summary = []

        if self.current_patient:
            summary.append(f"Current patient: {self.current_patient}")

        if self.current_samples:
            summary.append(f"Current samples: {', '.join(self.current_samples)}")

        if self.current_worksheet:
            summary.append(f"Current worksheet: {self.current_worksheet}")

        return "\n".join(summary) if summary else "No active context"
```

#### 5.5.2 Multi-turn Conversation Flow
```
User: "Register a new patient John Doe born on 1990-05-15"
  → LLM: Extract parameters, call create_patient tool
  → System: Creates patient PAT-2024-001, generates PATIENT_TOKEN_001
  → Response: "Patient PAT-2024-001 created. What would you like to do next?"

User: "Create a CBC test request for this patient"
  → Context: current_patient = PATIENT_TOKEN_001 (PAT-2024-001)
  → LLM: Resolve "this patient" to PATIENT_TOKEN_001
  → System: Creates analysis request
  → Response: "Request AR-2024-001 created with CBC test"

User: "Add 2 blood samples"
  → Context: current_patient, current_request = AR-2024-001
  → LLM: Create samples linked to current request
  → System: Creates SAM-2024-001, SAM-2024-002
  → Response: "2 samples added: SAM-2024-001, SAM-2024-002"
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)

#### Deliverables
1. **Backend Infrastructure**
   - AI Assistant service module structure
   - Conversation and message data models
   - Token management system
   - Basic GraphQL API (queries, mutations)

2. **Frontend Components**
   - Basic chat interface
   - Message display
   - Input box with send button
   - Conversation list

3. **LLM Integration**
   - LLM client abstraction (Claude/OpenAI)
   - Basic prompt templates
   - Function calling setup

4. **Core Capabilities (5 intents)**
   - Create patient
   - Search patient
   - Create sample
   - Create analysis request
   - Enter result

#### Success Criteria
- User can have basic conversation
- Create patient and samples via chat
- All PII properly tokenized
- No PII sent to LLM

---

### Phase 2: Core Workflows (Weeks 5-8)

#### Deliverables
1. **Patient Management (Complete)**
   - All patient CRUD operations
   - Patient search with encrypted fields
   - Patient identification management
   - Patient history queries

2. **Sample Management (Complete)**
   - Sample lifecycle operations
   - Sample relationships (parent-child, pooling)
   - Sample status updates
   - Rejection handling

3. **Result Entry (Basic)**
   - Single result entry
   - Multiple result entry
   - Result verification
   - Result retesting

4. **Enhanced UI**
   - Streaming responses
   - Rich formatting (markdown)
   - Action buttons
   - Context panel

#### Success Criteria
- Complete patient-sample-result workflow via chat
- Context maintained across conversations
- Streaming responses working
- User can complete 80% of daily tasks

---

### Phase 3: Advanced Workflows (Weeks 9-12)

#### Deliverables
1. **Worksheet Management**
   - Worksheet creation and assignment
   - Sample-to-worksheet assignment
   - Worksheet verification
   - QC integration

2. **Quality Control**
   - QC setup (levels, sets, templates)
   - QC result entry
   - QC chart generation
   - QC rule evaluation

3. **Shipment Operations**
   - Shipment creation
   - Sample assignment
   - Dispatch tracking
   - Manifest generation

4. **Inventory Management**
   - Stock operations
   - Low stock alerts
   - Expiry tracking
   - Reorder management

#### Success Criteria
- All major workflows available via chat
- Complex multi-step workflows simplified
- Integration with existing features
- Performance optimized (sub-second response)

---

### Phase 4: Specialized Modules (Weeks 13-16)

#### Deliverables
1. **Billing Operations**
   - Bill generation
   - Payment processing
   - Discount application
   - Revenue analytics

2. **Microbiology**
   - Organism reporting
   - AST panel management
   - MIC/Zone entry
   - Breakpoint interpretation

3. **Document Management**
   - Document creation
   - Version management
   - Review workflows
   - Search and retrieval

4. **Storage & Biobanking**
   - Sample storage
   - Location tracking
   - Retrieval operations
   - Storage analytics

#### Success Criteria
- All specialized workflows available
- Domain-specific language understanding
- Seamless integration with existing modules
- Expert users can use chat exclusively

---

### Phase 5: Intelligence & Analytics (Weeks 17-20)

#### Deliverables
1. **Natural Language Analytics**
   - "Show me TAT trends for CBC tests this month"
   - "Which tests have the highest failure rate?"
   - "What's our collection rate for bills last quarter?"

2. **Predictive Insights**
   - "When will we run out of glucose reagent?"
   - "Predict test volume for next month"
   - "Identify samples at risk of TAT breach"

3. **Automated Workflows**
   - "Create worksheet for all pending chemistry samples"
   - "Verify all results in worksheet WS-001 that pass QC"
   - "Generate end-of-month reports"

4. **Learning & Personalization**
   - Learn user preferences (e.g., default test panels)
   - Suggest actions based on context
   - Proactive notifications

#### Success Criteria
- AI generates actionable insights
- Predictive analytics functional
- User productivity increased 30%
- Reduced manual errors

---

### Phase 6: Polish & Production (Weeks 21-24)

#### Deliverables
1. **Performance Optimization**
   - Response time < 500ms for simple queries
   - Streaming latency < 100ms
   - Token caching for frequent operations
   - Database query optimization

2. **Enhanced UX**
   - Voice input/output
   - Mobile-optimized interface
   - Keyboard shortcuts
   - Multi-language support

3. **Admin & Monitoring**
   - Usage analytics dashboard
   - Token usage tracking (cost management)
   - Error logging and alerting
   - A/B testing framework

4. **Documentation & Training**
   - User guide with examples
   - Video tutorials
   - In-app help
   - Admin configuration guide

#### Success Criteria
- Production-ready quality
- Comprehensive documentation
- User satisfaction > 4.5/5
- Ready for scale

---

## 7. Security & Compliance

### 7.1 Authentication & Authorization

#### Multi-Tenant Isolation
```python
async def process_chat_message(message: str, user: User) -> str:
    """All assistant operations respect tenant context"""

    # Extract tenant context from JWT
    tenant_context = get_tenant_context()

    # Ensure user is authenticated
    if not tenant_context.is_authenticated:
        raise AuthenticationError("User not authenticated")

    # All database queries automatically filtered by laboratory_uid
    # via repository layer (existing pattern)

    # Create conversation scoped to user's laboratory
    conversation = await conversation_service.get_or_create(
        user_uid=tenant_context.user_uid,
        laboratory_uid=tenant_context.laboratory_uid
    )

    # Process message...
```

#### Permission Checks
```python
async def execute_intent(intent: Intent, params: dict) -> dict:
    """Check permissions before executing operations"""

    # Get required permission for intent
    required_permission = intent.get_required_permission()

    # Check user has permission
    if not user_has_permission(required_permission):
        raise PermissionDeniedError(
            f"User lacks permission: {required_permission}"
        )

    # Execute intent...
```

### 7.2 Audit Logging

#### Comprehensive Tracking
```python
class AIAssistantAuditLog(BaseEntity):
    """Track all AI-assisted operations"""

    uid: str
    conversation_uid: str
    user_uid: str
    laboratory_uid: str

    # What was requested
    user_message: str          # Original user input
    intent: str                # Classified intent
    parameters: dict           # Extracted parameters (JSON)

    # What was executed
    operations: list[dict]     # Backend operations performed
    success: bool
    error_message: Optional[str]

    # LLM tracking
    llm_provider: str          # claude, openai, etc.
    llm_model: str             # model version
    tokens_used: int           # Token count

    # Timestamps
    created_at: datetime
    completed_at: datetime
```

#### Compliance Reports
- **HIPAA Audit Trail**: All patient data access via assistant
- **User Activity Report**: Track operations by user
- **LLM Cost Tracking**: Token usage and costs per user/lab
- **Error Analysis**: Identify and fix common failures

### 7.3 Data Privacy

#### Token Expiration
```python
class TokenExpirationPolicy:
    """Auto-expire tokens after conversation ends"""

    CONVERSATION_TTL = timedelta(hours=24)  # Expire after 24h
    TOKEN_TTL = timedelta(hours=1)          # Expire tokens after 1h

    @staticmethod
    async def cleanup_expired_tokens():
        """Background job to clean up tokens"""
        cutoff = datetime.now() - TOKEN_TTL
        await TokenMap.delete().where(
            TokenMap.created_at < cutoff
        ).execute()
```

#### PII Logging Policy
```python
# NEVER log PII to application logs
logger.info(f"Created patient {patient.uid}")  # ✅ OK
logger.info(f"Created patient {patient.first_name}")  # ❌ NEVER

# Store audit logs in MongoDB (encrypted at rest)
await audit_service.log(
    action="create_patient",
    entity_uid=patient.uid,
    # PII stored encrypted in MongoDB, not in application logs
)
```

### 7.4 LLM Safety

#### Content Filtering
```python
def validate_user_input(message: str) -> tuple[bool, str]:
    """Check for injection attacks and inappropriate content"""

    # Check for prompt injection
    injection_patterns = [
        "ignore previous instructions",
        "system:",
        "assistant:",
        "<|im_start|>",
    ]

    for pattern in injection_patterns:
        if pattern.lower() in message.lower():
            return False, "Message contains suspicious content"

    # Check message length
    if len(message) > 10000:
        return False, "Message too long"

    return True, "Valid"
```

#### Rate Limiting
```python
class RateLimiter:
    """Prevent abuse and control costs"""

    # Per user limits
    MAX_MESSAGES_PER_HOUR = 100
    MAX_TOKENS_PER_DAY = 50000

    # Per laboratory limits
    MAX_COST_PER_DAY = 100.00  # USD
```

---

## 8. Integration Points

### 8.1 Existing Backend Services

#### Leverage Existing Patterns
```python
# Assistant uses same services as GraphQL API
from felicity.apps.patient.services import PatientService
from felicity.apps.analysis.services import AnalysisService
from felicity.apps.worksheet.services import WorksheetService

class CreatePatientIntent(IntentHandler):
    async def execute(self, params: dict) -> dict:
        # Use existing service - no code duplication
        patient_service = PatientService()
        patient = await patient_service.create(params)
        return {"patient_uid": patient.uid}
```

#### Reuse GraphQL Operations
```python
# Assistant can execute GraphQL operations directly
from felicity.api.gql.patient.mutations import PatientMutations

mutations = PatientMutations()
result = await mutations.create_patient(
    first_name="John",
    last_name="Doe",
    # ...
)
```

### 8.2 Frontend Integration

#### Chat Widget
```vue
<!-- Can be embedded anywhere in the app -->
<template>
  <div class="ai-assistant-widget">
    <!-- Floating chat button -->
    <button @click="toggleChat" class="chat-button">
      <MessageIcon />
      <span v-if="unreadCount" class="badge">{{ unreadCount }}</span>
    </button>

    <!-- Chat panel -->
    <AIChatInterface v-if="isOpen" @close="toggleChat" />
  </div>
</template>
```

#### Context Injection
```typescript
// Inject current page context into assistant
const assistantStore = useAssistantStore()

// User is viewing patient detail page
assistantStore.setContext({
  page: 'patient-detail',
  patientUid: route.params.patientUid,
  availableActions: ['create_sample', 'view_history', 'edit_patient']
})

// Assistant can now use this context:
// User: "Create a sample"
// Assistant knows which patient without asking
```

#### Quick Actions
```vue
<!-- Throughout the app, add quick action buttons -->
<button @click="openAssistant('Create patient')">
  Ask AI to Create Patient
</button>

<button @click="openAssistant('Enter results for this worksheet')">
  Ask AI to Enter Results
</button>
```

### 8.3 External Integrations

#### Instrument Interfaces
```python
# AI can trigger instrument data import
class ImportInstrumentResultsIntent(IntentHandler):
    async def execute(self, params: dict) -> dict:
        instrument_uid = params["instrument_uid"]

        # Trigger existing instrument interface
        interface_service = InstrumentInterfaceService()
        results = await interface_service.import_results(instrument_uid)

        return {
            "results_imported": len(results),
            "instrument": instrument_uid
        }
```

#### Notification Services
```python
# AI can send SMS/email via existing services
class SendReportIntent(IntentHandler):
    async def execute(self, params: dict) -> dict:
        patient_uid = params["patient_uid"]

        # Generate report using existing impress service
        report_service = ReportService()
        report_pdf = await report_service.generate(patient_uid)

        # Send via existing messaging service
        messaging_service = MessagingService()
        await messaging_service.send_email(
            to=patient.email,
            subject="Lab Results",
            attachments=[report_pdf]
        )

        return {"sent": True}
```

---

## 9. UI/UX Design

### 9.1 Chat Interface Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Felicity LIMS                                     [User Menu]│
├───────────┬─────────────────────────────────────────────────┤
│           │                                                   │
│ Conversa- │  ┌─────────────────────────────────────────┐   │
│ tions     │  │ Context: Patient PAT-2024-001           │   │
│           │  │ Samples: SAM-001, SAM-002               │   │
│ ● New lab │  └─────────────────────────────────────────┘   │
│   samples │                                                   │
│   today   │  ┌─────────────────────────────────────────┐   │
│           │  │ You: Register patient John Doe          │   │
│ ○ QC for  │  └─────────────────────────────────────────┘   │
│   Chemistry│                                                  │
│           │  ┌─────────────────────────────────────────┐   │
│ ○ Week... │  │ Assistant: I'll help you register a new │   │
│           │  │ patient. Please provide:                │   │
│ [+ New    │  │                                         │   │
│    Chat]  │  │ • Date of birth                        │   │
│           │  │ • Gender                               │   │
│           │  │                                         │   │
│           │  │ [Quick Fill] [Manual Entry]            │   │
│           │  └─────────────────────────────────────────┘   │
│           │                                                   │
│           │  ┌─────────────────────────────────────────┐   │
│           │  │ [Type your message...              🎤]  │   │
│           │  └─────────────────────────────────────────┘   │
│           │                                                   │
│           │  Suggested:  [Create sample]  [View patient]   │
└───────────┴─────────────────────────────────────────────────┘
```

### 9.2 Message Types

#### User Messages
- Simple text bubbles (right-aligned)
- File attachments (CSV, Excel)
- Voice messages

#### Assistant Messages
- Rich formatting (markdown)
- Tables for data display
- Action buttons
- Forms for data collection
- Charts and visualizations
- Confirmation prompts

#### System Messages
- Notifications (e.g., "Operation completed")
- Errors (with helpful suggestions)
- Status updates (e.g., "Processing...")

### 9.3 Interaction Patterns

#### Conversational Forms
```
User: "Register a patient"
Assistant: "I'll help you register a new patient. Let me collect some information."

[Form appears in chat]
┌──────────────────────────────────────┐
│ First Name: [_____________________]  │
│ Last Name:  [_____________________]  │
│ DOB:        [____/____/________]     │
│ Gender:     [M] [F] [Other]          │
│ Email:      [_____________________]  │
│ Phone:      [_____________________]  │
│                                      │
│        [Cancel]  [Submit]            │
└──────────────────────────────────────┘
```

#### Quick Actions
```
Assistant: "Patient PAT-2024-001 created successfully!"

Quick actions:
[+ Create Sample] [+ Create Test Request] [View Patient Details]
```

#### Confirmations
```
Assistant: "I'm about to delete sample SAM-001. This action cannot be undone."

[Cancel] [Confirm Delete]
```

#### Multi-Step Workflows
```
User: "Create a worksheet for chemistry samples"

Step 1/3: "Found 15 pending chemistry samples. Which samples should I include?"
[Select All] [Custom Selection]

Step 2/3: "Which instrument should I assign?"
[Cobas 6000] [Architect i2000] [Manual]

Step 3/3: "Assign analyst?"
[Current User: John Doe] [Other User...]

[Create Worksheet]
```

### 9.4 Mobile Responsiveness

#### Compact Chat Interface
- Bottom-sheet style on mobile
- Swipe gestures for conversation switching
- Voice input as primary input method
- Simplified action buttons

#### Offline Support
- Queue messages when offline
- Sync when connection restored
- Indicate offline status clearly

---

## 10. Testing Strategy

### 10.1 Unit Testing

#### Intent Classification Tests
```python
class TestPatientIntents:
    """Test patient-related intent classification"""

    def test_create_patient_intent(self):
        message = "Register a new patient John Doe born 1990-05-15"
        intent, params = classify_intent(message)

        assert intent == Intent.CREATE_PATIENT
        assert params["first_name"] == "John"
        assert params["last_name"] == "Doe"
        assert params["dob"] == "1990-05-15"

    def test_search_patient_intent(self):
        message = "Find patient PAT-2024-001"
        intent, params = classify_intent(message)

        assert intent == Intent.SEARCH_PATIENT
        assert params["patient_id"] == "PAT-2024-001"
```

#### Tokenization Tests
```python
class TestTokenization:
    """Test PII/PHI tokenization"""

    def test_patient_tokenization(self):
        patient = Patient(
            uid="patient-123",
            first_name="John",
            last_name="Doe",
            dob="1990-05-15"
        )

        token_manager = TokenManager()
        token = token_manager.tokenize_patient(patient)

        assert token.token.startswith("PATIENT_TOKEN_")
        assert "John" not in str(token.metadata)
        assert "Doe" not in str(token.metadata)
        assert token.metadata["age_group"] in ["30-40", "20-30"]

    def test_result_tokenization(self):
        result = AnalysisResult(
            uid="result-123",
            result="150 mg/dL",
            analysis_name="Glucose"
        )

        token = token_manager.tokenize_result(result)

        assert "150" not in str(token.metadata)
        assert token.metadata["status"] in ["elevated", "normal", "low"]
```

### 10.2 Integration Testing

#### End-to-End Workflow Tests
```python
class TestPatientWorkflow:
    """Test complete patient workflow"""

    async def test_create_patient_and_sample(self):
        # Create patient via assistant
        response = await assistant.process_message(
            message="Register patient John Doe, DOB 1990-05-15",
            user=test_user
        )

        assert "created successfully" in response.lower()

        # Extract patient ID from response
        patient_id = extract_patient_id(response)

        # Create sample for patient
        response = await assistant.process_message(
            message=f"Create blood sample for patient {patient_id}",
            user=test_user
        )

        assert "sample" in response.lower()
        assert "created" in response.lower()

        # Verify in database
        patient = await PatientService().get_by_patient_id(patient_id)
        assert patient is not None

        samples = await SampleService().get_by_patient(patient.uid)
        assert len(samples) == 1
```

### 10.3 Security Testing

#### PII Leakage Tests
```python
class TestPIIProtection:
    """Ensure no PII reaches LLM"""

    def test_no_pii_in_llm_prompts(self):
        """Monitor all LLM calls for PII"""

        with patch('llm_client.complete') as mock_complete:
            assistant.process_message(
                message="Show me patient John Doe's results",
                user=test_user
            )

            # Check all LLM calls
            for call in mock_complete.call_args_list:
                messages = call[0][0]
                for message in messages:
                    # Assert no PII in any message
                    assert "John" not in message["content"]
                    assert "Doe" not in message["content"]
                    # Should use token instead
                    assert "PATIENT_TOKEN" in message["content"]
```

#### Authorization Tests
```python
class TestAuthorization:
    """Test permission enforcement"""

    async def test_unauthorized_operation(self):
        """User without permission should be blocked"""

        # User without create_patient permission
        limited_user = create_test_user(permissions=[])

        with pytest.raises(PermissionDeniedError):
            await assistant.process_message(
                message="Create patient John Doe",
                user=limited_user
            )

    async def test_tenant_isolation(self):
        """Users can only see their laboratory's data"""

        # Create patient in Lab A
        lab_a_user = create_test_user(laboratory="lab-a")
        response = await assistant.process_message(
            message="Create patient John Doe, DOB 1990-05-15",
            user=lab_a_user
        )
        patient_id = extract_patient_id(response)

        # User from Lab B shouldn't see it
        lab_b_user = create_test_user(laboratory="lab-b")
        response = await assistant.process_message(
            message=f"Find patient {patient_id}",
            user=lab_b_user
        )

        assert "not found" in response.lower()
```

### 10.4 Performance Testing

#### Load Testing
```python
class TestPerformance:
    """Test system under load"""

    async def test_concurrent_conversations(self):
        """Handle multiple users simultaneously"""

        users = [create_test_user() for _ in range(100)]

        tasks = [
            assistant.process_message(
                message="Create patient test user",
                user=user
            )
            for user in users
        ]

        start = time.time()
        responses = await asyncio.gather(*tasks)
        duration = time.time() - start

        # All should complete successfully
        assert all("created" in r.lower() for r in responses)

        # Average response time < 2 seconds
        assert duration / len(tasks) < 2.0
```

### 10.5 User Acceptance Testing

#### UAT Scenarios
| Scenario | Steps | Expected Outcome |
|----------|-------|------------------|
| **New User Onboarding** | 1. New lab tech logs in<br>2. Opens assistant<br>3. Asks "How do I register a patient?" | Assistant guides through process |
| **Complex Workflow** | 1. Create patient<br>2. Create request<br>3. Add samples<br>4. Create worksheet<br>5. Enter results<br>6. Verify | Complete workflow via chat only |
| **Error Recovery** | 1. Create sample with invalid data<br>2. View error message<br>3. Correct and retry | Clear error, successful retry |
| **Context Switching** | 1. Working on Patient A<br>2. Switch to Patient B<br>3. Return to Patient A | Context preserved correctly |

---

## 11. Deployment & Operations

### 11.1 Infrastructure Requirements

#### Backend Services
```yaml
# docker-compose additions
services:
  felicity-assistant:
    build:
      context: .
      dockerfile: Dockerfile.assistant
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MONGODB_URL=${MONGODB_URL}
      - REDIS_URL=${REDIS_URL}
      - LLM_PROVIDER=${LLM_PROVIDER}  # claude, openai
      - LLM_API_KEY=${LLM_API_KEY}
      - LLM_MODEL=${LLM_MODEL}
    depends_on:
      - postgres
      - mongodb
      - redis
    volumes:
      - ./felicity:/app/felicity
```

#### Resource Allocation
- **CPU**: 2-4 cores per instance
- **Memory**: 4-8 GB RAM
- **Storage**: 50 GB for conversation logs
- **Network**: Low latency to LLM provider

### 11.2 Configuration Management

#### Environment Variables
```bash
# LLM Configuration
LLM_PROVIDER=claude  # or openai
LLM_API_KEY=sk-ant-xxxxx
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_MAX_TOKENS=4096
LLM_TEMPERATURE=0.3

# Assistant Configuration
ASSISTANT_ENABLED=true
ASSISTANT_MAX_CONVERSATIONS_PER_USER=10
ASSISTANT_CONVERSATION_TTL_HOURS=24
ASSISTANT_TOKEN_TTL_HOURS=1

# Rate Limiting
ASSISTANT_MAX_MESSAGES_PER_HOUR=100
ASSISTANT_MAX_TOKENS_PER_DAY=50000
ASSISTANT_MAX_COST_PER_DAY=100.00

# Features
ASSISTANT_VOICE_INPUT_ENABLED=true
ASSISTANT_VOICE_OUTPUT_ENABLED=false
ASSISTANT_FILE_UPLOAD_ENABLED=true
ASSISTANT_MAX_FILE_SIZE_MB=10
```

### 11.3 Monitoring & Observability

#### Key Metrics to Track
```python
# Performance metrics
- assistant_message_processing_time_seconds (histogram)
- assistant_llm_api_latency_seconds (histogram)
- assistant_database_query_time_seconds (histogram)

# Usage metrics
- assistant_messages_total (counter, by intent)
- assistant_conversations_active (gauge)
- assistant_users_active (gauge)

# Error metrics
- assistant_errors_total (counter, by type)
- assistant_llm_errors_total (counter)
- assistant_permission_denied_total (counter)

# Cost metrics
- assistant_tokens_used_total (counter)
- assistant_llm_cost_usd_total (counter)

# Business metrics
- assistant_workflows_completed_total (counter, by workflow)
- assistant_user_satisfaction_score (gauge)
- assistant_time_saved_seconds (counter)
```

#### Logging Strategy
```python
# Structured logging
logger.info(
    "message_processed",
    extra={
        "conversation_uid": conversation.uid,
        "user_uid": user.uid,
        "laboratory_uid": lab.uid,
        "intent": intent.value,
        "processing_time_ms": duration * 1000,
        "llm_tokens": tokens_used,
        "success": True
    }
)
```

#### Alerting Rules
```yaml
alerts:
  - name: high_error_rate
    condition: assistant_errors_total > 10% of assistant_messages_total
    severity: warning
    action: notify_team

  - name: high_llm_cost
    condition: assistant_llm_cost_usd_total > MAX_COST_PER_DAY
    severity: critical
    action: disable_assistant, notify_admin

  - name: slow_response_time
    condition: assistant_message_processing_time_seconds_p95 > 5s
    severity: warning
    action: notify_team

  - name: llm_api_down
    condition: assistant_llm_errors_total > 10 in 5 minutes
    severity: critical
    action: enable_fallback_mode, notify_team
```

### 11.4 Deployment Process

#### CI/CD Pipeline
```yaml
# .github/workflows/deploy-assistant.yml
name: Deploy AI Assistant

on:
  push:
    branches: [main]
    paths:
      - 'felicity/apps/assistant/**'
      - 'felicity/api/gql/assistant/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          pytest felicity/tests/assistant/ -v
          pytest felicity/tests/integration/assistant/ -v

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          # Deploy to staging environment
          # Run smoke tests
          # If passed, deploy to production
```

#### Rollout Strategy
1. **Canary Deployment**: 5% of users initially
2. **Monitor**: Track error rates, performance, user feedback
3. **Gradual Rollout**: 25% → 50% → 100% over 2 weeks
4. **Feature Flags**: Easy rollback if issues detected

### 11.5 Disaster Recovery

#### Backup Strategy
```python
# Backup conversation data daily
async def backup_conversations():
    """Backup conversations to S3/MinIO"""
    conversations = await Conversation.all()

    backup_data = {
        "timestamp": datetime.now().isoformat(),
        "conversations": [c.to_dict() for c in conversations]
    }

    await storage_service.upload(
        bucket="felicity-backups",
        key=f"assistant/conversations_{datetime.now():%Y%m%d}.json",
        data=backup_data
    )
```

#### Failover Procedures
1. **LLM Provider Failure**
   - Automatic fallback to secondary provider
   - Or disable AI features, allow manual operations

2. **Database Failure**
   - Read from replica
   - Queue write operations

3. **Complete System Failure**
   - Users can still access regular LIMS UI
   - Assistant operations queued for later processing

---

## 12. Cost Estimation

### 12.1 LLM Costs

#### Claude 3.5 Sonnet Pricing (as of 2024)
- **Input**: $3 per million tokens
- **Output**: $15 per million tokens

#### Example Usage Calculation
```
Assumptions:
- 50 active users per day
- 20 messages per user per day
- Average input: 500 tokens (context + message)
- Average output: 200 tokens

Daily calculation:
- Messages: 50 users × 20 messages = 1,000 messages/day
- Input tokens: 1,000 × 500 = 500,000 tokens
- Output tokens: 1,000 × 200 = 200,000 tokens

Daily cost:
- Input: 0.5M tokens × $3/M = $1.50
- Output: 0.2M tokens × $15/M = $3.00
- Total: $4.50/day

Monthly cost: $4.50 × 30 = $135/month
Yearly cost: $135 × 12 = $1,620/year
```

### 12.2 Infrastructure Costs

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| **Backend Service** | $50-100 | 2-4 core VPS |
| **Database Storage** | $10-20 | Conversation history |
| **Redis Cache** | $10-20 | Session management |
| **Bandwidth** | $20-50 | API calls |
| **Monitoring** | $0-30 | Application monitoring |
| **Total Infrastructure** | $90-220/month | ~$1,000-2,600/year |

### 12.3 Total Cost of Ownership (TCO)

#### Year 1 Costs
| Category | Cost | Notes |
|----------|------|-------|
| **Development** | $80,000 | 6 months, 1 senior developer |
| **LLM Costs** | $1,620 | Based on usage estimate |
| **Infrastructure** | $1,800 | Hosting and services |
| **Testing & QA** | $10,000 | Integration testing |
| **Training** | $5,000 | User training materials |
| **Total Year 1** | **$98,420** | |

#### Ongoing Costs (Per Year)
| Category | Cost | Notes |
|----------|------|-------|
| **LLM Costs** | $1,620 | Scales with usage |
| **Infrastructure** | $1,800 | Hosting |
| **Maintenance** | $20,000 | 25% of dev cost |
| **Support** | $5,000 | User support |
| **Total Ongoing** | **$28,420/year** | |

### 12.4 ROI Analysis

#### Time Savings Calculation
```
Assumptions:
- 50 lab staff using system
- 30 minutes saved per day per user (reduced training, faster workflows)
- Average hourly wage: $25/hour

Daily savings:
- 50 users × 0.5 hours × $25 = $625/day

Yearly savings:
- $625 × 250 working days = $156,250/year

ROI:
- Initial investment: $98,420
- Yearly savings: $156,250
- Payback period: 7.6 months
- 3-year ROI: (156,250 × 3 - 98,420 - 28,420 × 2) / 98,420 = 315%
```

#### Quality Improvements
- **Reduced Errors**: 20-30% reduction in data entry errors
- **Faster TAT**: 10-15% improvement in sample processing time
- **Better Compliance**: Comprehensive audit trails, reduced violations
- **User Satisfaction**: Improved user experience, reduced training time

---

## 13. Success Metrics & KPIs

### 13.1 Adoption Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Active Users** | 80% of lab staff | Weekly active users |
| **Messages per User** | 15+ per day | Average daily messages |
| **Workflows via AI** | 50%+ of operations | Percentage of operations via assistant |
| **User Retention** | 90%+ return rate | Users who return after first use |

### 13.2 Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Response Time** | < 500ms | P95 response time |
| **Streaming Latency** | < 100ms | Time to first token |
| **Uptime** | 99.9% | System availability |
| **Error Rate** | < 1% | Failed operations |

### 13.3 Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time Saved** | 30 min/user/day | Tracked via timestamps |
| **Error Reduction** | 25% fewer errors | Compare pre/post |
| **Training Time** | 50% reduction | New user onboarding time |
| **User Satisfaction** | 4.5/5 stars | In-app feedback surveys |

### 13.4 Cost Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LLM Cost per User** | < $3/month | Total cost / active users |
| **Cost per Message** | < $0.005 | Total cost / messages |
| **ROI** | > 200% in 1 year | Savings vs. costs |

---

## 14. Risks & Mitigation

### 14.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **LLM Provider Outage** | High | Medium | Multi-provider support, fallback mode |
| **PII Leakage** | Critical | Low | Comprehensive tokenization, regular audits |
| **Performance Degradation** | Medium | Medium | Caching, optimization, load testing |
| **Integration Bugs** | Medium | High | Extensive testing, phased rollout |

### 14.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Low Adoption** | High | Medium | User training, clear value demonstration |
| **High Costs** | Medium | Low | Rate limiting, cost monitoring, alerts |
| **Regulatory Issues** | High | Low | Legal review, HIPAA compliance validation |
| **User Resistance** | Medium | Medium | Change management, optional feature |

### 14.3 Security Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Prompt Injection** | Medium | Medium | Input validation, sandboxing |
| **Unauthorized Access** | High | Low | Strong authentication, RBAC |
| **Data Breach** | Critical | Very Low | Encryption, tokenization, audit logs |
| **LLM Hallucination** | Medium | Medium | Confirmation prompts, validation |

---

## 15. Future Enhancements

### Phase 7+: Advanced Capabilities

#### 15.1 Multimodal Capabilities
- **Image Analysis**: Upload images (culture plates, gels) for AI analysis
- **Voice Conversations**: Full voice-based interaction
- **Document Processing**: Extract data from PDFs, scanned forms
- **Video Guidance**: AI-generated video tutorials

#### 15.2 Advanced AI Features
- **Predictive Analytics**:
  - Predict test failures before they occur
  - Forecast reagent needs
  - Identify at-risk samples

- **Anomaly Detection**:
  - Automatic identification of unusual patterns
  - Outlier detection in QC data
  - Fraud detection in billing

- **Natural Language Reporting**:
  - Generate clinical interpretations
  - Auto-write lab reports
  - Summarize patient history

#### 15.3 Collaboration Features
- **Team Chats**: Multi-user conversations
- **Expert Consultation**: AI routes complex cases to specialists
- **Knowledge Base**: AI learns from organization's SOPs
- **Case Discussions**: AI-facilitated case reviews

#### 15.4 Integration Expansions
- **EHR Integration**: Two-way sync with hospital systems
- **LIMS-to-LIMS**: Transfer data between facilities
- **Billing Systems**: Insurance claim automation
- **Supply Chain**: Automated ordering from suppliers

---

## 16. Conclusion

### 16.1 Summary

The Felicity LIMS AI Assistant represents a transformative addition to the laboratory information management system, enabling:

1. **Simplified Workflows**: Complex multi-step processes reduced to simple conversations
2. **Enhanced Accessibility**: Lower barrier to entry for new users
3. **Improved Efficiency**: 30+ minutes saved per user per day
4. **Maintained Security**: Zero PII/PHI exposure to external LLMs
5. **Full Compliance**: HIPAA-compliant operations with comprehensive audit trails

### 16.2 Strategic Value

The AI Assistant provides strategic advantages:

- **Competitive Differentiation**: Cutting-edge AI capabilities
- **Scalability**: Easier onboarding supports rapid growth
- **Quality Assurance**: Reduced errors, improved consistency
- **Data Insights**: AI-powered analytics and predictions
- **User Satisfaction**: Modern, intuitive interface

### 16.3 Recommended Next Steps

1. **Stakeholder Approval**: Present plan to leadership and get buy-in
2. **Budget Allocation**: Secure funding for development ($100K Year 1)
3. **Team Assembly**: Hire/assign developers, designers, QA engineers
4. **Pilot Selection**: Identify 1-2 laboratories for initial rollout
5. **Phase 1 Kickoff**: Begin foundation work (Weeks 1-4)

### 16.4 Long-Term Vision

Over the next 2-3 years, the AI Assistant will evolve to become:

- The **primary interface** for most LIMS operations
- An **intelligent advisor** providing proactive insights
- A **training platform** that learns and improves continuously
- A **collaboration hub** connecting lab staff, clinicians, and systems
- A **competitive advantage** that sets Felicity LIMS apart

---

## 17. Appendices

### Appendix A: Complete Intent Taxonomy (150+ Intents)

```python
class IntentTaxonomy:
    """Complete list of supported intents"""

    PATIENT = {
        "create": "patient.create",
        "search": "patient.search",
        "update": "patient.update",
        "view": "patient.view",
        "add_identification": "patient.add_identification",
        "view_history": "patient.view_history",
        "merge": "patient.merge",
        "export": "patient.export"
    }

    SAMPLE = {
        "create": "sample.create",
        "update_status": "sample.update_status",
        "reject": "sample.reject",
        "derive": "sample.derive",
        "pool": "sample.pool",
        "search": "sample.search",
        "view": "sample.view",
        "print_labels": "sample.print_labels",
        "store": "sample.store",
        "retrieve": "sample.retrieve",
        "dispose": "sample.dispose"
    }

    # ... (continue for all 150+ intents across all modules)
```

### Appendix B: Example Conversations

#### Example 1: Complete Patient-Sample-Result Workflow
```
User: Register a new patient John Doe, born 1990-05-15, male