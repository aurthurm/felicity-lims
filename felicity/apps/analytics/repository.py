import logging

from dateutil import parser
from sqlalchemy import text
from sqlalchemy.future import select
from sqlalchemy.sql import func

from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analytics.entities import ReportMeta
from felicity.core.tenant_context import get_current_lab_uid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ReportMetaRepository(BaseRepository[ReportMeta]):
    def __init__(self) -> None:
        super().__init__(ReportMeta)


class SampleAnalyticsRepository(BaseRepository[Sample]):
    def __init__(self):
        self.table = Sample.__tablename__
        self.alias = Sample.__tablename__ + "_tbl"
        super().__init__(Sample)

    async def get_line_listing(
            self,
            period_start: str,
            period_end: str,
            sample_states: list[str],
            date_column: str,
            analysis_uids: list[str],
    ):
        start_date = parser.parse(str(period_start))
        end_date = parser.parse(str(period_end))

        # --- Dynamic WHERE conditions
        conditions = [
            f"sa.{date_column} >= :sd",
            f"sa.{date_column} <= :ed",
        ]
        params = {"sd": start_date, "ed": end_date}

        # Filter by analysis_uids if provided
        if analysis_uids:
            conditions.append("an.uid IN :an_uids")
            params["an_uids"] = tuple(analysis_uids)  # noqa

        # Filter by sample_states if provided
        if sample_states:
            conditions.append("sa.status IN :statuses")
            params["statuses"] = tuple(sample_states)  # noqa

        # Tenant context filter
        current_lab_uid = get_current_lab_uid()
        if current_lab_uid:
            conditions.append("re.laboratory_uid = :lab_uid")
            params["lab_uid"] = current_lab_uid  # noqa

        # Final WHERE clause
        where_clause = " AND ".join(conditions)

        # --- SQL statement
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
            inner join analysisresult re on re.sample_uid = sa.uid
            inner join analysisrequest ar on ar.uid = sa.analysis_request_uid
            inner join client cl on cl.uid = ar.client_uid
            inner join analysis an on an.uid = re.analysis_uid
            inner join sampletype st on st.uid = re.analysis_uid
            inner join patient pt on pt.uid = ar.patient_uid
            left join instrument inst on inst.uid = re.instrument_uid
            left join method mt on mt.uid = re.method_uid
            where {where_clause}
        """
        )

        async with self.async_session() as session:
            result = await session.execute(stmt, params)

        # columns result.keys()/result._metadata.keys
        return result.keys(), result.all()

    async def get_counts_group_by(
            self,
            group_by: str,
            start: tuple[str, str] | None,
            end: tuple[str, str] | None,
            group_in: list[str] | None = None,
    ):
        if not hasattr(self.model, group_by):
            logger.warning(f"Model has no attr {group_by}")
            raise AttributeError(f"Model has no attr {group_by}")
        group_by = getattr(self.model, group_by)

        stmt = select(group_by, func.count(self.model.uid).label("total")).filter(
            group_by is not None
        )

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

        # Tenant context filter
        current_lab_uid = get_current_lab_uid()
        if current_lab_uid and hasattr(self.model, "laboratory_uid"):
            stmt = stmt.filter(getattr(self.model, "laboratory_uid") == current_lab_uid)  # noqa

        if group_in:
            stmt = stmt.filter(group_by.in_(group_in))

        stmt = stmt.group_by(group_by)

        async with self.async_session() as session:
            result = await session.execute(stmt)

        return result.all()

    async def count_analyses_retests(
            self, start: tuple[str, str], end: tuple[str, str]
    ):
        retest = getattr(self.model, "retest")
        stmt = select(func.count(self.model.uid).label("total")).filter(
            retest.is_(True)
        )  # filter_by(retest=True)

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

        # Tenant context filter
        current_lab_uid = get_current_lab_uid()
        if current_lab_uid and hasattr(self.model, "laboratory_uid"):
            stmt = stmt.filter(getattr(self.model, "laboratory_uid") == current_lab_uid)  # noqa

        async with self.async_session() as session:
            result = await session.execute(stmt)

        return result.all()

    async def get_sample_process_performance(
            self, start: tuple[str, str], end: tuple[str, str]
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

        params = {"sd": start_date, "ed": end_date}

        # --- Tenant filter
        current_lab_uid = get_current_lab_uid()
        lab_filter = ""
        if current_lab_uid:
            lab_filter = "AND laboratory_uid = :lab_uid"
            params["lab_uid"] = current_lab_uid  # noqa

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
                    {lab_filter}
              ) as diff
        """

        stmt = text(raw_sql)  # noqa SQL200

        async with self.async_session() as session:
            result = await session.execute(stmt, params)

        return result.all()

    async def get_analysis_process_performance(
            self, start: tuple[str, str], end: tuple[str, str]
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

        # --- Tenant filter
        current_lab_uid = get_current_lab_uid()
        lab_filter = ""
        params = {"sd": start_date, "ed": end_date}
        if current_lab_uid:
            lab_filter = "AND ar.laboratory_uid = :lab_uid"
            params["lab_uid"] = current_lab_uid

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
                inner join analysisresult ar on ar.sample_uid = {self.alias}.uid
                inner join analysis a on a.uid = ar.analysis_uid
                where
                    {self.alias}.{start_column} >= :sd and
                    {self.alias}.{end_column} <= :ed
                    {lab_filter}
              ) as diff
            group by
              diff.name
        """

        stmt = text(raw_sql)  # noqa SQL200

        async with self.async_session() as session:
            result = await session.execute(stmt, params)

        return result.all()

    async def get_laggards(self):
        """
        Stats on delayed samples (with tenant context filter)
        """
        current_lab_uid = get_current_lab_uid()
        lab_filter = ""
        params = {}

        if current_lab_uid and hasattr(self.model, "laboratory_uid"):
            lab_filter = "AND laboratory_uid = :lab_uid"
            params["lab_uid"] = current_lab_uid

        raw_sql_for_incomplete = f"""
            SELECT 
                COUNT(*) AS total_incomplete,  
                COUNT(*) FILTER (WHERE late IS TRUE) AS total_delayed,  
                COUNT(*) FILTER (WHERE late IS FALSE) AS total_not_delayed,  
                COUNT(*) FILTER (WHERE total_days < 10) AS "< 10",
                COUNT(*) FILTER (WHERE total_days >= 10 AND total_days < 20) AS "10 - 20",
                COUNT(*) FILTER (WHERE total_days >= 20 AND total_days < 30) AS "20 - 30",
                COUNT(*) FILTER (WHERE total_days >= 30) AS "> 30"
            FROM 
              (
                SELECT 
                    DATE_PART('day', date_published::timestamp - date_received::timestamp) AS total_days,
                    due_date > date_published AS late
                FROM {self.table} {self.alias}
                WHERE
                    status IN ('due','received','to_be_verified','verified')
                    AND due_date IS NOT NULL
                    {lab_filter}
              ) AS incomplete
        """

        raw_sql_for_complete = f"""
            WITH completed_delayed AS (
                SELECT 
                    DATE_PART('day', date_published::timestamp - date_received::timestamp) AS total_days
                FROM {self.table} {self.alias}
                WHERE
                    status IN ('published')
                    AND due_date IS NOT NULL 
                    AND due_date > date_published
                    {lab_filter}
            )
            SELECT
                COUNT(*) AS total_delayed,  
                COUNT(*) FILTER (WHERE total_days < 10) AS "< 10",
                COUNT(*) FILTER (WHERE total_days >= 10 AND total_days < 20) AS "10 - 20",
                COUNT(*) FILTER (WHERE total_days >= 20 AND total_days < 30) AS "20 - 30",
                COUNT(*) FILTER (WHERE total_days >= 30) AS "> 30"
            FROM completed_delayed
        """

        stmt_for_incomplete = text(raw_sql_for_incomplete)  # noqa SQL200
        stmt_for_complete = text(raw_sql_for_complete)  # noqa SQL200

        async with self.async_session() as session:
            result_for_incomplete = await session.execute(stmt_for_incomplete, params)
            result_for_complete = await session.execute(stmt_for_complete, params)

        return result_for_incomplete.all(), result_for_complete.all()
