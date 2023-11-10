import{r as e}from"./shipment-53265c2d.js";const a=e`
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
`,o=e`
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
`,r=e`
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
`,d=e`
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
`,n=e`
    mutation AddStockPackaging($payload: StockPackagingInputType!) {
        createStockPackaging(payload: $payload) {
            ... on StockPackagingType {
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
`,i=e`
    mutation editStockPackaging($uid: String!, $payload: StockPackagingInputType!) {
        updateStockPackaging(uid: $uid, payload: $payload) {
            ... on StockPackagingType {
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
`,p=e`
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
`,u=e`
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
`,y=e`
    mutation AddStockProduct($payload: StockProductInputType!) {
        createStockProduct(payload: $payload) {
            ... on StockProductType {
                __typename
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
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;e`
    mutation editStockProduct($uid: String!, $payload: StockProductInputType!) {
        updateStockProduct(uid: $uid, payload: $payload) {
            ... on StockProductType {
                __typename
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

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;const c=e`
    mutation AddStockItem($payload: StockItemInputType!) {
        createStockItem(payload: $payload) {
            ... on StockItemType {
                __typename
                uid
                name
                description
                departmentUid
                department {
                    uid
                    name
                }
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,m=e`
    mutation editStockItem($uid: String!, $payload: StockItemInputType!) {
        updateStockItem(uid: $uid, payload: $payload) {
            ... on StockItemType {
                __typename
                uid
                name
                description
                departmentUid
                department {
                    uid
                    name
                }
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;e`
    mutation AddStockTransaction($payload: StockTransactionInputType!) {
        createStockTransaction(payload: $payload) {
            ... on StockTransactionType {
                __typename
                uid
                productUid
                issued
                departmentUid
                dateIssued
                transactionByUid
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;const s=e`
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
`,_=e`
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
                    price
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
`,S=e`
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
                    price
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
`,k=e`
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
`;e`
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
`;const g=e`
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
                        remaining
                    }
                    orderUid
                    price
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
`;e`
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
`;export{_ as A,S as E,g as I,k as S,s as a,r as b,d as c,c as d,m as e,n as f,i as g,p as h,u as i,a as j,o as k,y as l};
