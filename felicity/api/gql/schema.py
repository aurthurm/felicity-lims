import strawberry  # noqa
from api.gql.analysis.mutations import AnalysisMutations
from api.gql.analysis.query import AnalysisQuery
from api.gql.analytics.query import AnalyticsQuery
from api.gql.audit.query import AuditLogQuery
from api.gql.client.mutations import ClientMutations
from api.gql.client.query import ClientQuery
from api.gql.impress.query import ReportImpressQuery
from api.gql.inventory.mutations import InventoryMutations
from api.gql.inventory.query import InventoryQuery
from api.gql.messaging.mutations import MessageMutations
from api.gql.messaging.query import MessageQuery
from api.gql.noticeboard.mutations import NoticeMutations
from api.gql.noticeboard.query import NoticeQuery
from api.gql.notification.query import StreamNotificationQuery
from api.gql.notification.subscription import StreamSubscription
from api.gql.patient.mutations import PatientMutations
from api.gql.patient.query import PatientQuery
from api.gql.reflex.mutations import ReflexRuleMutations
from api.gql.reflex.query import ReflexRuleQuery
from api.gql.setup.mutations import SetupMutations
from api.gql.setup.query import SetupQuery
from api.gql.storage.mutations import StorageMutations
from api.gql.storage.query import StorageQuery
from api.gql.user.mutations import UserMutations
from api.gql.user.query import UserQuery
from api.gql.worksheet.mutations import WorkSheetMutations
from api.gql.worksheet.query import WorkSheetQuery
from api.gql.instrument.mutations import InstrumentMutations
from api.gql.instrument.query import InstrumentQuery
from api.gql.shipment.mutations import ShipmentMutations
from api.gql.shipment.query import ShipmentQuery
from api.gql.analysis.types import analysis_types
from api.gql.analytics import analytics_types
from api.gql.audit import audit_types
from api.gql.client import client_types
from api.gql.impress import impress_types
from api.gql.instrument import instrument_types
from api.gql.inventory import inventory_types
from api.gql.messaging import messaging_types
from api.gql.noticeboard import noticeboard_types
from api.gql.notification import notification_types
from api.gql.patient import patient_types
from api.gql.reflex import reflex_types
from api.gql.setup.types import setup_types
from api.gql.shipment import shipment_types
from api.gql.storage import storage_types
from api.gql.user import user_types
from api.gql.worksheet import worksheet_types
from api.gql.billing import billing_types
from api.gql.billing.query import BillingQuery
from api.gql.types import generic_types

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
):
    pass


@strawberry.type
class Subscription(StreamSubscription):
    pass


schema = strawberry.Schema(
    query=Query, mutation=Mutation, subscription=Subscription, types=types
)
