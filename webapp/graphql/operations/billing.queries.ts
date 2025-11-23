import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetPiceForProfileQueryVariables = Types.Exact<{
    profileUid: Types.Scalars['String']['input'];
}>;

export type GetPiceForProfileQuery = { __typename?: 'Query' } & {
    priceForProfile?: Types.Maybe<
        { __typename?: 'ProfilePriceType' } & Pick<Types.ProfilePriceType, 'uid' | 'profileUid' | 'isActive' | 'amount'>
    >;
};

export type GetPriceForAnalysisQueryVariables = Types.Exact<{
    analysisUid: Types.Scalars['String']['input'];
}>;

export type GetPriceForAnalysisQuery = { __typename?: 'Query' } & {
    priceForAnalysis?: Types.Maybe<
        { __typename?: 'AnalysisPriceType' } & Pick<Types.AnalysisPriceType, 'uid' | 'analysisUid' | 'isActive' | 'amount'>
    >;
};

export type GetDiscountForProfileQueryVariables = Types.Exact<{
    profileUid: Types.Scalars['String']['input'];
}>;

export type GetDiscountForProfileQuery = { __typename?: 'Query' } & {
    discountForProfile?: Types.Maybe<
        { __typename?: 'ProfileDiscountType' } & Pick<
            Types.ProfileDiscountType,
            | 'uid'
            | 'profileUid'
            | 'name'
            | 'discountType'
            | 'valueType'
            | 'startDate'
            | 'endDate'
            | 'voucherUid'
            | 'valuePercent'
            | 'valueAmount'
            | 'isActive'
        > & {
                voucher?: Types.Maybe<
                    { __typename?: 'VoucherType' } & Pick<
                        Types.VoucherType,
                        'uid' | 'name' | 'usageLimit' | 'used' | 'startDate' | 'endDate'
                    >
                >;
            }
    >;
};

export type GetDiscountForAnalysisQueryVariables = Types.Exact<{
    analysisUid: Types.Scalars['String']['input'];
}>;

export type GetDiscountForAnalysisQuery = { __typename?: 'Query' } & {
    discountForAnalysis?: Types.Maybe<
        { __typename?: 'AnalysisDiscountType' } & Pick<
            Types.AnalysisDiscountType,
            | 'uid'
            | 'analysisUid'
            | 'name'
            | 'discountType'
            | 'valueType'
            | 'startDate'
            | 'endDate'
            | 'voucherUid'
            | 'valuePercent'
            | 'valueAmount'
            | 'isActive'
        > & {
                voucher?: Types.Maybe<
                    { __typename?: 'VoucherType' } & Pick<
                        Types.VoucherType,
                        'uid' | 'name' | 'usageLimit' | 'used' | 'startDate' | 'endDate'
                    >
                >;
            }
    >;
};

export type GetAllVouchersQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAllVouchersQuery = { __typename?: 'Query' } & {
    voucherAll?: Types.Maybe<
        Array<
            { __typename?: 'VoucherType' } & Pick<
                Types.VoucherType,
                | 'uid'
                | 'name'
                | 'usageLimit'
                | 'used'
                | 'startDate'
                | 'endDate'
                | 'oncePerCustomer'
                | 'oncePerOrder'
                | 'createdAt'
                | 'createdByUid'
                | 'updatedAt'
                | 'updatedByUid'
            > & {
                    codes?: Types.Maybe<
                        Array<
                            { __typename?: 'VoucherCodeType' } & Pick<
                                Types.VoucherCodeType,
                                | 'uid'
                                | 'code'
                                | 'usageLimit'
                                | 'used'
                                | 'isActive'
                                | 'createdAt'
                                | 'createdByUid'
                                | 'updatedAt'
                                | 'updatedByUid'
                            >
                        >
                    >;
                }
        >
    >;
};

export type GetVoucherByUidQueryVariables = Types.Exact<{
    uid: Types.Scalars['String']['input'];
}>;

