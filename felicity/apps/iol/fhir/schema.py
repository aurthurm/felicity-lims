from typing import ForwardRef, List, Optional, Any
from pydantic import field_validator, BaseModel


class BaseResource:
    """All resources base: https://www.hl7.org/fhir/resource.html"""

    id: str
    meta: None
    extension: None


class Coding(BaseModel):
    #  Identity of the terminology system
    system: str | None = None
    # Version of the system - if relevant
    version: str | None = None
    # Symbol in syntax defined by the system
    code: str | None = None
    # Representation defined by the system
    display: str | None = None
    # If this coding was chosen directly by the user
    userSelected: bool | None = False


class CodeableConcept(BaseModel):
    # Code defined by a terminology system
    coding: List[Coding] | None = None
    # Plain text representation of the concept
    text: str | None = None


class Period(BaseModel):
    # C? Starting time with inclusive boundary
    start: str | None = None
    # C? End time with inclusive boundary, if not ongoing
    end: str | None = None


Reference = ForwardRef("Identifier")


class Reference(BaseModel):
    # C? Literal reference, Relative, internal or absolute URL
    reference: str | None = None
    # Type the reference refers to (e.g. "Patient")
    type: str | None = None
    # Logical reference, when literal reference is not known
    identifier: Optional["Identifier"] = None
    # Text alternative for the resource
    display: str | None = None


class Identifier(BaseModel):
    # usual | official | temp | secondary | old(If known)
    use: str | None = None
    # Description of identifier
    type: CodeableConcept | None = None
    # The namespace for the identifier value
    system: str | None = None
    # The value that is unique
    value: str | None = None
    # time period when id is / was valid for use
    period: Period | None = None
    # Organization that issued id(maybe just text)
    assigner: Reference | None = None


class HumanName(BaseModel):
    # usual | official | temp | nickname | anonymous | old | maiden
    use: str | None = None
    # Text representation of the full name
    text: str | None = None
    # Family name (often called 'Surname')
    family: str | None = None
    # Given names (not always 'first'). Includes middle names
    given: list[str] | None = None
    # Parts that come before the name
    prefix: str | None = None
    # Parts that come after the name
    suffix: str | None = None
    # Time period when name was/is in use
    period: Period | None = None


class ContactPoint(BaseModel):
    # C? phone | fax | email | pager | url | sms | other
    system: str | None = None
    # The actual contact point details
    value: str | None = None
    # home | work | temp | old | mobile - purpose of this contact point
    use: str | None = None
    # Specify preferred order of use (1 = highest)
    rank: int | None = None
    # Time period when the contact point was/is in use
    period: Period | None = None


class Address(BaseModel):
    # home | work | temp | old | billing - purpose of this address
    use: str | None = None
    # postal | physical | both
    type: str | None = None
    # Text representation of the address
    text: str | None = None
    # Street name, number, direction & P.O. Box etc.
    line: str | None = None
    # Name of city, town etc.
    city: str | None = None
    # District name (aka county)
    district: str | None = None
    # Subunit of country (abbreviations ok)
    state: str | None = None
    # Postal code for area
    postalCode: str | None = None
    # Country (e.g. can be ISO 3166 2 or 3-letter code)
    country: str | None = None
    # Time period when address was/is in use
    period: Period | None = None


class Annotation(BaseModel):
    # Reference(Organization|Patient|Practitioner|RelatedPerson)
    authorReference: Reference | None = None
    authorString: str | None = None
    # When the annotation was made
    time: str | None = None
    # R!  The annotation  - text content (as markdown)
    text: str | None = None


class Quantity(BaseModel):
    # Numerical value (with implicit precision)
    value: float | None = None
    # < | <= | >= | > - how to understand the value
    comparator: str | None = None
    # Unit representation
    unit: str | None = None
    # C? System that defines coded unit form
    system: str | None = None
    code: str | None = None


class Range(BaseModel):
    # Low limit
    low: Quantity | None = None
    # High limit
    high: Quantity | None = None


