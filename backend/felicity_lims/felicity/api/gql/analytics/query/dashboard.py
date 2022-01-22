import io
import logging
import strawberry  # noqa
import pandas as pd
from felicity.apps.analysis.models.analysis import Sample
from felicity.apps.analysis.models.results import AnalysisResult
from felicity.apps.worksheet.models import WorkSheet
from felicity.apps.user.models import User
from felicity.apps.setup.models import Instrument
from felicity.apps.analytics import AnalyticsInit
from felicity.api.gql.analytics import types
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def group_exists(val):
    if has_value_or_is_truthy(val):
        return str(val)
    return 'unknown'


async def get_username(val):
    if val == 'unknown':
        return val
    user = await User.get(uid=int(val))
    return user.auth.user_name


async def get_instrument(val):
    if val == 'unknown':
        return val
    instrument = await Instrument.get(uid=int(val))
    return instrument.name


@strawberry.field
async def test_stuff(info) -> types.Nothing:
    analytics = AnalyticsInit(Sample)
    columns, lines = await analytics.get_line_listing()

    # line = await analytics.get_line_listing_2()

    data_list = [line for line in lines]

    df = pd.DataFrame(data_list, columns=columns)

    df.to_csv("data.csv", index=False)
    s_buffer = io.StringIO()
    df.to_csv(s_buffer, index=False)
    in_memory_file = s_buffer.seek(0)

    # json.dumps([(dict(row.items())) for row in rs]) to json

    return types.Nothing(data="")


@strawberry.field
async def count_sample_group_by_status(info) -> types.GroupedCounts:
    analytics = AnalyticsInit(Sample)
    results = await analytics.get_counts_group_by('status')

    stats = []
    for row in results:
        stats.append(types.GroupCount(group=group_exists(row[0]), count=row[1]))

    return types.GroupedCounts(data=stats)


@strawberry.field
async def count_analyte_group_by_status(info) -> types.GroupedCounts:
    analytics = AnalyticsInit(AnalysisResult)
    results = await analytics.get_counts_group_by('status')

    stats = []
    for row in results:
        stats.append(types.GroupCount(group=group_exists(row[0]), count=row[1]))

    return types.GroupedCounts(data=stats)


@strawberry.field
async def count_worksheet_group_by_status(info) -> types.GroupedCounts:
    analytics = AnalyticsInit(WorkSheet)
    results = await analytics.get_counts_group_by('state')

    stats = []
    for row in results:
        stats.append(types.GroupCount(group=group_exists(row[0]), count=row[1]))

    return types.GroupedCounts(data=stats)


@strawberry.field
async def count_analyte_group_by_instrument(info) -> types.GroupedCounts:
    analytics = AnalyticsInit(AnalysisResult)
    results = await analytics.get_counts_group_by('instrument_uid')

    stats = []
    for row in results:
        stats.append(types.GroupCount(group=get_instrument(group_exists(row[0])), count=row[1]))

    return types.GroupedCounts(data=stats)


@strawberry.field
async def count_sample_group_by_action(info) -> types.GroupedData:
    analytics = AnalyticsInit(Sample)
    created = await analytics.get_counts_group_by('created_by_uid')
    submitted = await analytics.get_counts_group_by('submitted_by_uid')
    verified = await analytics.get_counts_group_by('verified_by_uid')
    published = await analytics.get_counts_group_by('published_by_uid')

    stats = []
    registration = types.GroupData(group="registration", counts=[])
    for row in created:
        registration.counts.append(types.GroupCount(group=get_username(group_exists(row[0])), count=row[1]))
    stats.append(registration)

    submission = types.GroupData(group="submission", counts=[])
    for row in submitted:
        submission.counts.append(types.GroupCount(group=get_username(group_exists(row[0])), count=row[1]))
    stats.append(submission)

    verification = types.GroupData(group="verification", counts=[])
    for row in verified:
        verification.counts.append(types.GroupCount(group=get_username(group_exists(row[0])), count=row[1]))
    stats.append(verification)

    publication = types.GroupData(group="publication", counts=[])
    for row in published:
        publication.counts.append(types.GroupCount(group=get_username(group_exists(row[0])), count=row[1]))
    stats.append(publication)

    return types.GroupedData(data=stats)