export type GetVoucherByUidQuery = { __typename?: 'Query' } & {
    voucherByUid?: Types.Maybe<
        { __typename?: 'VoucherType' } & Pick<
            Types.VoucherType,
            | 'uid'
            | 'name'
            | 'usageLimit'
            | 'used'
            | 'startDate'
            | 'endDate'
            | 'oncePerCustomer'
            | 'oncePerOrder'
            | 'createdAt'
            | 'createdByUid'
            | 'updatedAt'
            | 'updatedByUid'
        > & {
                codes?: Types.Maybe<
                    Array<
                        { __typename?: 'VoucherCodeType' } & Pick<
                            Types.VoucherCodeType,
                            | 'uid'
                            | 'code'
                            | 'usageLimit'
                            | 'used'
                            | 'isActive'
                            | 'createdAt'
                            | 'createdByUid'
                            | 'updatedAt'
                            | 'updatedByUid'
                        >
                    >
                >;
            }
    >;
};

export type GetVoucherCodesQueryVariables = Types.Exact<{
    voucherUid: Types.Scalars['String']['input'];
}>;

export type GetVoucherCodesQuery = { __typename?: 'Query' } & {
    voucherCodes?: Types.Maybe<
        Array<
            { __typename?: 'VoucherCodeType' } & Pick<
                Types.VoucherCodeType,
                | 'uid'
                | 'voucherUid'
                | 'code'
                | 'usageLimit'
                | 'used'
                | 'isActive'
                | 'createdAt'
                | 'createdByUid'
                | 'updatedAt'
                | 'updatedByUid'
            >
        >
    >;
};