class ReferenceRange(BaseModel):
    # C? Low Range, if relevant Quantity(SimpleQuantity)
    low: Quantity | None = None
    # C? High Range, if relevant Quantity(SimpleQuantity)
    high: Quantity | None = None
    # Reference range qualifier
    type: CodeableConcept | None = None
    # Reference range population
    appliesTo: List[CodeableConcept] | None = None
    # Applicable age range, if relevant
    age: Range | None = None
    # Text based reference range in an observation
    text: str | None = None


class Ratio(BaseModel):
    # Numerator value
    numerator: Quantity | None = None
    # Denominator value
    denominator: Quantity | None = None


class SampledData(BaseModel):
    # R!  Zero value and units
    origin: Quantity | None = None
    # R!  Number of milliseconds between samples
    period: int | None = None
    # Multiply data by this before adding to origin
    factor: int | None = None
    # Lower limit of detection
    lowerLimit: int | None = None
    # Upper limit of detection
    upperLimit: int | None = None
    # R!  Number of sample points at each time point
    dimensions: int | None = None
    # Decimal values with spaces, or "E" | "U" | "L"
    data: str | None = None


class Extension(BaseModel):
    url: str | None = None
    valueString: str | dict | None = None
    data: dict | None = None


class PatientResource(BaseModel):
    resourceType: str = "Patient"
    # An identifier for this patient
    identifier: List[Identifier] | None = None
    # Whether this patient's record is in active use
    active: bool | None = None
    # A name associated with the patient
    name: List[HumanName] | None = None
    #  A contact detail for the individual
    telecom: List[ContactPoint] | None = None
    # male | female | other | unknown
    gender: str | None = None
    # The date of birth for the individual
    birthDate: str | None = None
    # An address for the individual
    address: List[Address] | None = None
    #  Organization that is the custodian of the patient record Reference(Organization)
    managingOrganization: Reference | None = None


class SpecimenCollection(BaseModel):
    #  Who collected the specimen Reference(Patient|Practitioner|PractitionerRole|RelatedPerson)
    collector: Reference | None = None
    collectedDateTime: str | None = None
    #  The quantity of specimen collected Quantity(SimpleQuantity)
    quantity: Quantity | None = None
    # Technique used to perform collection
    method: CodeableConcept | None = None


class SpecimenResource(BaseModel):
    resourceType: str = "Specimen"
    # External Identifier
    identifier: List[Identifier] | None = None
    # Identifier assigned by the lab
    accessionIdentifier: Identifier | None = None
    # available | unavailable | unsatisfactory | entered-in-error
    status: str | None = None
    # Kind of material that forms the specimen icon
    type: CodeableConcept
    # Reference(BiologicallyDerivedProduct|Device|Group|Location|Patient|Substance)
    # Where the specimen came from. This may be from patient(s), from a location (e.g., the
    # source of an environmental sample), or a sampling of a substance, a biologically-derived product, or a device
    subject: Reference | None = None
    # The time when specimen is received by the testing laboratory
    receivedTime: str | None = None
    # Specimen from which this specimen originated Reference(Specimen)
    parent: list[Reference] | None = None
    # Why the specimen was collected Reference(ServiceRequest)
    request: list[Reference] | None = None
    #  grouped | pooled
    combined: str | None = None
    # The role the specimen serves
    role: list[CodeableConcept] | None = None
    # Collection details
    collection: SpecimenCollection
    # State of the specimen icon
    condition: list[CodeableConcept] | None = None
    # comments
    note: list[Annotation] | None = None


