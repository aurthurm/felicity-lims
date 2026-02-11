import{k as i,d as c,f as u}from"./index-Daoe3XS9.js";import{b as m,d as p,e as k,f as y,g as f,h as g,i as h,j as l}from"./inventory.queries-QHmwiWhL.js";const O=i`
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
    `,A=i`
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
    `,$=i`
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
    `,U=i`
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
    `,T=i`
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
    `,j=i`
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
    `,E=i`
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
    `,P=i`
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
    `,C=i`
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
    `,b=i`
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
    `,z=i`
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
    `,D=i`
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
    `,x=i`
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
    `,v=i`
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
    `,H=i`
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
    `;i`
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
    `;const V=i`
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
    `;i`
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
    `;const{withClientQuery:o}=u(),B=c("inventory",{state:()=>({hazards:[],fetchingHazards:!1,categories:[],fetchingCategories:!1,units:[],fetchingUnits:!1,products:[],fetchingProducts:!1,productsPaging:{},stockItems:[],stockItemsPaging:{},fetchingItems:!1,adjustments:[],adjustmentsPaging:{},fetchingAdjustments:!1,basket:[],stockOrders:[],fetchingStockOrders:!1,stockOrdersPaging:{}}),getters:{getHazards:t=>t.hazards,getCategories:t=>t.categories,getUnits:t=>t.units,getProducts:t=>t.products,getStockItems:t=>t.stockItems,getAdjustments:t=>t.adjustments,getBasket:t=>t.basket,getStockOrders:t=>t.stockOrders},actions:{async fetchAllDependencies(){try{await this.fetchHazards(),await this.fetchCategories(),await this.fetchUnits()}catch{}},async fetchHazards(){try{this.fetchingHazards=!0;const t=await o(l,{},"hazardAll");t&&Array.isArray(t)&&(this.hazards=t)}catch{}finally{this.fetchingHazards=!1}},addHazard(t){t?.uid&&this.hazards.unshift(t)},updateHazard(t){if(!t?.uid)return;const e=this.hazards.findIndex(r=>r.uid===t.uid);e>-1&&(this.hazards[e]=t)},async fetchCategories(){try{this.fetchingCategories=!0;const t=await o(h,{},"stockCategoryAll");t&&Array.isArray(t)&&(this.categories=t)}catch{}finally{this.fetchingCategories=!1}},addCategory(t){t?.uid&&this.categories.unshift(t)},updateCategory(t){if(!t?.uid)return;const e=this.categories.findIndex(r=>r.uid===t.uid);e>-1&&(this.categories[e]=t)},async fetchUnits(){try{this.fetchingUnits=!0;const t=await o(g,{},"stockUnitAll");t&&Array.isArray(t)&&(this.units=t)}catch{}finally{this.fetchingUnits=!1}},addUnit(t){t?.uid&&this.units.unshift(t)},updateUnit(t){if(!t?.uid)return;const e=this.units.findIndex(r=>r.uid===t.uid);e>-1&&(this.units[e]=t)},async fetchProducts(t){try{this.fetchingProducts=!0;const e=await o(f,t,"stockProductAll");e&&typeof e=="object"&&"items"in e&&(this.products=e.items,this.productsPaging.totalCount=e.totalCount,this.productsPaging.pageInfo=e.pageInfo)}catch{}finally{this.fetchingProducts=!1}},addStockProduct(t){t?.uid&&this.products.unshift(t)},updateProduct(t){if(!t?.uid)return;const e=this.products.findIndex(r=>r.uid===t.uid);if(e>-1){const r=this.products[e];this.products[e]={...r,...t}}},async fetchItems(t){try{this.fetchingItems=!0;const e=await o(y,t,"stockItemAll");e&&typeof e=="object"&&"items"in e&&(this.stockItems=e.items||[],this.stockItemsPaging.totalCount=e.totalCount,this.stockItemsPaging.pageInfo=e.pageInfo)}catch{}finally{this.fetchingItems=!1}},addItem(t){t?.uid&&this.stockItems.unshift(t)},updateItem(t){if(!t?.uid)return;const e=this.stockItems.findIndex(r=>r.uid===t.uid);e>-1&&(this.stockItems[e]=t)},async fetchItemVariants(t){if(t)try{const e=await o(k,{stockItemUid:t},"stockItemVariants");e&&Array.isArray(e)&&this.stockItems.forEach(r=>{r.uid===t&&(r.variants=e)})}catch{}},addItemVariant(t){!t?.uid||!t?.stockItemUid||this.stockItems.forEach(e=>{e.uid===t.stockItemUid&&(e.variants||(e.variants=[]),e.variants.unshift(t))})},updateItemVariant(t){!t?.uid||!t?.stockItemUid||this.stockItems.forEach(e=>{if(e.uid===t.stockItemUid&&e.variants){const r=e.variants.findIndex(s=>s.uid===t.uid);r>-1&&(e.variants[r]=t)}})},async fetchStockOrders(t){try{this.fetchingStockOrders=!0,this.stockOrders=[];const e=await o(p,t,"stockOrderAll");e&&typeof e=="object"&&"items"in e&&(this.stockOrders=e.items,this.stockOrdersPaging.totalCount=e.totalCount,this.stockOrdersPaging.pageInfo=e.pageInfo)}catch{}finally{this.fetchingStockOrders=!1}},addStockOrder(t){t?.uid&&this.stockOrders.unshift(t)},updateStockOrder(t){if(!t?.uid)return;const e=this.stockOrders.findIndex(r=>r.uid===t.uid);if(e>-1){const r=this.stockOrders[e];this.stockOrders[e]={...r,...t}}},issueStockOrder(t){t?.stockOrder?.uid&&(this.updateStockOrder(t.stockOrder),t.orderProducts&&Array.isArray(t.orderProducts)&&t.orderProducts.forEach(e=>{e.product?.uid&&this.updateProduct(e.product)}))},async fetchAdjustments(t){try{this.fetchingAdjustments=!0;const e=await o(m,t,"stockAdjustmentAll");e&&typeof e=="object"&&"items"in e&&(this.adjustments=e.items,this.adjustmentsPaging.totalCount=e.totalCount,this.adjustmentsPaging.pageInfo=e.pageInfo)}catch{}finally{this.fetchingAdjustments=!1}},addAdjustment(t){t?.uid&&this.adjustments.unshift(t)},updateAdjustment(t){if(!t?.uid)return;const e=this.adjustments.findIndex(r=>r.uid===t.uid);e>-1&&(this.adjustments[e]=t)},addToBasket(t,e,r){if(!t||!e||r<=0)return;const s=this.products.findIndex(a=>a.uid===t);if(s===-1)return;const d={product:this.products[s],stockLotUid:e,quantity:r},n=this.basket.findIndex(a=>a.product.uid===t);if(n===-1)this.basket.push(d);else{const a=this.basket[n].quantity;this.basket[n].quantity=a+r}},updateBasket(t,e){if(!t||e<0)return;const r=this.basket.findIndex(s=>s.product.uid===t);r!==-1&&(this.basket[r].quantity=e)},removeFromBasket(t){t&&(this.basket=this.basket.filter(e=>e.product.uid!==t))},clearBasket(){this.basket=[]}}});export{x as A,v as E,V as I,E as R,H as S,D as a,$ as b,U as c,P as d,C as e,T as f,j as g,O as h,A as i,b as j,z as k,B as u};
