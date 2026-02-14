import{k as t}from"./index-DApeomWQ.js";const r=t`
    query getAllHazards {
  hazardAll {
    uid
    name
    description
  }
}
    `,o=t`
    query getAllStockCategories {
  stockCategoryAll {
    uid
    name
    description
  }
}
    `,s=t`
    query getAllStockUnits {
  stockUnitAll {
    uid
    name
  }
}
    `,a=t`
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
    `,i=t`
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
    `,d=t`
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
    `,u=t`
    query getAllStockLots($productUid: String!) {
  stockLots(productUid: $productUid) {
    uid
    lotNumber
    quantity
    expiryDate
  }
}
    `,n=t`
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
    `,c=t`
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
    `,m=t`
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
    `,l=t`
    query getInventoryKpis($text: String, $limit: Int) {
  inventoryKpis(text: $text, limit: $limit) {
    productUid
    productName
    stockItemUid
    currentStock
    minimumLevel
    maximumLevel
    reorderPoint
    reorderQuantity
    lowStock
    reorderNow
  }
}
    `;export{u as G,c as a,m as b,l as c,n as d,i as e,a as f,d as g,s as h,o as i,r as j};
