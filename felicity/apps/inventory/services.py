from datetime import datetime, timedelta

from domain.exceptions import *
from domain.inventory.conf import OrderStates
from domain.inventory.ports import StockOrderProductLineIn
from domain.inventory.ports.repository import (
    IStockItemRepository,
    IStockOrderRepository,
    IStockAdjustmentRepository,
    IStockTransactionRepository,
    IStockOrderProductRepository,
    IStockProductRepository,
    IStockPackagingRepository,
    IStockUnitRepository,
    IHazardRepository,
    IStockCategoryRepository,
)
from domain.inventory.ports.service import (
    IStockItemService,
    IStockCategoryService,
    IHazardService,
    IStockUnitService,
    IStockPackagingService,
    IStockProductService,
    IStockOrderProductService,
    IStockTransactionService,
    IStockAdjustmentService,
    IStockOrderService,
)
from domain.inventory.schemas import (
    StockItem,
    StockCategory,
    Hazard,
    StockUnit,
    StockPackaging,
    StockProduct,
    StockOrderProduct,
    StockTransaction,
    StockAdjustment,
    StockOrder,
    StockItemCreate,
    StockItemUpdate,
    StockTransactionCreate,
    StockOrderUpdate,
    StockOrderProductCreate,
    StockOrderCreate,
    StockAdjustmentCreate,
    StockProductCreate,
    StockProductUpdate,
    StockPackagingCreate,
    StockPackagingUpdate,
    StockUnitCreate,
    StockUnitUpdate,
    HazardCreate,
    HazardUpdate,
    StockCategoryCreate,
    StockCategoryUpdate,
)
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.schemas import User


