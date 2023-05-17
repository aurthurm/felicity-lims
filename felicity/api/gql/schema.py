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


gql_schema = strawberry.Schema(
    query=Query, mutation=Mutation, subscription=Subscription
)
