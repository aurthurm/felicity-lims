import { defineStore } from 'pinia'

import { useApiUtil } from '../composables'
import { IHazard, IStockAdjustment, IStockCategory, IStockItem, IStockPackaging, IStockProduct, IStockTransaction, IStockUnit } from '../models/inventory';
import { GET_ALL_HAZARDS, GET_ALL_STOCK_ADJUSTMENTS, GET_ALL_STOCK_CATEGORIES, GET_ALL_STOCK_ITEMS, GET_ALL_STOCK_PACKAGES, GET_ALL_STOCK_PRODUCTS, GET_ALL_STOCK_TRANSACTIONS, GET_ALL_STOCK_UNITS } from '../graphql/inventory.queries';
import { IPagination, IPaginationMeta } from '../models/pagination';

const { withClientQuery } = useApiUtil()

export const useInventoryStore = defineStore('inventory', {
  state: () => {
      return {
        hazards: [], 
        fetchingHazards: false,
        categories: [],
        fetchingCategories: false,
        packages: [],
        fetchingPackages: false,
        units: [],
        fetchingUnits: false,
        products: [],
        fetchingProducts: false,
        stockItems: [],
        stockItemsPaging: {},
        fetchingItems: false,
        transactions: [],
        fetchingTransactions: false,
        adjustments: [],
        fetchingAdjustments: false,
      } as {
        hazards: IHazard[], 
        fetchingHazards: boolean,
        categories: IStockCategory[],
        fetchingCategories: boolean,
        packages: IStockPackaging[],
        fetchingPackages: boolean,
        units: IStockUnit[],
        fetchingUnits: boolean,
        products: IStockProduct[],
        fetchingProducts: boolean,
        stockItems: IStockItem[],
        stockItemsPaging: IPaginationMeta,
        fetchingItems: boolean,
        transactions: IStockTransaction[],
        fetchingTransactions: boolean,
        adjustments: IStockAdjustment[],
        fetchingAdjustments: boolean,
      }
  },
  getters: {  
    getHazards: (state) => state.hazards,
    getCategories: (state) => state.categories,
    getPackages: (state) => state.packages,
    getUnits: (state) => state.units,
    getProducts: (state) => state.products,
    getStockItems: (state) => state.stockItems,
    getTransactions: (state) => state.transactions,
    getAdjustments: (state) => state.adjustments,
  },
  actions: {
    // getAll stock Item deps
    async fetchAllDependencies() {
      await this.fetchHazards();
      await this.fetchCategories();
      await this.fetchPackages();
      await this.fetchUnits();
    },
    // hazards
    async fetchHazards(){
      this.fetchingHazards = true;
      await withClientQuery(GET_ALL_HAZARDS, {}, "hazardAll")
            .then((hazards: IHazard[]) => {
              this.fetchingHazards= false
              this.hazards = hazards
            }).catch((err) => this.fetchingHazards=false)
    },
    addHazard(payload): void {
      this.hazards?.unshift(payload);
    },
    updateHazard(payload: IHazard): void {
      const index = this.hazards?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.hazards[index] = payload;
    },

    // categories
    async fetchCategories(){
      this.fetchingCategories = true;
      await withClientQuery(GET_ALL_STOCK_CATEGORIES, {}, "stockCategoryAll")
            .then((categories: IStockCategory[]) => {
              this.fetchingCategories= false
              this.categories = categories
            }).catch((err) => this.fetchingCategories=false)
    },
    addCategory(payload): void {
      this.categories?.unshift(payload);
    },
    updateCategory(payload: IStockCategory): void {
      const index = this.categories?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.categories[index] = payload;
    },

    // packages
    async fetchPackages(){
      this.fetchingPackages = true;
      await withClientQuery(GET_ALL_STOCK_PACKAGES, {}, "stockPackagingAll")
            .then((packages: IStockPackaging[]) => {
              this.fetchingPackages= false
              this.packages = packages
            }).catch((err) => this.fetchingPackages=false)
    },
    addPackaging(payload): void {
      this.packages?.unshift(payload);
    },
    updatePackaging(payload: IStockPackaging): void {
      const index = this.packages?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.packages[index] = payload;
    },

    // units
    async fetchUnits(){
      this.fetchingUnits = true;
      await withClientQuery(GET_ALL_STOCK_UNITS, {}, "stockUnitAll")
            .then((units: IStockUnit[]) => {
              this.fetchingUnits= false
              this.units = units
            }).catch((err) => this.fetchingUnits=false)
    },
    addUnit(payload): void {
      this.units?.unshift(payload);
    },
    updateUnit(payload: IStockUnit): void {
      const index = this.units?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.units[index] = payload;
    },

    // products
    async fetchProducts(params){
      this.fetchingProducts = true;
      await withClientQuery(GET_ALL_STOCK_PRODUCTS, params, "stockProductAll")
            .then((products: IStockProduct[]) => {
              this.fetchingProducts= false
              this.products = products
            }).catch((err) => this.fetchingProducts=false)
    },
    addProduct(payload): void {
      this.products?.unshift(payload);
    },
    updateProduct(payload: IStockProduct): void {
      const index = this.products?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.products[index] = payload;
    },

    // stockItems
    async fetchItems(params){
      this.fetchingItems = true;
      await withClientQuery(GET_ALL_STOCK_ITEMS, params, "stockItemAll")
            .then((paging: IPagination<IStockItem>) => {
              this.fetchingItems= false
              this.stockItems = paging.items ?? [];
              this.stockItemsPaging['totalCount'] = paging.totalCount;
              this.stockItemsPaging['pageInfo'] = paging.pageInfo;
            }).catch((err) => this.fetchingItems=false)
    },
    addItem(payload): void {
      this.stockItems?.unshift(payload);
    },
    updateItem(payload: IStockProduct): void {
      const index = this.stockItems?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.stockItems[index] = payload;
    },

    // transactions
    async fetchTransactions(params){
      this.fetchingTransactions = true;
      await withClientQuery(GET_ALL_STOCK_TRANSACTIONS, params, "stockTransactionAll")
            .then((transactions: IStockTransaction[]) => {
              this.fetchingTransactions= false
              this.transactions = transactions
            }).catch((err) => this.fetchingTransactions=false)
    },
    addTransaction(payload): void {
      this.transactions?.unshift(payload);
    },
    updateTransaction(payload: IStockProduct): void {
      const index = this.transactions?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.transactions[index] = payload;
    },

    // adjustments
    async fetchAdjustments(params){
      this.fetchingAdjustments = true;
      await withClientQuery(GET_ALL_STOCK_ADJUSTMENTS, params, "stockAdjustmentAll")
            .then((adjustments: IStockAdjustment[]) => {
              this.fetchingAdjustments= false
              this.adjustments = adjustments
            }).catch((err) => this.fetchingAdjustments=false)
    },
    addAdjustment(payload): void {
      this.adjustments?.unshift(payload);
    },
    updateAdjustment(payload: IStockProduct): void {
      const index = this.adjustments?.findIndex(item => item.uid === payload?.uid);
      if(index > -1) this.adjustments[index] = payload;
    },

  }
})


