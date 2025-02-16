import strawberry  # noqa

from felicity.api.gql.analysis.mutations import AnalysisMutations
from felicity.api.gql.analysis.query import AnalysisQuery
from felicity.api.gql.analysis.types import analysis_types
from felicity.api.gql.analytics import analytics_types
from felicity.api.gql.analytics.query import AnalyticsQuery
from felicity.api.gql.audit import audit_types
from felicity.api.gql.audit.query import AuditLogQuery
from felicity.api.gql.billing import billing_types
from felicity.api.gql.billing.mutations import BillingMutations
from felicity.api.gql.billing.query import BillingQuery
from felicity.api.gql.client import client_types
from felicity.api.gql.client.mutations import ClientMutations
from felicity.api.gql.client.query import ClientQuery
from felicity.api.gql.impress import impress_types
from felicity.api.gql.impress.query import ReportImpressQuery
from felicity.api.gql.instrument import instrument_types
from felicity.api.gql.instrument.mutations import InstrumentMutations
from felicity.api.gql.instrument.query import InstrumentQuery
from felicity.api.gql.inventory import inventory_types
from felicity.api.gql.inventory.mutations import InventoryMutations
from felicity.api.gql.inventory.query import InventoryQuery
from felicity.api.gql.messaging import messaging_types
from felicity.api.gql.messaging.mutations import MessageMutations
from felicity.api.gql.messaging.query import MessageQuery
from felicity.api.gql.multiplex.microbiology import microbiology_types
from felicity.api.gql.multiplex.microbiology.mutations import MicrobiologyMutations
from felicity.api.gql.multiplex.microbiology.query import MicrobiologyQuery
from felicity.api.gql.noticeboard import noticeboard_types
from felicity.api.gql.noticeboard.mutations import NoticeMutations
from felicity.api.gql.noticeboard.query import NoticeQuery
from felicity.api.gql.notification import notification_types
from felicity.api.gql.notification.query import StreamNotificationQuery
from felicity.api.gql.notification.subscription import StreamSubscription
from felicity.api.gql.patient import patient_types
from felicity.api.gql.patient.mutations import PatientMutations
from felicity.api.gql.patient.query import PatientQuery
from felicity.api.gql.reflex import reflex_types
from felicity.api.gql.reflex.mutations import ReflexRuleMutations
from felicity.api.gql.reflex.query import ReflexRuleQuery
from felicity.api.gql.setup.mutations import SetupMutations
from felicity.api.gql.setup.query import SetupQuery
from felicity.api.gql.setup.types import setup_types
from felicity.api.gql.shipment import shipment_types
from felicity.api.gql.shipment.mutations import ShipmentMutations
from felicity.api.gql.shipment.query import ShipmentQuery
from felicity.api.gql.storage import storage_types
from felicity.api.gql.storage.mutations import StorageMutations
from felicity.api.gql.storage.query import StorageQuery
from felicity.api.gql.types import generic_types
from felicity.api.gql.user import user_types
from felicity.api.gql.user.mutations import UserMutations
from felicity.api.gql.user.query import UserQuery
from felicity.api.gql.worksheet import worksheet_types
from felicity.api.gql.worksheet.mutations import WorkSheetMutations
from felicity.api.gql.worksheet.query import WorkSheetQuery

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
    MicrobiologyMutations
):
    pass


@strawberry.type
class Subscription(StreamSubscription):
    pass


schema = strawberry.Schema(
    query=Query, mutation=Mutation, subscription=Subscription, types=types
)