class StockItemService(BaseService[StockItem], IStockItemService):
    def __init__(self, repository: IStockItemRepository):
        self.repository = repository

    async def create(
        self,
        name: str,
        description: str,
        department_uid: str | None,
        maximum_level: int | None,
        minimum_level: int | None,
        user: User,
    ) -> StockItem:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError("StockItem with this name already exists")

        incoming: dict = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = StockItemCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        name: str,
        description: str,
        department_uid: str | None,
        maximum_level: int | None,
        minimum_level: int | None,
        user: User,
    ) -> StockItem:
        payload = locals()

        stock_item = await self.get(uid=uid)
        obj_data = marshal(stock_item)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(stock_item, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(stock_item, "updated_by_uid", user.uid)

        obj_in = StockItemUpdate(**marshal(stock_item))
        return await super().update(stock_item, **marshal(obj_in))


class StockCategoryService(BaseService[StockCategory], IStockCategoryService):
    def __init__(self, repository: IStockCategoryRepository):
        self.repository = repository

    async def create(self, name: str, description: str, user: User) -> StockCategory:
        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError("StockCategory with this name already exists")

        incoming: dict = {
            "name": name,
            "description": description,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        obj_in = StockCategoryCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self, uid: str, name: str, description: str, user: User
    ) -> StockCategory:

        stock_category = await self.get(uid=uid)
        if not stock_category:
            raise AlreadyExistsError(
                f"StockCategory with uid {uid} not found. Cannot update obj ..."
            )

        setattr(stock_category, "description", description)
        setattr(stock_category, "name", name)
        setattr(stock_category, "updated_by_uid", user.uid)

        obj_in = StockCategoryUpdate(**stock_category.to_dict())
        return await super().update(stock_category, **marshal(obj_in))


class HazardService(BaseService[Hazard], IHazardService):
    def __init__(self, repository: IHazardRepository):
        self.repository = repository

    async def create(self, name: str, description: str, user: User) -> Hazard:
        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError("Hazard with this name already exists")

        incoming: dict = {
            "name": name,
            "description": description,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        obj_in = HazardCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(self, uid: str, name: str, description: str, user: User) -> Hazard:
        hazard = await self.get(uid=uid)

        setattr(hazard, "name", name)
        setattr(hazard, "description", description)
        setattr(hazard, "updated_by_uid", user.uid)

        obj_in = HazardUpdate(**marshal(hazard))
        return await super().update(hazard, **marshal(obj_in))


class StockUnitService(BaseService[StockUnit], IStockUnitService):
    def __int__(self, repository: IStockUnitRepository):
        self.repository = repository

    async def create(self, name: str, user: User) -> StockUnit:
        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError("StockUnit with this name already exists")

        incoming: dict = {
            "name": name,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        obj_in = StockUnitCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(self, uid: str, name: str, user: User) -> StockUnit:
        stock_unit = await self.get(uid=uid)

        setattr(stock_unit, "name", name)
        setattr(stock_unit, "updated_by_uid", user.uid)

        obj_in = StockUnitUpdate(**marshal(stock_unit))
        return await super().update(**marshal(obj_in))


class StockPackagingService(BaseService[StockPackaging], IStockPackagingService):
    def __init__(self, repository: IStockPackagingRepository):
        self.repository = repository

    async def create(self, name: str, user: User) -> StockPackaging:
        incoming: dict = {
            "name": name,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        obj_in = StockPackagingCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(self, uid: str, name: str, user: User) -> StockPackaging:
        stock_packaging = await self.get(uid=uid)

        setattr(stock_packaging, "name", name)
        setattr(stock_packaging, "updated_by_uid", user.uid)

        obj_in = StockPackagingUpdate(**marshal(stock_packaging))
        return await super().update(stock_packaging, **marshal(obj_in))


class StockProductService(BaseService[StockProduct], IStockProductService):
    def __init__(self, repository: IStockProductRepository):
        self.repository = repository

    async def create(
        self,
        name: str,
        stock_item_uid: str | None,
        department_uid: str | None,
        supplier_uid: str | None,
        category_uid: str | None,
        hazard_uid: str | None,
        store_room_uid: str | None,
        lot_number: str | None,
        batch: str | None,
        size: int | None,
        unit_uid: str | None,
        packaging_uid: str | None,
        price: int | None,
        quantity_received: int | None,
        date_received: datetime | None,
        expiry_date: datetime | None,
        received_by_uid: str | None,
        user: User,
    ) -> StockProduct:
        payload = locals()

        incoming: dict = {
            "date_received": datetime.today(),
            "expiry_date": datetime.today() + timedelta(days=10),
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v
        incoming["remaining"] = quantity_received

        obj_in = StockProductCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        name: str,
        stock_item_uid: str | None,
        department_uid: str | None,
        supplier_uid: str | None,
        category_uid: str | None,
        hazard_uid: str | None,
        store_room_uid: str | None,
        lot_number: str | None,
        batch: str | None,
        size: int | None,
        unit_uid: str | None,
        packaging_uid: str | None,
        price: int | None,
        quantity_received: int | None,
        date_received: datetime | None,
        expiry_date: datetime | None,
        received_by_uid: str | None,
        user: User,
    ) -> StockProduct:
        payload = locals()

        stock_product = await self.get(uid=uid)

        obj_data = marshal(stock_product)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(stock_product, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(stock_product, "updated_by_uid", user.uid)

        obj_in = StockProductUpdate(**marshal(stock_product))
        return await super().update(stock_product, **marshal(obj_in))


class StockOrderProductService(
    BaseService[StockOrderProduct], IStockOrderProductService
):
    def __init__(self, repository: IStockOrderProductRepository):
        self.repository = repository


class StockTransactionService(BaseService[StockTransaction], IStockTransactionService):
    def __init__(
        self,
        repository: IStockTransactionRepository,
        stock_product_service: IStockProductService,
    ):
        self.repository = repository
        self.stock_product_service = stock_product_service

    async def create(
        self,
        product_uid: str,
        issued: int,
        issued_to_uid: str,
        department_uid: str | None,
        user: User,
    ) -> StockTransaction:

        incoming: dict = {
            "product_uid": product_uid,
            "issued": issued,
            "issued_to_uid": issued_to_uid,
            "department_uid": department_uid,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
            "transaction_by_uid": user.uid,
            "date_issued": datetime.now(),
        }

        obj_in = StockTransactionCreate(**incoming)
        stock_transaction = await super().create(**marshal(obj_in))

        product = await self.stock_product_service.get(
            uid=stock_transaction.product_uid
        )

        # Transact
        remaining = product.remaining - stock_transaction.issued
        if remaining < 0:
            await super().update(
                stock_transaction,
                **{
                    "remarks": "Sustained: Sorry you cannot issue beyond whats available"
                },
            )
            raise NotAllowedError("Sorry you cannot issue beyond whats available")
        else:
            await self.stock_product_service.update(product, **{"remaining": remaining})

        return stock_transaction


class StockAdjustmentService(BaseService[StockAdjustment], IStockAdjustmentService):
    def __init__(
        self,
        repository: IStockAdjustmentRepository,
        stock_product_service: IStockProductService,
    ):
        self.repository = repository
        self.stock_product_service = stock_product_service

    async def create(
        self,
        product_uid: str,
        adjustment_type: str,
        adjust: int,
        remarks: str | None,
        user: User,
    ) -> StockAdjustment:
        incoming: dict = {
            "product_uid": product_uid,
            "adjustment_type": adjustment_type,
            "adjust": adjust,
            "remarks": remarks,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
            "adjustment_by_uid": user.uid,
            "adjustment_date": datetime.now(),
        }

        obj_in = StockAdjustmentCreate(**incoming)
        stock_adjustment = await super().create(**marshal(obj_in))

        product = await self.stock_product_service.get(uid=stock_adjustment.product_uid)

        # Adjust
        if stock_adjustment.adjustment_type == "transfer-in":
            remaining = product.remaining + stock_adjustment.adjust
            await product.update({"remaining": remaining})
        else:
            remaining = product.remaining - stock_adjustment.adjust
            if remaining < 0:
                await stock_adjustment.update(
                    {"remarks": "Sustained: Sorry you cant adjust beyond what you have"}
                )  # noqa
                raise NotAllowedError("Sorry you cant adjust beyond what you have")
            else:
                await self.stock_product_service.update(
                    product, **{"remaining": remaining}
                )

        return stock_adjustment


class StockOrderService(BaseService[StockOrder], IStockOrderService):
    def __init__(
        self,
        repository: IStockOrderRepository,
        stock_product_service: IStockProductService,
        stock_order_product_service: IStockOrderProductService,
        stock_transaction_service: IStockTransactionService,
    ):
        self.repository = repository
        self.stock_product_service = stock_product_service
        self.stock_order_product_service = stock_order_product_service
        self.stock_transaction_service = stock_transaction_service

    async def create(
        self,
        order_products: list[StockOrderProductLineIn],
        department_uid: str | None,
        user: User,
    ) -> tuple[StockOrder, list[StockOrderProduct]]:

        incoming: dict = {
            "status": OrderStates.PREPARATION,
            "order_number": (await self.id_sequence_service.get_next_number("SON"))[1],
            "department_uid": department_uid,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
            "order_by_uid": user.uid,
        }

        obj_in = StockOrderCreate(**incoming)
        stock_order = await super().create(**marshal(obj_in))

        # create Order Products
        for prod in order_products:
            product = await self.stock_product_service.get(uid=prod.get("product_uid"))
            op_in = StockOrderProductCreate(
                product_uid=prod.get("product_uid"),
                order_uid=stock_order.uid,
                price=product.price,
                quantity=prod.get("quantity"),
            )
            await self.stock_order_product_service.create(**marshal(op_in))

        order_products = await self.stock_order_product_service.get_all(
            order_uid=stock_order.uid
        )

        return stock_order, order_products

    async def update(
        self,
        uid: str,
        order_products: list[StockOrderProductLineIn],
        department_uid: str | None,
        user: User,
    ) -> tuple[StockOrder, list[StockProduct]]:

        stock_order = await self.get(uid=uid)
        if stock_order.status != OrderStates.PREPARATION:
            raise NotAllowedError("You can only update a StockOrder under preparation")

        obj_in = StockOrderUpdate(
            **{
                "department_uid": department_uid,
                "order_by_uid": user.uid,
            }
        )
        await super().update(stock_order, **marshal(obj_in))

        # add Order Products
        old_products = await self.stock_order_product_service.get_all(order_uid=uid)
        _pr_uids = [p.product_uid for p in old_products]
        for prod in order_products:
            # New product
            if prod.get("product_uid") not in _pr_uids:
                product = await self.stock_product_service.get(
                    uid=prod.get("product_uid")
                )
                op_in = StockOrderProductCreate(
                    product_uid=prod.get("product_uid"),
                    order_uid=uid,
                    price=product.price,
                    quantity=prod.get("quantity"),
                )
                await self.stock_order_product_service.create(**marshal(op_in))
            else:  # update existing products
                so_product = await self.stock_order_product_service.get(
                    product_uid=prod.get("product_uid"), order_uid=uid
                )
                await self.stock_order_product_service.update(
                    so_product, **{"quantity": prod.get("quantity")}
                )

        # delete removed products
        order_products_uids = [p.get("product_uid") for p in order_products]
        for _op in old_products:
            if _op.product_uid not in order_products_uids:
                await self.repository.delete(_op)

        # re-fetch updated
        o_products = await self.stock_order_product_service.get_all(order_uid=uid)
        stock_order = await self.get(uid=uid)

        return stock_order, o_products

    async def submit(self, info, uid: str) -> StockOrder:

        stock_order = await self.get(uid=uid)
        if stock_order.status not in [OrderStates.PREPARATION]:
            raise NotAllowedError("You can only submit a StockOrder under preperation")

        return await super().update(stock_order, **{"status": OrderStates.SUBMITTED})

    async def approve(self, uid: str, remarks: str, status: str) -> StockOrder:

        stock_order = await self.get(uid=uid)
        if stock_order.status not in [OrderStates.SUBMITTED]:
            raise NotAllowedError("You can only approve/revert a submitted StockOrder")

        return await super().update(
            stock_order, **{"status": status, "remarks": remarks}
        )

    async def issue(
        self, uid: str, payload: list[StockOrderProductLineIn], user: User
    ) -> tuple[StockOrder, list[StockProduct]]:

        stock_order = await self.get(uid=uid)
        if stock_order.status not in [OrderStates.PENDING, OrderStates.SUBMITTED]:
            raise NotAllowedError("You can only issue a pending StockOrder")

        # issuance
        for order_p in payload:
            # init transaction
            incoming: dict = {
                "created_by_uid": user.uid,
                "updated_by_uid": user.uid,
                "date_issued": datetime.now(),
                "product_uid": order_p.get("product_uid"),
                "issued": order_p.get("quantity"),
                "issued_to_uid": stock_order.order_by_uid,
                "department_uid": stock_order.department_uid,
                "transaction_by_uid": user.uid,
            }
            obj_in = StockTransactionCreate(**incoming)
            await self.stock_transaction_service.create(**marshal(obj_in))
            #
            product = await self.stock_product_service.get(
                uid=order_p.get("product_uid")
            )
            quantity = product.remaining - order_p.get("quantity")
            if quantity < 0:
                raise NotAllowedError("Sorry you cannot issue beyond whats available")
            else:
                await self.stock_product_service.update(
                    product, **{"remaining": quantity}
                )

        stock_order = await super().update(
            stock_order, **{"status": OrderStates.PROCESSED, "remarks": ""}
        )
        o_products = await self.stock_product_service.get_all(order_uid=uid)
        return stock_order, o_products

    async def delete(self, uid: str) -> str:
        stock_order = await self.get(uid=uid)
        if stock_order.status != OrderStates.PREPARATION:
            raise GenericError("You can only delete a StockOrder under preparation")

        order_products = await self.stock_order_product_service.get_all(
            order_uid=stock_order.uid
        )
        for op in order_products:
            await self.repository.delete(op)

        await self.repository.delete(stock_order)
        return stock_order.uid