class ServiceRequestResource(BaseModel):
    resourceType: str = "ServiceRequest"
    # Identifiers assigned to this order
    identifier: List[Identifier] | None = None
    # What request replaces Reference(ServiceRequest)
    replaces: List[Reference] | None = None
    # Composite Request ID
    requisition: Identifier | None = None
    # draft | active | on-hold | revoked | completed | entered-in-error | unknown
    status: str | None = None
    # proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option
    intent: str | None = None
    # routine | urgent | asap | stat
    priority: str | None = None
    # True if service/procedure should not be performed
    doNotPerform: bool = False
    # What is being requested/ordered
    code: CodeableConcept | None = None
    # R!  Individual or Entity the service is ordered for Reference(Device|Group|Location|Patient)
    subject: Reference | PatientResource | None = None
    # Date request signed
    authoredOn: str | None = None
    # Who/what is requesting service Reference(Device|Organization|Patient|Practitioner|
    # PractitionerRole|RelatedPerson)
    requester: Reference | None = None
    # Requested performer Reference(CareTeam|Device|HealthcareService|Organization|
    # Patient|Practitioner|PractitionerRole|RelatedPerson)
    performer: List[Reference] | None = None
    # Requested location
    locationCode: List[CodeableConcept] | None = None
    # Explanation/Justification for procedure or service
    reasonCode: List[CodeableConcept] | None = None
    # Procedure Samples Reference(Specimen)
    specimen: List[Reference | SpecimenResource] | None = None
    # Comments
    note: List[Annotation] | None = None
    # Patient or consumer-oriented instructions
    patientInstruction: str | None = None


class ObservationComponent(BaseModel):
    # R!  Type of component observation (code / type)
    code: CodeableConcept | None = None
    # value[x]: Actual component result. One of these 11:
    valueQuantity: Quantity | None = None
    valueCodeableConcept: CodeableConcept
    valueString: str | None = None
    valueBoolean: bool | None = None
    valueInteger: int | None = None
    valueRange: Range | None = None
    valueRatio: Ratio | None = None
    valueSampledData: SampledData | None = None
    valueTime: str | None = None
    valueDateTime: str | None = None
    valuePeriod: Period | None = None
    # C? Why the component result is missing
    dataAbsentReason: CodeableConcept | None = None
    # High, low, normal, etc.
    interpretation: List[CodeableConcept] | None = None
    # Provides guide for interpretation of component result
    referenceRange: List[ReferenceRange] | None = None


class ObservationResource(BaseModel):
    resourceType: str = "Observation"
    # Business Identifier for observation
    identifier: List[Identifier] | None = None
    # Fulfills plan, proposal or order
    # Reference(CarePlan|DeviceRequest|ImmunizationRecommendation|MedicationRequest|NutritionOrder|ServiceRequest)
    basedOn: List[Reference] | None = None
    # R!  registered | preliminary | final | amended +
    status: str | None = None
    # R!  Type of observation (code / type)
    code: CodeableConcept | None = None
    # // Who and/or what the observation is about
    # Reference(Device|Group|Location|Medication|Organization|Patient|Practitioner|Procedure|Substance)
    subject: Reference | None = None
    # What the observation is about, when it is not about the subject of record
    # Reference(Any)
    focus: List[Reference] | None = None
    # Date/Time this version was made available
    issued: str | None = None
    # Who is responsible for the observation
    # Reference(CareTeam|Organization|Patient|Practitioner|PractitionerRole|RelatedPerson)
    performer: List[Reference] | None = None
    # value[x]: Actual result. One of these 11:
    valueQuantity: Quantity | None = None
    valueCodeableConcept: CodeableConcept | None = None
    valueString: str | None = None
    valueBoolean: bool | None = None
    valueInteger: int | None = None
    valueRange: Range | None = None
    valueRatio: Ratio | None = None
    valueSampledData: SampledData | None = None
    valueTime: str | None = None
    valueDateTime: str | None = None
    valuePeriod: Period | None = None
    # C? Why the result is missing
    dataAbsentReason: CodeableConcept | None = None
    # High, low, normal, etc.
    interpretation: List[CodeableConcept] | None = None
    # Comments about the observation
    note: List[Annotation] | None = None
    # How it was done
    method: CodeableConcept | None = None
    # Specimen used for this observation Reference(Specimen)
    specimen: Reference | None = None
    # (Measurement) Device  Reference(Device|DeviceMetric)
    device: Reference | None = None
    # Provides guide for interpretation
    referenceRange: List[ReferenceRange] | None = None
    # // Related measurements the observation is made from
    # Reference(DocumentReference|ImagingStudy|Media|MolecularSequence|Observation|QuestionnaireResponse)
    derivedFrom: List[Reference] | None = None
    # // Component results
    component: List[ObservationComponent] | None = None


