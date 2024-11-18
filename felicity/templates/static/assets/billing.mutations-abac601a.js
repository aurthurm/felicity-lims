import{J as e}from"./index-0c72aec6.js";const o=e`
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
`,a=e`
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
`,n=e`
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
`,d=e`
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
`,c=e`
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
`,p=e`
    mutation confirmTestBillTransaction($uid: String!, $notes: String) {
        confirmTestBillTransaction(uid: $uid, notes: $notes) {
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
`,y=e`
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
`;export{c as A,p as C,d as E,y as a,n as b,o as c,a as d,i as e,r as f,u as g,s as h};
