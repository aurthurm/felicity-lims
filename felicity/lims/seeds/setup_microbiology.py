import logging

import pandas as pd

from felicity.apps.multiplex.microbiology.entities import AbxGuideline, AbxAntibiotic, AbxAntibioticGuideline
from felicity.apps.multiplex.microbiology.schemas import AbxGuidelineCreate
from felicity.apps.multiplex.microbiology.services import AbxGuidelineService
from felicity.core.config import get_settings
from felicity.lims.seeds.data import get_whonet_dataframes

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_person() -> None:
    logger.info("Setting up person .....")
    data = get_whonet_dataframes("Antibiotics")

    abx_guideline_service = AbxGuidelineService()
    for guideline in ['CLSI', 'EUCAST']:
        if not (await abx_guideline_service.get(name=guideline)):
            guideline_in = AbxGuidelineCreate(name=guideline, code=guideline, description=guideline)
            await abx_guideline_service.create(guideline_in)


def import_antibiotic_data(file_path: str, session: Session):
    """Imports antibiotic data from a TXT file into the database."""

    try:
        df = pd.read_csv(file_path, sep='\t', dtype=str, keep_default_na=False)  # Keep empty strings

        # --- Import AbxGuideline ---
        guidelines = {}
        for _, row in df.iterrows():
            guideline_name = row['Guideline']
            if guideline_name and guideline_name not in guidelines:  # Check if name is not empty and not already in dict
                guideline = AbxGuideline(name=guideline_name, code=row.get('Guideline Code'),
                                         description=row.get('Guideline Description'))
                session.add(guideline)
                session.flush()  # Get the generated UID
                guidelines[guideline_name] = guideline.uid

        # --- Import AbxAntibiotic ---
        antibiotics = {}
        for _, row in df.iterrows():
            antibiotic_name = row['Antibiotic']
            if antibiotic_name and antibiotic_name not in antibiotics:  # Check if name is not empty and not already in dict
                antibiotic = AbxAntibiotic(
                    name=antibiotic_name,
                    whonet_abx_code=row.get('WHONET Abx Code'),
                    who_code=row.get('WHO Code'),
                    din_code=row.get('DIN Code'),
                    jac_code=row.get('JAC Code'),
                    eucast_code=row.get('EUCAST Code'),
                    user_code=row.get('User Code'),
                    abx_number=row.get('Abx Number'),
                    potency=row.get('Potency'),
                    atc_code=row.get('ATC Code'),
                    class_=row.get('Class'),  # Use class_ to avoid keyword conflict
                    subclass=row.get('Subclass'),
                    prof_class=row.get('Prof Class'),
                    cia_category=row.get('CIA Category'),
                    clsi_order=row.get('CLSI Order'),
                    eucast_order=row.get('EUCAST Order'),
                    human=row.get('Human') == 'TRUE' if row.get('Human') else None,  # Convert to boolean
                    veterinary=row.get('Veterinary') == 'TRUE' if row.get('Veterinary') else None,  # Convert to boolean
                    animal_gp=row.get('Animal GP'),
                    loinccorp=row.get('LOINC Corp'),
                    loincgen=row.get('LOINC Gen'),
                    loinccdisk=row.get('LOINC Disk'),
                    loinccmic=row.get('LOINC Mic'),
                    loincetest=row.get('LOINC Etest'),
                    loincslow=row.get('LOINC Slow'),
                    loincafb=row.get('LOINC AFB'),
                    loincsbt=row.get('LOINC SBT'),
                    loincmlc=row.get('LOINC MLC'),
                    comments=row.get('Comments')
                )
                session.add(antibiotic)
                session.flush()  # Get the generated UID
                antibiotics[antibiotic_name] = antibiotic.uid

        # --- Import AbxAntibioticGuideline ---
        for _, row in df.iterrows():
            antibiotic_name = row['Antibiotic']
            guideline_name = row['Guideline']

            if antibiotic_name and guideline_name and antibiotic_name in antibiotics and guideline_name in guidelines:  # Check if name is not empty and in dict
                abx_antibiotic_guideline = AbxAntibioticGuideline(
                    antibiotic_uid=antibiotics[antibiotic_name],
                    guideline_uid=guidelines[guideline_name]
                )
                session.add(abx_antibiotic_guideline)

        session.commit()
        print("Data imported successfully!")

    except Exception as e:
        session.rollback()
        print(f"An error occurred: {e}")
    finally:
        session.close()

# Example usage (assuming you have a SQLAlchemy session available)
# with Session(engine) as session:
#     import_antibiotic_data("path/to/your/file.txt", session)
