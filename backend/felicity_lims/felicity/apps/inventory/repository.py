from felicity.apps.inventory import entities
from felicity.apps.inventory import schemas


class StockItemRepository(entities.StockItem):

    @classmethod
    async def create(cls, obj_in: schemas.StockItemCreate) -> schemas.StockItem:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockItemUpdate) -> schemas.StockItem:
        data = self._import(obj_in)
        return await super().update(**data)


class StockCategoryRepository(entities.StockCategory):

    @classmethod
    async def create(cls, obj_in: schemas.StockCategoryCreate) -> schemas.StockCategory:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockCategoryUpdate) -> schemas.StockCategory:
        data = self._import(obj_in)
        return await super().update(**data)


class HazardRepository(entities.Hazard):

    @classmethod
    async def create(cls, obj_in: schemas.HazardCreate) -> schemas.Hazard:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.HazardUpdate) -> schemas.Hazard:
        data = self._import(obj_in)
        return await super().update(**data)


class StockUnitRepository(entities.StockUnit):

    @classmethod
    async def create(cls, obj_in: schemas.StockUnitCreate) -> schemas.StockUnit:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockUnitUpdate) -> schemas.StockUnit:
        data = self._import(obj_in)
        return await super().update(**data)


class StockPackagingRepository(entities.StockPackaging):

    @classmethod
    async def create(cls, obj_in: schemas.StockPackagingCreate) -> schemas.StockPackaging:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockPackagingUpdate) -> schemas.StockPackaging:
        data = self._import(obj_in)
        return await super().update(**data)


class StockProductRepository(entities.StockProduct):

    @classmethod
    async def create(cls, obj_in: schemas.StockProductCreate) -> schemas.StockProduct:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockProductUpdate) -> schemas.StockProduct:
        data = self._import(obj_in)
        return await super().update(**data)


class StockOrderRepository(entities.StockOrder):

    @classmethod
    async def create(cls, obj_in: schemas.StockOrderCreate) -> schemas.StockOrder:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockOrderUpdate) -> schemas.StockOrder:
        data = self._import(obj_in)
        return await super().update(**data)


class StockOrderProductRepository(entities.StockOrderProduct):

    @classmethod
    async def create(cls, obj_in: schemas.StockOrderProductCreate) -> schemas.StockOrderProduct:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockOrderProductUpdate) -> schemas.StockOrderProduct:
        data = self._import(obj_in)
        return await super().update(**data)


class StockTransactionRepository(entities.StockTransaction):

    @classmethod
    async def create(cls, obj_in: schemas.StockTransactionCreate) -> schemas.StockTransaction:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockTransactionUpdate) -> schemas.StockTransaction:
        data = self._import(obj_in)
        return await super().update(**data)


class StockAdjustmentRepository(entities.StockAdjustment):

    @classmethod
    async def create(cls, obj_in: schemas.StockAdjustmentCreate) -> schemas.StockAdjustment:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockAdjustmentUpdate) -> schemas.StockAdjustment:
        data = self._import(obj_in)
        return await super().update(**data)
