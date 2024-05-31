import gql from 'graphql-tag';

// hazards
export const ADD_HAZARD = gql`
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
`;

export const EDIT_HAZARD = gql`
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
`;

// categories
export const ADD_STOCK_CATEGORY = gql`
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
`;

export const EDIT_STOCK_CATEGORY = gql`
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
`;


// units
export const ADD_STOCK_UNIT = gql`
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
`;

export const EDIT_STOCK_UNIT = gql`
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
`;

// products
export const RECEIVE_STOCK_PRODUCT = gql`
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
`;

// items
export const ADD_STOCK_ITEM = gql`
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
`;

export const EDIT_STOCK_ITEM = gql`
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
`;

// stock item variants
export const ADD_STOCK_ITEM_VARIANT = gql`
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
`;


export const EDIT_STOCK_ITEM_VARIANT = gql`
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
`;


// adjustments
export const ADD_STOCK_ADJUSTMENT = gql`
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
`;

// stock orders
export const ADD_STOCK_ORDER = gql`
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
`;

export const EDIT_STOCK_ORDER = gql`
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
`;

export const SUBMIT_STOCK_ORDER = gql`
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
`;

export const APPROVE_STOCK_ORDER = gql`
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
`;

export const ISSUE_STOCK_ORDER = gql`
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
`;

export const DELETE_STOCK_ORDER = gql`
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
`;
