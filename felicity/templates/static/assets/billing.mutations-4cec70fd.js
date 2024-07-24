import{K as e}from"./index-03fd00e9.js";const t=e`
    mutation EditProfilePricing($uid: String!, $payload: PriceInput!) {
        updateProfilePrice(uid: $uid, payload: $payload) {
            ... on ProfilePriceType {
                __typename
                uid
                isActive
                amount
            }
            ...on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,o=e`
    mutation EditAnalysisPricing($uid: String!, $payload: PriceInput!) {
        updateAnalysisPrice(uid: $uid, payload: $payload) {
            ... on AnalysisPriceType {
                __typename
                uid
                isActive
                amount
            }
            ...on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,i=e`
    mutation EditProfileDiscount($uid: String!, $payload: PriceDiscountInput!) {
        updateProfileDiscount(uid: $uid, payload: $payload) {
            ... on ProfileDiscountType {
                __typename
                uid
                profileUid
                name
                discountType
                valueType
                startDate
                endDate
                voucherUid
                valuePercent
                valueAmount
                isActive
            }
            ...on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,r=e`
    mutation EditAnalysisDiscount($uid: String!, $payload: PriceDiscountInput!) {
        updateAnalysisDiscount(uid: $uid, payload: $payload) {
            ... on AnalysisDiscountType {
                __typename
                uid
                analysisUid
                name
                discountType
                valueType
                startDate
                endDate
                voucherUid
                valuePercent
                valueAmount
                isActive
            }
            ...on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,d=e`
    mutation addVoucher ($payload: VoucherInput!) {
        createVoucher(payload: $payload)  {
            __typename
            ...on VoucherType {
                uid
                name
                usageLimit
                used
                startDate
                endDate
                oncePerCustomer
                oncePerOrder            
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
            ...on OperationError {
                error
                suggestion
            }
        }
    }
`,n=e`
    mutation editVoucher ($uid: String!, $payload: VoucherInput!) {
        updateVoucher(uid: $uid, payload: $payload)  {
            __typename
            ...on VoucherType {
                uid
                name
                usageLimit
                used
                startDate
                endDate
                oncePerCustomer
                oncePerOrder            
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
            ...on OperationError {
                error
                suggestion
            }
        }
    }
`,u=e`
    mutation addVoucherCode ($payload: VoucherCodeInput!) {
        createVoucherCode(payload: $payload)  {
            __typename
            ...on VoucherCodeType {
                uid
                voucherUid
                code
                usageLimit
                used
                isActive            
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
            ...on OperationError {
                error
                suggestion
            }
        }
    }
`,s=e`
    mutation editVoucherCode ($uid: String!, $payload: VoucherCodeInput!) {
        updateVoucherCode(uid: $uid, payload: $payload)  {
            __typename
            ...on VoucherCodeType {
                uid
                voucherUid
                code
                usageLimit
                used
                isActive            
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
            ...on OperationError {
                error
                suggestion
            }
        }
    }
`,p=e`
    mutation addTestBillTransaction($payload: BillTransactionInput!) {
        createTestBillTransaction(payload: $payload) {
            __typename
            ...on TestBillTransactionType {
                uid
                testBillUid
                kind
                amount
                isSuccess
                actionRequired
                processed
                notes
                createdAt
                createdByUid
            }
            ...on OperationError {
                error
                suggestion
            }
        } 
    }
`,c=e`
    mutation applyBillVoucher($payload: ApplyVoucherInput!) {
        applyVoucher(payload: $payload) {
            __typename
            ...on TestBillTransactionType {
                uid
                testBillUid
                kind
                amount
                isSuccess
                actionRequired
                processed
                notes
                createdAt
                createdByUid
            }
            ...on OperationError {
                error
                suggestion
            }
        } 
    }
`;export{p as A,n as E,c as a,d as b,t as c,o as d,i as e,r as f,u as g,s as h};
