import strawberry  # noqa

from beak.api.gql.analysis.mutations import AnalysisMutations
from beak.api.gql.analysis.query import AnalysisQuery
from beak.api.gql.analysis.types import analysis_types
from beak.api.gql.analytics import analytics_types
from beak.api.gql.analytics.query import AnalyticsQuery
from beak.api.gql.audit import audit_types
from beak.api.gql.audit.query import AuditLogQuery
from beak.api.gql.billing import billing_types
from beak.api.gql.billing.mutations import BillingMutations
from beak.api.gql.billing.query import BillingQuery
from beak.api.gql.client import client_types
from beak.api.gql.client.mutations import ClientMutations
from beak.api.gql.client.query import ClientQuery
from beak.api.gql.commune import commune_types
from beak.api.gql.commune.mutations import CommuneMutations
from beak.api.gql.commune.query import CommuneQuery
from beak.api.gql.document import document_types
from beak.api.gql.document.mutations import DocumentMutations
from beak.api.gql.document.query import DocumentQuery
from beak.api.gql.grind import grind_types
from beak.api.gql.grind.mutation import GrindMutations
from beak.api.gql.grind.query import GrindQuery
from beak.api.gql.impress import impress_types
from beak.api.gql.impress.query import ReportImpressQuery
from beak.api.gql.instrument import instrument_types
from beak.api.gql.instrument.mutations import InstrumentMutations
from beak.api.gql.instrument.query import InstrumentQuery
from beak.api.gql.inventory import inventory_types
from beak.api.gql.inventory.mutations import InventoryMutations
from beak.api.gql.inventory.query import InventoryQuery
from beak.api.gql.iol import iol_types, IOLMutations
from beak.api.gql.messaging import messaging_types
from beak.api.gql.messaging.mutations import MessageMutations
from beak.api.gql.messaging.query import MessageQuery
from beak.api.gql.multiplex.microbiology import microbiology_types
from beak.api.gql.multiplex.microbiology.mutations import MicrobiologyMutations
from beak.api.gql.multiplex.microbiology.query import MicrobiologyQuery
from beak.api.gql.noticeboard import noticeboard_types
from beak.api.gql.noticeboard.mutations import NoticeMutations
from beak.api.gql.noticeboard.query import NoticeQuery
from beak.api.gql.notification import notification_types
from beak.api.gql.notification.query import StreamNotificationQuery
from beak.api.gql.notification.subscription import StreamSubscription
from beak.api.gql.patient import patient_types
from beak.api.gql.patient.mutations import PatientMutations
from beak.api.gql.patient.query import PatientQuery
from beak.api.gql.reflex import reflex_types
from beak.api.gql.reflex.mutations import ReflexRuleMutations
from beak.api.gql.reflex.query import ReflexRuleQuery
from beak.api.gql.setup.mutations import SetupMutations
from beak.api.gql.setup.query import SetupQuery
from beak.api.gql.setup.types import setup_types
from beak.api.gql.shipment import shipment_types
from beak.api.gql.shipment.mutations import ShipmentMutations
from beak.api.gql.shipment.query import ShipmentQuery
from beak.api.gql.storage import storage_types
from beak.api.gql.storage.mutations import StorageMutations
from beak.api.gql.storage.query import StorageQuery
from beak.api.gql.types import generic_types
from beak.api.gql.user import user_types
from beak.api.gql.user.mutations import UserMutations
from beak.api.gql.user.query import UserQuery
from beak.api.gql.worksheet import worksheet_types
from beak.api.gql.worksheet.mutations import WorkSheetMutations
from beak.api.gql.worksheet.query import WorkSheetQuery

types = (
    generic_types
    + analysis_types
    + analytics_types
    + audit_types
    + client_types
    + impress_types
    + instrument_types
    + inventory_types
    + messaging_types
    + noticeboard_types
    + notification_types
    + patient_types
    + reflex_types
    + setup_types
    + shipment_types
    + storage_types
    + user_types
    + worksheet_types
    + billing_types
    + microbiology_types
    + grind_types
    + document_types
    + commune_types
    + iol_types
)


@strawberry.type
class Query(
    SetupQuery,
    AuditLogQuery,
    UserQuery,
    ClientQuery,
    PatientQuery,
    AnalysisQuery,
    WorkSheetQuery,
    MessageQuery,
    NoticeQuery,
    StreamNotificationQuery,
    AnalyticsQuery,
    ReflexRuleQuery,
    StorageQuery,
    InventoryQuery,
    ReportImpressQuery,
    InstrumentQuery,
    ShipmentQuery,
    BillingQuery,
    MicrobiologyQuery,
    GrindQuery,
    DocumentQuery,
    CommuneQuery,
):
    pass


@strawberry.type
class Mutation(
    UserMutations,
    SetupMutations,
    ClientMutations,
    PatientMutations,
    AnalysisMutations,
    WorkSheetMutations,
    MessageMutations,
    NoticeMutations,
    ReflexRuleMutations,
    StorageMutations,
    InventoryMutations,
    InstrumentMutations,
    ShipmentMutations,
    BillingMutations,
    MicrobiologyMutations,
    GrindMutations,
    DocumentMutations,
    CommuneMutations,
    IOLMutations,
):
    pass


@strawberry.type
class Subscription(StreamSubscription):
    pass


schema = strawberry.Schema(
    query=Query, mutation=Mutation, subscription=Subscription, types=types
)
