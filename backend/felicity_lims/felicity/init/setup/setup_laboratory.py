from typing import Optional

from felicity.apps.setup.models import Laboratory
from felicity.apps.setup.schemas import LaboratoryCreate


async def create_laboratory() -> None:
    laboratory: Optional[Laboratory] = await Laboratory.get_by_setup_name("felicity")
    if not laboratory:
        lab_in = LaboratoryCreate(
            setup_name="felicity",
            lab_name="Felicity Labs",
            email=None,
            email_cc=None,
            mobile_phone=None,
            business_phone=None,
        )
        await Laboratory.create(lab_in)
