import{g as o,f as c,d as u}from"./index-9a11e11f.js";const $=o`
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
    `,A=o`
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
    `,O=o`
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
    `,_=o`
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
    `,v=o`
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
    `,U=o`
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
    `,P=o`
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
    `,C=o`
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
    `,j=o`
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
    `,x=o`
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
    `,E=o`
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
    `,z=o`
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
    `,T=o`
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
    `,B=o`
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
    `,D=o`
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
    `;o`
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
    `;const b=o`
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
    `;o`
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
    `;const m=o`
    query getAllHazards {
  hazardAll {
    uid
    name
    description
  }
}
    `,p=o`
    query getAllStockCategories {
  stockCategoryAll {
    uid
    name
    description
  }
}
    `,l=o`
    query getAllStockUnits {
  stockUnitAll {
    uid
    name
  }
}
    `,k=o`
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
    `,g=o`
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
    `,y=o`
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
    `,N=o`
    query getAllStockLots($productUid: String!) {
  stockLots(productUid: $productUid) {
    uid
    lotNumber
    quantity
    expiryDate
  }
}
    `,f=o`
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
    `,q=o`
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
    `,h=o`
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
    `,{withClientQuery:s}=c(),H=u("inventory",{state:()=>({hazards:[],fetchingHazards:!1,categories:[],fetchingCategories:!1,units:[],fetchingUnits:!1,products:[],fetchingProducts:!1,productsPaging:{},stockItems:[],stockItemsPaging:{},fetchingItems:!1,adjustments:[],adjustmentsPaging:{},fetchingAdjustments:!1,basket:[],stockOrders:[],fetchingStockOrders:!1,stockOrdersPaging:{}}),getters:{getHazards:t=>t.hazards,getCategories:t=>t.categories,getUnits:t=>t.units,getProducts:t=>t.products,getStockItems:t=>t.stockItems,getAdjustments:t=>t.adjustments,getBasket:t=>t.basket,getStockOrders:t=>t.stockOrders},actions:{async fetchAllDependencies(){try{await this.fetchHazards(),await this.fetchCategories(),await this.fetchUnits()}catch(t){console.error("Error fetching all dependencies:",t)}},async fetchHazards(){try{this.fetchingHazards=!0;const t=await s(m,{},"hazardAll");t&&Array.isArray(t)?this.hazards=t:console.error("Invalid hazards data received:",t)}catch(t){console.error("Error fetching hazards:",t)}finally{this.fetchingHazards=!1}},addHazard(t){if(!t?.uid){console.error("Invalid hazard payload:",t);return}this.hazards.unshift(t)},updateHazard(t){if(!t?.uid){console.error("Invalid hazard payload:",t);return}const e=this.hazards.findIndex(r=>r.uid===t.uid);e>-1&&(this.hazards[e]=t)},async fetchCategories(){try{this.fetchingCategories=!0;const t=await s(p,{},"stockCategoryAll");t&&Array.isArray(t)?this.categories=t:console.error("Invalid categories data received:",t)}catch(t){console.error("Error fetching categories:",t)}finally{this.fetchingCategories=!1}},addCategory(t){if(!t?.uid){console.error("Invalid category payload:",t);return}this.categories.unshift(t)},updateCategory(t){if(!t?.uid){console.error("Invalid category payload:",t);return}const e=this.categories.findIndex(r=>r.uid===t.uid);e>-1&&(this.categories[e]=t)},async fetchUnits(){try{this.fetchingUnits=!0;const t=await s(l,{},"stockUnitAll");t&&Array.isArray(t)?this.units=t:console.error("Invalid units data received:",t)}catch(t){console.error("Error fetching units:",t)}finally{this.fetchingUnits=!1}},addUnit(t){if(!t?.uid){console.error("Invalid unit payload:",t);return}this.units.unshift(t)},updateUnit(t){if(!t?.uid){console.error("Invalid unit payload:",t);return}const e=this.units.findIndex(r=>r.uid===t.uid);e>-1&&(this.units[e]=t)},async fetchProducts(t){try{this.fetchingProducts=!0;const e=await s(y,t,"stockProductAll");e&&typeof e=="object"&&"items"in e?(this.products=e.items,this.productsPaging.totalCount=e.totalCount,this.productsPaging.pageInfo=e.pageInfo):console.error("Invalid products data received:",e)}catch(e){console.error("Error fetching products:",e)}finally{this.fetchingProducts=!1}},addStockProduct(t){if(!t?.uid){console.error("Invalid product payload:",t);return}this.products.unshift(t)},updateProduct(t){if(!t?.uid){console.error("Invalid product payload:",t);return}const e=this.products.findIndex(r=>r.uid===t.uid);if(e>-1){const r=this.products[e];this.products[e]={...r,...t}}},async fetchItems(t){try{this.fetchingItems=!0;const e=await s(k,t,"stockItemAll");e&&typeof e=="object"&&"items"in e?(this.stockItems=e.items||[],this.stockItemsPaging.totalCount=e.totalCount,this.stockItemsPaging.pageInfo=e.pageInfo):console.error("Invalid stock items data received:",e)}catch(e){console.error("Error fetching stock items:",e)}finally{this.fetchingItems=!1}},addItem(t){if(!t?.uid){console.error("Invalid stock item payload:",t);return}this.stockItems.unshift(t)},updateItem(t){if(!t?.uid){console.error("Invalid stock item payload:",t);return}const e=this.stockItems.findIndex(r=>r.uid===t.uid);e>-1&&(this.stockItems[e]=t)},async fetchItemVariants(t){if(!t){console.error("Invalid stock item UID provided to fetchItemVariants");return}try{const e=await s(g,{stockItemUid:t},"stockItemVariants");e&&Array.isArray(e)?this.stockItems.forEach(r=>{r.uid===t&&(r.variants=e)}):console.error("Invalid stock item variants data received:",e)}catch(e){console.error("Error fetching stock item variants:",e)}},addItemVariant(t){if(!t?.uid||!t?.stockItemUid){console.error("Invalid stock item variant payload:",t);return}this.stockItems.forEach(e=>{e.uid===t.stockItemUid&&(e.variants||(e.variants=[]),e.variants.unshift(t))})},updateItemVariant(t){if(!t?.uid||!t?.stockItemUid){console.error("Invalid stock item variant payload:",t);return}this.stockItems.forEach(e=>{if(e.uid===t.stockItemUid&&e.variants){const r=e.variants.findIndex(i=>i.uid===t.uid);r>-1&&(e.variants[r]=t)}})},async fetchStockOrders(t){try{this.fetchingStockOrders=!0,this.stockOrders=[];const e=await s(f,t,"stockOrderAll");e&&typeof e=="object"&&"items"in e?(this.stockOrders=e.items,this.stockOrdersPaging.totalCount=e.totalCount,this.stockOrdersPaging.pageInfo=e.pageInfo):console.error("Invalid stock orders data received:",e)}catch(e){console.error("Error fetching stock orders:",e)}finally{this.fetchingStockOrders=!1}},addStockOrder(t){if(!t?.uid){console.error("Invalid stock order payload:",t);return}this.stockOrders.unshift(t)},updateStockOrder(t){if(!t?.uid){console.error("Invalid stock order payload:",t);return}const e=this.stockOrders.findIndex(r=>r.uid===t.uid);if(e>-1){const r=this.stockOrders[e];this.stockOrders[e]={...r,...t}}},issueStockOrder(t){if(!t?.stockOrder?.uid){console.error("Invalid stock order payload:",t);return}this.updateStockOrder(t.stockOrder),t.orderProducts&&Array.isArray(t.orderProducts)&&t.orderProducts.forEach(e=>{e.product?.uid&&this.updateProduct(e.product)})},async fetchAdjustments(t){try{this.fetchingAdjustments=!0;const e=await s(h,t,"stockAdjustmentAll");e&&typeof e=="object"&&"items"in e?(this.adjustments=e.items,this.adjustmentsPaging.totalCount=e.totalCount,this.adjustmentsPaging.pageInfo=e.pageInfo):console.error("Invalid stock adjustments data received:",e)}catch(e){console.error("Error fetching stock adjustments:",e)}finally{this.fetchingAdjustments=!1}},addAdjustment(t){if(!t?.uid){console.error("Invalid stock adjustment payload:",t);return}this.adjustments.unshift(t)},updateAdjustment(t){if(!t?.uid){console.error("Invalid stock adjustment payload:",t);return}const e=this.adjustments.findIndex(r=>r.uid===t.uid);e>-1&&(this.adjustments[e]=t)},addToBasket(t,e,r){if(!t||!e||r<=0){console.error("Invalid parameters provided to addToBasket");return}const i=this.products.findIndex(a=>a.uid===t);if(i===-1){console.error("Product not found:",t);return}const d={product:this.products[i],stockLotUid:e,quantity:r},n=this.basket.findIndex(a=>a.product.uid===t);if(n===-1)this.basket.push(d);else{const a=this.basket[n].quantity;this.basket[n].quantity=a+r}},updateBasket(t,e){if(!t||e<0){console.error("Invalid parameters provided to updateBasket");return}const r=this.basket.findIndex(i=>i.product.uid===t);if(r===-1){console.error("Item not found in basket:",t);return}this.basket[r].quantity=e},removeFromBasket(t){if(!t){console.error("Invalid UID provided to removeFromBasket");return}this.basket=this.basket.filter(e=>e.product.uid!==t)},clearBasket(){this.basket=[]}}});export{T as A,_ as E,N as G,b as I,P as R,D as S,z as a,O as b,C as c,j as d,v as e,U as f,$ as g,A as h,h as i,x as j,E as k,B as l,q as m,y as n,H as u};