export type SearchBillsQueryVariables = Types.Exact<{
    pageSize: Types.Scalars['Int']['input'];
    afterCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
    beforeCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
    text?: Types.InputMaybe<Types.Scalars['String']['input']>;
    isActive?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
    partial?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
    clientUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
    sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;

export type SearchBillsQuery = { __typename?: 'Query' } & {
    searchBills: { __typename?: 'TestBillCursorPage' } & Pick<Types.TestBillCursorPage, 'totalCount'> & {
            pageInfo: { __typename?: 'PageInfo' } & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>;
            items?: Types.Maybe<
                Array<
                    { __typename?: 'TestBillType' } & Pick<
                        Types.TestBillType,
                        | 'uid'
                        | 'billId'
                        | 'patientUid'
                        | 'clientUid'
                        | 'isActive'
                        | 'toConfirm'
                        | 'partial'
                        | 'totalCharged'
                        | 'totalPaid'
                        | 'createdAt'
                        | 'updatedAt'
                    > & {
                            client: { __typename?: 'ClientType' } & Pick<Types.ClientType, 'name'>;
                            orders?: Types.Maybe<
                                Array<
                                    { __typename?: 'AnalysisRequestType' } & Pick<
                                        Types.AnalysisRequestType,
                                        'uid' | 'requestId' | 'clientRequestId' | 'patientUid'
                                    > & {
                                            patient: { __typename?: 'PatientType' } & Pick<
                                                Types.PatientType,
                                                'firstName' | 'lastName' | 'clientPatientId' | 'gender' | 'dateOfBirth'
                                            >;
                                            samples: Array<
                                                { __typename?: 'SampleType' } & Pick<Types.SampleType, 'uid' | 'sampleId' | 'status'>
                                            >;
                                        }
                                >
                            >;
                        }
                >
            >;
        };
};

export type GetBillsForPatientQueryVariables = Types.Exact<{
    patientUid: Types.Scalars['String']['input'];
}>;

export type GetBillsForPatientQuery = { __typename?: 'Query' } & {
    billsForPatient?: Types.Maybe<
        Array<
            { __typename?: 'TestBillType' } & Pick<
                Types.TestBillType,
                | 'uid'
                | 'billId'
                | 'patientUid'
                | 'clientUid'
                | 'isActive'
                | 'toConfirm'
                | 'partial'
                | 'totalCharged'
                | 'totalPaid'
                | 'createdAt'
                | 'updatedAt'
            > & {
                    client: { __typename?: 'ClientType' } & Pick<Types.ClientType, 'name'>;
                    orders?: Types.Maybe<
                        Array<
                            { __typename?: 'AnalysisRequestType' } & Pick<
                                Types.AnalysisRequestType,
                                'uid' | 'requestId' | 'clientRequestId'
                            >
                        >
                    >;
                }
        >
    >;
};

export type GetBillsForClientQueryVariables = Types.Exact<{
    clientUid: Types.Scalars['String']['input'];
}>;

export type GetBillsForClientQuery = { __typename?: 'Query' } & {
    billsForClient?: Types.Maybe<
        Array<
            { __typename?: 'TestBillType' } & Pick<
                Types.TestBillType,
                | 'uid'
                | 'billId'
                | 'patientUid'
                | 'clientUid'
                | 'isActive'
                | 'toConfirm'
                | 'partial'
                | 'totalCharged'
                | 'totalPaid'
                | 'createdAt'
                | 'updatedAt'
            > & {
                    client: { __typename?: 'ClientType' } & Pick<Types.ClientType, 'name'>;
                    orders?: Types.Maybe<
                        Array<
                            { __typename?: 'AnalysisRequestType' } & Pick<
                                Types.AnalysisRequestType,
                                'uid' | 'requestId' | 'clientRequestId'
                            >
                        >
                    >;
                }
        >
    >;
};

export type GetBillTransactionsQueryVariables = Types.Exact<{
    billUid: Types.Scalars['String']['input'];
}>;

export type GetBillTransactionsQuery = { __typename?: 'Query' } & {
    billTransactions?: Types.Maybe<
        Array<
            { __typename?: 'TestBillTransactionType' } & Pick<
                Types.TestBillTransactionType,
                | 'uid'
                | 'testBillUid'
                | 'kind'
                | 'amount'
                | 'isSuccess'
                | 'actionRequired'
                | 'processed'
                | 'notes'
                | 'createdAt'
                | 'createdByUid'
            >
        >
    >;
};

export type ImpressBillingReportQueryVariables = Types.Exact<{
    billUid: Types.Scalars['String']['input'];
}>;

export type ImpressBillingReportQuery = { __typename?: 'Query' } & Pick<Types.Query, 'billInvoiceCreate'>;

export type GetOrdersByBillUidQueryVariables = Types.Exact<{
    uid: Types.Scalars['String']['input'];
}>;

export type GetOrdersByBillUidQuery = { __typename?: 'Query' } & {
    ordersByBillUid: Array<
        { __typename?: 'AnalysisRequestType' } & Pick<Types.AnalysisRequestType, 'uid' | 'clientRequestId' | 'requestId' | 'createdAt'> & {
                patient: { __typename?: 'PatientType' } & Pick<
                    Types.PatientType,
                    | 'uid'
                    | 'firstName'
                    | 'lastName'
                    | 'clientPatientId'
                    | 'gender'
                    | 'dateOfBirth'
                    | 'age'
                    | 'ageDobEstimated'
                    | 'consentSms'
                >;
                samples: Array<
                    { __typename?: 'SampleType' } & Pick<Types.SampleType, 'uid' | 'sampleId' | 'priority' | 'status'> & {
                            sampleType?: Types.Maybe<{ __typename?: 'SampleTypeTyp' } & Pick<Types.SampleTypeTyp, 'name'>>;
                            analyses?: Types.Maybe<
                                Array<{ __typename?: 'AnalysisType' } & Pick<Types.AnalysisType, 'uid' | 'name' | 'sortKey'>>
                            >;
                            profiles: Array<{ __typename?: 'ProfileType' } & Pick<Types.ProfileType, 'uid' | 'name'>>;
                        }
                >;
            }
    >;
};

export type GetBillingOverviewMetricsQueryVariables = Types.Exact<{
    startDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
    endDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;

export type GetBillingOverviewMetricsQuery = { __typename?: 'Query' } & {
    billingOverviewMetrics: { __typename?: 'BillingOverviewMetrics' } & {
        keyMetrics: { __typename?: 'KeyMetrics' } & Pick<
            Types.KeyMetrics,
            'totalCharged' | 'totalPaid' | 'outstandingBalance' | 'collectionRate'
        >;
        volumeMetrics: { __typename?: 'VolumeMetrics' } & Pick<
            Types.VolumeMetrics,
            'activeBills' | 'inactiveBills' | 'pendingConfirmation' | 'partialBills' | 'completeBills'
        >;
        transactionMetrics: { __typename?: 'TransactionMetrics' } & Pick<
            Types.TransactionMetrics,
            'successfulTransactions' | 'failedTransactions' | 'pendingTransactions' | 'totalTransactionAmount'
        >;
        discountMetrics: { __typename?: 'DiscountMetrics' } & Pick<
            Types.DiscountMetrics,
            'totalDiscountAmount' | 'activeVouchers' | 'totalVouchers' | 'voucherRedemptionRate' | 'vouchersWithAvailableUsage'
        >;
    };
};

export const GetPiceForProfileDocument = gql`
    query GetPiceForProfile($profileUid: String!) {
        priceForProfile(profileUid: $profileUid) {
            uid
            profileUid
            isActive
            amount
        }
    }
`;

export function useGetPiceForProfileQuery(options: Omit<Urql.UseQueryArgs<never, GetPiceForProfileQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetPiceForProfileQuery>({ query: GetPiceForProfileDocument, ...options });
}
export const GetPriceForAnalysisDocument = gql`
    query GetPriceForAnalysis($analysisUid: String!) {
        priceForAnalysis(analysisUid: $analysisUid) {
            uid
            analysisUid
            isActive
            amount
        }
    }
`;

export function useGetPriceForAnalysisQuery(options: Omit<Urql.UseQueryArgs<never, GetPriceForAnalysisQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetPriceForAnalysisQuery>({ query: GetPriceForAnalysisDocument, ...options });
}
export const GetDiscountForProfileDocument = gql`
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

export function useGetDiscountForProfileQuery(options: Omit<Urql.UseQueryArgs<never, GetDiscountForProfileQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetDiscountForProfileQuery>({ query: GetDiscountForProfileDocument, ...options });
}
export const GetDiscountForAnalysisDocument = gql`
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

export function useGetDiscountForAnalysisQuery(
    options: Omit<Urql.UseQueryArgs<never, GetDiscountForAnalysisQueryVariables>, 'query'> = {}
) {
    return Urql.useQuery<GetDiscountForAnalysisQuery>({ query: GetDiscountForAnalysisDocument, ...options });
}
export const GetAllVouchersDocument = gql`
    query getAllVouchers {
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
`;

export function useGetAllVouchersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllVouchersQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetAllVouchersQuery>({ query: GetAllVouchersDocument, ...options });
}
export const GetVoucherByUidDocument = gql`
    query getVoucherByUid($uid: String!) {
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
`;

export function useGetVoucherByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetVoucherByUidQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetVoucherByUidQuery>({ query: GetVoucherByUidDocument, ...options });
}
export const GetVoucherCodesDocument = gql`
    query getVoucherCodes($voucherUid: String!) {
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
`;

