import { defineStore } from 'pinia';

import  useApiUtil  from '@/composables/api_util';

import {
    GetAllHazardsDocument, GetAllHazardsQuery, GetAllHazardsQueryVariables,
    GetAllStockAdjustmentsDocument, GetAllStockAdjustmentsQuery, GetAllStockAdjustmentsQueryVariables,
    GetAllStockCategoriesDocument, GetAllStockCategoriesQuery, GetAllStockCategoriesQueryVariables,
    GetAllStockItemsDocument, GetAllStockItemsQuery, GetAllStockItemsQueryVariables,
    GetAllStockItemVariantsDocument, GetAllStockItemVariantsQuery, GetAllStockItemVariantsQueryVariables,
    GetAllStockOrdersDocument, GetAllStockOrdersQuery, GetAllStockOrdersQueryVariables,
    GetAllStockProductsDocument, GetAllStockProductsQuery, GetAllStockProductsQueryVariables,
    GetAllStockUnitsDocument, GetAllStockUnitsQuery, GetAllStockUnitsQueryVariables,
} from '@/graphql/operations/inventory.queries';

import {
    HazardType,
    StockCategoryType,
    StockUnitType,
    StockItemType,
    StockItemVariantType,
    StockOrderType,
    StockAdjustmentType,
    PageInfo
} from '@/types/gql';

const { withClientQuery } = useApiUtil();

type InventoryStateType = {
    hazards: HazardType[];
    fetchingHazards: boolean;
    categories: StockCategoryType[];
    fetchingCategories: boolean;
    units: StockUnitType[];
    fetchingUnits: boolean;
    products: StockItemVariantType[];
    fetchingProducts: boolean;
    productsPaging: {
        totalCount?: number;
        pageInfo?: PageInfo;
    };
    stockItems: StockItemType[];
    stockItemsPaging: {
        totalCount?: number;
        pageInfo?: PageInfo;
    };
    fetchingItems: boolean;
    adjustments: StockAdjustmentType[];
    adjustmentsPaging: {
        totalCount?: number;
        pageInfo?: PageInfo;
    };
    fetchingAdjustments: boolean;
    basket: any[];
    stockOrders: StockOrderType[];
    fetchingStockOrders: boolean;
    stockOrdersPaging: {
        totalCount?: number;
        pageInfo?: PageInfo;
    };
};

