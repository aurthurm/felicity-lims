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
                department {
                    uid
                    name
                }
                supplier {
                    uid
                    name
                }
                category {
                    uid
                    name
                }
                hazard {
                    uid
                    name
                }
                storeRoom {
                    uid
                    name
                }
                lotNumber
                batch
                size
                unit {
                    uid
                    name
                }
                packaging {
                    uid
                    name
                }
                price
                quantityReceived
                remaining
                dateReceived
                expiryDate
                receivedBy {
                    uid
                    firstName
                    lastName
                }
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

// stock orders
export const GET_ALL_STOCK_ORDERS = gql`
query getAllStockOrders($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
    stockOrderAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy){
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
}`;


export const GET_ALL_STOCK_ORDER_PRODUCTS = gql`
query getAllStockOrderProducts($stockOrderUid: FelicityID!) {
    stockOrderProductAll(stockOrderUid: $stockOrderUid){
            uid
            product {
                uid
                name
                remaining
            }
            price
            quantity
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
                product{
                    uid
                    name
                }
                issued
                department{
                    uid
                    name
                }
                dateIssued
                transactionBy {
                    uid 
                    firstName
                    lastName
                }
                createdAt
            }
    }
}`;

// adjustments
export const GET_ALL_STOCK_ADJUSTMENTS = gql`
    query getAllStockAdustments($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockAdjustmentAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy){
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
                adjustmentByUid
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
    }
}`;
