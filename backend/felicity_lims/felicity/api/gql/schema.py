import strawberry  # noqa

from felicity.api.gql.analysis.mutations import AnalysisMutations
from felicity.api.gql.analysis.query import AnalysisQuery
from felicity.api.gql.analytics.query import AnalyticsQuery
from felicity.api.gql.audit.query import AuditLogQuery
from felicity.api.gql.client.mutations import ClientMutations
from felicity.api.gql.client.query import ClientQuery
from felicity.api.gql.impress.query import ReportImpressQuery
from felicity.api.gql.inventory.mutations import InventoryMutations
from felicity.api.gql.inventory.query import InventoryQuery
from felicity.api.gql.messaging.mutations import MessageMutations
from felicity.api.gql.messaging.query import MessageQuery
from felicity.api.gql.noticeboard.mutations import NoticeMutations
from felicity.api.gql.noticeboard.query import NoticeQuery
from felicity.api.gql.notification.query import StreamNotificationQuery
from felicity.api.gql.notification.subscription import StreamSubscription
from felicity.api.gql.patient.mutations import PatientMutations
from felicity.api.gql.patient.query import PatientQuery
from felicity.api.gql.reflex.mutations import ReflexRuleMutations
from felicity.api.gql.reflex.query import ReflexRuleQuery
from felicity.api.gql.setup.mutations import SetupMutations
from felicity.api.gql.setup.query import SetupQuery
from felicity.api.gql.storage.mutations import StorageMutations
from felicity.api.gql.storage.query import StorageQuery
from felicity.api.gql.user.mutations import UserMutations
from felicity.api.gql.user.query import UserQuery
from felicity.api.gql.worksheet.mutations import WorkSheetMutations
from felicity.api.gql.worksheet.query import WorkSheetQuery


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
):
    pass


@strawberry.type
class Subscription(StreamSubscription):
    pass


gql_schema = strawberry.Schema(
    query=Query, mutation=Mutation, subscription=Subscription
)
