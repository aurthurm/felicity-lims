import gql from 'graphql-tag';

// hazards
export const GET_ALL_HAZARDS = gql`
    query getAllHazards {
        hazardAll {
            uid
            name
            description
        }
    }
`;

// categories
export const GET_ALL_STOCK_CATEGORIES = gql`
    query getAllStockCategories {
        stockCategoryAll {
            uid
            name
            description
        }
    }
`;


// units
export const GET_ALL_STOCK_UNITS = gql`
    query getAllStockUnits {
        stockUnitAll {
            uid
            name
        }
    }
`;


// items
export const GET_ALL_STOCK_ITEMS = gql`
    query getAllStockItems($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockItemAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
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
`;

export const GET_ALL_STOCK_ITEM_VARIANTS = gql`
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
`;


export const GET_ALL_STOCK_PRODUCTS = gql`
    query getAllStockProducts($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockProductAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
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
`;

// stock lots
export const GET_ALL_STOCK_LOTS = gql`
    query getAllStockLots($productUid: String!) {
        stockLots(productUid: $productUid) {
            uid
            lotNumber
            expiryDate
        }
    }
`; 


// stock orders
export const GET_ALL_STOCK_ORDERS = gql`
    query getAllStockOrders($first: Int!, $after: String, $status: String!, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockOrderAll(pageSize: $first, afterCursor: $after, status: $status,text: $text, sortBy: $sortBy) {
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
`;

export const GET_ALL_STOCK_ORDER_PRODUCTS = gql`
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
`;


// adjustments
export const GET_ALL_STOCK_ADJUSTMENTS = gql`
    query getAllStockAdustments($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        stockAdjustmentAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
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
`;