export function useGetVoucherCodesQuery(options: Omit<Urql.UseQueryArgs<never, GetVoucherCodesQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetVoucherCodesQuery>({ query: GetVoucherCodesDocument, ...options });
}
export const SearchBillsDocument = gql`
    query SearchBills(
        $pageSize: Int!
        $afterCursor: String
        $beforeCursor: String
        $text: String
        $isActive: Boolean
        $partial: Boolean
        $clientUid: String
        $sortBy: [String!]
    ) {
        searchBills(
            pageSize: $pageSize
            afterCursor: $afterCursor
            beforeCursor: $beforeCursor
            text: $text
            isActive: $isActive
            partial: $partial
            clientUid: $clientUid
            sortBy: $sortBy
        ) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
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
                    patientUid
                    patient {
                        firstName
                        lastName
                        clientPatientId
                        gender
                        dateOfBirth
                    }
                    samples {
                        uid
                        sampleId
                        status
                    }
                }
                createdAt
                updatedAt
            }
        }
    }
`;

export function useSearchBillsQuery(options: Omit<Urql.UseQueryArgs<never, SearchBillsQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<SearchBillsQuery>({ query: SearchBillsDocument, ...options });
}
export const GetBillsForPatientDocument = gql`
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
`;

export function useGetBillsForPatientQuery(options: Omit<Urql.UseQueryArgs<never, GetBillsForPatientQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetBillsForPatientQuery>({ query: GetBillsForPatientDocument, ...options });
}
export const GetBillsForClientDocument = gql`
    query getBillsForClient($clientUid: String!) {
        billsForClient(clientUid: $clientUid) {
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
`;

