import logging
from datetime import datetime
from typing import List

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info, verify_user_auth
from felicity.api.gql.inventory import types
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.inventory import models, schemas
from felicity.apps.inventory.conf import order_states, Adjust

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

StockItemResponse = strawberry.union(
    "StockItemResponse", (types.StockItemType, OperationError), description=""  # noqa
)


@strawberry.input
class StockItemInputType:
    name: str
    description: str
    category_uid: str | None = None
    hazard_uid: str | None = None
    maximum_level: int | None = None
    minimum_level: int | None = None


StockItemVariantResponse = strawberry.union(
    "StockItemVariantResponse", (types.StockItemVariantType, OperationError), description=""  # noqa
)


@strawberry.input
class StockItemVariantInputType:
    name: str
    description: str
    maximum_level: int | None = None
    minimum_level: int | None = None


StockCategoryResponse = strawberry.union(
    "StockCategoryResponse",
    (types.StockCategoryType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StockCategoryInputType:
    name: str
    description: str


HazardResponse = strawberry.union(
    "HazardResponse", (types.HazardType, OperationError), description=""  # noqa
)


@strawberry.input
class HazardInputType:
    name: str
    description: str


StockUnitResponse = strawberry.union(
    "StockUnitResponse", (types.StockUnitType, OperationError), description=""  # noqa
)


@strawberry.input
class StockUnitInputType:
    name: str


@strawberry.input
class StockReceiptInputType:
    product_uid: str
    lot_number: str
    unit_price: float | None = None
    total_price: float | None = None
    supplier_uid: str
    unit_uid: str
    singles_received: int
    packages_received: int
    package_factor: int
    quantity_received: int
    receipt_type: str
    receipt_by_uid: str
    receipt_date: datetime | None
    expiry_date: datetime | None


StockReceiptResponse = strawberry.union(
    "StockReceiptResponse",
    (types.StockReceiptType, OperationError),
    description="",  # noqa
)


@strawberry.type
class StockOrderLineType:
    stock_order: types.StockOrderType
    order_products: List[types.StockOrderProductType]


StockOrderResponse = strawberry.union(
    "StockOrderResponse",
    (StockOrderLineType, types.StockOrderType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StockOrderProductLineInputType:
    product_uid: str
    stock_lot_uid: str
    quantity: int
    price: float = 0.0
    remarks: str | None = None


@strawberry.input
class StockOrderInputType:
    order_products: List[StockOrderProductLineInputType]
    department_uid: str | None = None


@strawberry.input
class StockOrderApprovalInputType:
    remarks: str
    status: str


StockTransactionResponse = strawberry.union(
    "StockTransactionResponse",
    (types.StockTransactionType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StockTransactionInputType:
    product_uid: str
    issued: int
    issued_to_uid: str
    department_uid: str | None = None


StockAdjustmentResponse = strawberry.union(
    "StockAdjustmentResponse",
    (types.StockAdjustmentType, OperationError),
    description="",  # noqa
)


@strawberry.input
class StockAdjustmentInputType:
    product_uid: str
    stock_lot_uid: str
    adjustment_type: str
    adjust: int
    remarks: str | None = None


@strawberry.type
class InventoryMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_stock_item(
            self, info, payload: StockItemInputType
    ) -> StockItemResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create stock item",
        )
        if not auth_success:
            return auth_error

        exists = await models.StockItem.get(name=payload.name)
        if exists:
            return OperationError(error="StockItem with this name already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StockItemCreate(**incoming)
        stock_item: models.StockItem = await models.StockItem.create(obj_in)
        # Add default variant
        if stock_item:
            variant_in = schemas.StockItemVariantCreate(
                name=stock_item.name,
                description=stock_item.description,
                stock_item_uid=stock_item.uid,
                maximum_level=stock_item.maximum_level,
                minimum_level=stock_item.minimum_level,
            )
            await models.StockItemVariant.create(variant_in)
        return types.StockItemType(**stock_item.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_stock_item(
            self, info, uid: str, payload: StockItemInputType
    ) -> StockItemResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update stock item",
        )

        if not uid:
            return OperationError(error="No uid provided to identity update obj.")

        stock_item: models.StockItem = await models.StockItem.get(uid=uid)
        if not stock_item:
            return OperationError(
                error=f"StockItem with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = stock_item.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(stock_item, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(stock_item, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.StockItemUpdate(**stock_item.to_dict())
        stock_item = await stock_item.update(obj_in)
        return types.StockItemType(**stock_item.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_stock_item_variant(
            self, info, stock_item_uid: str, payload: StockItemVariantInputType
    ) -> StockItemVariantResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create stock item variant",
        )
        if not auth_success:
            return auth_error

        exists = await models.StockItem.get(uid=stock_item_uid)
        if not exists:
            return OperationError(error=f"StockItem with uid {stock_item_uid} does not exist")

        incoming: dict = {
            "stock_item_uid": exists.uid,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StockItemVariantCreate(**incoming)
        stock_item_variant = await models.StockItemVariant.create(obj_in)
        return types.StockItemVariantType(**stock_item_variant.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_stock_item_variant(
            self, info, uid: str, payload: StockItemVariantInputType
    ) -> StockItemVariantResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update stock item variant",
        )

        if not uid:
            return OperationError(error="No uid provided to identity update obj.")

        stock_item_variant = await models.StockItemVariant.get(uid=uid)
        if not stock_item_variant:
            return OperationError(
                error=f"Stock Item variant with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = stock_item_variant.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(stock_item_variant, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(stock_item_variant, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.StockItemVariantUpdate(**stock_item_variant.to_dict())
        stock_item_variant = await stock_item_variant.update(obj_in)
        return types.StockItemVariantType(**stock_item_variant.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_stock_category(
            self, info, payload: StockCategoryInputType
    ) -> StockCategoryResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create stock categories",
        )
        if not auth_success:
            return auth_error

        exists = await models.StockCategory.get(name=payload.name)
        if exists:
            return OperationError(error="StockCategory with this name already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StockCategoryCreate(**incoming)
        stock_category: models.StockCategory = await models.StockCategory.create(obj_in)
        return types.StockCategoryType(**stock_category.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_stock_category(
            self, info, uid: str, payload: StockCategoryInputType
    ) -> StockCategoryResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update stock category",
        )

        if not uid:
            return OperationError(
                error="No uid provided to identity update stock category"
            )

        stock_category: models.StockCategory = await models.StockCategory.get(uid=uid)
        if not stock_category:
            return OperationError(
                error=f"StockCategory with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = stock_category.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(stock_category, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(stock_category, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.StockCategoryUpdate(**stock_category.to_dict())
        stock_category = await stock_category.update(obj_in)
        return types.StockCategoryType(**stock_category.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_hazard(self, info, payload: HazardInputType) -> HazardResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create hazard",
        )
        if not auth_success:
            return auth_error

        exists = await models.Hazard.get(name=payload.name)
        if exists:
            return OperationError(error="Hazard with this name already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.HazardCreate(**incoming)
        hazard: models.Hazard = await models.Hazard.create(obj_in)
        return types.HazardType(**hazard.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_hazard(
            self, info, uid: str, payload: HazardInputType
    ) -> HazardResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update hazard",
        )

        if not uid:
            return OperationError(error="No uid provided to identity update hazard")

        hazard: models.Hazard = await models.Hazard.get(uid=uid)
        if not hazard:
            return OperationError(
                error=f"Hazard with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = hazard.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(hazard, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(hazard, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.HazardUpdate(**hazard.to_dict())
        hazard = await hazard.update(obj_in)
        return types.HazardType(**hazard.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_stock_unit(
            self, info, payload: StockUnitInputType
    ) -> StockUnitResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create stock_unit",
        )
        if not auth_success:
            return auth_error

        exists = await models.StockUnit.get(name=payload.name)
        if exists:
            return OperationError(error="StockUnit with this name already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StockUnitCreate(**incoming)
        stock_unit: models.StockUnit = await models.StockUnit.create(obj_in)
        return types.StockUnitType(**stock_unit.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_stock_unit(
            self, info, uid: str, payload: StockUnitInputType
    ) -> StockUnitResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update stock_unit",
        )

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        stock_unit: models.StockUnit = await models.StockUnit.get(uid=uid)
        if not stock_unit:
            return OperationError(
                error=f"StockUnit with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = stock_unit.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(stock_unit, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(stock_unit, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.StockUnitUpdate(**stock_unit.to_dict())
        stock_unit = await stock_unit.update(obj_in)
        return types.StockUnitType(**stock_unit.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_stock_receipt(
            self, info, payload: StockReceiptInputType
    ) -> StockItemVariantResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can receive products",
        )
        if not auth_success:
            return auth_error

        stock_lot = await models.StockLot.get(product_uid=payload.product_uid, lot_number=payload.lot_number)
        if not stock_lot:
            stock_lot = await models.StockLot.create({
                "product_uid": payload.product_uid,
                "lot_number": payload.lot_number,
                "expiry_date": payload.expiry_date
            })
        else:
            await stock_lot.update({"expiry_date": payload.expiry_date})

        incoming: dict = {
            "receipt_date": payload.receipt_date,
            "expiry_date": payload.expiry_date,
            "stock_lot_uid": stock_lot.uid,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        for k, v in payload.__dict__.items():
            incoming[k] = v

        quantity_received = payload.quantity_received
        assert quantity_received > 0
        if payload.packages_received and payload.package_factor:
            if quantity_received != payload.packages_received * payload.package_factor:
                quantity_received = payload.packages_received * payload.package_factor

        incoming["quantity_received"] = quantity_received

        obj_in = schemas.StockReceiptCreate(**incoming)
        await models.StockReceipt.create(obj_in)

        # update StockProductInventory and  StockLot
        inventory = await models.StockProductInventory.get(
            product_uid=payload.product_uid, stock_lot_uid=stock_lot.uid
        )
        if not inventory:
            await models.StockProductInventory.create({
                "product_uid": payload.product_uid,
                "stock_lot_uid": stock_lot.uid,
                "quantity": quantity_received
            })
        else:
            await inventory.update({
                "quantity": inventory.quantity + quantity_received
            })

        # Record the adjustment
        adjustment = schemas.StockAdjustmentCreate(**{
            "product_uid": payload.product_uid,
            "lot_number": payload.lot_number,
            "adjustment_type": payload.receipt_type,
            "adjust": quantity_received,
            "adjustment_date": datetime.now(),
            "remarks": "",
            "adjustment_by_uid": felicity_user.uid
        })
        await models.StockAdjustment.create(adjustment)

        stock_item_variant = await models.StockItemVariant.get(uid=payload.product_uid)
        return types.StockItemVariantType(**stock_item_variant.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_stock_order(
            self, info, payload: StockOrderInputType
    ) -> StockOrderResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create stock_order",
        )
        if not auth_success:
            return auth_error

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "order_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StockOrderCreate(**incoming)
        stock_order: models.StockOrder = await models.StockOrder.create(obj_in)

        # create Order Products
        for prod in payload.order_products:
            op_in = schemas.StockOrderProductCreate(
                product_uid=prod.product_uid,
                stock_lot_uid=prod.stock_lot_uid,
                order_uid=stock_order.uid,
                quantity=prod.quantity,
            )
            await models.StockOrderProduct.create(op_in)

        order_products = await models.StockOrderProduct.get_all(
            order_uid=stock_order.uid
        )

        return StockOrderLineType(
            stock_order=stock_order, order_products=order_products
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_stock_order(
            self, info, uid: str, payload: StockOrderInputType
    ) -> StockOrderResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create stock_order",
        )
        if not auth_success:
            return auth_error

        stock_order: models.StockOrder = await models.StockOrder.get(uid=uid)
        if stock_order.status != order_states.PREPARATION:
            return OperationError(
                error="You can only update a StockOrder under preparation"
            )

        obj_in = schemas.StockOrderUpdate(
            **{
                "department_uid": payload.department_uid,
                "order_by_uid": felicity_user.uid,
            }
        )
        await stock_order.update(obj_in)

        # add Order Products
        old_products = await models.StockOrderProduct.get_all(order_uid=uid)
        _pr_uids = [p.product_uid for p in old_products]
        for prod in payload.order_products:
            # New product
            if prod.product_uid not in _pr_uids:
                op_in = schemas.StockOrderProductCreate(
                    product_uid=prod.product_uid,
                    stock_lot_uid=prod.stock_lot_uid,
                    order_uid=uid,
                    quantity=prod.quantity,
                )
                await models.StockOrderProduct.create(op_in)
            else:  # update existing products
                so_product = await models.StockOrderProduct.get(
                    product_uid=prod.product_uid, order_uid=uid
                )
                await so_product.update({"quantity": prod.quantity})

        # delete removed products
        order_products_uids = [p.product_uid for p in payload.order_products]
        for _op in old_products:
            if _op.product_uid not in order_products_uids:
                await _op.delete()

        # re-fetch updated
        o_products = await models.StockOrderProduct.get_all(order_uid=uid)
        stock_order = await models.StockOrder.get(uid=uid)

        return StockOrderLineType(stock_order=stock_order, order_products=o_products)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def submit_stock_order(self, info, uid: str) -> StockOrderResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can submit stock orders",
        )
        if not auth_success:
            return auth_error

        stock_order: models.StockOrder = await models.StockOrder.get(uid=uid)
        if stock_order.status not in [order_states.PREPARATION]:
            return OperationError(
                error="You can only submit a StockOrder under preperation"
            )

        stock_order = await stock_order.update(
            {"status": order_states.SUBMITTED}
        )  # noqa
        return types.StockOrderType(**stock_order.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def approve_stock_order(
            self, info, uid: str, payload: StockOrderApprovalInputType
    ) -> StockOrderResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can approve stock orders",
        )
        if not auth_success:
            return auth_error

        stock_order: models.StockOrder = await models.StockOrder.get(uid=uid)
        if stock_order.status not in [order_states.SUBMITTED]:
            return OperationError(
                error="You can only approve/revert a submitted StockOrder"
            )

        stock_order = await stock_order.update(
            {"status": payload.status, "remarks": payload.remarks}
        )  # noqa
        return types.StockOrderType(**stock_order.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def issue_stock_order(
            self, info, uid: str, payload: List[StockOrderProductLineInputType]
    ) -> StockOrderResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can delete stock orders",
        )
        if not auth_success:
            return auth_error

        stock_order: models.StockOrder = await models.StockOrder.get(uid=uid)
        if stock_order.status not in [order_states.PENDING, order_states.SUBMITTED]:
            return OperationError(error="You can only issue a pending StockOrder")

        # issuance
        for order_p in payload:
            adjust_in = {
                "adjustment_type": Adjust.ISSUE,
                "adjustment_date": datetime.now(),
                "product_uid": order_p.product_uid,
                "department_uid": stock_order.department_uid,
                "adjustment_by_uid": felicity_user.uid,
                "adjustment_for_uid": stock_order.order_by_uid,
                "remarks": "issue out stock",
                "created_by_uid": felicity_user.uid,
                "updated_by_uid": felicity_user.uid,
            }
            base_adjustment = schemas.StockAdjustmentCreate(**adjust_in)

            inventories = await models.StockProductInventory.get_all(
                product_uid=order_p.product_uid,
                quantity__gt=0
            )
            if len(inventories) == 0:
                return OperationError(
                    error=f"No inventory found for this product {order_p.product_uid}"
                )

            _data = []
            for inv in inventories:
                _data.append({
                    "uid": inv.uid,
                    "product_uid": inv.product_uid,
                    "quantity": inv.quantity,
                    "expiry": inv.stock_lot.expiry_date,
                    "lot_number": inv.stock_lot.lot_number,
                })

            _data = sorted(_data, key=lambda x: x['expiry'])

            issued = 0
            remaining = order_p.quantity
            for item in _data:
                stock_inventory = await models.StockProductInventory.get(uid=item.get("uid"))
                if item.get("quantity") >= remaining:
                    adjustment = base_adjustment.model_copy(update={
                        "adjust": remaining,
                        "lot_number": item.get("lot_number")
                    })
                    await models.StockAdjustment.create(adjustment)
                    await stock_inventory.update({
                        "quantity": stock_inventory.quantity - remaining
                    })
                    issued += remaining
                    remaining -= remaining
                else:
                    adjustment = base_adjustment.model_copy(update={
                        "adjust": stock_inventory.quantity,
                        "lot_number": item.get("lot_number")
                    })
                    await models.StockAdjustment.create(adjustment)
                    await stock_inventory.update({
                        "quantity": 0
                    })
                    issued += stock_inventory.quantity
                    remaining -= stock_inventory.quantity

                if remaining == 0:
                    assert issued == order_p.quantity
                    break

        stock_order = await stock_order.update(
            {"status": order_states.PROCESSED, "remarks": ""}
        )  # noqa
        o_products = await models.StockOrderProduct.get_all(order_uid=uid)
        return StockOrderLineType(stock_order=stock_order, order_products=o_products)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_stock_order(self, info, uid: str) -> StockOrderResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can delete stock orders",
        )
        if not auth_success:
            return auth_error

        stock_order: models.StockOrder = await models.StockOrder.get(uid=uid)
        if stock_order.status != order_states.PREPARATION:
            return OperationError(
                error="You can only delete a StockOrder under preparation"
            )

        order_products = await models.StockOrderProduct.get_all(
            order_uid=stock_order.uid
        )
        for op in order_products:
            await op.delete()

        await stock_order.delete()
        return types.StockOrderType(**stock_order.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_stock_adjustment(
            self, info, payload: StockAdjustmentInputType
    ) -> StockAdjustmentResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create stock_adjustment",
        )
        if not auth_success:
            return auth_error

        if payload.adjustment_type in [Adjust.PURCHASE, Adjust.TRANSFER_IN, Adjust.PUSHED]:
            return OperationError(
                error="Use Stock Receipt to make this adjustment"
            )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "adjustment_by_uid": felicity_user.uid,
            "adjustment_date": datetime.now(),
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.StockAdjustmentCreate(**incoming)
        stock_adjustment = await models.StockAdjustment.create(
            obj_in
        )

        inventory = await models.StockProductInventory.get(
            product_uid=payload.product_uid, stock_lot_uid=payload.stock_lot_uid
        )

        remaining = inventory.quantity - stock_adjustment.adjust
        if remaining < 0:
            await stock_adjustment.update(
                {"remarks": "Sustained: Sorry you cant adjust beyond what you have"}
            )  # noqa
            return OperationError(
                error="Sorry you cant adjust beyond what you have"
            )
        else:
            await inventory.update({"quantity": remaining})

        return types.StockAdjustmentType(**stock_adjustment.marshal_simple())