class DiagnosticReportResource(BaseModel):
    resourceType: str = "DiagnosticReport"
    # Business identifier for report
    identifier: List[Identifier] | None = None
    # What was requested
    # Reference(CarePlan|ImmunizationRecommendation|MedicationRequest|NutritionOrder|ServiceRequest)
    basedOn: List[Reference] | None = None
    # R!  registered | partial | preliminary | final +
    status: str | None = None
    # Service category
    category: List[CodeableConcept] | None = None
    # R!  Name/Code for this diagnostic report
    code: CodeableConcept | None = None
    # The subject of the report - usually, but not always, the patient
    # Reference(Device|Group|Location|Medication|Organization|Patient|Practitioner|Procedure|Substance)
    subject: Reference | None = None
    #  DateTime this version was made
    issued: str | None = None
    # Responsible Diagnostic Service
    # Reference(CareTeam|Organization|Practitioner|PractitionerRole)
    performer: List[Reference] | None = None
    # Primary result interpreter
    # Reference(CareTeam|Organization|Practitioner|PractitionerRole)
    resultsInterpreter: List[Reference] | None = None
    # Specimens this report is based on Reference(Specimen)
    specimen: List[Reference] | None = None
    # Observations Reference(Observation)
    result: List[Reference] | None = None
    # Clinical conclusion (interpretation) of test results
    conclusion: str | None = None
    # Codes for the clinical conclusion of test results
    conclusionCode: List[CodeableConcept] | None = None


class Resource(BaseModel):
    resourceType: str
    # short description
    property1: str | None = None


class BundleEntryRequest(BaseModel):
    # I R!  GET | HEAD | POST | PUT | DELETE | PATCH
    method: str
    # R!  URL for HTTP equivalent of this entry
    url: str | None = None


class BundleEntryResponse(BaseModel):
    # R!  Status response code (text optional)
    status: str
    # The location (if the operation returns a location)
    location: str | None = None
    # Server's date time modified
    lastModified: str | None = None
    # // OperationOutcome with hints and warnings (for batch/transaction)
    outcome: Resource


class BundleEntry(BaseModel):
    # I A resource in the bundle
    resource: Any = None
    # I Additional execution information (transaction/batch/history)
    request: BundleEntryRequest | None = None
    # I Results of execution (transaction/batch/history)
    response: BundleEntryResponse | None = None

    @field_validator("resource")
    @classmethod
    def validate_resource(cls, val):
        allowed_types = (
            ServiceRequestResource,
            DiagnosticReportResource,
            PatientResource,
            ObservationResource,
            Resource,
        )
        if any(isinstance(val, t) for t in allowed_types):
            return val

        if isinstance(val, dict):
            mappings = {
                "ServiceRequest": ServiceRequestResource,
                "DiagnosticReport": DiagnosticReportResource,
                "Patient": PatientResource,
                "Observation": ObservationResource,
                "Resource": Resource,
            }
            res = val.get("resourceType", None)
            if res in mappings:
                return mappings[res](**val)

        raise TypeError(f"Wrong type for 'resource', must be one of {allowed_types}")


class BundleResource(BaseModel):
    resourceType: str = "Bundle"
    # I Persistent identifier for the bundle
    identifier: Identifier | None = None
    # I R!  document | message | transaction | transaction-response | batch | batch-response | history | searchset | collection | subscription-notification
    type: str
    # I When the bundle was assembled
    timestamp: str
    # I If search, the total number of matches
    total: int
    # // Entry in the bundle - will have a resource or information
    entry: list[BundleEntry]
    extension: list[Extension] | None = None


Reference.update_forward_refs()
