import{K as t}from"./index-03fd00e9.js";const o=t`
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
`,a=t`
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
`,r=t`
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
`,d=t`
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
`,n=t`
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
`,i=t`
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
`,p=t`
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
`,u=t`
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
`,y=t`
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
`,m=t`
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
`,c=t`
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
`,s=t`
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
`,_=t`
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
`,S=t`
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
`,k=t`
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
`;t`
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
`;const T=t`
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
`;t`
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
`;export{_ as A,S as E,T as I,p as R,k as S,s as a,r as b,d as c,u as d,y as e,n as f,i as g,o as h,a as i,m as j,c as k};