export function useGetBillsForClientQuery(options: Omit<Urql.UseQueryArgs<never, GetBillsForClientQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetBillsForClientQuery>({ query: GetBillsForClientDocument, ...options });
}
export const GetBillTransactionsDocument = gql`
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
`;

export function useGetBillTransactionsQuery(options: Omit<Urql.UseQueryArgs<never, GetBillTransactionsQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetBillTransactionsQuery>({ query: GetBillTransactionsDocument, ...options });
}
export const ImpressBillingReportDocument = gql`
    query impressBillingReport($billUid: String!) {
        billInvoiceCreate(billUid: $billUid)
    }
`;

export function useImpressBillingReportQuery(options: Omit<Urql.UseQueryArgs<never, ImpressBillingReportQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<ImpressBillingReportQuery>({ query: ImpressBillingReportDocument, ...options });
}
export const GetOrdersByBillUidDocument = gql`
    query getOrdersByBillUid($uid: String!) {
        ordersByBillUid(uid: $uid) {
            uid
            clientRequestId
            requestId
            createdAt
            patient {
                uid
                firstName
                lastName
                clientPatientId
                gender
                dateOfBirth
                age
                ageDobEstimated
                consentSms
            }
            samples {
                uid
                sampleType {
                    name
                }
                sampleId
                priority
                status
                analyses {
                    uid
                    name
                    sortKey
                }
                profiles {
                    uid
                    name
                }
            }
        }
    }
`;

export function useGetOrdersByBillUidQuery(options: Omit<Urql.UseQueryArgs<never, GetOrdersByBillUidQueryVariables>, 'query'> = {}) {
    return Urql.useQuery<GetOrdersByBillUidQuery>({ query: GetOrdersByBillUidDocument, ...options });
}
export const GetBillingOverviewMetricsDocument = gql`
    query getBillingOverviewMetrics($startDate: DateTime, $endDate: DateTime) {
        billingOverviewMetrics(startDate: $startDate, endDate: $endDate) {
            keyMetrics {
                totalCharged
                totalPaid
                outstandingBalance
                collectionRate
            }
            volumeMetrics {
                activeBills
                inactiveBills
                pendingConfirmation
                partialBills
                completeBills
            }
            transactionMetrics {
                successfulTransactions
                failedTransactions
                pendingTransactions
                totalTransactionAmount
            }
            discountMetrics {
                totalDiscountAmount
                activeVouchers
                totalVouchers
                voucherRedemptionRate
                vouchersWithAvailableUsage
            }
        }
    }
`;

export function useGetBillingOverviewMetricsQuery(
    options: Omit<Urql.UseQueryArgs<never, GetBillingOverviewMetricsQueryVariables>, 'query'> = {}
) {
    return Urql.useQuery<GetBillingOverviewMetricsQuery>({ query: GetBillingOverviewMetricsDocument, ...options });
}
