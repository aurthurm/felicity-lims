from beak.modules.core.abstract.repository import BaseRepository
from beak.modules.core.setup.entities import Country, District, Province


class CountryRepository(BaseRepository[Country]):
    def __init__(self) -> None:
        super().__init__(Country)


class ProvinceRepository(BaseRepository[Province]):
    def __init__(self) -> None:
        super().__init__(Province)


class DistrictRepository(BaseRepository[District]):
    def __init__(self) -> None:
        super().__init__(District)
