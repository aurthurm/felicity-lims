
from felicity.apps.setup.entities import Country, Province, District
from felicity.apps.abstract.repository import BaseRepository


class CountryRepository(BaseRepository[Country]):
    def __init__(self) -> None:
        super().__init__(Country)


class ProvinceRepository(BaseRepository[Province]):
    def __init__(self) -> None:
        super().__init__(Province)


class DistrictRepository(BaseRepository[District]):
    def __init__(self) -> None:
        super().__init__(District)
