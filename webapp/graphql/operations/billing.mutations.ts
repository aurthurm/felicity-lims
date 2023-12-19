import gql from 'graphql-tag';

export const EDIT_PROFILE_PRICING = gql`
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
`;

export const EDIT_ANALYSIS_PRICING = gql`
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
`;


export const EDIT_PROFILE_DISCOUNT = gql`
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
`;

export const EDIT_ANALYSIS_DISCOUNT = gql`
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
`;

export const ADD_VOUCHER = gql`
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
`

export const EDIT_VOUCHER = gql`
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
`

export const ADD_VOUCHER_CODE = gql`
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
`

export const EDIT_VOUCHER_CODE = gql`
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
`

export const ADD_TEST_BILL_TRANSACTION = gql`
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
`

export const APPLY_BILL_VOUCHER = gql`
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
`