from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.setup.entities import Country, District, Province


class CountryRepository(BaseRepository[Country]):
    def __init__(self) -> None:
        super().__init__(Country)


class ProvinceRepository(BaseRepository[Province]):
    def __init__(self) -> None:
        super().__init__(Province)


class DistrictRepository(BaseRepository[District]):
    def __init__(self) -> None:
        super().__init__(District)
