import { defineStore } from 'pinia';

import { useApiUtil } from '../composables';
import {
    IHazard,
    IStockAdjustment,
    IStockCategory,
    IStockItem,
    IStockItemVariant,
    IStockOrder,
    IStockProduct,
    IStockUnit,
} from '../models/inventory';
import {
    GET_ALL_HAZARDS,
    GET_ALL_STOCK_ADJUSTMENTS,
    GET_ALL_STOCK_CATEGORIES,
    GET_ALL_STOCK_ITEMS,
    GET_ALL_STOCK_ITEM_VARIANTS,
    GET_ALL_STOCK_ORDERS,
    GET_ALL_STOCK_PRODUCTS,
    GET_ALL_STOCK_UNITS,
} from '../graphql/operations/inventory.queries';
import { IPagination, IPaginationMeta } from '../models/pagination';

const { withClientQuery } = useApiUtil();

export const useInventoryStore = defineStore('inventory', {
    state: () => {
        return {
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
        } as {
            hazards: IHazard[];
            fetchingHazards: boolean;
            categories: IStockCategory[];
            fetchingCategories: boolean;
            units: IStockUnit[];
            fetchingUnits: boolean;
            products: IStockProduct[];
            fetchingProducts: boolean;
            productsPaging: IPaginationMeta;
            stockItems: IStockItem[];
            stockItemsPaging: IPaginationMeta;
            fetchingItems: boolean;
            adjustments: IStockAdjustment[];
            adjustmentsPaging: IPaginationMeta;
            fetchingAdjustments: boolean;
            basket: any[];
            stockOrders: IStockOrder[];
            fetchingStockOrders: boolean;
            stockOrdersPaging: IPaginationMeta;
        };
    },
    getters: {
        getHazards: state => state.hazards,
        getCategories: state => state.categories,
        getUnits: state => state.units,
        getProducts: state => state.products,
        getStockItems: state => state.stockItems,
        getAdjustments: state => state.adjustments,
        getBasket: state => state.basket,
        getStockOrders: state => state.stockItems,
    },
    actions: {
        // getAll stock Item deps
        async fetchAllDependencies() {
            await this.fetchHazards();
            await this.fetchCategories();
            await this.fetchUnits();
        },
        // hazards
        async fetchHazards() {
            this.fetchingHazards = true;
            await withClientQuery(GET_ALL_HAZARDS, {}, 'hazardAll')
                .then((hazards: IHazard[]) => {
                    this.fetchingHazards = false;
                    this.hazards = hazards;
                })
                .catch(err => (this.fetchingHazards = false));
        },
        addHazard(payload): void {
            this.hazards?.unshift(payload);
        },
        updateHazard(payload: IHazard): void {
            const index = this.hazards?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.hazards[index] = payload;
        },

        // categories
        async fetchCategories() {
            this.fetchingCategories = true;
            await withClientQuery(GET_ALL_STOCK_CATEGORIES, {}, 'stockCategoryAll')
                .then((categories: IStockCategory[]) => {
                    this.fetchingCategories = false;
                    this.categories = categories;
                })
                .catch(err => (this.fetchingCategories = false));
        },
        addCategory(payload): void {
            this.categories?.unshift(payload);
        },
        updateCategory(payload: IStockCategory): void {
            const index = this.categories?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.categories[index] = payload;
        },

        // units
        async fetchUnits() {
            this.fetchingUnits = true;
            await withClientQuery(GET_ALL_STOCK_UNITS, {}, 'stockUnitAll')
                .then((units: IStockUnit[]) => {
                    this.fetchingUnits = false;
                    this.units = units;
                })
                .catch(err => (this.fetchingUnits = false));
        },
        addUnit(payload): void {
            this.units?.unshift(payload);
        },
        updateUnit(payload: IStockUnit): void {
            const index = this.units?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.units[index] = payload;
        },

        // products
        async fetchProducts(params) {
            this.fetchingProducts = true;
            await withClientQuery(GET_ALL_STOCK_PRODUCTS, params, 'stockProductAll')
                .then((paging: IPagination<IStockProduct>) => {
                    this.fetchingProducts = false;
                    this.products = paging.items ?? [];
                    this.productsPaging['totalCount'] = paging.totalCount;
                    this.productsPaging['pageInfo'] = paging.pageInfo;
                })
                .catch(err => (this.fetchingProducts = false));
        },
        addStockProduct(payload): void {
            this.products?.unshift(payload);
        },
        updateProduct(payload: IStockProduct): void {
            const index = this.products?.findIndex(item => item.uid === payload?.uid);
            const old = this.products[index];
            if (index > -1) this.products[index] = { ...old, ...payload };
        },

        // stockItems
        async fetchItems(params) {
            this.fetchingItems = true;
            await withClientQuery(GET_ALL_STOCK_ITEMS, params, 'stockItemAll')
                .then((paging: IPagination<IStockItem>) => {
                    this.fetchingItems = false;
                    this.stockItems = paging.items ?? [];
                    this.stockItemsPaging['totalCount'] = paging.totalCount;
                    this.stockItemsPaging['pageInfo'] = paging.pageInfo;
                })
                .catch(err => (this.fetchingItems = false));
        },
        addItem(payload): void {
            this.stockItems?.unshift(payload);
        },
        updateItem(payload: IStockItem): void {
            const index = this.stockItems?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.stockItems[index] = payload;
        },
        async fetchItemVariants(stockItemUid: string) {
            await withClientQuery(GET_ALL_STOCK_ITEM_VARIANTS, { stockItemUid }, 'stockItemVariants')
                .then((data: IStockItemVariant[]) => {
                    this.stockItems?.map(item => {
                        if (item.uid === stockItemUid) {
                            item.variants = [...data] ?? [];
                        }
                    });
                })
                .catch(err => (this.fetchingItems = false));
        },
        addItemVariant(payload): void {
            this.stockItems?.map(item => {
                if (item.uid === payload.stockItemUid) {
                    item.variants?.unshift(payload);
                }
            });
        },
        updateItemVariant(payload: IStockItemVariant): void {
            this.stockItems?.map(item => {
                if (item.uid === payload.stockItemUid) {
                    const index = item.variants?.findIndex(v => v.uid === payload.uid);
                    if (index > -1) item.variants[index] = payload;
                }
            });
        },

        // stockOrders
        async fetchStockOrders(params) {
            this.fetchingItems = true;
            this.stockOrders = []
            await withClientQuery(GET_ALL_STOCK_ORDERS, params, 'stockOrderAll')
                .then((paging: IPagination<IStockOrder>) => {
                    this.fetchingItems = false;
                    this.stockOrders = paging.items ?? [];
                    this.stockOrdersPaging['totalCount'] = paging.totalCount;
                    this.stockOrdersPaging['pageInfo'] = paging.pageInfo;
                })
                .catch(err => (this.fetchingStockOrders = false));
        },
        addStockOrder(payload): void {
            this.stockOrders?.unshift(payload);
        },
        updateStockOrder(payload: IStockOrder): void {
            const index = this.stockOrders?.findIndex(item => item.uid === payload?.uid);
            const old = this.stockOrders[index];
            if (index > -1) this.stockOrders[index] = { ...old, ...payload };
        },
        issueStockOrder(payload: any): void {
            this.updateStockOrder(payload?.stockOrder);
            for (const op of payload?.orderProducts) {
                this.updateProduct(op.product);
            }
        },

        // adjustments
        async fetchAdjustments(params) {
            this.fetchingAdjustments = true;
            await withClientQuery(GET_ALL_STOCK_ADJUSTMENTS, params, 'stockAdjustmentAll')
                .then((paging: IPagination<IStockAdjustment>) => {
                    this.fetchingAdjustments = false;
                    this.adjustments = paging.items ?? [];
                    this.adjustmentsPaging['totalCount'] = paging.totalCount;
                    this.adjustmentsPaging['pageInfo'] = paging.pageInfo;
                })
                .catch(err => (this.fetchingAdjustments = false));
        },
        addAdjustment(payload): void {
            this.adjustments?.unshift(payload);
        },
        updateAdjustment(payload: IStockAdjustment): void {
            const index = this.adjustments?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.adjustments[index] = payload;
        },

        // Basket
        addToBasket(uid: string, stockLotUid: string, quantity: number): void {
            const index = this.products?.findIndex(item => item.uid === uid);
            const product = this.products[index];
            const orderItem = {
                product,
                stockLotUid,
                quantity,
            };

            // if not in basket add
            // if in basket modify quantity
            const basketIndex = this.basket?.findIndex(oi => oi.product.uid === uid);
            if (basketIndex == -1) {
                this.basket.push(orderItem);
            } else {
                const count = this.basket[basketIndex].quantity;
                this.basket[basketIndex].quantity = count + quantity;
            }
        },
        udateBasket(uid: string, quantity: number): void {
            // modify quantity
            const basketIndex = this.basket?.findIndex(oi => oi.product.uid === uid);
            this.basket[basketIndex].quantity = quantity;
        },
        removeFromBasket(uid: string): void {
            this.basket = [...this.basket.filter(oi => oi.product.uid !== uid)];
        },
        clearBasket(): void {
            this.basket = [];
        },
    },
});
