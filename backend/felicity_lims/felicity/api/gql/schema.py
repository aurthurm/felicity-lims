import strawberry  # noqa
from felicity.api.gql.analysis.mutations import AnalysisMutations
from felicity.api.gql.analysis.query import AnalysisQuery
from felicity.api.gql.audit.query import AuditLogQuery
from felicity.api.gql.client.mutations import ClientMutations
from felicity.api.gql.client.query import ClientQuery
from felicity.api.gql.kanban.mutations import KanBanMutations
from felicity.api.gql.kanban.query import KanBanQuery
from felicity.api.gql.markdown.mutations import MarkdownMutations
from felicity.api.gql.markdown.query import MarkDownQuery
from felicity.api.gql.messaging.mutations import MessageMutations
from felicity.api.gql.messaging.query import MessageQuery
from felicity.api.gql.noticeboard.mutations import NoticeMutations
from felicity.api.gql.noticeboard.query import NoticeQuery
from felicity.api.gql.notification.query import StreamNotificationQuery
from felicity.api.gql.patient.mutations import PatientMutations
from felicity.api.gql.patient.query import PatientQuery
from felicity.api.gql.setup.mutations import SetupMutations
from felicity.api.gql.setup.query import SetupQuery
from felicity.api.gql.notification.subscription import StreamSubscription
from felicity.api.gql.user.mutations import UserMutations
from felicity.api.gql.user.query import UserQuery
from felicity.api.gql.worksheet.mutations import WorkSheetMutations
from felicity.api.gql.worksheet.query import WorkSheetQuery
from felicity.api.gql.analytics.query import AnalyticsQuery


@strawberry.type
class Query(
    SetupQuery,
    AuditLogQuery,
    UserQuery,
    ClientQuery,
    PatientQuery,
    AnalysisQuery,
    WorkSheetQuery,
    MarkDownQuery,
    KanBanQuery,
    MessageQuery,
    NoticeQuery,
    StreamNotificationQuery,
    AnalyticsQuery,
):
    pass


@strawberry.type
class Mutation(
    UserMutations,
    SetupMutations,
    ClientMutations,
    PatientMutations,
    MarkdownMutations,
    AnalysisMutations,
    WorkSheetMutations,
    KanBanMutations,
    MessageMutations,
    NoticeMutations,
):
    pass


@strawberry.type
class Subscription(StreamSubscription):
    pass


gql_schema = strawberry.Schema(
    query=Query, mutation=Mutation, subscription=Subscription
)
