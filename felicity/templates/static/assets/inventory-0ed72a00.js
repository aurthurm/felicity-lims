import{g as r,e as c,d as u}from"./index-66877f9a.js";const $=r`
    mutation AddHazard($payload: HazardInputType!) {
  createHazard(payload: $payload) {
    ... on HazardType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,A=r`
    mutation EditHazard($uid: String!, $payload: HazardInputType!) {
  updateHazard(uid: $uid, payload: $payload) {
    ... on HazardType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,O=r`
    mutation AddStockCategory($payload: StockCategoryInputType!) {
  createStockCategory(payload: $payload) {
    ... on StockCategoryType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,_=r`
    mutation EditStockCategory($uid: String!, $payload: StockCategoryInputType!) {
  updateStockCategory(uid: $uid, payload: $payload) {
    ... on StockCategoryType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,U=r`
    mutation AddStockUnit($payload: StockUnitInputType!) {
  createStockUnit(payload: $payload) {
    ... on StockUnitType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,C=r`
    mutation editStockUnit($uid: String!, $payload: StockUnitInputType!) {
  updateStockUnit(uid: $uid, payload: $payload) {
    ... on StockUnitType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,P=r`
    mutation ReceiveStockProduct($payload: StockReceiptInputType!) {
  createStockReceipt(payload: $payload) {
    ... on StockItemVariantType {
      __typename
      uid
      name
      description
      stockItem {
        name
        description
        category {
          name
        }
        hazard {
          name
        }
      }
      quantity
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,x=r`
    mutation AddStockItem($payload: StockItemInputType!) {
  createStockItem(payload: $payload) {
    ... on StockItemType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,z=r`
    mutation editStockItem($uid: String!, $payload: StockItemInputType!) {
  updateStockItem(uid: $uid, payload: $payload) {
    ... on StockItemType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,T=r`
    mutation AddStockItemVariant($stockItemUid: String!, $payload: StockItemVariantInputType!) {
  createStockItemVariant(stockItemUid: $stockItemUid, payload: $payload) {
    ... on StockItemVariantType {
      __typename
      uid
      name
      description
      stockItemUid
      minimumLevel
      maximumLevel
      createdAt
      createdBy {
        uid
        firstName
        lastName
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,j=r`
    mutation editStockItemVariant($uid: String!, $payload: StockItemVariantInputType!) {
  updateStockItemVariant(uid: $uid, payload: $payload) {
    ... on StockItemVariantType {
      __typename
      uid
      name
      description
      stockItemUid
      minimumLevel
      maximumLevel
      createdAt
      createdBy {
        uid
        firstName
        lastName
      }
      updatedAt
      updatedBy {
        uid
        firstName
        lastName
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,B=r`
    mutation AddStockAdjustment($payload: StockAdjustmentInputType!) {
  createStockAdjustment(payload: $payload) {
    ... on StockAdjustmentType {
      __typename
      uid
      productUid
      adjustmentType
      adjust
      adjustmentDate
      remarks
      adjustmentByUid
      createdAt
      createdByUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,D=r`
    mutation AddStockOrder($payload: StockOrderInputType!) {
  createStockOrder(payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
      }
      orderProducts {
        uid
        productUid
        orderUid
        quantity
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,E=r`
    mutation EditStockOrder($uid: String!, $payload: StockOrderInputType!) {
  updateStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
        remarks
      }
      orderProducts {
        uid
        productUid
        orderUid
        quantity
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,N=r`
    mutation SubmitStockOrder($uid: String!) {
  submitStockOrder(uid: $uid) {
    ... on StockOrderType {
      __typename
      uid
      status
      orderNumber
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;r`
    mutation ApproveStockOrder($uid: String!, $payload: StockOrderApprovalInputType!) {
  approveStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderType {
      __typename
      uid
      orderByUid
      departmentUid
      status
      orderNumber
      remarks
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;const b=r`
    mutation IssueStockOrder($uid: String!, $payload: [StockOrderProductLineInputType!]!) {
  issueStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
        remarks
      }
      orderProducts {
        uid
        product {
          uid
          quantity
        }
        orderUid
        quantity
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;r`
    mutation DeleteStockOrder($uid: String!) {
  deleteStockOrder(uid: $uid) {
    ... on StockOrderLineType {
      __typename
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;const m=r`
    query getAllHazards {
  hazardAll {
    uid
    name
    description
  }
}
    `,p=r`
    query getAllStockCategories {
  stockCategoryAll {
    uid
    name
    description
  }
}
    `,y=r`
    query getAllStockUnits {
  stockUnitAll {
    uid
    name
  }
}
    `,k=r`
    query getAllStockItems($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockItemAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
      categoryUid
      category {
        uid
        name
      }
      hazardUid
      hazard {
        uid
        name
      }
    }
  }
}
    `,g=r`
    query getAllStockItemVariants($stockItemUid: String!) {
  stockItemVariants(stockItemUid: $stockItemUid) {
    uid
    name
    description
    stockItemUid
    minimumLevel
    maximumLevel
  }
}
    `,l=r`
    query getAllStockProducts($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockProductAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
      stockItem {
        name
        description
        category {
          name
        }
        hazard {
          name
        }
      }
      quantity
      createdAt
      createdBy {
        uid
        firstName
        lastName
      }
      updatedAt
      updatedBy {
        uid
        firstName
        lastName
      }
    }
  }
}
    `,q=r`
    query getAllStockLots($productUid: String!) {
  stockLots(productUid: $productUid) {
    uid
    lotNumber
    quantity
    expiryDate
  }
}
    `,h=r`
    query getAllStockOrders($first: Int!, $after: String, $status: String!, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockOrderAll(
    pageSize: $first
    afterCursor: $after
    status: $status
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      orderBy {
        uid
        firstName
        lastName
      }
      department {
        uid
        name
      }
      status
      orderNumber
    }
  }
}
    `,v=r`
    query getAllStockOrderProducts($stockOrderUid: String!) {
  stockOrderProductAll(stockOrderUid: $stockOrderUid) {
    uid
    product {
      uid
      name
      quantity
    }
    stockLot {
      uid
      lotNumber
      quantity
    }
    quantity
  }
}
    `,S=r`
    query getAllStockAdjustments($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"], $productUid: String) {
  stockAdjustmentAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
    productUid: $productUid
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      productUid
      product {
        name
      }
      adjustmentType
      adjust
      adjustmentDate
      remarks
      adjustmentByUid
      adjustmentBy {
        firstName
        lastName
      }
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
  }
}
    `,{withClientQuery:s}=c(),H=u("inventory",{state:()=>({hazards:[],fetchingHazards:!1,categories:[],fetchingCategories:!1,units:[],fetchingUnits:!1,products:[],fetchingProducts:!1,productsPaging:{},stockItems:[],stockItemsPaging:{},fetchingItems:!1,adjustments:[],adjustmentsPaging:{},fetchingAdjustments:!1,basket:[],stockOrders:[],fetchingStockOrders:!1,stockOrdersPaging:{}}),getters:{getHazards:t=>t.hazards,getCategories:t=>t.categories,getUnits:t=>t.units,getProducts:t=>t.products,getStockItems:t=>t.stockItems,getAdjustments:t=>t.adjustments,getBasket:t=>t.basket,getStockOrders:t=>t.stockItems},actions:{async fetchAllDependencies(){await this.fetchHazards(),await this.fetchCategories(),await this.fetchUnits()},async fetchHazards(){this.fetchingHazards=!0,await s(m,{},"hazardAll").then(t=>{this.fetchingHazards=!1,this.hazards=t}).catch(t=>this.fetchingHazards=!1)},addHazard(t){this.hazards?.unshift(t)},updateHazard(t){const e=this.hazards?.findIndex(a=>a.uid===t?.uid);e>-1&&(this.hazards[e]=t)},async fetchCategories(){this.fetchingCategories=!0,await s(p,{},"stockCategoryAll").then(t=>{this.fetchingCategories=!1,this.categories=t}).catch(t=>this.fetchingCategories=!1)},addCategory(t){this.categories?.unshift(t)},updateCategory(t){const e=this.categories?.findIndex(a=>a.uid===t?.uid);e>-1&&(this.categories[e]=t)},async fetchUnits(){this.fetchingUnits=!0,await s(y,{},"stockUnitAll").then(t=>{this.fetchingUnits=!1,this.units=t}).catch(t=>this.fetchingUnits=!1)},addUnit(t){this.units?.unshift(t)},updateUnit(t){const e=this.units?.findIndex(a=>a.uid===t?.uid);e>-1&&(this.units[e]=t)},async fetchProducts(t){this.fetchingProducts=!0,await s(l,t,"stockProductAll").then(e=>{this.fetchingProducts=!1,this.products=e.items??[],this.productsPaging.totalCount=e.totalCount,this.productsPaging.pageInfo=e.pageInfo}).catch(e=>this.fetchingProducts=!1)},addStockProduct(t){this.products?.unshift(t)},updateProduct(t){const e=this.products?.findIndex(o=>o.uid===t?.uid),a=this.products[e];e>-1&&(this.products[e]={...a,...t})},async fetchItems(t){this.fetchingItems=!0,await s(k,t,"stockItemAll").then(e=>{this.fetchingItems=!1,this.stockItems=e.items??[],this.stockItemsPaging.totalCount=e.totalCount,this.stockItemsPaging.pageInfo=e.pageInfo}).catch(e=>this.fetchingItems=!1)},addItem(t){this.stockItems?.unshift(t)},updateItem(t){const e=this.stockItems?.findIndex(a=>a.uid===t?.uid);e>-1&&(this.stockItems[e]=t)},async fetchItemVariants(t){await s(g,{stockItemUid:t},"stockItemVariants").then(e=>{this.stockItems?.map(a=>{a.uid===t&&(a.variants=[...e])})}).catch(e=>this.fetchingItems=!1)},addItemVariant(t){this.stockItems?.map(e=>{e.uid===t.stockItemUid&&e.variants?.unshift(t)})},updateItemVariant(t){this.stockItems?.map(e=>{if(e.uid===t.stockItemUid){const a=e.variants?.findIndex(o=>o.uid===t.uid);a>-1&&(e.variants[a]=t)}})},async fetchStockOrders(t){this.fetchingItems=!0,this.stockOrders=[],await s(h,t,"stockOrderAll").then(e=>{this.fetchingItems=!1,this.stockOrders=e.items??[],this.stockOrdersPaging.totalCount=e.totalCount,this.stockOrdersPaging.pageInfo=e.pageInfo}).catch(e=>this.fetchingStockOrders=!1)},addStockOrder(t){this.stockOrders?.unshift(t)},updateStockOrder(t){const e=this.stockOrders?.findIndex(o=>o.uid===t?.uid),a=this.stockOrders[e];e>-1&&(this.stockOrders[e]={...a,...t})},issueStockOrder(t){this.updateStockOrder(t?.stockOrder);for(const e of t?.orderProducts)this.updateProduct(e.product)},async fetchAdjustments(t){this.fetchingAdjustments=!0,await s(S,t,"stockAdjustmentAll").then(e=>{this.fetchingAdjustments=!1,this.adjustments=e.items??[],this.adjustmentsPaging.totalCount=e.totalCount,this.adjustmentsPaging.pageInfo=e.pageInfo}).catch(e=>this.fetchingAdjustments=!1)},addAdjustment(t){this.adjustments?.unshift(t)},updateAdjustment(t){const e=this.adjustments?.findIndex(a=>a.uid===t?.uid);e>-1&&(this.adjustments[e]=t)},addToBasket(t,e,a){const o=this.products?.findIndex(i=>i.uid===t),n={product:this.products[o],stockLotUid:e,quantity:a},d=this.basket?.findIndex(i=>i.product.uid===t);if(d==-1)this.basket.push(n);else{const i=this.basket[d].quantity;this.basket[d].quantity=i+a}},udateBasket(t,e){const a=this.basket?.findIndex(o=>o.product.uid===t);this.basket[a].quantity=e},removeFromBasket(t){this.basket=[...this.basket.filter(e=>e.product.uid!==t)]},clearBasket(){this.basket=[]}}});export{D as A,_ as E,q as G,b as I,P as R,N as S,B as a,O as b,x as c,z as d,U as e,C as f,$ as g,A as h,S as i,T as j,j as k,E as l,v as m,l as n,H as u};
