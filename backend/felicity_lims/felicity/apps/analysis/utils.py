from typing import List

from felicity.apps.analysis import schemas
from felicity.apps.analysis.models.analysis import SampleType
from felicity.utils import has_value_or_is_truthy
from sqlalchemy import or_


async def get_qc_sample_type():
    st = await SampleType.get(name="QC Sample")
    if not st:
        st_in = schemas.SampleTypeCreate(
            name="QC Sample", description="QC Sample", abbr="QCS"
        )
        st = await SampleType.create(st_in)
    return st


async def sample_search(
    model, status: str, text: str, client_uid: int
) -> List[schemas.SampleType]:
    """No pagination"""
    filters = []
    _or_text_ = {}
    if has_value_or_is_truthy(text):
        arg_list = [
            "sample_id__ilike",
            "analysis_request___patient___first_name__ilike",
            "analysis_request___patient___last_name__ilike",
            "analysis_request___patient___client_patient_id__ilike",
            "analysis_request___client_request_id__ilike",
        ]
        for _arg in arg_list:
            _or_text_[_arg] = f"%{text}%"

        text_filters = {or_: _or_text_}
        filters.append(text_filters)

    if client_uid:
        filters.append({"analysis_request___client_uid__exact": client_uid})

    if status:
        filters.append({"status__exact": status})

    filters.append({"internal_use__ne": True})

    stmt = model.smart_query(filters=filters, sort_attrs=["uid"])
    return (await model.session.execute(stmt)).scalars().all()
