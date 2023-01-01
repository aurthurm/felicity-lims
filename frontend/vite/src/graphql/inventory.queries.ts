import gql from 'graphql-tag';

// hazards
export const GET_ALL_HAZARDS = gql`
    query getAllHazards {
      hazardAll {
        uid
        name
        description
      }
  }`;

// categories
export const GET_ALL_STOCK_CATEGORIES = gql`
    query getAllStockCategories {
      stockCategoryAll {
        uid
        name
        description
      }
  }`;

// packages
export const GET_ALL_STOCK_PACKAGES = gql`
    query getAllStockPackaging {
    stockPackagingAll {
        uid
        name
    }
}`;

// units
export const GET_ALL_STOCK_UNITS = gql`
    query getAllStockUnits {
        stockUnitAll {
            uid
            name
    }
}`;

// products
export const GET_ALL_STOCK_PRODUCTS = gql`
    query getAllStockProducts($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockProductAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy){
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
                departmentUid
                supplierUid
                categoryUid
                hazardUid
                storeRoomUid
                lot_number
                batch
                size
                unitUid
                packagingUid
                price
                quantityReceived
                minimumLevel
                remaining
                dateReceived
                expiryDate
                receivedByUid
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
    }
}`;

// items
export const GET_ALL_STOCK_ITEMS = gql`
    query getAllStockItems($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockItemAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy){
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
                departmentUid
                department {
                    uid
                    name
                }
            }
    }
}`;

// transactions
export const GET_ALL_STOCK_TRANSACTIONS = gql`
    query getAllStockTransactions($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockTransactionAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy){
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
                issued
                departmentUid
                date_issued
                transactionByUid
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
    }
}`;

// adjustments
export const GET_ALL_STOCK_ADJUSTMENTS = gql`
    query getAllStockProducts($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockProductAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy){
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
                adjustmentType
                adjust
                adjustmentDate
                remarks
                adjustment_by_uid
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
    }
}`;
