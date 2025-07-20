from datetime import datetime
import logging
from typing import Any, Generic, List, Optional, Tuple, Type, TypeVar

from dateutil import parser
from sqlalchemy import text
from sqlalchemy.future import select
from sqlalchemy.sql import func

from felicity.apps.abstract.entity import BaseEntity
from felicity.database.session import async_session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ModelType = TypeVar("ModelType", bound=BaseEntity)


class EntityAnalyticsInit(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model
        self.table = model.__tablename__
        self.alias = model.__tablename__ + "_tbl"

    async def get_line_listing(
        self,
        period_start: str | datetime,
        period_end: str | datetime,
        sample_states: list[str],
        date_column: str,
        analysis_uids: List[str],
    ) -> tuple[list[str], list[Any]]:
        start_date = parser.parse(str(period_start))
        end_date = parser.parse(str(period_end))

        if len(analysis_uids) > 0:
            an_uids = analysis_uids
            if len(an_uids) == 1:
                an_uids.append(analysis_uids[0])
            an_uids = tuple(an_uids)
        else:
            an_uids = (0, 0)

        if sample_states:
            statuses = sample_states
            if len(sample_states) == 1:
                statuses.append(sample_states[0])
            statuses = tuple(statuses)
        else:
            statuses = ("", "")  # noqa

        stmt = text(
            f"""
            select 
                pt.patient_id as "Patient Id",
                pt.first_name as "First Name",
                pt.last_name as "Last Name",
                pt.client_patient_id as "Client Patient Id",
                cl.name as "Client",
                pt.gender as "Gender",
                pt.age as "Age",
                pt.date_of_birth as "Date Of Birth",
                pt.age_dob_estimated as "Age DOB Estimated",
                ar.client_request_id as "Client Request Id",    
                sa.sample_id as "Sample Id",
                sa.date_received as "Date Received",
                sa.date_submitted as "Date Submitted",
                sa.date_verified as "Date Verified",
                sa.date_published as "Date Published",
                sa.date_invalidated as "Date Invalidated",
                sa.date_cancelled as "Date Cancelled",
                an.name as "Analysis",
                re.result as "Result",
                mt.name as "Method",
                inst.name as "Instrument",
                re.reportable as "Reportable",
                sa.status as "Sample Status",
                sa.{date_column} as "Period Criteria - {date_column}"
            from {self.table} sa
            inner join analysis_result re on re.sample_uid = sa.uid
            inner join analysis_request ar on ar.uid = sa.analysis_request_uid
            inner join client cl on cl.uid = ar.client_uid
            inner join analysis an on an.uid = re.analysis_uid
            inner join sample_type st on st.uid = re.analysis_uid
            inner join patient pt on pt.uid = ar.patient_uid
            left join laboratory_instrument li on li.uid = re.laboratory_instrument_uid
            inner join instrument inst on inst.uid = li.instrument_uid
            left join method mt on mt.uid = re.method_uid
            where
                sa.{date_column} >= :sd and
                sa.{date_column} <= :ed and 
                an.uid in {an_uids} and
                sa.status in {statuses}
        """
        )

        async with async_session() as session:
            result = await session.execute(stmt, {"sd": start_date, "ed": end_date})

        # columns result.keys()/result._metadata.keys
        return result.keys(), result.all()

    async def get_line_listing_2(self):
        stmt = self.model.with_joined(
            "analysis_results", "analyses", "analysis_request"
        )
        async with async_session() as session:
            await session.execute(stmt.limit(10))

        # logger.info(result)
        # logger.info(result.scalars().all())

        return None, None

    async def get_counts_group_by(
        self,
        group_by: str,
        start: Optional[Tuple[str, str]] = None,
        end: Optional[Tuple[str, str]] = None,
        group_in: list[str] | None = None,
    ):  # noqa
        if not hasattr(self.model, group_by):
            logger.warning(f"Model has no attr {group_by}")
            raise AttributeError(f"Model has no attr {group_by}")
        group_by = getattr(self.model, group_by)

        stmt = select(group_by, func.count(self.model.uid).label("total")).filter(
            group_by is not None
        )  # noqa

        if start[1]:
            start_column = start[0]
            start_date = parser.parse(start[1]).replace(tzinfo=None)
            if not hasattr(self.model, start_column):
                logger.warning(f"Model has no attr {start_column}")
                raise AttributeError(f"Model has no attr {start_column}")
            start_column = getattr(self.model, start_column)
            stmt = stmt.filter(start_column >= start_date)

        if end[1]:
            end_column = end[0]
            end_date = parser.parse(end[1]).replace(tzinfo=None)
            if not hasattr(self.model, end_column):
                logger.warning(f"Model has no attr {end_column}")
                raise AttributeError(f"Model has no attr {end_column}")
            end_column = getattr(self.model, end_column)
            stmt = stmt.filter(end_column <= end_date)

        if group_in:
            stmt = stmt.filter(group_by.in_(group_in))

        stmt = stmt.group_by(group_by)

        async with async_session() as session:
            result = await session.execute(stmt)

        return result.all()

    async def count_analyses_retests(
        self, start: Tuple[str, str], end: Tuple[str, str]
    ):
        retest = getattr(self.model, "retest")
        stmt = select(func.count(self.model.uid).label("total")).filter(retest is True)

        if start[1]:
            start_column = start[0]
            start_date = parser.parse(start[1]).replace(tzinfo=None)
            if not hasattr(self.model, start_column):
                logger.warning(f"Model has no attr {start_column}")
                raise AttributeError(f"Model has no attr {start_column}")
            start_column = getattr(self.model, start_column)
            stmt = stmt.filter(start_column >= start_date)

        if end[1]:
            end_column = end[0]
            end_date = parser.parse(end[1]).replace(tzinfo=None)
            if not hasattr(self.model, end_column):
                logger.warning(f"Model has no attr {end_column}")
                raise AttributeError(f"Model has no attr {end_column}")
            end_column = getattr(self.model, end_column)
            stmt = stmt.filter(end_column <= end_date)

        async with async_session() as session:
            result = await session.execute(stmt)

        return result.all()

    async def get_sample_process_performance(
        self, start: Tuple[str, str], end: Tuple[str, str]
    ):
        """
        :param start: process start Tuple[str::Column, str::Date]
        :param end:  process end Tuple[str::Column, str::Date]
        :return: process counts <> [total_sample, total_late, total_not_late, process_average, average_extra_days]
        example:
            start: ('date_received','01-01-2020')
            end: ('date_published','31-12-2020')
            return [12672, 4563, 2971, 241, 63]
        """

        start_column = start[0]
        start_date = parser.parse(start[1]).replace(tzinfo=None)
        end_column = end[0]
        end_date = parser.parse(end[1]).replace(tzinfo=None)

        if not all([start_column, start_date, end_column, end_date]):
            logger.warning(
                "start and end process parameters are required and must be complete tuples"
            )
            raise Exception(
                "start and end process parameters are required and must be complete tuples"
            )

        if not hasattr(self.model, start_column):
            logger.warning(f"Model has no attr {start_column}")
            raise AttributeError(f"Model has no attr {start_column}")

        if not hasattr(self.model, end_column):
            logger.warning(f"Model has no attr {end_column}")
            raise AttributeError(f"Model has no attr {end_column}")

        if self.table != "sample":
            logger.warning(
                "analysis_process_performance must have sample as root table"
            )
            raise Exception(
                "analysis_process_performance must have sample as root table"
            )

        raw_sql = f"""
            select 
                COUNT(diff.total_days) as total_samples,
                COUNT(diff.total_days) filter (where diff.late is true) as total_late,  
                COUNT(diff.total_days) filter (where diff.late is false) as total_not_late,  
                FLOOR(AVG(diff.total_days)) as process_average,
                FLOOR(AVG(diff.late_days) filter (where diff.late is true))  as average_extra_days
            from 
              (
                select 
                    {start_column},
                    {end_column},
                    due_date,
                    DATE_PART('day', {end_column}::timestamp - {start_column}::timestamp) as total_days,
                    DATE_PART('day', due_date::timestamp - {end_column}::timestamp) as late_days,
                    due_date > {end_column} as late
                from {self.table}
                where
                    {start_column} >= :sd and
                    {end_column} <= :ed
              ) as diff
        """

        stmt = text(raw_sql)  # noqa:

        async with async_session() as session:
            result = await session.execute(stmt, {"sd": start_date, "ed": end_date})

        return result.all()

    async def get_analysis_process_performance(
        self, start: Tuple[str, str], end: Tuple[str, str]
    ):
        """
        :param start: process start Tuple[str::Column, str::Date]
        :param end:  process end Tuple[str::Column, str::Date]
        :return: process counts <> [total_sample, total_late, total_not_late, process_average, average_extra_days]
        example:
            start: ('date_received','01-01-2020')
            end: ('date_published','31-12-2020')
            return row ['EID', 12672, 4563, 2971, 241, 63]
        """

        start_column = start[0]
        start_date = parser.parse(start[1]).replace(tzinfo=None)
        end_column = end[0]
        end_date = parser.parse(end[1]).replace(tzinfo=None)

        if not all([start_column, start_date, end_column, end_date]):
            logger.warning(
                "start and end process parameters are required and must be complete tuples"
            )
            raise Exception(
                "start and end process parameters are required and must be complete tuples"
            )

        if not hasattr(self.model, start_column):
            logger.warning(f"Model has no attr {start_column}")
            raise AttributeError(f"Model has no attr {start_column}")

        if not hasattr(self.model, end_column):
            logger.warning(f"Model has no attr {end_column}")
            raise AttributeError(f"Model has no attr {end_column}")

        if self.table != "sample":
            logger.warning(
                "analysis_process_performance must have sample as root table"
            )
            raise Exception(
                "analysis_process_performance must have sample as root table"
            )

        raw_sql = f"""
            select 
                diff.name,
                COUNT(diff.total_days) as total_samples,
                COUNT(diff.total_days) filter (where diff.late is true) as total_late,  
                COUNT(diff.total_days) filter (where diff.late is false) as total_not_late,  
                FLOOR(AVG(diff.total_days)) as process_average,
                FLOOR(AVG(diff.late_days) filter (where diff.late is true))  as average_extra_days
            from 
              (
                select 
                    a.name,
                    {self.alias}.{start_column},
                    {self.alias}.{end_column},
                    {self.alias}.due_date,
                    DATE_PART('day', {self.alias}.{end_column}::timestamp - {self.alias}.{start_column}::timestamp) as total_days,
                    DATE_PART('day', {self.alias}.due_date::timestamp - {self.alias}.{end_column}::timestamp) as late_days,
                    {self.alias}.due_date > {self.alias}.{end_column} as late
                from {self.table} {self.alias}
                inner join analysis_result ar on ar.sample_uid = {self.alias}.uid
                inner join analysis a on a.uid = ar.analysis_uid
                where
                    {self.alias}.{start_column} >= :sd and
                    {self.alias}.{end_column} <= :ed
              ) as diff
            group by
              diff.name
        """

        stmt = text(raw_sql)  # noqa:

        async with async_session() as session:
            result = await session.execute(stmt, {"sd": start_date, "ed": end_date})

        return result.all()

    async def get_laggards(self):
        """
        Stats on delayed samples
        """

        raw_sql_for_incomplete = f"""
            select 
                count(*) as total_incomplete,  
                count(*) filter (where late is true) as total_delayed,  
                count(*) filter (where late is false) as total_not_delayed,  
                count(*) filter (where total_days<10) as "< 10",
                count(*) filter (where total_days>=10 and total_days<20) as "10 - 20",
                count(*) filter (where total_days>=20 and total_days<30) as "20 - 30",
                count(*) filter (where total_days>=30) as "> 30"
            from 
              (
                select 
                    DATE_PART('day', date_published::timestamp - date_received::timestamp) as total_days,
                    due_date > date_published as late
                from {self.table} {self.alias}
                where
                    status in ('due','received','to_be_verified', 'verified') and 
                    due_date is not null
              ) as incomplete
        """

        raw_sql_for_complete = f"""
            with completed_delayed as (
                select 
                    DATE_PART('day', date_published::timestamp - date_received::timestamp) as total_days
                from {self.table} {self.alias}
                where
                    status in ('published') and
                    due_date is not null and 
                    due_date > date_published
            )
            select
                count(*) as total_delayed,  
                count(*) filter (where total_days<10) as "< 10",
                count(*) filter (where total_days>=10 and total_days<20) as "10 - 20",
                count(*) filter (where total_days>=20 and total_days<30) as "20 - 30",
                count(*) filter (where total_days>=30) as "> 30"
            from
              completed_delayed
        """

        stmt_for_incomplete = text(raw_sql_for_incomplete)  # noqa:
        stmt_for_complete = text(raw_sql_for_complete)  # noqa:

        async with async_session() as session:
            result_for_incomplete = await session.execute(stmt_for_incomplete)
            result_for_complete = await session.execute(stmt_for_complete)

        return result_for_incomplete.all(), result_for_complete.all()
