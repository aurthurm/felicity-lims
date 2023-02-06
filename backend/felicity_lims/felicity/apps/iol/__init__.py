"""Inter Operability Layer"""

# Research documents
# https://guides.ohie.org/arch-spec/openhie-component-specifications-1/openhie-interoperability-layer-iol?_ga=2.219202845.526419640.1669945669-243096029.1669710989&_gl=1*w1tjwx*_ga*MjQzMDk2MDI5LjE2Njk3MTA5ODk.*_ga_0X0YT73PM5*MTY2OTk0NjU2MC4xLjAuMTY2OTk0NjU3MC4wLjAuMA..
# https://guides.ohie.org/arch-spec/introduction/laboratory-work-flows/report-lab-results
# FHIR
# https://www.commonhealth.org/lab-implementation-guide
# http://hl7.org/fhir/us/core/StructureDefinition-us-core-diagnosticreport-lab.html
# http://www.fhir.org/guides/argonaut/r2/StructureDefinition-argo-diagnosticreport.html#profile
# https://simplifier.net/guide/ontariolaboratoriesinformationsystemproviderquery/diagnosticreportsearch?version=current
# https://fhir.cerner.com/millennium/dstu2/care-provision/procedure-request/
# http://hl7.org/fhir/diagnostics-module.html yes yes yes
# http://hl7.org/fhir/graphql.html
# https://www.hl7.org/fhir/patient.html


## TO IMPLEMENT
# 0. Task? to create and Track ServiceRequest : Optional: Not Mandatory
# 1. ServiceRequest to order a lab test   http://hl7.org/fhir/servicerequest.html
# 2. DiagnosticReport to view a results for a specific sample  http://hl7.org/fhir/diagnosticreport.html
# 3. Bundle to view all DiagnosticReport(s) of a patient

"""Terminology Service"""

# maybe make these standalone
# reasoning is there all communications will probably come via iol and terminology service


# FelicityMeta is a service to contain all felicity common metadata and Terminologies metadata mappings e.g to LOINC
# FelicityLIMS sycs data from FelicityMeta and does not allow instance level metadata setup if meta is activated


# FelicityMeta will be implemented in NESTJS, NEXTJS, mongodb
# CodeSystem:
#     name
#
# CodeSystemInterOp:
#     codeSystem:
#     codeSystemId:
#     internalObjectId:
#     internalObject:
