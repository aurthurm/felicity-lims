import strawberry

from felicity.gql.setup.query import SetupQuery
from felicity.gql.audit.query import AuditLogQuery
# from felicity.gql.setup.mutations import SetupMutations
from felicity.gql.user.query import UserQuery
from felicity.gql.user.mutations import UserMutations
from felicity.gql.client.query import ClientQuery
# from felicity.gql.client.mutations import ClientMutations
from felicity.gql.patient.query import PatientQuery
# from felicity.gql.patient.mutations import PatientMutations
from felicity.gql.analysis.query import AnalysisQuery
# from felicity.gql.analysis.mutations import AnalysisMutations
from felicity.gql.worksheet.query import WorkSheetQuery
# from felicity.gql.worksheet.mutations import WorkSheetMutations
from felicity.gql.markdown.query import MarkDownQuery
# from felicity.gql.markdown.mutations import MarkdownMutations
from felicity.gql.kanban.query import KanBanQuery
# from felicity.gql.kanban.mutations import KanBanMutations


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
):
    pass


@strawberry.type
class Mutation(
    UserMutations,
):
    pass


gql_schema = strawberry.Schema(query=Query, mutation=Mutation)
