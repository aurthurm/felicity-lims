import{k as o,d as c,f as u}from"./index-v7Q387fb.js";import{b as m,d as p,e as l,f as k,g as y,h as f,i as g,j as h}from"./inventory.queries-Cv6dYn2a.js";const O=o`
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
    `,v=o`
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
    `,A=o`
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
    `,$=o`
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
    `,U=o`
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
    `,E=o`
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
    `,j=o`
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
    `,T=o`
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
    `,P=o`
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
    `,z=o`
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
    `,C=o`
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
    `,D=o`
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
    `,b=o`
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
    `,x=o`
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
    `,H=o`
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
    `;const B=o`
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
    `;const{withClientQuery:i}=u(),V=c("inventory",{state:()=>({hazards:[],fetchingHazards:!1,categories:[],fetchingCategories:!1,units:[],fetchingUnits:!1,products:[],fetchingProducts:!1,productsPaging:{},stockItems:[],stockItemsPaging:{},fetchingItems:!1,adjustments:[],adjustmentsPaging:{},fetchingAdjustments:!1,basket:[],stockOrders:[],fetchingStockOrders:!1,stockOrdersPaging:{}}),getters:{getHazards:t=>t.hazards,getCategories:t=>t.categories,getUnits:t=>t.units,getProducts:t=>t.products,getStockItems:t=>t.stockItems,getAdjustments:t=>t.adjustments,getBasket:t=>t.basket,getStockOrders:t=>t.stockOrders},actions:{async fetchAllDependencies(){try{await this.fetchHazards(),await this.fetchCategories(),await this.fetchUnits()}catch(t){console.error("Error fetching all dependencies:",t)}},async fetchHazards(){try{this.fetchingHazards=!0;const t=await i(h,{},"hazardAll");t&&Array.isArray(t)?this.hazards=t:console.error("Invalid hazards data received:",t)}catch(t){console.error("Error fetching hazards:",t)}finally{this.fetchingHazards=!1}},addHazard(t){if(!t?.uid){console.error("Invalid hazard payload:",t);return}this.hazards.unshift(t)},updateHazard(t){if(!t?.uid){console.error("Invalid hazard payload:",t);return}const e=this.hazards.findIndex(r=>r.uid===t.uid);e>-1&&(this.hazards[e]=t)},async fetchCategories(){try{this.fetchingCategories=!0;const t=await i(g,{},"stockCategoryAll");t&&Array.isArray(t)?this.categories=t:console.error("Invalid categories data received:",t)}catch(t){console.error("Error fetching categories:",t)}finally{this.fetchingCategories=!1}},addCategory(t){if(!t?.uid){console.error("Invalid category payload:",t);return}this.categories.unshift(t)},updateCategory(t){if(!t?.uid){console.error("Invalid category payload:",t);return}const e=this.categories.findIndex(r=>r.uid===t.uid);e>-1&&(this.categories[e]=t)},async fetchUnits(){try{this.fetchingUnits=!0;const t=await i(f,{},"stockUnitAll");t&&Array.isArray(t)?this.units=t:console.error("Invalid units data received:",t)}catch(t){console.error("Error fetching units:",t)}finally{this.fetchingUnits=!1}},addUnit(t){if(!t?.uid){console.error("Invalid unit payload:",t);return}this.units.unshift(t)},updateUnit(t){if(!t?.uid){console.error("Invalid unit payload:",t);return}const e=this.units.findIndex(r=>r.uid===t.uid);e>-1&&(this.units[e]=t)},async fetchProducts(t){try{this.fetchingProducts=!0;const e=await i(y,t,"stockProductAll");e&&typeof e=="object"&&"items"in e?(this.products=e.items,this.productsPaging.totalCount=e.totalCount,this.productsPaging.pageInfo=e.pageInfo):console.error("Invalid products data received:",e)}catch(e){console.error("Error fetching products:",e)}finally{this.fetchingProducts=!1}},addStockProduct(t){if(!t?.uid){console.error("Invalid product payload:",t);return}this.products.unshift(t)},updateProduct(t){if(!t?.uid){console.error("Invalid product payload:",t);return}const e=this.products.findIndex(r=>r.uid===t.uid);if(e>-1){const r=this.products[e];this.products[e]={...r,...t}}},async fetchItems(t){try{this.fetchingItems=!0;const e=await i(k,t,"stockItemAll");e&&typeof e=="object"&&"items"in e?(this.stockItems=e.items||[],this.stockItemsPaging.totalCount=e.totalCount,this.stockItemsPaging.pageInfo=e.pageInfo):console.error("Invalid stock items data received:",e)}catch(e){console.error("Error fetching stock items:",e)}finally{this.fetchingItems=!1}},addItem(t){if(!t?.uid){console.error("Invalid stock item payload:",t);return}this.stockItems.unshift(t)},updateItem(t){if(!t?.uid){console.error("Invalid stock item payload:",t);return}const e=this.stockItems.findIndex(r=>r.uid===t.uid);e>-1&&(this.stockItems[e]=t)},async fetchItemVariants(t){if(!t){console.error("Invalid stock item UID provided to fetchItemVariants");return}try{const e=await i(l,{stockItemUid:t},"stockItemVariants");e&&Array.isArray(e)?this.stockItems.forEach(r=>{r.uid===t&&(r.variants=e)}):console.error("Invalid stock item variants data received:",e)}catch(e){console.error("Error fetching stock item variants:",e)}},addItemVariant(t){if(!t?.uid||!t?.stockItemUid){console.error("Invalid stock item variant payload:",t);return}this.stockItems.forEach(e=>{e.uid===t.stockItemUid&&(e.variants||(e.variants=[]),e.variants.unshift(t))})},updateItemVariant(t){if(!t?.uid||!t?.stockItemUid){console.error("Invalid stock item variant payload:",t);return}this.stockItems.forEach(e=>{if(e.uid===t.stockItemUid&&e.variants){const r=e.variants.findIndex(s=>s.uid===t.uid);r>-1&&(e.variants[r]=t)}})},async fetchStockOrders(t){try{this.fetchingStockOrders=!0,this.stockOrders=[];const e=await i(p,t,"stockOrderAll");e&&typeof e=="object"&&"items"in e?(this.stockOrders=e.items,this.stockOrdersPaging.totalCount=e.totalCount,this.stockOrdersPaging.pageInfo=e.pageInfo):console.error("Invalid stock orders data received:",e)}catch(e){console.error("Error fetching stock orders:",e)}finally{this.fetchingStockOrders=!1}},addStockOrder(t){if(!t?.uid){console.error("Invalid stock order payload:",t);return}this.stockOrders.unshift(t)},updateStockOrder(t){if(!t?.uid){console.error("Invalid stock order payload:",t);return}const e=this.stockOrders.findIndex(r=>r.uid===t.uid);if(e>-1){const r=this.stockOrders[e];this.stockOrders[e]={...r,...t}}},issueStockOrder(t){if(!t?.stockOrder?.uid){console.error("Invalid stock order payload:",t);return}this.updateStockOrder(t.stockOrder),t.orderProducts&&Array.isArray(t.orderProducts)&&t.orderProducts.forEach(e=>{e.product?.uid&&this.updateProduct(e.product)})},async fetchAdjustments(t){try{this.fetchingAdjustments=!0;const e=await i(m,t,"stockAdjustmentAll");e&&typeof e=="object"&&"items"in e?(this.adjustments=e.items,this.adjustmentsPaging.totalCount=e.totalCount,this.adjustmentsPaging.pageInfo=e.pageInfo):console.error("Invalid stock adjustments data received:",e)}catch(e){console.error("Error fetching stock adjustments:",e)}finally{this.fetchingAdjustments=!1}},addAdjustment(t){if(!t?.uid){console.error("Invalid stock adjustment payload:",t);return}this.adjustments.unshift(t)},updateAdjustment(t){if(!t?.uid){console.error("Invalid stock adjustment payload:",t);return}const e=this.adjustments.findIndex(r=>r.uid===t.uid);e>-1&&(this.adjustments[e]=t)},addToBasket(t,e,r){if(!t||!e||r<=0){console.error("Invalid parameters provided to addToBasket");return}const s=this.products.findIndex(n=>n.uid===t);if(s===-1){console.error("Product not found:",t);return}const d={product:this.products[s],stockLotUid:e,quantity:r},a=this.basket.findIndex(n=>n.product.uid===t);if(a===-1)this.basket.push(d);else{const n=this.basket[a].quantity;this.basket[a].quantity=n+r}},updateBasket(t,e){if(!t||e<0){console.error("Invalid parameters provided to updateBasket");return}const r=this.basket.findIndex(s=>s.product.uid===t);if(r===-1){console.error("Item not found in basket:",t);return}this.basket[r].quantity=e},removeFromBasket(t){if(!t){console.error("Invalid UID provided to removeFromBasket");return}this.basket=this.basket.filter(e=>e.product.uid!==t)},clearBasket(){this.basket=[]}}});export{b as A,x as E,B as I,j as R,H as S,D as a,A as b,$ as c,T as d,P as e,U as f,E as g,O as h,v as i,z as j,C as k,V as u};
