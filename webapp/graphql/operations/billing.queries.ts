import gql from 'graphql-tag';


export const GET_PRICE_FOR_PROFILE = gql`
    query GetPiceForProfile($profileUid: String!) {
        priceForProfile(profileUid: $profileUid) {
            uid
            profileUid
            isActive
            amount
        }
    }
`;

export const GET_PRICE_FOR_ANALYSIS = gql`
    query GetPiceForAnalysis($analysisUid: String!) {
        priceForAnalysis(analysisUid: $analysisUid) {
            uid
            analysisUid
            isActive
            amount
        }
    }
`;

export const GET_DISCOUNT_FOR_PROFILE = gql`
    query GetDiscountForProfile($profileUid: String!) {
        discountForProfile(profileUid: $profileUid) {
            uid
            profileUid
            name
            discountType
            valueType
            startDate
            endDate
            voucherUid
            voucher {
                uid
                name
                usageLimit
                used
                startDate
                endDate
            }
            valuePercent
            valueAmount
            isActive
        }
    }
`;

export const GET_DISCOUNT_FOR_ANALYSIS = gql`
    query GetDiscountForAnalysis($analysisUid: String!) {
        discountForAnalysis(analysisUid: $analysisUid) {
            uid
            analysisUid
            name
            discountType
            valueType
            startDate
            endDate
            voucherUid
            voucher {
                uid
                name
                usageLimit
                used
                startDate
                endDate
            }
            valuePercent
            valueAmount
            isActive
        }
    }
`;


export const GET_ALL_VOUCHERS = gql`
    query getAllVouchers{
        voucherAll {
            uid
            name
            usageLimit
            used
            startDate
            endDate
            oncePerCustomer
            oncePerOrder
            codes {
                uid
                code
                usageLimit
                used
                isActive
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
            createdAt
            createdByUid
            updatedAt
            updatedByUid
        }
    }
`

export const GET_VOUCHER_BY_UID = gql`
    query getVoucherByUid ($uid: String!) {
        voucherByUid(uid: $uid) {
            uid
            name
            usageLimit
            used
            startDate
            endDate
            oncePerCustomer
            oncePerOrder
            codes {
                uid
                code
                usageLimit
                used
                isActive
                createdAt
                createdByUid
                updatedAt
                updatedByUid
            }
            createdAt
            createdByUid
            updatedAt
            updatedByUid
        }
    }
`

export const GET_VOUCHER_CODES = gql`
    query getVoucherCodes ($voucherUid: String!) {
        voucherCodes(voucherUid: $voucherUid) {
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
    }
`

export const GET_BILLS_FOR_PATIENT = gql`
    query getBillsForPatient($patientUid: String!) {
        billsForPatient(patientUid: $patientUid) {
            uid
            billId
            patientUid
            clientUid
            client {
                name
            }
            isActive
            toConfirm
            partial
            totalCharged
            totalPaid
            orders {
                uid
                requestId
                clientRequestId
            }
            createdAt
            updatedAt
        } 
    }
`

export const GET_BILL_TRANSACTIONS = gql`
    query getBillTransactions($billUid: String!) {
        billTransactions(billUid: $billUid) {
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
    }
`

export const DOWNLOAD_INVOICE = gql`
    query impressReport($billUid: String!) {
        billInvoiceCreate(billUid: $billUid)
    }
`;