@strawberry.field
async def sample_process_performance(info, start_date: str, end_date: str) -> types.ProcessStatistics:
    analytics = AnalyticsInit(Sample)
    received_to_published = await analytics.get_sample_process_performance(
        start=('date_received', start_date),
        end=('date_published', end_date)
    )
    received_to_submitted = await analytics.get_sample_process_performance(
        start=('date_received', start_date),
        end=('date_submitted', end_date)
    )
    submitted_to_verified = await analytics.get_sample_process_performance(
        start=('date_submitted', start_date),
        end=('date_verified', end_date)
    )
    verified_to_published = await analytics.get_sample_process_performance(
        start=('date_verified', start_date),
        end=('date_published', end_date)
    )

    final_data = []

    rtp_process = types.ProcessData(process="received_to_published", counts=None, groups=[])
    for row in received_to_published:
        rtp_process.counts = types.ProcessCounts(
            total_samples=row[0],
            total_late=row[1],
            total_not_late=row[2],
            process_average=row[3],
            avg_extra_days=row[4]
        )
    final_data.append(rtp_process)

    rts_process = types.ProcessData(process="received_to_submitted", counts=None, groups=[])
    for row in received_to_submitted:
        rts_process.counts = types.ProcessCounts(
            total_samples=row[0],
            total_late=row[1],
            total_not_late=row[2],
            process_average=row[3],
            avg_extra_days=row[4]
        )
    final_data.append(rts_process)

    stv_process = types.ProcessData(process="submitted_to_verified", counts=None, groups=[])
    for row in submitted_to_verified:
        stv_process.counts = types.ProcessCounts(
            total_samples=row[0],
            total_late=row[1],
            total_not_late=row[2],
            process_average=row[3],
            avg_extra_days=row[4]
        )
    final_data.append(stv_process)

    stp_process = types.ProcessData(process="verified_to_published", counts=None, groups=[])
    for row in verified_to_published:
        stp_process.counts = types.ProcessCounts(
            total_samples=row[0],
            total_late=row[1],
            total_not_late=row[2],
            process_average=row[3],
            avg_extra_days=row[4]
        )
    final_data.append(stp_process)

    return types.ProcessStatistics(data=final_data)


@strawberry.field
async def analysis_process_performance(info, process: str, start_date: str, end_date: str) -> types.ProcessStatistics:
    analytics = AnalyticsInit(Sample)
    processes = [
        'received_to_published',
        'received_to_submitted',
        'submitted_to_verified',
        'verified_to_published'
    ]
    if process not in processes:
        logger.warning(f"invalid process {process}")
        raise Exception(f"invalid process {process}")

    performance = []
    if process == 'received_to_published':
        performance = await analytics.get_analysis_process_performance(
            start=('date_received', start_date),
            end=('date_published', end_date)
        )
    if process == 'received_to_submitted':
        performance = await analytics.get_analysis_process_performance(
            start=('date_received', start_date),
            end=('date_submitted', end_date)
        )
    if process == 'submitted_to_verified':
        performance = await analytics.get_analysis_process_performance(
            start=('date_submitted', start_date),
            end=('date_verified', end_date)
        )
    if process == 'verified_to_published':
        performance = await analytics.get_analysis_process_performance(
            start=('date_verified', start_date),
            end=('date_published', end_date)
        )

    final_data = []

    rtp_process = types.ProcessData(process=process, counts=None, groups=[])

    for row in performance:
        rtp_process.groups.append(types.ProcessCounts(
            service=row[0],
            total_samples=row[1],
            total_late=row[2],
            total_not_late=row[3],
            process_average=row[4],
            avg_extra_days=row[5]
        ))
    final_data.append(rtp_process)

    return types.ProcessStatistics(data=final_data)


@strawberry.field
async def sample_laggards(info) -> types.LaggardStatistics:
    analytics = AnalyticsInit(Sample)
    not_complete, complete = await analytics.get_laggards()

    final_data = []

    complete_laggards = types.LaggardData(category="authorised_already_delayed", counts=[])
    for row in complete:
        complete_laggards.counts = types.LaggardCounts(
            total_delayed=row[0],
            lessThanTen=row[1],
            tenToTwenty=row[2],
            twentyToThirty=row[3],
            graterThanThirty=row[4]
        )
    final_data.append(complete_laggards)

    in_complete_laggards = types.LaggardData(category="delayed_and_incomplete", counts=[])
    for row in not_complete:
        in_complete_laggards.counts = types.LaggardCounts(
            total_incomplete=row[0],
            total_delayed=row[1],
            total_not_delayed=row[2],
            lessThanTen=row[3],
            tenToTwenty=row[4],
            twentyToThirty=row[5],
            graterThanThirty=row[6]
        )
    final_data.append(in_complete_laggards)

    return types.LaggardStatistics(data=final_data)
