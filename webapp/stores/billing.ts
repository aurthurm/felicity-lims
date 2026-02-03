import { defineStore } from 'pinia';
import {
    GetPiceForProfileDocument,
    GetPiceForProfileQuery,
    GetPiceForProfileQueryVariables,
    GetDiscountForProfileDocument,
    GetDiscountForProfileQuery,
    GetDiscountForProfileQueryVariables,
    GetPriceForAnalysisDocument,
    GetPriceForAnalysisQuery,
    GetPriceForAnalysisQueryVariables,
    GetDiscountForAnalysisDocument,
    GetDiscountForAnalysisQuery,
    GetDiscountForAnalysisQueryVariables,
    GetAllVouchersDocument,
    GetAllVouchersQuery,
    GetAllVouchersQueryVariables,
    GetVoucherByUidDocument,
    GetVoucherByUidQueryVariables,
    GetVoucherByUidQuery,
    GetVoucherCodesDocument,
    GetVoucherCodesQueryVariables,
    GetVoucherCodesQuery,
    GetBillsForPatientDocument,
    GetBillsForPatientQueryVariables,
    GetBillsForPatientQuery,
    GetBillsForClientDocument,
    GetBillsForClientQueryVariables,
    GetBillsForClientQuery,
    GetBillTransactionsDocument,
    GetBillTransactionsQueryVariables,
    GetBillTransactionsQuery,
    SearchBillsDocument,
    SearchBillsQuery,
    SearchBillsQueryVariables,
    GetBatchPricesDocument,
    GetBatchPricesQuery,
    GetBatchPricesQueryVariables,
} from '@/graphql/operations/billing.queries';

import useApiUtil from '@/composables/api_util';
import {
    ProfilePriceType,
    ProfileDiscountType,
    AnalysisPriceType,
    AnalysisDiscountType,
    VoucherType,
    VoucherCodeType,
    TestBillType,
    TestBillTransactionType,
} from '@/types/gql';

const { withClientQuery } = useApiUtil();

// Define the state type
type BillingStateType = {
    profilePrice?: ProfilePriceType;
    profileDiscount?: ProfileDiscountType;
    fetchingPrice: boolean;
    analysisPrice?: AnalysisPriceType;
    analysisDiscount?: AnalysisDiscountType;
    fetchingDiscount: boolean;
    vouchers: VoucherType[];
    fetchingVouchers: boolean;
    fetchingVoucher: boolean;
    fetchingVoucherCodes: boolean;
    bills: TestBillType[];
    fetchingBills: boolean;
    billPageInfo?: {
        hasNextPage: boolean;
        hasPreviousPage?: boolean;
        endCursor?: string | null;
        startCursor?: string | null;
        totalCount: number;
    };
    transactions: TestBillTransactionType[];
    fetchingTransactions: boolean;
    // Price caching for batch operations
    profilePrices: Map<string, ProfilePriceType>;
    analysisPrices: Map<string, AnalysisPriceType>;
    fetchingPrices: boolean;
};

