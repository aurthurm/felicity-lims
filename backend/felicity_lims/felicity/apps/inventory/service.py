from felicity.apps.inventory import repository


class StockItemService:
    repository = repository.StockItemRepository


class StockCategoryService:
    repository = repository.StockCategoryRepository


class HazardService:
    repository = repository.HazardRepository


class StockUnitService:
    repository = repository.StockUnitRepository


class StockPackagingService:
    repository = repository.StockPackagingRepository


class StockProductService:
    repository = repository.StockProductRepository


class StockOrderService:
    repository = repository.StockOrderRepository


class StockOrderProductService:
    repository = repository.StockOrderProductRepository


class StockTransactionService:
    repository = repository.StockTransactionRepository


class StockAdjustmentService:
    repository = repository.StockAdjustmentRepository