export const useInventoryStore = defineStore('inventory', {
    state: (): InventoryStateType => ({
        hazards: [],
        fetchingHazards: false,
        categories: [],
        fetchingCategories: false,
        units: [],
        fetchingUnits: false,
        products: [],
        fetchingProducts: false,
        productsPaging: {},
        stockItems: [],
        stockItemsPaging: {},
        fetchingItems: false,
        adjustments: [],
        adjustmentsPaging: {},
        fetchingAdjustments: false,
        basket: [],
        stockOrders: [],
        fetchingStockOrders: false,
        stockOrdersPaging: {},
    }),
    getters: {
        getHazards: (state): HazardType[] => state.hazards,
        getCategories: (state): StockCategoryType[] => state.categories,
        getUnits: (state): StockUnitType[] => state.units,
        getProducts: (state): StockItemVariantType[] => state.products,
        getStockItems: (state): StockItemType[] => state.stockItems,
        getAdjustments: (state): StockAdjustmentType[] => state.adjustments,
        getBasket: (state): any[] => state.basket,
        getStockOrders: (state): StockOrderType[] => state.stockOrders,
    },
    actions: {
        // getAll stock Item deps
        async fetchAllDependencies(): Promise<void> {
            try {
                await this.fetchHazards();
                await this.fetchCategories();
                await this.fetchUnits();
            } catch (error) {
                console.error('Error fetching all dependencies:', error);
            }
        },
        // hazards
        async fetchHazards(): Promise<void> {
            try {
                this.fetchingHazards = true;
                const result = await withClientQuery<GetAllHazardsQuery, GetAllHazardsQueryVariables>(
                    GetAllHazardsDocument, 
                    {}, 
                    'hazardAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.hazards = result as HazardType[];
                } else {
                    console.error('Invalid hazards data received:', result);
                }
            } catch (error) {
                console.error('Error fetching hazards:', error);
            } finally {
                this.fetchingHazards = false;
            }
        },
        addHazard(payload: HazardType): void {
            if (!payload?.uid) {
                console.error('Invalid hazard payload:', payload);
                return;
            }
            
            this.hazards.unshift(payload);
        },
        updateHazard(payload: HazardType): void {
            if (!payload?.uid) {
                console.error('Invalid hazard payload:', payload);
                return;
            }
            
            const index = this.hazards.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.hazards[index] = payload;
            }
        },

        // categories
        async fetchCategories(): Promise<void> {
            try {
                this.fetchingCategories = true;
                const result = await withClientQuery<GetAllStockCategoriesQuery, GetAllStockCategoriesQueryVariables>(
                    GetAllStockCategoriesDocument, 
                    {}, 
                    'stockCategoryAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.categories = result as StockCategoryType[];
                } else {
                    console.error('Invalid categories data received:', result);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                this.fetchingCategories = false;
            }
        },
        addCategory(payload: StockCategoryType): void {
            if (!payload?.uid) {
                console.error('Invalid category payload:', payload);
                return;
            }
            
            this.categories.unshift(payload);
        },
        updateCategory(payload: StockCategoryType): void {
            if (!payload?.uid) {
                console.error('Invalid category payload:', payload);
                return;
            }
            
            const index = this.categories.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.categories[index] = payload;
            }
        },

        // units
        async fetchUnits(): Promise<void> {
            try {
                this.fetchingUnits = true;
                const result = await withClientQuery<GetAllStockUnitsQuery, GetAllStockUnitsQueryVariables>(
                    GetAllStockUnitsDocument, 
                    {}, 
                    'stockUnitAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.units = result as StockUnitType[];
                } else {
                    console.error('Invalid units data received:', result);
                }
            } catch (error) {
                console.error('Error fetching units:', error);
            } finally {
                this.fetchingUnits = false;
            }
        },
        addUnit(payload: StockUnitType): void {
            if (!payload?.uid) {
                console.error('Invalid unit payload:', payload);
                return;
            }
            
            this.units.unshift(payload);
        },
        updateUnit(payload: StockUnitType): void {
            if (!payload?.uid) {
                console.error('Invalid unit payload:', payload);
                return;
            }
            
            const index = this.units.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.units[index] = payload;
            }
        },

        // products
        async fetchProducts(params: any): Promise<void> {
            try {
                this.fetchingProducts = true;
                const result = await withClientQuery<GetAllStockProductsQuery, GetAllStockProductsQueryVariables>(
                    GetAllStockProductsDocument, 
                    params, 
                    'stockProductAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.products = result.items as StockItemVariantType[];
                    this.productsPaging.totalCount = result.totalCount;
                    this.productsPaging.pageInfo = result.pageInfo;
                } else {
                    console.error('Invalid products data received:', result);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                this.fetchingProducts = false;
            }
        },
        addStockProduct(payload: StockItemVariantType): void {
            if (!payload?.uid) {
                console.error('Invalid product payload:', payload);
                return;
            }
            
            this.products.unshift(payload);
        },
        updateProduct(payload: StockItemVariantType): void {
            if (!payload?.uid) {
                console.error('Invalid product payload:', payload);
                return;
            }
            
            const index = this.products.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                const old = this.products[index];
                this.products[index] = { ...old, ...payload };
            }
        },

        // stockItems
        async fetchItems(params: any): Promise<void> {
            try {
                this.fetchingItems = true;
                const result = await withClientQuery<GetAllStockItemsQuery, GetAllStockItemsQueryVariables>(
                    GetAllStockItemsDocument, 
                    params, 
                    'stockItemAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.stockItems = result.items || [];
                    this.stockItemsPaging.totalCount = result.totalCount;
                    this.stockItemsPaging.pageInfo = result.pageInfo;
                } else {
                    console.error('Invalid stock items data received:', result);
                }
            } catch (error) {
                console.error('Error fetching stock items:', error);
            } finally {
                this.fetchingItems = false;
            }
        },
        addItem(payload: StockItemType): void {
            if (!payload?.uid) {
                console.error('Invalid stock item payload:', payload);
                return;
            }
            
            this.stockItems.unshift(payload);
        },
        updateItem(payload: StockItemType): void {
            if (!payload?.uid) {
                console.error('Invalid stock item payload:', payload);
                return;
            }
            
            const index = this.stockItems.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.stockItems[index] = payload;
            }
        },
        async fetchItemVariants(stockItemUid: string): Promise<void> {
            if (!stockItemUid) {
                console.error('Invalid stock item UID provided to fetchItemVariants');
                return;
            }
            
            try {
                const result = await withClientQuery<GetAllStockItemVariantsQuery, GetAllStockItemVariantsQueryVariables>(
                    GetAllStockItemVariantsDocument, 
                    { stockItemUid }, 
                    'stockItemVariants'
                );
                
                if (result && Array.isArray(result)) {
                    this.stockItems.forEach(item => {
                        if (item.uid === stockItemUid) {
                            item.variants = result as StockItemVariantType[];
                        }
                    });
                } else {
                    console.error('Invalid stock item variants data received:', result);
                }
            } catch (error) {
                console.error('Error fetching stock item variants:', error);
            }
        },
        addItemVariant(payload: StockItemVariantType): void {
            if (!payload?.uid || !payload?.stockItemUid) {
                console.error('Invalid stock item variant payload:', payload);
                return;
            }
            
            this.stockItems.forEach(item => {
                if (item.uid === payload.stockItemUid) {
                    if (!item.variants) {
                        item.variants = [];
                    }
                    item.variants.unshift(payload);
                }
            });
        },
        updateItemVariant(payload: StockItemVariantType): void {
            if (!payload?.uid || !payload?.stockItemUid) {
                console.error('Invalid stock item variant payload:', payload);
                return;
            }
            
            this.stockItems.forEach(item => {
                if (item.uid === payload.stockItemUid && item.variants) {
                    const index = item.variants.findIndex(v => v.uid === payload.uid);
                    if (index > -1) {
                        item.variants[index] = payload;
                    }
                }
            });
        },

        // stockOrders
        async fetchStockOrders(params: any): Promise<void> {
            try {
                this.fetchingStockOrders = true;
                this.stockOrders = [];
                
                const result = await withClientQuery<GetAllStockOrdersQuery, GetAllStockOrdersQueryVariables>(
                    GetAllStockOrdersDocument, 
                    params, 
                    'stockOrderAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.stockOrders = result.items as StockOrderType[];
                    this.stockOrdersPaging.totalCount = result.totalCount;
                    this.stockOrdersPaging.pageInfo = result.pageInfo;
                } else {
                    console.error('Invalid stock orders data received:', result);
                }
            } catch (error) {
                console.error('Error fetching stock orders:', error);
            } finally {
                this.fetchingStockOrders = false;
            }
        },
        addStockOrder(payload: StockOrderType): void {
            if (!payload?.uid) {
                console.error('Invalid stock order payload:', payload);
                return;
            }
            
            this.stockOrders.unshift(payload);
        },
        updateStockOrder(payload: StockOrderType): void {
            if (!payload?.uid) {
                console.error('Invalid stock order payload:', payload);
                return;
            }
            
            const index = this.stockOrders.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                const old = this.stockOrders[index];
                this.stockOrders[index] = { ...old, ...payload };
            }
        },
        issueStockOrder(payload: { stockOrder: StockOrderType; orderProducts: { product: StockItemVariantType }[] }): void {
            if (!payload?.stockOrder?.uid) {
                console.error('Invalid stock order payload:', payload);
                return;
            }
            
            this.updateStockOrder(payload.stockOrder);
            
            if (payload.orderProducts && Array.isArray(payload.orderProducts)) {
                payload.orderProducts.forEach(op => {
                    if (op.product?.uid) {
                        this.updateProduct(op.product);
                    }
                });
            }
        },

        // adjustments
        async fetchAdjustments(params: any): Promise<void> {
            try {
                this.fetchingAdjustments = true;
                const result = await withClientQuery<GetAllStockAdjustmentsQuery, GetAllStockAdjustmentsQueryVariables>(
                    GetAllStockAdjustmentsDocument, 
                    params, 
                    'stockAdjustmentAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.adjustments = result.items as StockAdjustmentType[];
                    this.adjustmentsPaging.totalCount = result.totalCount;
                    this.adjustmentsPaging.pageInfo = result.pageInfo;
                } else {
                    console.error('Invalid stock adjustments data received:', result);
                }
            } catch (error) {
                console.error('Error fetching stock adjustments:', error);
            } finally {
                this.fetchingAdjustments = false;
            }
        },
        addAdjustment(payload: StockAdjustmentType): void {
            if (!payload?.uid) {
                console.error('Invalid stock adjustment payload:', payload);
                return;
            }
            
            this.adjustments.unshift(payload);
        },
        updateAdjustment(payload: StockAdjustmentType): void {
            if (!payload?.uid) {
                console.error('Invalid stock adjustment payload:', payload);
                return;
            }
            
            const index = this.adjustments.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.adjustments[index] = payload;
            }
        },

        // Basket
        addToBasket(uid: string, stockLotUid: string, quantity: number): void {
            if (!uid || !stockLotUid || quantity <= 0) {
                console.error('Invalid parameters provided to addToBasket');
                return;
            }
            
            const index = this.products.findIndex(item => item.uid === uid);
            if (index === -1) {
                console.error('Product not found:', uid);
                return;
            }
            
            const product = this.products[index];
            const orderItem = {
                product,
                stockLotUid,
                quantity,
            };

            // if not in basket add
            // if in basket modify quantity
            const basketIndex = this.basket.findIndex(oi => oi.product.uid === uid);
            if (basketIndex === -1) {
                this.basket.push(orderItem);
            } else {
                const count = this.basket[basketIndex].quantity;
                this.basket[basketIndex].quantity = count + quantity;
            }
        },
        updateBasket(uid: string, quantity: number): void {
            if (!uid || quantity < 0) {
                console.error('Invalid parameters provided to updateBasket');
                return;
            }
            
            // modify quantity
            const basketIndex = this.basket.findIndex(oi => oi.product.uid === uid);
            if (basketIndex === -1) {
                console.error('Item not found in basket:', uid);
                return;
            }
            
            this.basket[basketIndex].quantity = quantity;
        },
        removeFromBasket(uid: string): void {
            if (!uid) {
                console.error('Invalid UID provided to removeFromBasket');
                return;
            }
            
            this.basket = this.basket.filter(oi => oi.product.uid !== uid);
        },
        clearBasket(): void {
            this.basket = [];
        },
    },
});