export const useBillingStore = defineStore('billing', {
    state: (): BillingStateType => {
        return {
            profilePrice: undefined,
            profileDiscount: undefined,
            fetchingPrice: false,
            analysisPrice: undefined,
            analysisDiscount: undefined,
            fetchingDiscount: false,
            vouchers: [],
            fetchingVouchers: false,
            fetchingVoucher: false,
            fetchingVoucherCodes: false,
            bills: [],
            fetchingBills: false,
            billPageInfo: undefined,
            transactions: [],
            fetchingTransactions: false,
            profilePrices: new Map(),
            analysisPrices: new Map(),
            fetchingPrices: false,
        };
    },
    getters: {
        getVouchers: (state): VoucherType[] => state.vouchers,
        getProfilePrice: (state): ProfilePriceType | undefined => state.profilePrice,
        getAnalysisPrice: (state): AnalysisPriceType | undefined => state.analysisPrice,
        getBills: (state): TestBillType[] => state.bills,
    },
    actions: {
        // Clear all billing data
        async clear(): Promise<void> {
            this.analysisPrice = undefined;
            this.analysisDiscount = undefined;
            this.profilePrice = undefined;
            this.profileDiscount = undefined;
        },

        // Profile price and discount
        async fetchProfilePrice(profileUid: string): Promise<void> {
            if (!profileUid) {
                return;
            }

            try {
                this.fetchingPrice = true;
                const result = await withClientQuery<GetPiceForProfileQuery, GetPiceForProfileQueryVariables>(
                    GetPiceForProfileDocument,
                    { profileUid },
                    'priceForProfile',
                );

                if (result) {
                    this.profilePrice = result as unknown as ProfilePriceType;
                } else {
                }
            } catch {
            } finally {
                this.fetchingPrice = false;
            }
        },

        async fetchProfileDiscount(profileUid: string): Promise<void> {
            if (!profileUid) {
                return;
            }

            try {
                this.fetchingDiscount = true;
                const result = await withClientQuery<GetDiscountForProfileQuery, GetDiscountForProfileQueryVariables>(
                    GetDiscountForProfileDocument,
                    { profileUid },
                    'discountForProfile',
                );

                if (result) {
                    this.profileDiscount = result as unknown as ProfileDiscountType;
                } else {
                }
            } catch {
            } finally {
                this.fetchingDiscount = false;
            }
        },

        // Analysis price and discount
        async fetchAnalysisPrice(analysisUid: string): Promise<void> {
            if (!analysisUid) {
                return;
            }

            try {
                this.fetchingPrice = true;
                const result = await withClientQuery<GetPriceForAnalysisQuery, GetPriceForAnalysisQueryVariables>(
                    GetPriceForAnalysisDocument,
                    { analysisUid },
                    'priceForAnalysis',
                );

                if (result) {
                    this.analysisPrice = result as unknown as AnalysisPriceType;
                } else {
                }
            } catch {
            } finally {
                this.fetchingPrice = false;
            }
        },

        async fetchAnalysisDiscount(analysisUid: string): Promise<void> {
            if (!analysisUid) {
                return;
            }

            try {
                this.fetchingDiscount = true;
                const result = await withClientQuery<GetDiscountForAnalysisQuery, GetDiscountForAnalysisQueryVariables>(
                    GetDiscountForAnalysisDocument,
                    { analysisUid },
                    'discountForAnalysis',
                );

                if (result) {
                    this.analysisDiscount = result as unknown as AnalysisDiscountType;
                } else {
                }
            } catch {
            } finally {
                this.fetchingDiscount = false;
            }
        },

        // Vouchers
        async fetchVouchers(): Promise<void> {
            try {
                this.fetchingVouchers = true;
                const result = await withClientQuery<GetAllVouchersQuery, GetAllVouchersQueryVariables>(
                    GetAllVouchersDocument,
                    {},
                    'voucherAll',
                );

                if (result && Array.isArray(result)) {
                    this.vouchers = result as unknown as VoucherType[];
                } else {
                }
            } catch {
            } finally {
                this.fetchingVouchers = false;
            }
        },

        async fetchVoucherByUid(uid: string): Promise<void> {
            if (!uid) {
                return;
            }

            try {
                this.fetchingVoucher = true;
                const result = await withClientQuery<GetVoucherByUidQuery, GetVoucherByUidQueryVariables>(
                    GetVoucherByUidDocument,
                    { uid },
                    'voucherByUid',
                );

                if (result && typeof result === 'object' && 'uid' in result) {
                    const voucher = result as unknown as VoucherType;
                    const index = this.vouchers?.findIndex(item => item.uid === voucher.uid);

                    if (index > -1) {
                        this.vouchers[index] = voucher;
                    } else {
                        this.vouchers = [voucher, ...this.vouchers];
                    }
                } else {
                }
            } catch {
            } finally {
                this.fetchingVoucher = false;
            }
        },

        async fetchVoucherCodes(voucherUid: string): Promise<void> {
            if (!voucherUid) {
                return;
            }

            try {
                this.fetchingVoucherCodes = true;
                const result = await withClientQuery<GetVoucherCodesQuery, GetVoucherCodesQueryVariables>(
                    GetVoucherCodesDocument,
                    { voucherUid },
                    'voucherCodes',
                );

                if (result && Array.isArray(result)) {
                    const codes = result as unknown as VoucherCodeType[];
                    const index = this.vouchers?.findIndex(item => item.uid === voucherUid);

                    if (index > -1) {
                        this.vouchers[index] = {
                            ...this.vouchers[index],
                            codes: codes,
                        };
                    }
                } else {
                }
            } catch {
            } finally {
                this.fetchingVoucherCodes = false;
            }
        },

        addVoucher(voucher: VoucherType): void {
            if (!voucher?.uid) {
                return;
            }

            this.vouchers = [voucher, ...this.vouchers];
        },

        updateVoucher(voucher: VoucherType): void {
            if (!voucher?.uid) {
                return;
            }

            const index = this.vouchers?.findIndex(item => item.uid === voucher.uid);
            if (index > -1) {
                this.vouchers[index] = {
                    ...this.vouchers[index],
                    ...voucher,
                };
            }
        },

        addVoucherCode(voucherCode: VoucherCodeType): void {
            if (!voucherCode?.uid || !voucherCode?.voucherUid) {
                return;
            }

            const index = this.vouchers?.findIndex(item => item.uid === voucherCode.voucherUid);
            if (index > -1) {
                this.vouchers[index] = {
                    ...this.vouchers[index],
                    codes: [voucherCode, ...(this.vouchers[index].codes || [])],
                };
            }
        },

        updateVoucherCode(voucherCode: VoucherCodeType): void {
            if (!voucherCode?.uid || !voucherCode?.voucherUid) {
                return;
            }

            const index = this.vouchers?.findIndex(item => item.uid === voucherCode.voucherUid);
            if (index > -1) {
                const codes = this.vouchers[index].codes || [];
                const codeIndex = codes?.findIndex(item => item.uid === voucherCode.uid);

                if (codeIndex > -1) {
                    codes[codeIndex] = { ...codes[codeIndex], ...voucherCode };
                    this.vouchers[index] = {
                        ...this.vouchers[index],
                        codes: codes,
                    };
                }
            }
        },

        // Bills
        async fetchBillsForPatient(patientUid: string): Promise<void> {
            if (!patientUid) {
                return;
            }

            try {
                this.fetchingBills = true;
                const result = await withClientQuery<GetBillsForPatientQuery, GetBillsForPatientQueryVariables>(
                    GetBillsForPatientDocument,
                    { patientUid },
                    'billsForPatient',
                );

                if (result && Array.isArray(result)) {
                    this.bills = result as unknown as TestBillType[];
                } else {
                }
            } catch {
            } finally {
                this.fetchingBills = false;
            }
        },

        async fetchBillsForClient(clientUid: string): Promise<void> {
            if (!clientUid) {
                return;
            }

            try {
                this.fetchingBills = true;
                const result = await withClientQuery<GetBillsForClientQuery, GetBillsForClientQueryVariables>(
                    GetBillsForClientDocument,
                    { clientUid },
                    'billsForClient',
                );

                if (result && Array.isArray(result)) {
                    this.bills = result as unknown as TestBillType[];
                } else {
                }
            } catch {
            } finally {
                this.fetchingBills = false;
            }
        },

        // Transactions
        async fetchBillTransactions(billUid: string): Promise<void> {
            if (!billUid) {
                return;
            }

            try {
                this.fetchingTransactions = true;
                this.transactions = [];

                const result = await withClientQuery<GetBillTransactionsQuery, GetBillTransactionsQueryVariables>(
                    GetBillTransactionsDocument,
                    { billUid },
                    'billTransactions',
                );

                if (result && Array.isArray(result)) {
                    this.transactions = result as unknown as TestBillTransactionType[];
                } else {
                }
            } catch {
            } finally {
                this.fetchingTransactions = false;
            }
        },

        addTransaction(transaction: TestBillTransactionType): void {
            if (!transaction?.uid) {
                return;
            }

            this.transactions = [transaction, ...this.transactions];
        },

        updateTransaction(transaction: TestBillTransactionType): void {
            if (!transaction?.uid) {
                return;
            }

            const index = this.transactions?.findIndex(item => item.uid === transaction.uid);
            if (index > -1) {
                this.transactions[index] = {
                    ...this.transactions[index],
                    ...transaction,
                };
            }
        },

        // Search bills with filters
        async searchBills(params: {
            pageSize?: number;
            afterCursor?: string;
            beforeCursor?: string;
            text?: string;
            isActive?: boolean | null;
            partial?: boolean | null;
            clientUid?: string;
            sortBy?: string[];
        }): Promise<void> {
            try {
                this.fetchingBills = true;
                const result = await withClientQuery<SearchBillsQuery, SearchBillsQueryVariables>(
                    SearchBillsDocument,
                    {
                        pageSize: params.pageSize || 50,
                        afterCursor: params.afterCursor || undefined,
                        beforeCursor: params.beforeCursor || undefined,
                        text: params.text || undefined,
                        isActive: params.isActive !== null && params.isActive !== undefined ? params.isActive : undefined,
                        partial: params.partial !== null && params.partial !== undefined ? params.partial : undefined,
                        clientUid: params.clientUid || undefined,
                        sortBy: params.sortBy || ['-uid'],
                    },
                    'searchBills',
                );

                if (result && typeof result === 'object' && 'items' in result) {
                    const fetchedBills = (result as any).items ?? [];
                    this.bills = fetchedBills;
                    this.billPageInfo = {
                        hasNextPage: (result as any).pageInfo?.hasNextPage ?? false,
                        hasPreviousPage: (result as any).pageInfo?.hasPreviousPage ?? false,
                        endCursor: (result as any).pageInfo?.endCursor ?? null,
                        startCursor: (result as any).pageInfo?.startCursor ?? null,
                        totalCount: (result as any).totalCount ?? 0,
                    };
                } else {
                }
            } catch {
            } finally {
                this.fetchingBills = false;
            }
        },

        // Batch fetch prices for multiple profiles and analyses
        async fetchBatchPrices(profileUids: string[], analysisUids: string[]): Promise<void> {
            if (!profileUids.length && !analysisUids.length) {
                return;
            }

            try {
                this.fetchingPrices = true;
                const result = await withClientQuery<GetBatchPricesQuery, GetBatchPricesQueryVariables>(
                    GetBatchPricesDocument,
                    {
                        profileUids: profileUids || [],
                        analysisUids: analysisUids || [],
                    },
                    'pricesForBatch',
                );

                if (result && typeof result === 'object') {
                    const batchResult = result as any;

                    // Update profile prices cache
                    if (batchResult.profilePrices && Array.isArray(batchResult.profilePrices)) {
                        batchResult.profilePrices.forEach((price: ProfilePriceType) => {
                            if (price.profileUid) {
                                this.profilePrices.set(price.profileUid, price);
                            }
                        });
                    }

                    // Update analysis prices cache
                    if (batchResult.analysisPrices && Array.isArray(batchResult.analysisPrices)) {
                        batchResult.analysisPrices.forEach((price: AnalysisPriceType) => {
                            if (price.analysisUid) {
                                this.analysisPrices.set(price.analysisUid, price);
                            }
                        });
                    }
                } else {
                }
            } catch {
            } finally {
                this.fetchingPrices = false;
            }
        },

        // Get price for a profile from cache
        getPriceForProfile(profileUid: string): number | null {
            const price = this.profilePrices.get(profileUid);
            return price?.amount ?? null;
        },

        // Get price for an analysis from cache
        getPriceForAnalysis(analysisUid: string): number | null {
            const price = this.analysisPrices.get(analysisUid);
            return price?.amount ?? null;
        },

        // Clear price cache
        clearPriceCache(): void {
            this.profilePrices.clear();
            this.analysisPrices.clear();
        },
    },
});
