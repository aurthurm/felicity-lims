import logging
from datetime import datetime
from typing import Any, Generic, List, Optional, Tuple, Type, TypeVar

from dateutil import parser
from sqlalchemy import text
from sqlalchemy.future import select
from sqlalchemy.sql import func

from felicity.apps.abstract.entity import BaseEntity
from felicity.core.tenant_context import get_current_lab_uid
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

        # Safely prepare tuples
        an_uids = tuple(analysis_uids) if analysis_uids else tuple()
        statuses = tuple(sample_states) if sample_states else tuple()

        # Tenant / lab context
        current_lab_uid = get_current_lab_uid()
        lab_uids = (current_lab_uid,) if current_lab_uid else tuple()

        # SQL filters with safe empty tuple handling
        an_filter = "an.uid IN :an_uids" if an_uids else "1=0"
        status_filter = "sa.status IN :statuses" if statuses else "1=0"
        lab_filter = "sa.laboratory_uid IN :lab_uids" if lab_uids else "1=0"

        stmt = text(
            f"""
            SELECT 
                pt.patient_id AS "Patient Id",
                pt.first_name AS "First Name",
                pt.last_name AS "Last Name",
                pt.client_patient_id AS "Client Patient Id",
                cl.name AS "Client",
                pt.gender AS "Gender",
                pt.age AS "Age",
                pt.date_of_birth AS "Date Of Birth",
                pt.age_dob_estimated AS "Age DOB Estimated",
                ar.client_request_id AS "Client Request Id",    
                sa.sample_id AS "Sample Id",
                sa.date_received AS "Date Received",
                sa.date_submitted AS "Date Submitted",
                sa.date_verified AS "Date Verified",
                sa.date_published AS "Date Published",
                sa.date_invalidated AS "Date Invalidated",
                sa.date_cancelled AS "Date Cancelled",
                an.name AS "Analysis",
                re.result AS "Result",
                mt.name AS "Method",
                inst.name AS "Instrument",
                re.reportable AS "Reportable",
                sa.status AS "Sample Status",
                sa.{date_column} AS "Period Criteria - {date_column}"
            FROM {self.table} sa
            INNER JOIN analysis_result re ON re.sample_uid = sa.uid
            INNER JOIN analysis_request ar ON ar.uid = sa.analysis_request_uid
            INNER JOIN client cl ON cl.uid = ar.client_uid
            INNER JOIN analysis an ON an.uid = re.analysis_uid
            INNER JOIN sample_type st ON st.uid = re.analysis_uid
            INNER JOIN patient pt ON pt.uid = ar.patient_uid
            LEFT JOIN laboratory_instrument li ON li.uid = re.laboratory_instrument_uid
            INNER JOIN instrument inst ON inst.uid = li.instrument_uid
            LEFT JOIN method mt ON mt.uid = re.method_uid
            WHERE
                sa.{date_column} >= :sd AND
                sa.{date_column} <= :ed AND
                {an_filter} AND
                {status_filter} AND
                {lab_filter}
            """
        )

        async with async_session() as session:
            result = await session.execute(
                stmt,
                {
                    "sd": start_date,
                    "ed": end_date,
                    "an_uids": an_uids,
                    "statuses": statuses,
                    "lab_uids": lab_uids,
                },
            )

        return result.keys(), result.all()

    async def get_line_listing_2(self):
        stmt = self.model.with_joined(
            "analysis_results", "analyses", "analysis_request"
        )

        # Apply tenant/lab context if available
        current_lab_uid = get_current_lab_uid()
        if current_lab_uid and hasattr(self.model, "laboratory_uid"):
            stmt = stmt.filter(getattr(self.model, "laboratory_uid") == current_lab_uid)

        async with async_session() as session:
            result = await session.execute(stmt.limit(10))

        # If you want scalars:
        # rows = result.scalars().all()

        return None, None

    async def get_counts_group_by(
            self,
            group_by: str,
            start: Optional[Tuple[str, str]] = None,
            end: Optional[Tuple[str, str]] = None,
            group_in: list[str] | None = None,
    ):
        if not hasattr(self.model, group_by):
            logger.warning(f"Model has no attr {group_by}")
            raise AttributeError(f"Model has no attr {group_by}")
        group_by_col = getattr(self.model, group_by)

        stmt = select(group_by_col, func.count(self.model.uid).label("total")).filter(
            group_by_col.isnot(None)
        )

        # Apply start date filter
        if start and start[1]:
            start_col_name, start_val = start
            if not hasattr(self.model, start_col_name):
                logger.warning(f"Model has no attr {start_col_name}")
                raise AttributeError(f"Model has no attr {start_col_name}")
            start_col = getattr(self.model, start_col_name)
            start_date = parser.parse(start_val).replace(tzinfo=None)
            stmt = stmt.filter(start_col >= start_date)

        # Apply end date filter
        if end and end[1]:
            end_col_name, end_val = end
            if not hasattr(self.model, end_col_name):
                logger.warning(f"Model has no attr {end_col_name}")
                raise AttributeError(f"Model has no attr {end_col_name}")
            end_col = getattr(self.model, end_col_name)
            end_date = parser.parse(end_val).replace(tzinfo=None)
            stmt = stmt.filter(end_col <= end_date)

        # Apply group_in filter
        if group_in:
            stmt = stmt.filter(group_by_col.in_(group_in))

        # ✅ Apply tenant/lab context
        current_lab_uid = get_current_lab_uid()
        if current_lab_uid and hasattr(self.model, "laboratory_uid"):
            stmt = stmt.filter(getattr(self.model, "laboratory_uid") == current_lab_uid)

        stmt = stmt.group_by(group_by_col)

        async with async_session() as session:
            result = await session.execute(stmt)

        return result.all()

    async def count_analyses_retests(
            self, start: Tuple[str, str], end: Tuple[str, str]
    ):
        retest_col = getattr(self.model, "retest")
        stmt = select(func.count(self.model.uid).label("total")).filter(retest_col.is_(True))

        # Start date filter
        if start and start[1]:
            start_col_name, start_val = start
            if not hasattr(self.model, start_col_name):
                logger.warning(f"Model has no attr {start_col_name}")
                raise AttributeError(f"Model has no attr {start_col_name}")
            start_col = getattr(self.model, start_col_name)
            start_date = parser.parse(start_val).replace(tzinfo=None)
            stmt = stmt.filter(start_col >= start_date)

        # End date filter
        if end and end[1]:
            end_col_name, end_val = end
            if not hasattr(self.model, end_col_name):
                logger.warning(f"Model has no attr {end_col_name}")
                raise AttributeError(f"Model has no attr {end_col_name}")
            end_col = getattr(self.model, end_col_name)
            end_date = parser.parse(end_val).replace(tzinfo=None)
            stmt = stmt.filter(end_col <= end_date)

        # ✅ Apply tenant/lab context
        current_lab_uid = get_current_lab_uid()
        if current_lab_uid and hasattr(self.model, "laboratory_uid"):
            stmt = stmt.filter(getattr(self.model, "laboratory_uid") == current_lab_uid)

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

        start_column, start_date_str = start
        end_column, end_date_str = end
        start_date = parser.parse(start_date_str).replace(tzinfo=None)
        end_date = parser.parse(end_date_str).replace(tzinfo=None)

        # Validate columns
        for col_name in [start_column, end_column]:
            if not hasattr(self.model, col_name):
                logger.warning(f"Model has no attr {col_name}")
                raise AttributeError(f"Model has no attr {col_name}")

        if self.table != "sample":
            logger.warning("analysis_process_performance must have sample as root table")
            raise Exception("analysis_process_performance must have sample as root table")

        # Tenant/lab context
        current_lab_uid = get_current_lab_uid()
        lab_filter_sql = f"AND laboratory_uid = :lab_uid" if current_lab_uid else ""

        raw_sql = f"""
            SELECT 
                COUNT(diff.total_days) AS total_samples,
                COUNT(diff.total_days) FILTER (WHERE diff.late IS TRUE) AS total_late,  
                COUNT(diff.total_days) FILTER (WHERE diff.late IS FALSE) AS total_not_late,  
                FLOOR(AVG(diff.total_days)) AS process_average,
                FLOOR(AVG(diff.late_days) FILTER (WHERE diff.late IS TRUE)) AS average_extra_days
            FROM 
              (
                SELECT 
                    {start_column},
                    {end_column},
                    due_date,
                    DATE_PART('day', {end_column}::timestamp - {start_column}::timestamp) AS total_days,
                    DATE_PART('day', due_date::timestamp - {end_column}::timestamp) AS late_days,
                    due_date > {end_column} AS late
                FROM {self.table}
                WHERE
                    {start_column} >= :sd AND
                    {end_column} <= :ed
                    {lab_filter_sql}
              ) AS diff
        """

        params = {"sd": start_date, "ed": end_date}
        if current_lab_uid:
            params["lab_uid"] = current_lab_uid

        stmt = text(raw_sql)

        async with async_session() as session:
            result = await session.execute(stmt, params)

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

        start_column, start_date_str = start
        end_column, end_date_str = end
        start_date = parser.parse(start_date_str).replace(tzinfo=None)
        end_date = parser.parse(end_date_str).replace(tzinfo=None)

        # Validate columns
        for col_name in [start_column, end_column]:
            if not hasattr(self.model, col_name):
                logger.warning(f"Model has no attr {col_name}")
                raise AttributeError(f"Model has no attr {col_name}")

        if self.table != "sample":
            logger.warning("analysis_process_performance must have sample as root table")
            raise Exception("analysis_process_performance must have sample as root table")

        # Tenant / lab context
        current_lab_uid = get_current_lab_uid()
        lab_filter_sql = f"AND {self.alias}.laboratory_uid = :lab_uid" if current_lab_uid else ""

        raw_sql = f"""
            SELECT 
                diff.name,
                COUNT(diff.total_days) AS total_samples,
                COUNT(diff.total_days) FILTER (WHERE diff.late IS TRUE) AS total_late,  
                COUNT(diff.total_days) FILTER (WHERE diff.late IS FALSE) AS total_not_late,  
                FLOOR(AVG(diff.total_days)) AS process_average,
                FLOOR(AVG(diff.late_days) FILTER (WHERE diff.late IS TRUE)) AS average_extra_days
            FROM 
              (
                SELECT 
                    a.name,
                    {self.alias}.{start_column},
                    {self.alias}.{end_column},
                    {self.alias}.due_date,
                    DATE_PART('day', {self.alias}.{end_column}::timestamp - {self.alias}.{start_column}::timestamp) AS total_days,
                    DATE_PART('day', {self.alias}.due_date::timestamp - {self.alias}.{end_column}::timestamp) AS late_days,
                    {self.alias}.due_date > {self.alias}.{end_column} AS late
                FROM {self.table} {self.alias}
                INNER JOIN analysis_result ar ON ar.sample_uid = {self.alias}.uid
                INNER JOIN analysis a ON a.uid = ar.analysis_uid
                WHERE
                    {self.alias}.{start_column} >= :sd AND
                    {self.alias}.{end_column} <= :ed
                    {lab_filter_sql}
              ) AS diff
            GROUP BY diff.name
        """

        params = {"sd": start_date, "ed": end_date}
        if current_lab_uid:
            params["lab_uid"] = current_lab_uid

        stmt = text(raw_sql)

        async with async_session() as session:
            result = await session.execute(stmt, params)

        return result.all()

    async def get_laggards(self):
        """
        Stats on delayed samples
        """

        current_lab_uid = get_current_lab_uid()
        lab_filter = "AND laboratory_uid = :lab_uid" if current_lab_uid else ""

        raw_sql_for_incomplete = f"""
            SELECT 
                COUNT(*) AS total_incomplete,  
                COUNT(*) FILTER (WHERE late IS TRUE) AS total_delayed,  
                COUNT(*) FILTER (WHERE late IS FALSE) AS total_not_delayed,  
                COUNT(*) FILTER (WHERE total_days<10) AS "< 10",
                COUNT(*) FILTER (WHERE total_days>=10 AND total_days<20) AS "10 - 20",
                COUNT(*) FILTER (WHERE total_days>=20 AND total_days<30) AS "20 - 30",
                COUNT(*) FILTER (WHERE total_days>=30) AS "> 30"
            FROM 
              (
                SELECT 
                    DATE_PART('day', date_published::timestamp - date_received::timestamp) AS total_days,
                    due_date > date_published AS late
                FROM {self.table} {self.alias}
                WHERE
                    status IN ('due','received','to_be_verified','verified') AND 
                    due_date IS NOT NULL
                    {lab_filter}
              ) AS incomplete
        """

        raw_sql_for_complete = f"""
            WITH completed_delayed AS (
                SELECT 
                    DATE_PART('day', date_published::timestamp - date_received::timestamp) AS total_days
                FROM {self.table} {self.alias}
                WHERE
                    status IN ('published') AND
                    due_date IS NOT NULL AND 
                    due_date > date_published
                    {lab_filter}
            )
            SELECT
                COUNT(*) AS total_delayed,  
                COUNT(*) FILTER (WHERE total_days<10) AS "< 10",
                COUNT(*) FILTER (WHERE total_days>=10 AND total_days<20) AS "10 - 20",
                COUNT(*) FILTER (WHERE total_days>=20 AND total_days<30) AS "20 - 30",
                COUNT(*) FILTER (WHERE total_days>=30) AS "> 30"
            FROM
              completed_delayed
        """

        params = {}
        if current_lab_uid:
            params["lab_uid"] = current_lab_uid

        stmt_for_incomplete = text(raw_sql_for_incomplete)
        stmt_for_complete = text(raw_sql_for_complete)

        async with async_session() as session:
            result_for_incomplete = await session.execute(stmt_for_incomplete, params)
            result_for_complete = await session.execute(stmt_for_complete, params)

        return result_for_incomplete.all(), result_for_complete.all()
