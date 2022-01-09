import strawberry  # noqa
from felicity.gql.analysis.mutations import AnalysisMutations
from felicity.gql.analysis.query import AnalysisQuery
from felicity.gql.audit.query import AuditLogQuery
from felicity.gql.client.mutations import ClientMutations
from felicity.gql.client.query import ClientQuery
from felicity.gql.kanban.mutations import KanBanMutations
from felicity.gql.kanban.query import KanBanQuery
from felicity.gql.markdown.mutations import MarkdownMutations
from felicity.gql.markdown.query import MarkDownQuery
from felicity.gql.messaging.mutations import MessageMutations
from felicity.gql.messaging.query import MessageQuery
from felicity.gql.noticeboard.mutations import NoticeMutations
from felicity.gql.noticeboard.query import NoticeQuery
from felicity.gql.notification.query import NotificationQuery
from felicity.gql.patient.mutations import PatientMutations
from felicity.gql.patient.query import PatientQuery
from felicity.gql.setup.mutations import SetupMutations
from felicity.gql.setup.query import SetupQuery
from felicity.gql.stream.subscription import StreamSubscription
from felicity.gql.user.mutations import UserMutations
from felicity.gql.user.query import UserQuery
from felicity.gql.worksheet.mutations import WorkSheetMutations
from felicity.gql.worksheet.query import WorkSheetQuery


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
    NotificationQuery,
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
